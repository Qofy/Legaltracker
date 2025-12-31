<template>
  <div class=" p-4  ">
    <h3 class="text-lg font-semibold mb-2">Legal Research Assistant</h3>
    <p class="text-sm text-gray-600">This is a placeholder assistant component. Replace with real AI UI later.</p>
    <div class="flex flex-col">     
    <textarea v-model="prompt" placeholder="Ask a legal question..." class="w-full mt-3 p-2 border rounded"></textarea>
    <div class="mt-3 flex gap-2">
      <button @click="ask" class="px-3 py-1 bg-blue-600 text-white rounded">Ask</button>
      <button @click="clear" class="px-3 py-1 border rounded">Clear</button>
    </div>
    </div>
    <div v-if="answer" class="mt-4 p-3 border rounded bg-gray-50">
      <h4 class="font-medium mb-1">Answer</h4>
      <div v-html="answer"></div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const prompt = ref('')
const answer = ref('')

function ask() {
  if (!prompt.value) {
    answer.value = '<em>Please enter a question.</em>'
    return
  }
  answer.value = `<p>Searching legal sources for: <strong>${escapeHtml(prompt.value)}</strong></p><p class="mt-2 text-sm text-gray-700">This is a mock response. Replace with real LLM integration.</p>`
}

function clear() {
  prompt.value = ''
  answer.value = ''
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"}[s]))
}
</script>

<style scoped>
.legal-research-assistant textarea { min-height: 80px; }
</style>
