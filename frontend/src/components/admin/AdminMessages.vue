<template>
  <div class="flex h-[calc(100vh-12rem)] bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
    <!-- Users List Sidebar -->
    <div class="w-80 border-r border-gray-200 flex flex-col">
      <!-- Header -->
      <div class="p-4 border-b border-gray-200 bg-gray-50">
        <h2 class="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <MessageSquare class="w-5 h-5 text-blue-600" />
          Messages
        </h2>
        <p class="text-xs text-gray-500 mt-1">Select a user to start messaging</p>
      </div>

      <!-- Search Users -->
      <div class="p-3 border-b border-gray-200">
        <div class="relative">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search users..."
            class="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <!-- Users List -->
      <div class="flex-1 overflow-y-auto">
        <div v-if="isLoadingUsers" class="p-4 text-center text-sm text-gray-500">
          Loading users...
        </div>
        <div v-else-if="filteredUsers.length === 0" class="p-4 text-center text-sm text-gray-500">
          No users found
        </div>
        <div v-else>
          <button
            v-for="user in filteredUsers"
            :key="user.id"
            @click="selectUser(user)"
            :class="[
              'w-full p-4 text-left hover:bg-gray-50 transition-colors border-b border-gray-100',
              selectedUser?.id === user.id ? 'bg-blue-50 hover:bg-blue-50' : ''
            ]"
          >
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                {{ getUserInitials(user) }}
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2">
                  <p class="text-sm font-medium text-gray-900 truncate">{{ user.full_name }}</p>
                  <span
                    :class="[
                      'px-2 py-0.5 text-xs rounded-full',
                      user.user_type === 'lawyer' ? 'bg-purple-100 text-purple-700' :
                      user.user_type === 'customer' ? 'bg-green-100 text-green-700' :
                      'bg-gray-100 text-gray-700'
                    ]"
                  >
                    {{ user.user_type }}
                  </span>
                </div>
                <p class="text-xs text-gray-500 truncate">{{ user.email }}</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>

    <!-- Chat Area -->
    <div class="flex-1 flex flex-col">
      <!-- No User Selected -->
      <div v-if="!selectedUser" class="flex-1 flex items-center justify-center text-gray-400">
        <div class="text-center">
          <MessageCircle class="w-16 h-16 mx-auto mb-3 opacity-50" />
          <p class="text-lg font-medium">Select a user to start messaging</p>
          <p class="text-sm mt-1">Choose from the list on the left</p>
        </div>
      </div>

      <!-- Chat with Selected User -->
      <template v-else>
        <!-- Chat Header -->
        <div class="p-4 border-b border-gray-200 bg-gray-50">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
              {{ getUserInitials(selectedUser) }}
            </div>
            <div>
              <p class="text-sm font-semibold text-gray-900">{{ selectedUser.full_name }}</p>
              <p class="text-xs text-gray-500">{{ selectedUser.email }}</p>
            </div>
          </div>
        </div>

        <!-- Messages List -->
        <div ref="messagesContainer" class="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          <div v-if="isLoadingMessages" class="text-center text-sm text-gray-500">
            Loading messages...
          </div>
          <div v-else-if="currentMessages.length === 0" class="text-center text-sm text-gray-500 py-8">
            No messages yet. Start the conversation!
          </div>
          <div v-else v-for="message in currentMessages" :key="message.id" class="flex items-start gap-3">
            <!-- Message from others -->
            <div v-if="message.sender_id !== currentUserId" class="flex-1">
              <div class="flex items-start gap-2">
                <div class="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                  {{ getUserInitials(message.sender || selectedUser) }}
                </div>
                <div class="flex-1">
                  <div class="bg-white rounded-lg rounded-tl-none p-3 shadow-sm border border-gray-200 max-w-md">
                    <p class="text-sm text-gray-900">{{ message.content }}</p>
                  </div>
                  <p class="text-xs text-gray-400 mt-1 ml-1">{{ formatMessageTime(message.created_at) }}</p>
                </div>
              </div>
            </div>

            <!-- Message from admin (current user) -->
            <div v-else class="flex-1 flex justify-end">
              <div class="flex items-start gap-2 flex-row-reverse">
                <div class="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                  {{ getUserInitials(message.sender || currentUser) }}
                </div>
                <div class="flex-1 flex flex-col items-end">
                  <div class="bg-blue-600 text-white rounded-lg rounded-tr-none p-3 shadow-sm max-w-md relative">
                    <!-- Yellow Star Indicator for Admin -->
                    <div class="absolute -top-2 -right-2">
                      <Star class="w-5 h-5 text-yellow-400 fill-yellow-400 drop-shadow-md" />
                    </div>
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
                v-model="newMessage"
                @keydown.enter.exact.prevent="sendMessage"
                placeholder="Type your message... (Press Enter to send)"
                rows="2"
                class="w-full px-3 py-2 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              ></textarea>
            </div>
            <button
              @click="sendMessage"
              :disabled="!newMessage.trim() || isSending"
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
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue';
import { User, DirectMessage } from '@/services/entities';
import { useAuthStore } from '@/stores/auth';
import { MessageSquare, MessageCircle, Search, Send, Star } from 'lucide-vue-next';
import { format } from 'date-fns';

