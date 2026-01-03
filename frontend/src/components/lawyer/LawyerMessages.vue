<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h2 class="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <svg class="w-7 h-7 text-[#003aca]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          Messages
        </h2>
        <p class="text-gray-500 mt-1">Communicate with clients on your assigned cases</p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <!-- Cases list -->
      <div class="lg:col-span-1 bg-white rounded-lg border border-gray-200 p-4">
        <h3 class="text-sm font-semibold text-gray-700 mb-3">Assigned Cases</h3>
        <div v-if="cases.length === 0" class="text-sm text-gray-500">No cases assigned.</div>
        <ul class="space-y-2">
          <li v-for="c in cases" :key="c.id" class="flex items-center justify-between p-2 rounded hover:bg-gray-50">
            <div>
                <div class="font-medium text-gray-900 text-sm">{{ c.title }}</div>
              <div class="text-xs text-gray-500">Client: <span class="font-medium">{{ displayClients(c) }}</span></div>
            </div>
            <div>
                <div class="flex items-center gap-2">
                  <button @click="openCase(c)" class="px-3 py-1 bg-[#003aca] text-white rounded text-sm">Open</button>
                  <span v-if="getUnread(c.id) > 0" class="ml-2 inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium rounded-full bg-red-600 text-white">{{ getUnread(c.id) }}</span>
                </div>
            </div>
          </li>
        </ul>
      </div>

      <!-- Messages panel -->
      <div class="lg:col-span-3 bg-white rounded-lg border border-gray-200 flex flex-col" style="min-height: 60vh;">
        <div class="p-4 border-b">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="font-semibold text-gray-900">{{ activeCase?.title || 'Select a case' }}</h3>
              <p class="text-xs text-gray-500">Client(s): {{ activeCase ? displayClients(activeCase) : '' }}</p>
            </div>
            <div class="text-sm text-gray-500">Messages</div>
          </div>
        </div>

        <div ref="messagesContainer" class="flex-1 p-4 overflow-y-auto space-y-4">
          <div v-if="!activeCase" class="flex items-center justify-center h-full text-gray-500">
            <div class="text-center">
              <p class="text-sm">Select a case to view messages</p>
            </div>
          </div>

          <div v-else>
            <div v-if="messages.length === 0" class="text-center text-gray-500 py-8">No messages for this case yet.</div>

            <div v-for="m in messages" :key="m.id" :class="['flex', m.sender_id === authStore.user?.id ? 'justify-end' : 'justify-start']">
                <div :class="[
                  'max-w-2xl px-4 py-3 rounded-lg',
                  m.sender_id === authStore.user?.id ? 'bg-blue-600 text-white rounded-br-none' : 'bg-gray-100 text-gray-900 rounded-bl-none'
                ]">
                  <p class="text-sm">{{ m.content || m.message }}</p>
                  <p class="text-xs mt-1 text-gray-200" v-if="m.sender_id === authStore.user?.id">You • {{ formatTime(m.created_date) }}</p>
                  <p class="text-xs mt-1 text-gray-500" v-else>{{ getSenderName(m.sender_id) }} • {{ formatTime(m.created_date) }}</p>
                </div>
            </div>
          </div>
        </div>

        <div class="p-4 border-t">
          <div class="flex items-end gap-3">
            <textarea v-model="newMessage" ref="messageInput" rows="2" placeholder="Type your message..." class="flex-1 px-4 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
            <button @click="sendMessage" :disabled="!newMessage.trim() || !activeCase" class="px-6 py-2 bg-[#003aca] text-white rounded-lg disabled:opacity-50">
              Send
            </button>
          </div>
          <p class="text-xs text-gray-500 mt-2">Press Enter to send, Shift+Enter for new line</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import { Case, ChatMessage, User } from '@/services/entities';
import { useAuthStore } from '@/stores/auth';
import { format } from 'date-fns';
import { initSocket, getSocket } from '@/plugins/socket';

const authStore = useAuthStore();

const cases = ref([]);
const activeCase = ref(null);
const messages = ref([]);
const newMessage = ref('');
const messagesContainer = ref(null);
const messageInput = ref(null);
const unreadMap = ref({}); // caseId -> count

const userCache = ref({}); // cache user names by id

