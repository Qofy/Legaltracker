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
        </div>
        <div>
          <button @click.prevent="startConversationForCase(c)" class="px-3 py-1 bg-[#003aca] text-white rounded text-sm">Message</button>
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
</template>

<script setup>
import { ref, nextTick, onMounted } from 'vue';
import { Case, ChatMessage, User } from '@/services/entities';
import { useAuthStore } from '@/stores/auth';
import { format } from 'date-fns';
import {SendHorizontal} from "lucide-vue-next"

const authStore = useAuthStore();

const myCases = ref([]);
const selectedCaseId = ref('');
const messages = ref([]);
const newMessage = ref('');
const lawyerName = ref('Your Lawyer');
const messagesContainer = ref(null);
const lawyerMap = ref({}); // cached lawyers by case id
const messageInput = ref(null);

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
      await loadMessages();
    }
  } catch (error) {
    console.error('Failed to load cases:', error);
  }
};

const startConversationForCase = async (caseItem) => {
  if (!caseItem) return;
  selectedCaseId.value = caseItem.id;
  await loadMessages();
  await nextTick();
  if (messageInput.value) messageInput.value.focus();
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
    // focus input
    if (messageInput.value) messageInput.value.focus();
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
