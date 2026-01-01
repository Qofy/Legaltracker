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
        <p class="text-gray-500 mt-1">Communicate with your lawyer</p>
      </div>
    </div>

    <!-- Case Selection -->
    <div v-if="myCases.length > 1" class="bg-white rounded-lg border border-gray-200 p-4">
      <label class="block text-sm font-medium text-gray-700 mb-2">Select Case</label>
      <select v-model="selectedCaseId" @change="loadMessages" class="w-full md:w-96 px-3 py-2 border border-gray-300 rounded-md">
        <option v-for="c in myCases" :key="c.id" :value="c.id">
          {{ c.title }} - #{{ c.case_number }}
        </option>
      </select>
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
             :class="['flex', message.is_from_customer ? 'justify-end' : 'justify-start']">
          <div :class="[
            'max-w-sm px-4 py-3 rounded-lg',
            message.is_from_customer
              ? 'bg-blue-600 text-white rounded-br-none'
              : 'bg-gray-100 text-gray-900 rounded-bl-none'
          ]">
            <p class="text-sm">{{ message.message }}</p>
            <p :class="['text-xs mt-1', message.is_from_customer ? 'text-blue-100' : 'text-gray-500']">
              {{ formatTime(message.created_date) }}
            </p>
          </div>
        </div>
      </div>

      <!-- Message Input -->
      <div class="p-4 border-t border-gray-200">
        <div class="flex items-end gap-3">
          <textarea
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
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
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
</template>

<script setup>
import { ref, nextTick, onMounted } from 'vue';
import { Case, ChatMessage, User } from '@/services/entities';
import { useAuthStore } from '@/stores/auth';
import { format } from 'date-fns';

const authStore = useAuthStore();

const myCases = ref([]);
const selectedCaseId = ref('');
const messages = ref([]);
const newMessage = ref('');
const lawyerName = ref('Your Lawyer');
const messagesContainer = ref(null);

const loadMyCases = async () => {
  try {
    const userId = authStore.user?.id;
    if (!userId) return;

    const allCases = await Case.list();
    myCases.value = allCases.filter(c =>
      c.customer_ids && Array.isArray(c.customer_ids) && c.customer_ids.includes(userId)
    );

    if (myCases.value.length > 0) {
      selectedCaseId.value = myCases.value[0].id;
      await loadMessages();
    }
  } catch (error) {
    console.error('Failed to load cases:', error);
  }
};

const loadMessages = async () => {
  try {
    if (!selectedCaseId.value) return;

    const selectedCase = myCases.value.find(c => c.id === selectedCaseId.value);

    // Load lawyer name
    if (selectedCase && selectedCase.lawyer_id) {
      try {
        const lawyer = await User.get(selectedCase.lawyer_id);
        lawyerName.value = lawyer.full_name;
      } catch (error) {
        console.error('Failed to load lawyer:', error);
      }
    }

    // Load messages for this case
    const allMessages = await ChatMessage.list('-created_date');
    messages.value = allMessages
      .filter(m => m.case_id === selectedCaseId.value)
      .map(m => ({
        ...m,
        is_from_customer: m.sender_id === authStore.user?.id,
      }))
      .sort((a, b) => new Date(a.created_date) - new Date(b.created_date));

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
      sender_id: authStore.user?.id,
      message: newMessage.value.trim(),
    };

    const sentMessage = await ChatMessage.create(messageData);
    messages.value.push({
      ...sentMessage,
      is_from_customer: true,
    });

    newMessage.value = '';

    // Scroll to bottom
    await nextTick();
    scrollToBottom();
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

const formatTime = (date) => {
  try {
    return format(new Date(date), 'MMM d, h:mm a');
  } catch (e) {
    return '';
  }
};

onMounted(() => {
  loadMyCases();
});
</script>
