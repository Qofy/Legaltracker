<template>
  <div class="h-full flex flex-col clean-border">
    <!-- Loading State -->
    <div v-if="isInitialLoading" class="h-full flex flex-col clean-border">
      <div class="p-4 border-b border-gray-200 bg-white">
        <div class="flex items-center space-x-2">
          <MessageSquare class="w-5 h-5 text-blue-600" />
          <h3 class="font-semibold text-gray-900">AI Assistant</h3>
        </div>
      </div>
      <div class="flex-1 flex items-center justify-center">
        <Loader2 class="w-6 h-6 animate-spin text-blue-600" />
      </div>
    </div>

    <!-- No Case Selected -->
    <div v-else-if="!caseId" class="h-full flex flex-col clean-border">
      <div class="p-4 border-b border-gray-200 bg-white">
        <div class="flex items-center space-x-2">
          <MessageSquare class="w-5 h-5 text-blue-600" />
          <h3 class="font-semibold text-gray-900">AI Assistant</h3>
        </div>
      </div>
      <div class="flex-1 flex items-center justify-center p-4">
        <div class="text-center">
          <Bot class="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p class="text-sm text-gray-500 mb-4">Select a case to start chatting</p>
          <div class="text-xs text-gray-400 space-y-1">
            <p>• Ask questions about your cases</p>
            <p>• Get legal insights</p>
            <p>• Document analysis</p>
            <p>• Case strategy suggestions</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Chat Interface -->
    <template v-else>
      <!-- Chat Header -->
      <div class="p-4 border-b border-gray-200 bg-white">
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center space-x-2">
            <MessageSquare class="w-5 h-5 text-blue-600" />
            <h3 class="font-semibold text-gray-900">AI Assistant</h3>
          </div>
          <div class="flex items-center space-x-1">
            <button @click="clearChat" class="h-6 w-6 flex items-center justify-center hover:bg-gray-100 rounded">
              <Trash2 class="w-3 h-3" />
            </button>
            <button @click="loadMessages" class="h-6 w-6 flex items-center justify-center hover:bg-gray-100 rounded">
              <RefreshCw class="w-3 h-3" />
            </button>
          </div>
        </div>

        <div class="space-y-2">
          <span class="inline-block text-xs px-2 py-1 bg-gray-100 rounded clean-border">
            {{ currentCase?.case_number }} • {{ currentCase?.case_type?.replace('_', ' ') }}
          </span>

          <select
            v-model="chatMode"
            class="w-full h-8 text-xs border rounded-md px-2 clean-border focus:ring-2 focus:ring-blue-500"
          >
            <option value="general">General Questions</option>
            <option value="document_analysis">Document Analysis</option>
            <option value="case_strategy">Case Strategy</option>
          </select>
        </div>
      </div>

      <!-- Case Info -->
      <div v-if="currentCase" class="p-3 bg-blue-50 border-b border-gray-200">
        <div class="text-xs space-y-1">
          <div class="flex items-center space-x-2">
            <FileText class="w-3 h-3 text-blue-600" />
            <span class="font-medium">{{ currentCase.title }}</span>
          </div>
          <p class="text-gray-600 truncate">{{ currentCase.description }}</p>
          <div class="flex items-center space-x-2">
            <span class="text-xs px-1 py-0 bg-white rounded clean-border">
              {{ caseDocuments.length }} docs
            </span>
            <span class="text-xs px-1 py-0 bg-white rounded clean-border">
              {{ currentCase.status }}
            </span>
          </div>
        </div>
      </div>

      <!-- Messages -->
      <div class="flex-1 overflow-y-auto p-4">
        <div class="space-y-4">
          <div v-if="messages.length === 0" class="text-center py-8">
            <Bot class="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p class="text-sm text-gray-500 mb-3">Start a conversation about this case</p>
            <div class="text-xs text-gray-400 space-y-1">
              <p>"What are the key issues in this case?"</p>
              <p>"Summarize the uploaded documents"</p>
              <p>"What should be our next steps?"</p>
            </div>
          </div>

          <div
            v-for="message in messages"
            :key="message.id"
            :class="[
              'flex space-x-3',
              message.message_type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
            ]"
          >
            <div
              :class="[
                'h-8 w-8 flex-shrink-0 rounded-full flex items-center justify-center',
                message.message_type === 'ai' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100'
              ]"
            >
              <Bot v-if="message.message_type === 'ai'" class="w-4 h-4" />
              <User v-else class="w-4 h-4" />
            </div>
            <div
              :class="[
                'max-w-[85%] p-3 rounded-lg border clean-border',
                message.message_type === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white material-elevation-1'
              ]"
            >
              <div class="space-y-2">
                <p class="text-sm leading-relaxed whitespace-pre-wrap">{{ message.message }}</p>
                <span
                  v-if="message.ai_context && message.message_type === 'ai'"
                  class="inline-block text-xs px-2 py-1 bg-gray-100 rounded clean-border"
                >
                  {{ message.ai_context.replace('_', ' ') }}
                </span>
                <p
                  v-if="message.created_date"
                  :class="['text-xs', message.message_type === 'user' ? 'text-blue-100' : 'text-gray-500']"
                >
                  {{ formatTime(message.created_date) }}
                </p>
              </div>
            </div>
          </div>

          <div v-if="isLoading" class="flex space-x-3">
            <div class="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
              <Bot class="w-4 h-4" />
            </div>
            <div class="bg-white material-elevation-1 p-3 rounded-lg border clean-border">
              <div class="flex items-center space-x-2">
                <Loader2 class="w-4 h-4 animate-spin" />
                <span class="text-sm text-gray-500">AI is thinking...</span>
              </div>
            </div>
          </div>
          <div ref="scrollRef" />
        </div>
      </div>

      <!-- Message Input -->
      <div class="p-4 border-t border-gray-200 bg-white">
        <form @submit.prevent="handleSendMessage" class="flex space-x-2">
          <input
            v-model="newMessage"
            type="text"
            placeholder="Ask about this case..."
            :disabled="isLoading"
            class="flex-1 px-3 py-2 border rounded-md clean-border focus:ring-2 focus:ring-blue-500 text-sm"
          />
          <button
            type="submit"
            :disabled="!newMessage.trim() || isLoading"
            class="h-10 w-10 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white rounded disabled:opacity-50"
          >
            <Send class="w-4 h-4" />
          </button>
        </form>
        <p class="text-xs text-gray-400 mt-2">
          💡 Try asking: "What are the key points?" or "Analyze the documents"
        </p>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, nextTick } from 'vue'
