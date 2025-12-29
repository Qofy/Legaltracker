<template>
  <div>
    <!-- Chat Bubble Button -->
    <button
      @click="showChat = true"
      class="h-12 w-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg flex items-center justify-center"
    >
      <MessageSquare class="w-5 h-5" />
    </button>

    <!-- Chat Dialog -->
    <div
      v-if="showChat"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      @click.self="showChat = false"
    >
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] flex flex-col">
        <div class="p-4 border-b flex items-center justify-between">
          <div class="flex items-center space-x-2">
            <MessageSquare class="w-5 h-5 text-blue-600" />
            <h3 class="font-semibold">AI Assistant</h3>
          </div>
          <button
            @click="showChat = false"
            class="h-8 w-8 rounded hover:bg-gray-100 flex items-center justify-center"
          >
            ✕
          </button>
        </div>
        <div class="h-[60vh]">
          <ChatPanel :caseId="caseId" :user="user" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { MessageSquare } from 'lucide-vue-next'
import ChatPanel from './ChatPanel.vue'

defineProps({
  caseId: {
    type: String,
    default: null
  },
  user: {
    type: Object,
    default: null
  }
})

const showChat = ref(false)
</script>