const loadAssignedCases = async () => {
  try {
    // backend RLS should return the cases assigned to this lawyer
    const list = await Case.list();
    cases.value = list || [];
    // initialize unreadMap entries for these cases
    cases.value.forEach(c => { unreadMap.value[c.id] = unreadMap.value[c.id] || 0; });
    // preload any nested customer objects or user ids
    const customerIds = new Set();
    cases.value.forEach(c => {
      if (Array.isArray(c.customers)) {
        c.customers.forEach(u => { if (u && (u.id || u._id)) customerIds.add(u.id || u._id); });
      } else if (Array.isArray(c.customer_ids)) {
        c.customer_ids.forEach(id => customerIds.add(id));
      }
    });
    // preload small number of users
    await Promise.all(Array.from(customerIds).slice(0, 20).map(async id => {
      try { userCache.value[id] = (await User.get(id)); } catch (e) {}
    }));
  } catch (e) {
    console.error('Failed to load assigned cases', e);
  }
};

const openCase = async (c) => {
  try {
    const socket = getSocket();
    // leave previous case room
    if (socket && activeCase.value && activeCase.value.id) {
      socket.emit('leave_case', activeCase.value.id);
    }
  } catch (e) {}

  activeCase.value = c;
  await loadMessagesForCase(c.id);
  // join case room
  try {
    const socket = getSocket();
    if (socket && c && c.id) socket.emit('join_case', c.id);
  } catch (e) {}

  // reset unread count for this case
  if (c && c.id) unreadMap.value[c.id] = 0;
};

const loadMessagesForCase = async (caseId) => {
  try {
    const all = await ChatMessage.list('-created_date');
    messages.value = (all || []).filter(m => m.case_id === caseId).sort((a,b) => new Date(a.created_date) - new Date(b.created_date));
    await nextTick();
    scrollToBottom();
  } catch (e) {
    console.error('Failed to load messages', e);
  }
};

const getSenderName = (id) => {
  if (!id) return 'Unknown';
  if (userCache.value[id]) return userCache.value[id].full_name || userCache.value[id].name || userCache.value[id].email || 'User';
  // in background fetch short info
  User.get(id).then(u => { userCache.value[id] = u; }).catch(() => {});
  return id;
};

const sendMessage = async () => {
  if (!activeCase.value || !newMessage.value.trim()) return;
  const payload = {
    case_id: activeCase.value.id,
    content: newMessage.value.trim(),
  };
  try {
    const sent = await ChatMessage.create(payload);
    messages.value.push(sent);
    newMessage.value = '';
    await nextTick();
    scrollToBottom();
    if (messageInput.value) messageInput.value.focus();
    // emit via socket so other participants receive the message in realtime
    try {
      const socket = getSocket();
      if (socket) socket.emit('client:new_message', sent);
    } catch (e) {
      // ignore socket emit failures
    }
  } catch (e) {
    console.error('Failed to send message', e);
    alert('Failed to send message');
  }
};

const scrollToBottom = () => {
  if (messagesContainer.value) messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
};

const formatTime = (date) => {
  try { return format(new Date(date), 'MMM d, h:mm a'); } catch (e) { return ''; }
};

const displayClients = (c) => {
  if (!c) return '';
  if (Array.isArray(c.customers) && c.customers.length > 0) {
    return c.customers.map(u => (u.full_name || u.name || u.email || u.id)).join(', ');
  }
  if (Array.isArray(c.customer_ids) && c.customer_ids.length > 0) {
    return c.customer_ids.slice(0,2).join(', ') + (c.customer_ids.length > 2 ? ', ...' : '');
  }
  return 'No client listed';
};

// expose unread helper for template
const getUnread = (caseId) => {
  return unreadMap.value[caseId] || 0;
};

onMounted(() => {
  loadAssignedCases();
  // initialize socket connection
  try {
    initSocket(authStore.token);
    const socket = getSocket();
    if (socket) {
      socket.on('new_message', (msg) => {
        // avoid duplicates
        if (!msg || !msg.id) return;
        if (messages.value.find(m => m.id === msg.id)) return;
        // if the incoming message belongs to the currently open case, append it
        if (activeCase.value && msg.case_id === activeCase.value.id) {
          messages.value.push(msg);
          nextTick().then(scrollToBottom);
        }
      });
    }
  } catch (e) {
    console.debug('Socket init error', e);
  }
});

onUnmounted(() => {
  const socket = getSocket();
  if (socket) {
    socket.off('new_message');
  }
});
</script>

<style scoped>
/* small styles if needed */
</style>
