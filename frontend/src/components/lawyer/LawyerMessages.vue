<template>
  <div class="flex flex-col min-h-0" style="overflow: hidden;">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h2 class="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <svg class="w-7 h-7 text-[#003aca]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          Messages
        </h2>
        <p class="text-gray-500 mt-1">Communicate with clients and admin</p>
      </div>
    </div>

    <!-- Tabs -->
    <div class="flex gap-2 border-b border-gray-200">
      <button
        @click="activeTab = 'cases'"
        :class="[
          'px-4 py-2 font-medium text-sm transition-colors',
          activeTab === 'cases'
            ? 'text-blue-600 border-b-2 border-blue-600'
            : 'text-gray-600 hover:text-gray-800'
        ]"
      >
        Case Messages
      </button>
      <button
        @click="activeTab = 'admin'"
        :class="[
          'px-4 py-2 font-medium text-sm transition-colors',
          activeTab === 'admin'
            ? 'text-blue-600 border-b-2 border-blue-600'
            : 'text-gray-600 hover:text-gray-800'
        ]"
      >
        Admin Messages
      </button>
    </div>

    <!-- Case Messages Tab -->
    <div v-if="activeTab === 'cases'" class="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <!-- Cases list -->
      <div class="lg:col-span-1 bg-white rounded-lg border border-gray-200 p-4">
        <h3 class="text-sm font-semibold text-gray-700 mb-3">Assigned Cases</h3>
        <div v-if="cases.length === 0" class="text-sm text-gray-500">No cases assigned.</div>
        <ul class="space-y-2">
          <li v-for="c in cases" :key="c.id" class="flex items-center justify-between p-2 rounded hover:bg-gray-50">
            <div>
                <div class="font-medium text-gray-900 text-sm">{{ c.title }}</div>
                <div class="text-xs text-gray-500">Client: <span class="font-medium">{{ displayClients(c) }}</span></div>
                <div class="text-xs text-gray-400 mt-1">Last: <span class="font-medium">{{ lastMessageMap[c.id] ? formatTime(lastMessageMap[c.id]) : '—' }}</span></div>
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

            <div v-for="m in messages" :key="m.id" :class="['flex', (m.sender_id === authStore.user?.id) ? 'justify-end' : 'justify-start']">
                <div :class="[(m.sender_id === authStore.user?.id) ? 'items-end flex flex-col' : 'items-start flex flex-col']">
                  <div :class="[
                    'max-w-2xl rounded-lg',
                    (m.sender_id === authStore.user?.id)
                      ? 'bg-blue-600 text-white rounded-br-none px-3 py-2 text-sm'
                      : 'bg-gray-100 text-gray-900 rounded-bl-none px-4 py-3'
                  ]">
                    <p class="text-sm">{{ m.content || m.message }}</p>
                  </div>
                  <div class="mt-1">
                    <p v-if="m.sender_id === authStore.user?.id" class="text-xs text-gray-200">You • {{ formatTime(m.created_date) }}</p>
                    <p v-else class="text-xs text-gray-500">{{ getSenderName(m.sender_id) }} • {{ formatTime(m.created_date) }}</p>
                  </div>
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

    <!-- Admin Messages Tab -->
    <div v-else-if="activeTab === 'admin'" class="flex flex-col flex-1 bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <div class="flex-1 flex flex-col overflow-hidden">
        <!-- Chat Header -->
        <div class="p-4 border-b border-gray-200 bg-gray-50">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold">
              A
            </div>
            <div>
              <p class="text-sm font-semibold text-gray-900">Admin</p>
              <p class="text-xs text-gray-500">Direct messages with administrator</p>
            </div>
          </div>
        </div>

        <!-- Messages List -->
        <div ref="adminMessagesContainer" class="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          <div v-if="isLoadingAdminMessages" class="text-center text-sm text-gray-500">
            Loading messages...
          </div>
          <div v-else-if="adminMessages.length === 0" class="text-center text-sm text-gray-500 py-8">
            No messages yet. Admin hasn't sent you any messages.
          </div>
            <div v-else v-for="message in adminMessages" :key="message.id || message._tempId || message.created_at || message.created_date" class="flex items-start gap-3">
            <!-- Message from admin -->
            <div v-if="message.sender_id !== currentUserId" class="flex-1">
              <div class="flex items-start gap-2">
                <div class="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                  A
                </div>
                <div class="flex-1">
                  <div class="bg-white rounded-lg rounded-tl-none p-3 shadow-sm border border-gray-200 max-w-md relative">
                    <!-- Yellow Star Indicator for Admin -->
                    <div class="absolute -top-2 -left-2">
                      <Star class="w-5 h-5 text-yellow-400 fill-yellow-400 drop-shadow-md" />
                    </div>
                    <p class="text-sm text-gray-900">{{ message.content }}</p>
                    <!-- source/id debug removed -->
                  </div>
                  <p class="text-xs text-gray-400 mt-1 ml-1">{{ formatMessageTime(message.created_at) }}</p>
                </div>
              </div>
            </div>

            <!-- Message from lawyer (current user) -->
            <div v-else class="flex-1 flex justify-end">
              <div class="flex items-start gap-2 flex-row-reverse">
                <div class="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                  {{ getUserInitials(authStore.user) }}
                </div>
                <div class="flex-1 flex flex-col items-end">
                  <div class="bg-blue-600 text-white rounded-lg rounded-tr-none px-3 py-2 shadow-sm max-w-md">
                    <p class="text-sm">{{ message.content }}</p>
                  </div>
                  <!-- source/id debug removed -->
                  <p class="text-xs text-gray-400 mt-1 mr-1">{{ formatMessageTime(message.created_at) }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Message Input -->
        <div class="p-4 border-t border-gray-200 bg-white">
          <div class="flex items-end gap-3">
            <div class="flex-1">
              <textarea
                v-model="newAdminMessage"
                @keydown.enter.exact.prevent="sendAdminMessage"
                placeholder="Type your message to admin... (Press Enter to send)"
                rows="2"
                class="w-full px-3 py-2 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              ></textarea>
            </div>
            <button
              @click="sendAdminMessage"
              :disabled="!newAdminMessage.trim() || isSendingAdmin"
              class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Send class="w-4 h-4" />
              <span>Send</span>
            </button>
          </div>
          <p class="text-xs text-gray-500 mt-2 flex items-center gap-1">
            <Star class="w-3 h-3 text-yellow-400 fill-yellow-400" />
            Messages from admin are marked with a yellow star
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, computed, watch } from 'vue';
import { Case, ChatMessage, DirectMessage, User } from '@/services/entities';
import { useAuthStore } from '@/stores/auth';
import { format } from 'date-fns';
import { initSocket, getSocket } from '@/plugins/socket';
import { Star, Send } from 'lucide-vue-next';