import {
  MessageSquare,
  Send,
  Bot,
  User,
  Loader2,
  FileText,
  Trash2,
  RefreshCw
} from 'lucide-vue-next'
import { format } from 'date-fns'

const props = defineProps({
  caseId: {
    type: String,
    default: null
  },
  user: {
    type: Object,
    default: null
  }
})

const messages = ref([])
const newMessage = ref('')
const isLoading = ref(false)
const isInitialLoading = ref(true)
const currentCase = ref(null)
const caseDocuments = ref([])
const chatMode = ref('general')
const scrollRef = ref(null)

const loadCaseData = async () => {
  try {
    // TODO: Replace with actual API call
    currentCase.value = null
    caseDocuments.value = []
  } catch (error) {
    console.error('Failed to load case data:', error)
  }
}

const loadMessages = async () => {
  isInitialLoading.value = true
  try {
    // TODO: Replace with actual API call
    messages.value = []
  } catch (error) {
    console.error('Failed to load messages:', error)
  }
  isInitialLoading.value = false
}

const scrollToBottom = () => {
  nextTick(() => {
    if (scrollRef.value) {
      scrollRef.value.scrollIntoView({ behavior: 'smooth' })
    }
  })
}

const clearChat = () => {
  messages.value = []
}

const handleSendMessage = async () => {
  if (!newMessage.value.trim() || !props.caseId || isLoading.value) return

  const userMessage = {
    case_id: props.caseId,
    sender_id: props.user?.id,
    message: newMessage.value,
    message_type: 'user'
  }

  messages.value.push({
    ...userMessage,
    id: Date.now(),
    created_date: new Date().toISOString()
  })

  newMessage.value = ''
  isLoading.value = true
  scrollToBottom()

  try {
    // TODO: Replace with actual API call and AI integration
    const aiMessage = {
      case_id: props.caseId,
      message: 'This is a placeholder AI response. Connect to your AI service to get real responses.',
      message_type: 'ai',
      sender_id: 'ai-assistant',
      ai_context: chatMode.value
    }

    messages.value.push({
      ...aiMessage,
      id: Date.now() + 1,
      created_date: new Date().toISOString()
    })
  } catch (error) {
    console.error('Failed to send message:', error)
  }

  isLoading.value = false
  scrollToBottom()
}

const formatTime = (date) => {
  return format(new Date(date), 'HH:mm')
}

watch(() => props.caseId, (newVal) => {
  if (newVal) {
    loadCaseData()
    loadMessages()
  } else {
    isInitialLoading.value = false
  }
}, { immediate: true })

watch(messages, () => {
  scrollToBottom()
})

onMounted(() => {
  if (props.caseId) {
    loadCaseData()
    loadMessages()
  } else {
    isInitialLoading.value = false
  }
})
</script>