const authStore = useAuthStore();

const currentUser = ref(null);
const currentUserId = computed(() => authStore.user?.id || currentUser.value?.id);

const users = ref([]);
const selectedUser = ref(null);
const searchQuery = ref('');
const messages = ref([]);
const newMessage = ref('');
const isLoadingUsers = ref(true);
const isLoadingMessages = ref(false);
const isSending = ref(false);
const messagesContainer = ref(null);
let pollingInterval = null;

// Filtered users based on search
const filteredUsers = computed(() => {
  if (!searchQuery.value.trim()) return users.value;
  const query = searchQuery.value.toLowerCase();
  return users.value.filter(user =>
    user.full_name?.toLowerCase().includes(query) ||
    user.email?.toLowerCase().includes(query)
  );
});

// Messages for current conversation
const currentMessages = computed(() => {
  if (!selectedUser.value) return [];

  // Filter messages between admin and selected user
  return messages.value
    .filter(msg => {
      const isBetweenUsers =
        (msg.sender_id === currentUserId.value && msg.recipient_id === selectedUser.value.id) ||
        (msg.sender_id === selectedUser.value.id && msg.recipient_id === currentUserId.value);
      return isBetweenUsers;
    })
    .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
});

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

const loadUsers = async () => {
  isLoadingUsers.value = true;
  try {
    currentUser.value = await User.me();
    const allUsers = await User.list();

    // Filter out current admin user and only show lawyers and customers
    users.value = allUsers.filter(u =>
      u.id !== currentUserId.value &&
      (u.user_type === 'lawyer' || u.user_type === 'customer')
    );

    console.log('Loaded users for messaging:', users.value.length);
  } catch (error) {
    console.error('Failed to load users:', error);
  } finally {
    isLoadingUsers.value = false;
  }
};

const loadMessages = async () => {
  isLoadingMessages.value = true;
  try {
    // Load all messages from the backend
    const allMessages = await DirectMessage.list();
    messages.value = allMessages || [];
    console.log('Loaded messages from backend:', messages.value.length);
  } catch (error) {
    console.error('Failed to load messages:', error);
    messages.value = [];
  } finally {
    isLoadingMessages.value = false;
  }
};

const selectUser = async (user) => {
  selectedUser.value = user;
  isLoadingMessages.value = true;

  try {
    // Load conversation with this specific user
    const conversation = await DirectMessage.getConversation(user.id);
    messages.value = conversation || [];
    console.log('Loaded conversation with', user.full_name, ':', messages.value.length, 'messages');
  } catch (error) {
    console.error('Failed to load conversation:', error);
  } finally {
    isLoadingMessages.value = false;
  }

  await nextTick();
  scrollToBottom();
};

const sendMessage = async () => {
  if (!newMessage.value.trim() || !selectedUser.value || isSending.value) return;

  isSending.value = true;
  try {
    // Send message to backend
    const sentMessage = await DirectMessage.create({
      content: newMessage.value.trim(),
      recipient_id: selectedUser.value.id,
      message_type: 'text'
    });

    // Add the sent message to the local array
    messages.value.push(sentMessage);

    newMessage.value = '';

    await nextTick();
    scrollToBottom();

    console.log('Message sent to', selectedUser.value.full_name);
  } catch (error) {
    console.error('Failed to send message:', error);
    alert('Failed to send message. Please try again.');
  } finally {
    isSending.value = false;
  }
};

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
};

// Auto-refresh messages when a user is selected
const startPolling = () => {
  if (pollingInterval) {
    clearInterval(pollingInterval);
  }

  // Poll every 3 seconds for new messages
  pollingInterval = setInterval(async () => {
    if (selectedUser.value) {
      try {
        const conversation = await DirectMessage.getConversation(selectedUser.value.id);
        messages.value = conversation || [];
      } catch (error) {
        console.error('Failed to refresh messages:', error);
      }
    }
  }, 3000);
};

const stopPolling = () => {
  if (pollingInterval) {
    clearInterval(pollingInterval);
    pollingInterval = null;
  }
};

// Watch for user selection to start/stop polling
watch(() => selectedUser.value, (newUser) => {
  if (newUser) {
    startPolling();
  } else {
    stopPolling();
  }
});

// Watch for new messages and scroll to bottom
watch(() => currentMessages.value.length, async () => {
  await nextTick();
  scrollToBottom();
});

onMounted(async () => {
  await loadUsers();
  await loadMessages();
});

onUnmounted(() => {
  stopPolling();
});
</script>

<style scoped>
/* Custom scrollbar for messages */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