const authStore = useAuthStore();

// Tab state
const activeTab = ref('cases');

// Case messages state
const cases = ref([]);
const activeCase = ref(null);
const messages = ref([]);
const newMessage = ref('');
const messagesContainer = ref(null);
const messageInput = ref(null);
const unreadMap = ref({}); // caseId -> count
const lastMessageMap = ref({}); // caseId -> most recent message created_date

// Admin messages state
const adminMessages = ref([]);
const newAdminMessage = ref('');
const adminMessagesContainer = ref(null);
const isLoadingAdminMessages = ref(false);
const isSendingAdmin = ref(false);
let adminPollingInterval = null;
const allDirectMessages = ref([]);
const adminUser = ref(null);

const userCache = ref({}); // cache user names by id
const currentUserId = computed(() => authStore.user?.id);

const loadAssignedCases = async () => {
  try {
    // backend RLS should return the cases assigned to this lawyer
    const list = await Case.list();
    cases.value = list || [];
    // initialize unreadMap entries for these cases
    cases.value.forEach(c => { unreadMap.value[c.id] = unreadMap.value[c.id] || 0; });
    // load last message timestamps for cases
    await Promise.all(cases.value.map(async (c) => {
      try {
        const msgs = await ChatMessage.filter({ case_id: c.id }, '-created_date', 1);
        if (msgs && msgs.length > 0) lastMessageMap.value[c.id] = msgs[0].created_date;
        else lastMessageMap.value[c.id] = null;
      } catch (e) {
        lastMessageMap.value[c.id] = null;
      }
    }));
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
    // Auto-open the first case so the message input is visible immediately
    if (cases.value.length > 0) {
      activeCase.value = cases.value[0];
      await loadMessagesForCase(activeCase.value.id);
      // join case room
      try {
        const socket = getSocket();
        if (socket && activeCase.value && activeCase.value.id) socket.emit('join_case', activeCase.value.id);
      } catch (e) {}
      await nextTick();
      if (messageInput.value) messageInput.value.focus();
    }
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
    const all = await ChatMessage.list('-created_date') || [];
    const normalizeMessage = (m) => ({ ...m, created_date: m.created_date || m.created_at || m.createdAt || new Date().toISOString() });
    const serverMsgs = (all || []).filter(m => m.case_id === caseId).map(normalizeMessage);

    // Merge server messages with local messages (preserve local-only/unsynced messages)
    const byKey = {};
    const addToByKey = (m) => {
      if (!m) return;
      const key = m.id || m._tempId || (m.created_date ? `${new Date(m.created_date).getTime()}-${Math.random().toString(36).slice(2,8)}` : `tmp-${Math.random().toString(36).slice(2,8)}`);
      if (!byKey[key]) byKey[key] = m;
      else {
        if (m.id && (!byKey[key].id || byKey[key].id !== m.id)) byKey[key] = m;
      }
    };

    serverMsgs.forEach(addToByKey);
    // include existing in-memory messages (may contain unsynced items without id)
    messages.value.forEach(addToByKey);

    messages.value = Object.values(byKey).sort((a,b) => new Date(a.created_date) - new Date(b.created_date));
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
    messages.value.push({ ...sent, created_date: sent.created_date || sent.created_at || sent.createdAt || new Date().toISOString() });
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

// Admin messaging functions
const getUserInitials = (user) => {
  if (!user) return '?';
  const names = (user.full_name || user.email || '?').split(' ');
  if (names.length >= 2) {
    return (names[0][0] + names[1][0]).toUpperCase();
  }
  return (names[0][0] || '?').toUpperCase();
};

const formatMessageTime = (timestamp) => {
  if (!timestamp) return '';
  try {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return format(date, 'h:mm a');
    } else if (diffInHours < 48) {
      return 'Yesterday ' + format(date, 'h:mm a');
    } else {
      return format(date, 'MMM d, h:mm a');
    }
  } catch (e) {
    return '';
  }
};

const loadAdminMessages = async () => {
  isLoadingAdminMessages.value = true;
  try {
    // Find ALL admin users
    const allUsers = await User.list();
    const allAdmins = allUsers.filter(u => u.user_type === 'admin').sort((a, b) => a.email.localeCompare(b.email));

    // Set primary admin for sending messages (first one alphabetically)
    if (!adminUser.value && allAdmins.length > 0) {
      adminUser.value = allAdmins[0];
      // Found PRIMARY admin for sending (debug removed)
    }

    // All admins loaded (debug removed)

    if (allAdmins.length > 0) {
      // Loading conversations with ALL admins (debug removed)
      // Current lawyer ID available (debug removed)

      // Load conversations with ALL admins
      const allConversations = await Promise.all(
        allAdmins.map(admin => DirectMessage.getConversation(admin.id).catch(() => []))
      );

      // API returned conversation counts (debug removed)

      // Filter and merge messages from all conversations
      let serverFiltered = [];
      allConversations.forEach(conversation => {
        if (Array.isArray(conversation)) {
          const filtered = conversation.filter(msg => {
            const isUserInvolved = String(msg.sender_id) === String(currentUserId.value) || String(msg.recipient_id) === String(currentUserId.value);
            return isUserInvolved;
          });
          serverFiltered.push(...filtered);
        }
      });

      // Mark server messages as coming from server for debugging and remove duplicates
      const serverById = {};
      serverFiltered.forEach(m => {
        if (m && m.id) {
          serverById[m.id] = { ...m, __source: 'server' };
        }
      });
      serverFiltered = Object.values(serverById);
      console.debug('[DEBUG LAWYER] serverFiltered count:', serverFiltered.length);

      // Also include cached messages that match these conversations (fallback when server returns empty)
      let cachedFiltered = [];
      try {
        const cached = (allDirectMessages.value && allDirectMessages.value.length) ? allDirectMessages.value : (DirectMessage.getCachedMessages() || []);
        const adminIds = new Set(allAdmins.map(a => String(a.id)));
        cachedFiltered = cached.filter(msg => {
          const isAdminInvolved = adminIds.has(String(msg.sender_id)) || adminIds.has(String(msg.recipient_id));
          const isUserInvolved = String(msg.sender_id) === String(currentUserId.value) || String(msg.recipient_id) === String(currentUserId.value);
          return isAdminInvolved && isUserInvolved;
        });
        cachedFiltered = cachedFiltered.map(m => ({ ...m, __source: m.__source || 'cache' }));
        console.debug('[DEBUG LAWYER] cachedFiltered count:', cachedFiltered.length);
      } catch (e) {
        console.debug('Failed to read direct message cache for conversation merge:', e);
      }

      // Merge server, cached, and in-memory messages without losing items that lack server ids
      const byKey = {};
      const addToByKey = (m) => {
        if (!m) return;
        const key = m.id || m._tempId || (m.created_at || m.created_date ? `${new Date(m.created_at || m.created_date).getTime()}-${Math.random().toString(36).slice(2,8)}` : `tmp-${Math.random().toString(36).slice(2,8)}`);
        if (m && !m.__source) m.__source = 'memory';
        if (!byKey[key]) byKey[key] = m;
        else {
          if (m.id && (!byKey[key].id || byKey[key].id !== m.id)) byKey[key] = m;
          if (m.__source === 'server') byKey[key] = m;
        }
      };

      serverFiltered.forEach(addToByKey);
      cachedFiltered.forEach(addToByKey);
      adminMessages.value.forEach(addToByKey);

      adminMessages.value = Object.values(byKey).sort((a,b) => new Date(a.created_at || a.created_date || 0) - new Date(b.created_at || b.created_date || 0));
      // Loaded admin messages from all admins (merged) (debug removed)

      // Persist merged admin messages into the shared direct messages cache
      try {
        adminMessages.value.forEach(m => {
          try { DirectMessage.addToCache(m); } catch (e) { /* ignore */ }
        });
        console.debug('[DEBUG LAWYER] persisted merged admin messages to cache');
        try {
          adminMessages.value.forEach(m => { if (m && m.id && !allDirectMessages.value.find(x => x.id && x.id === m.id)) allDirectMessages.value.push(m); });
        } catch (e) {}
      } catch (e) {
        console.debug('[DEBUG LAWYER] failed to persist admin messages to cache', e);
      }
    } else {
      console.warn('[WARN LAWYER] No admin user found!');
    }
  } catch (error) {
    console.error('[ERROR LAWYER] Failed to load admin messages:', error);
    console.error('[ERROR LAWYER] Error details:', error.response?.data || error.message);
    // Fallback to cached direct messages if available to avoid wiping UI
    try {
      const cached = DirectMessage.getCachedMessages() || [];
      if (cached.length > 0) {
        const allUsers = await User.list().catch(() => []);
        const adminIds = new Set(allUsers.filter(u => u.user_type === 'admin').map(a => String(a.id)));
        adminMessages.value = cached.filter(m =>
          (adminIds.has(String(m.sender_id)) || adminIds.has(String(m.recipient_id))) &&
          (String(m.sender_id) === String(currentUserId.value) || String(m.recipient_id) === String(currentUserId.value))
        );
        // Populated adminMessages from cache after error (debug removed)
      } else {
        adminMessages.value = [];
      }
    } catch (e) {
      console.debug('[DEBUG LAWYER] Failed to read cache after load error:', e);
      adminMessages.value = [];
    }
  } finally {
    isLoadingAdminMessages.value = false;
  }
};

const sendAdminMessage = async () => {
  if (!newAdminMessage.value.trim() || isSendingAdmin.value) return;

  isSendingAdmin.value = true;
    try {
      // Find PRIMARY admin user if not already loaded
      if (!adminUser.value) {
      const allUsers = await User.list();
      const admins = allUsers.filter(u => u.user_type === 'admin').sort((a, b) => a.email.localeCompare(b.email));
      adminUser.value = admins[0]; // Use first admin for consistency
    }

    if (!adminUser.value) {
      alert('Admin user not found');
      return;
    }

    // Sending to PRIMARY admin (debug removed)

    // Send message to admin
    const sentMessage = await DirectMessage.create({
      content: newAdminMessage.value.trim(),
      recipient_id: adminUser.value.id,
      message_type: 'text'
    });

    // Mark as local/sent for debug tracing
    try { sentMessage.__source = 'local'; } catch (e) {}

    // Message sent (debug removed)

    // Add the sent message to the local array
    adminMessages.value.push(sentMessage);
    newAdminMessage.value = '';

    await nextTick();
    scrollAdminToBottom();

    // Emit over socket so admin receives it in realtime
    try {
      const socket = getSocket();
      console.debug('[socket LAWYER] emitting client:new_message', sentMessage);
      if (socket) socket.emit('client:new_message', sentMessage);
    } catch (e) {
      console.debug('Failed to emit lawyer->admin new_message', e, sentMessage);
    }
  } catch (error) {
    console.error('[ERROR LAWYER] Failed to send message to admin:', error);
    alert('Failed to send message. Please try again.');
  } finally {
    isSendingAdmin.value = false;
  }
};

const scrollAdminToBottom = () => {
  if (adminMessagesContainer.value) {
    adminMessagesContainer.value.scrollTop = adminMessagesContainer.value.scrollHeight;
  }
};

const startAdminPolling = () => {
  if (adminPollingInterval) {
    clearInterval(adminPollingInterval);
  }

  // Poll every 10 seconds for new messages (reduced frequency)
  adminPollingInterval = setInterval(async () => {
    // Skip polling when page is hidden or socket is connected
    try {
      const socket = getSocket && getSocket();
      if (typeof document !== 'undefined' && document.hidden) return;
      if (socket && socket.connected) return;
    } catch (e) {}

    if (activeTab.value === 'admin') {
      try {
        // Get all admin users
        const allUsers = await User.list();
        const allAdmins = allUsers.filter(u => u.user_type === 'admin');

        if (allAdmins.length > 0) {
          // Load conversations with ALL admins
          const allConversations = await Promise.all(
            allAdmins.map(admin => DirectMessage.getConversation(admin.id).catch(() => []))
          );

          // Merge all conversations
          const byId = {};
          allConversations.forEach(conversation => {
            if (Array.isArray(conversation)) {
              conversation.forEach(m => { if (m && m.id) byId[m.id] = m; });
            }
          });

          // Also include existing local messages
          adminMessages.value.forEach(m => { if (m && m.id) byId[m.id] = m; });

          adminMessages.value = Object.values(byId).sort((a,b) =>
            new Date(a.created_at || a.created_date || 0) - new Date(b.created_at || b.created_date || 0)
          );
        }
      } catch (error) {
        console.error('Failed to refresh admin messages:', error);
      }
    }
  }, 10000);
};

const stopAdminPolling = () => {
  if (adminPollingInterval) {
    clearInterval(adminPollingInterval);
    adminPollingInterval = null;
  }
};

// Watch for tab change to start/stop polling
watch(() => activeTab.value, async (newTab) => {
  if (newTab === 'admin') {
    await loadAdminMessages();
    startAdminPolling();
    await nextTick();
    scrollAdminToBottom();
  } else {
    stopAdminPolling();
  }
});

// Watch for new admin messages and scroll to bottom
watch(() => adminMessages.value.length, async () => {
  if (activeTab.value === 'admin') {
    await nextTick();
    scrollAdminToBottom();
  }
});

onMounted(() => {
  loadAssignedCases();
  // preload direct messages (cache-first) so admin conversation merges have data to use
  (async () => {
    try {
      // Load cached messages first
      const cached = DirectMessage.getCachedMessages() || [];
      if (cached && cached.length > 0) {
        allDirectMessages.value = cached;
        console.debug('[DEBUG LAWYER] Loaded cached direct messages:', cached.length);
      }
      // Refresh from server (list) and merge with cache without wiping local-only items
      const srv = await DirectMessage.list();
      if (Array.isArray(srv) && srv.length > 0) {
        // merge server into allDirectMessages preferring server entries
        const byId = {};
        srv.forEach(m => { if (m && m.id) byId[m.id] = m; });
        // include any cached items that the server doesn't know about
        (allDirectMessages.value || []).forEach(m => { if (m && m.id && !byId[m.id]) byId[m.id] = m; });
        // keep local-only (no id) messages at end
        const locals = (allDirectMessages.value || []).filter(m => !m.id);
        allDirectMessages.value = Object.values(byId).concat(locals);
        console.debug('[DEBUG LAWYER] Refreshed direct messages from backend:', Object.keys(byId).length);
      }
    } catch (e) {
      console.debug('[DEBUG LAWYER] Failed to preload direct messages:', e);
    }
  })();
  // initialize socket connection
    try {
      initSocket(authStore.accessToken);
      const socket = getSocket();
      if (socket) {
        try { socket.emit('register', { userId: authStore.user?.id, userType: authStore.user?.user_type }); } catch (e) {}
        // When connection is (re)established, rejoin rooms and refresh messages
        socket.on('connect', () => {
          try {
            // rejoin active case
            if (activeCase.value && activeCase.value.id) {
              socket.emit('join_case', activeCase.value.id);
              // reload messages for the case to catch any missed ones
              loadMessagesForCase(activeCase.value.id).catch(() => {});
            }
            // reload admin conversation if admin tab is open or adminUser is known
            if (adminUser.value) {
              loadAdminMessages().catch(() => {});
            }
          } catch (e) {
            console.debug('Error during socket connect handler', e);
          }
        });

        socket.on('new_message', (msg) => {
        // avoid duplicates
        if (!msg || !msg.id) return;
        if (messages.value.find(m => m.id === msg.id)) return;
        // if the incoming message belongs to the currently open case, append it
        if (activeCase.value && msg.case_id === activeCase.value.id) {
          const normalized = { ...msg, created_date: msg.created_date || msg.created_at || msg.createdAt || new Date().toISOString() };
          messages.value.push(normalized);
          nextTick().then(scrollToBottom);
        }
        // update last message timestamp
        if (msg.case_id) lastMessageMap.value[msg.case_id] = msg.created_date || msg.created_at || new Date().toISOString();
        // Handle direct messages (admin <-> lawyer)
            if (msg.recipient_id && (msg.recipient_id === authStore.user?.id || msg.sender_id === authStore.user?.id)) {
          if (!adminMessages.value.find(m => (m.id && msg.id && m.id === msg.id) || (m._tempId && m._tempId === msg._tempId))) {
            const normalized = { ...msg, created_at: msg.created_at || msg.created_date || msg.createdAt || new Date().toISOString(), __source: 'socket' };
            // ensure a stable temporary id for messages that don't have server id yet
            if (!normalized.id && !normalized._tempId) normalized._tempId = `tmp-${Date.now()}-${Math.random().toString(36).slice(2,6)}`;
            adminMessages.value.push(normalized);
            try {
              console.debug('[DEBUG LAWYER] after socket push adminMessages count:', adminMessages.value.length);
              console.debug('[DEBUG LAWYER] last admin message:', adminMessages.value[adminMessages.value.length-1]);
            } catch (e) {}
            // also add to in-memory allDirectMessages so merges can use it immediately
            try {
              if (normalized.id) {
                if (!allDirectMessages.value.find(m => m.id === normalized.id)) allDirectMessages.value.push(normalized);
              } else {
                // keep local-only messages too
                allDirectMessages.value.push(normalized);
              }
            } catch (e) {}
            // Cache the message in localStorage
            try {
              DirectMessage.addToCache(normalized);
            } catch (e) {
              console.debug('Failed to cache admin message in localStorage:', e);
            }
            if (activeTab.value === 'admin') {
              nextTick().then(scrollAdminToBottom);
            }
          }
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
  stopAdminPolling();
});
</script>

<style scoped>
/* small styles if needed */
</style>
