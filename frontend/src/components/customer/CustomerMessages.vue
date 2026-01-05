<template>
  <div class="flex flex-col" style="height: 100vh; overflow: hidden;">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h2 class="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <svg class="w-7 h-7 text-[#003aca]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          Messages
        </h2>
        <p class="text-gray-500 mt-1">Communicate with your lawyer and admin</p>
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
        Lawyer Messages
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
    <div v-if="activeTab === 'cases'" class="space-y-6">
    <!-- Case Selection -->
    <div v-if="myCases.length > 1" class="bg-white rounded-lg border border-gray-200 p-4">
      <label class="block text-sm font-medium text-gray-700 mb-2">Select Case</label>
      <select v-model="selectedCaseId" @change="loadMessages" class="w-full md:w-96 px-3 py-2 border border-gray-300 rounded-md">
        <option v-for="c in myCases" :key="c.id" :value="c.id">
          {{ c.title }} - #{{ c.case_number }}
        </option>
      </select>
    </div>

    <!-- Cases & Lawyers quick list -->
    <div v-if="myCases.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-3">
      <div v-for="c in myCases" :key="c.id" class="bg-white rounded-lg border border-gray-200 p-3 flex items-center justify-between">
        <div>
          <div class="font-semibold">{{ c.title }}</div>
          <div class="text-xs text-gray-500">Case #: {{ c.case_number || '—' }}</div>
          <div class="text-xs text-gray-500 mt-1">Lawyer: <span class="font-medium">
            {{
              (lawyerMap[c.id] && (lawyerMap[c.id].full_name || lawyerMap[c.id].name || lawyerMap[c.id].email))
              || (c.lawyer && (c.lawyer.full_name || c.lawyer.name))
              || (c.assigned_lawyer && (c.assigned_lawyer.full_name || c.assigned_lawyer.name))
              || (c.lawyer_id || c.assigned_lawyer_id || c.assignedLawyerId || c.lawyerId ? 'Loading...' : 'No lawyer assigned')
            }}
          </span></div>
          <div class="text-xs text-gray-400 mt-1">Last: <span class="font-medium">{{ lastMessageMap[c.id] ? formatTime(lastMessageMap[c.id]) : '—' }}</span></div>
        </div>
        <div>
          <div class="flex items-center gap-2">
            <button @click.prevent="startConversationForCase(c)" class="px-3 py-1 bg-[#003aca] text-white rounded text-sm">Message</button>
            <span v-if="unreadMap[c.id] > 0" class="ml-2 inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium rounded-full bg-red-600 text-white">{{ unreadMap[c.id] }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Messages Container -->
    <div class="bg-white rounded-lg border border-gray-200 flex flex-col" style="height: calc(100vh - 300px);">
      <!-- Messages Header -->
      <div class="p-4 border-b border-gray-200">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <h3 class="font-semibold text-gray-900">{{ lawyerName }}</h3>
            <p class="text-xs text-gray-500">Your Lawyer</p>
          </div>
        </div>
      </div>

      <!-- Messages List -->
      <div ref="messagesContainer" class="flex-1 p-4 overflow-y-auto space-y-4">
        <div v-if="messages.length === 0" class="flex items-center justify-center h-full text-gray-500">
          <div class="text-center">
            <svg class="w-16 h-16 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            <p class="text-sm">No messages yet</p>
            <p class="text-xs text-gray-400 mt-1">Start a conversation with your lawyer</p>
          </div>
        </div>

        <div v-else v-for="message in messages" :key="message.id"
             :class="['flex', (message.sender_id === authStore.user?.id) ? 'justify-end' : 'justify-start']">
          <div :class="[(message.sender_id === authStore.user?.id) ? 'items-end flex flex-col' : 'items-start flex flex-col']">
            <div :class="[
              'max-w-sm px-4 py-3 rounded-lg message-bubble',
              (message.sender_id === authStore.user?.id)
                ? 'sender bg-blue-600 text-white rounded-br-none'
                : 'receiver bg-gray-100 text-gray-900 rounded-bl-none'
            ]">
              <p class="text-sm">{{ message.content || message.message }}</p>
            </div>
            <div class="mt-1">
              <p :class="['text-xs', (message.sender_id === authStore.user?.id) ? 'text-blue-100' : 'text-gray-500']">{{ formatTime(message.created_date) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Message Input -->
      <div class="p-4 border-t border-gray-200">
        <div class="flex items-end gap-3">
          <textarea
            ref="messageInput"
            v-model="newMessage"
            @keydown.enter.prevent="sendMessage"
            rows="2"
            placeholder="Type your message..."
            class="flex-1 px-4 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
          <button
            @click="sendMessage"
            :disabled="!newMessage.trim()"
            class="px-6 py-2 bg-[#003aca] text-white rounded-lg hover:bg-[#0031a0] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <SendHorizontal size="20"/>
            Send
          </button>
        </div>
        <p class="text-xs text-gray-500 mt-2">Press Enter to send, Shift+Enter for new line</p>
      </div>
    </div>

    <!-- Communication Tips -->
    <div class="bg-blue-50 rounded-lg border border-blue-200 p-4">
      <div class="flex items-start gap-3">
        <svg class="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          <h4 class="font-semibold text-blue-900 mb-1">Communication Tips</h4>
          <ul class="text-sm text-blue-800 space-y-1">
            <li>• Be clear and concise in your messages</li>
            <li>• Include relevant case details when asking questions</li>
            <li>• Your lawyer will typically respond within 24-48 hours</li>
            <li>• For urgent matters, please call the office directly</li>
          </ul>
        </div>
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
          <div v-else v-for="message in adminMessages" :key="message.id" class="flex items-start gap-3">
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
                  </div>
                  <p class="text-xs text-gray-400 mt-1 ml-1">{{ formatMessageTime(message.created_at) }}</p>
                </div>
              </div>
            </div>

            <!-- Message from customer (current user) -->
            <div v-else class="flex-1 flex justify-end">
              <div class="flex items-start gap-2 flex-row-reverse">
                <div class="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                  {{ getUserInitials(authStore.user) }}
                </div>
                <div class="flex-1 flex flex-col items-end">
                  <div class="bg-blue-600 text-white rounded-lg rounded-tr-none p-3 shadow-sm max-w-md">
                    <p class="text-sm">{{ message.content }}</p>
                  </div>
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
import { ref, nextTick, onMounted, onUnmounted, computed, watch } from 'vue';
import { Case, ChatMessage, DirectMessage, User } from '@/services/entities';
import { useAuthStore } from '@/stores/auth';
import { format } from 'date-fns';
import { SendHorizontal, Star, Send } from "lucide-vue-next"
import { initSocket, getSocket } from '@/plugins/socket';

const authStore = useAuthStore();

// Tab state
const activeTab = ref('cases');

// Admin messages state
const adminMessages = ref([]);
const newAdminMessage = ref('');
const adminMessagesContainer = ref(null);
const isLoadingAdminMessages = ref(false);
const isSendingAdmin = ref(false);
let adminPollingInterval = null;
const adminUser = ref(null);

const currentUserId = computed(() => authStore.user?.id);

const myCases = ref([]);
const selectedCaseId = ref('');
const messages = ref([]);
const newMessage = ref('');
const lawyerName = ref('Your Lawyer');
const messagesContainer = ref(null);
const lawyerMap = ref({}); // cached lawyers by case id
const lastMessageMap = ref({}); // caseId -> most recent message created_date
const messageInput = ref(null);
const unreadMap = ref({});

const loadMyCases = async () => {
  try {
    const userId = authStore.user?.id;
    if (!userId) return;

    const allCases = await Case.list();
    myCases.value = allCases.filter(c => {
      // support multiple shapes: c.customer_ids (array of ids), c.customers (array of objects), or comma-separated string
      const customersField = c.customer_ids || c.customers || c.customerIds || c.customers_list;
      if (Array.isArray(customersField)) {
        // elements might be ids or objects
        return customersField.some((item) => {
          if (!item) return false;
          if (typeof item === 'string') return item === userId;
          if (typeof item === 'object') return item.id === userId || item._id === userId;
          return false;
        });
      }
      if (typeof customersField === 'string') {
        return customersField.split(',').map(s => s.trim()).includes(userId);
      }
      return false;
    });

    console.debug('[CustomerMessages] myCases loaded:', myCases.value.length, myCases.value.map(c => ({ id: c.id, title: c.title })));

    if (myCases.value.length > 0) {
      // preload lawyer info for each case (if available)
      // cases may use different field names for assigned lawyer: lawyer_id, assigned_lawyer_id, assignedLawyerId, lawyerId
      const possibleLawyerField = (c) => c.lawyer_id || c.assigned_lawyer_id || c.assignedLawyerId || c.lawyerId || (c.lawyer && (c.lawyer.id || c.lawyer._id));

      // If case already contains nested lawyer object, use it
      myCases.value.forEach(c => {
        if (c.lawyer && (c.lawyer.full_name || c.lawyer.name || c.lawyer.email)) {
          lawyerMap.value[c.id] = c.lawyer;
        } else if (c.assigned_lawyer && (c.assigned_lawyer.full_name || c.assigned_lawyer.name)) {
          lawyerMap.value[c.id] = c.assigned_lawyer;
        }
      });

      const uniqueLawyerIds = Array.from(new Set(myCases.value.map(c => possibleLawyerField(c)).filter(Boolean)));
      console.debug('[CustomerMessages] detected lawyer ids for preload:', uniqueLawyerIds);

      await Promise.all(uniqueLawyerIds.map(async (lid) => {
        try {
          const u = await User.get(lid);
          // assign to any cases that reference this lawyer id in any of the known fields
          myCases.value.forEach(c => {
            if (possibleLawyerField(c) === lid) lawyerMap.value[c.id] = u;
          });
        } catch (e) {
          // ignore failures for individual lawyer fetches
        }
      }));

      selectedCaseId.value = myCases.value[0].id;
      // initialize unread map
      myCases.value.forEach(c => { unreadMap.value[c.id] = unreadMap.value[c.id] || 0; });
      // load last message timestamps for each case
      await Promise.all(myCases.value.map(async (c) => {
        try {
          const msgs = await ChatMessage.filter({ case_id: c.id }, '-created_date', 1);
          if (msgs && msgs.length > 0) lastMessageMap.value[c.id] = msgs[0].created_date;
          else lastMessageMap.value[c.id] = null;
        } catch (e) {
          lastMessageMap.value[c.id] = null;
        }
      }));
      await loadMessages();
    }
  } catch (error) {
    console.error('Failed to load cases:', error);
  }
};

const startConversationForCase = async (caseItem) => {
  if (!caseItem) return;
  try {
    const socket = getSocket();
    if (socket && selectedCaseId.value) socket.emit('leave_case', selectedCaseId.value);
  } catch (e) {}

  selectedCaseId.value = caseItem.id;
  await loadMessages();
  await nextTick();
  if (messageInput.value) messageInput.value.focus();
  // join case room
  try {
    const socket = getSocket();
    if (socket && caseItem && caseItem.id) socket.emit('join_case', caseItem.id);
  } catch (e) {}

  // reset unread for this case
  if (caseItem && caseItem.id) unreadMap.value[caseItem.id] = 0;
};

const loadMessages = async () => {
  try {
    if (!selectedCaseId.value) return;

    const selectedCase = myCases.value.find(c => c.id === selectedCaseId.value);

    // Load lawyer name (use cached lawyer when possible)
    if (selectedCase) {
      const cached = lawyerMap.value[selectedCase.id];
      if (cached) {
        lawyerName.value = cached.full_name || cached.name || cached.email || 'Your Lawyer';
      } else if (selectedCase.lawyer_id) {
        try {
          const lawyer = await User.get(selectedCase.lawyer_id);
          lawyerMap.value[selectedCase.id] = lawyer;
          lawyerName.value = lawyer.full_name || lawyer.name || lawyer.email || 'Your Lawyer';
        } catch (error) {
          console.error('Failed to load lawyer:', error);
        }
      } else {
        lawyerName.value = 'No lawyer assigned';
      }
    }

    const mapMsg = (m) => ({ ...normalizeMessage(m), is_from_customer: m.sender_id === authStore.user?.id });
    // Load all messages from backend (sorted desc by created_date)
    const allMessages = await ChatMessage.list('-created_date');
    const serverMessages = (allMessages || []).filter(m => m.case_id === selectedCaseId.value).map(mapMsg);

    // Merge server messages with in-memory messages to preserve local-only items
    const byKey = {};
    const addToByKey = (m) => {
      if (!m) return;
      const key = m.id || m._tempId || (m.created_date ? `${new Date(m.created_date).getTime()}-${Math.random().toString(36).slice(2,8)}` : `tmp-${Math.random().toString(36).slice(2,8)}`);
      if (!byKey[key]) byKey[key] = m;
      else {
        if (m.id && (!byKey[key].id || byKey[key].id !== m.id)) byKey[key] = m;
      }
    };

    serverMessages.forEach(addToByKey);
    messages.value.forEach(addToByKey);
    messages.value = Object.values(byKey).sort((a, b) => new Date(a.created_date) - new Date(b.created_date));

    // Scroll to bottom
    await nextTick();
    scrollToBottom();
  } catch (error) {
    console.error('Failed to load messages:', error);
  }
};

const sendMessage = async () => {
  if (!newMessage.value.trim() || !selectedCaseId.value) return;

  try {
    const messageData = {
      case_id: selectedCaseId.value,
      content: newMessage.value.trim(),
    };

    const sentMessage = await ChatMessage.create(messageData);
    messages.value.push({ ...normalizeMessage(sentMessage), is_from_customer: true });

    newMessage.value = '';

    // Scroll to bottom
    await nextTick();
    scrollToBottom();
    // focus input
    if (messageInput.value) messageInput.value.focus();
    // emit via socket so lawyer and other clients receive realtime update
    try {
      const socket = getSocket();
      if (socket) socket.emit('client:new_message', sentMessage);
    } catch (e) {
      // ignore socket emit errors
    }
  } catch (error) {
    console.error('Failed to send message:', error);
    alert('Failed to send message. Please try again.');
  }
};

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
};

// Ensure message objects have a consistent timestamp field
const normalizeMessage = (m) => {
  if (!m) return m;
  return {
    ...m,
    created_date: m.created_date || m.created_at || m.createdAt || new Date().toISOString()
  };
};
const formatTime = (date) => {
  try {
    return format(new Date(date), 'MMM d, h:mm a');
  } catch (e) {
    return '';
  }
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
    }

    if (allAdmins.length > 0) {

      // Load conversations with ALL admins and merge them
      const allConversations = await Promise.all(
        allAdmins.map(admin => DirectMessage.getConversation(admin.id).catch(() => []))
      );

      // Merge all conversations and remove duplicates
      const mergedMessages = {};
      allConversations.forEach(conversation => {
        if (Array.isArray(conversation)) {
          conversation.forEach(msg => {
            if (msg && msg.id) {
              mergedMessages[msg.id] = msg;
            }
          });
        }
      });

      const allMessages = Object.values(mergedMessages);
      // API returned total messages from all admins

      // Only replace local adminMessages when server returns non-empty results
      if (allMessages.length > 0) {
        adminMessages.value = allMessages.sort((a, b) =>
          new Date(a.created_at || a.created_date).getTime() - new Date(b.created_at || b.created_date).getTime()
        );
      } else {
        // Server returned no admin conversations; preserve existing local admin messages
        try {
          const cached = DirectMessage.getCachedMessages() || [];
          if (cached.length > 0 && adminMessages.value.length === 0) {
            // Filter for messages involving ANY admin
            const adminIds = new Set(allAdmins.map(a => String(a.id)));
            adminMessages.value = cached.filter(m =>
              adminIds.has(String(m.sender_id)) || adminIds.has(String(m.recipient_id))
            );
            // populated adminMessages from cache
          }
        } catch (e) {
          console.debug('Failed to populate adminMessages from cache:', e);
        }
      }
    } else {
      console.warn('[WARN CUSTOMER] No admin user found!');
    }
  } catch (error) {
    console.error('[ERROR CUSTOMER] Failed to load admin messages:', error);
    console.error('[ERROR CUSTOMER] Error details:', error.response?.data || error.message);
    // Fallback to cached direct messages if available to avoid wiping UI
    try {
      const cached = DirectMessage.getCachedMessages() || [];
      if (cached.length > 0) {
        // Filter for messages involving any admin
        adminMessages.value = cached;
      } else {
        adminMessages.value = [];
      }
    } catch (e) {
      console.debug('[DEBUG CUSTOMER] Failed to read cache after load error:', e);
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

    // debug: sending to primary admin

    // Send message to admin
    const sentMessage = await DirectMessage.create({
      content: newAdminMessage.value.trim(),
      recipient_id: adminUser.value.id,
      message_type: 'text'
    });

    // debug: message sent

    // Add the sent message to the local array
    adminMessages.value.push(sentMessage);
    newAdminMessage.value = '';

    await nextTick();
    scrollAdminToBottom();

    // Emit socket event so admin receives it in realtime
    try {
      const socket = getSocket();
      if (socket) socket.emit('client:new_message', sentMessage);
    } catch (e) {
      console.debug('Failed to emit admin new_message', e);
    }
  } catch (error) {
    console.error('[ERROR CUSTOMER] Failed to send message to admin:', error);
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
  loadMyCases();
  try {
    initSocket(authStore.accessToken);
    const socket = getSocket();
    if (socket) {
      try { socket.emit('register', { userId: authStore.user?.id, userType: authStore.user?.user_type }); } catch (e) {}
      socket.on('new_message', (msg) => {
        if (!msg || !msg.id) return;
        // only add if it belongs to the selected case and not a duplicate
        if (msg.case_id === selectedCaseId.value && !messages.value.find(m => m.id === msg.id)) {
          messages.value.push({ ...msg, is_from_customer: msg.sender_id === authStore.user?.id });
          nextTick().then(scrollToBottom);
        }
        else if (msg.case_id) {
          // increment unread count for background cases
          unreadMap.value[msg.case_id] = (unreadMap.value[msg.case_id] || 0) + 1;
        }
        // Handle direct messages (admin <-> customer)
        if (msg.recipient_id && (msg.recipient_id === authStore.user?.id || msg.sender_id === authStore.user?.id)) {
          if (!adminMessages.value.find(m => m.id === msg.id)) {
            adminMessages.value.push(msg);
            // Cache the message in localStorage
            try {
              DirectMessage.addToCache(msg);
            } catch (e) {
              console.debug('Failed to cache admin message in localStorage:', e);
            }
            if (activeTab.value === 'admin') {
              nextTick().then(scrollAdminToBottom);
            }
          }
        }
        // update last message timestamp for the case
        if (msg.case_id) lastMessageMap.value[msg.case_id] = msg.created_date || msg.created_at || new Date().toISOString();
      });
    }
  } catch (e) {
    console.debug('Socket init error', e);
  }
});

onUnmounted(() => {
  const socket = getSocket();
  if (socket) socket.off('new_message');
  stopAdminPolling();
});
</script>
