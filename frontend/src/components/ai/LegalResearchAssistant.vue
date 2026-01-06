<template>
  <div class="p-4">
    <h3 class="text-lg font-semibold mb-2">Legal Research Assistant</h3>
    <p class="text-sm text-gray-600">Ask a question and the assistant will query the LLM (Ollama) for legal research.</p>

    <div class="mt-4">
      <textarea
        v-model="prompt"
        placeholder="Ask a legal question (include jurisdiction, time period, and any specifics)..."
        class="w-full mt-2 p-3 border rounded min-h-[100px] resize-vertical"
      ></textarea>

      <div class="mt-3">
        <label class="text-sm font-medium">Include cases in context (optional)</label>
        <select v-model="selectedCaseIds" multiple class="w-full mt-2 p-2 border rounded text-sm">
          <option v-for="c in availableCases" :key="c.id" :value="c.id">
            {{ c.title }} - {{ c.case_number || '' }}
          </option>
        </select>
        <p class="text-xs text-gray-500 mt-1">Hold Shift/Ctrl (or Cmd) to select multiple cases.</p>
      </div>

      <div class="flex items-center gap-3 mt-3">
        <button @click="ask" :disabled="isLoading || !prompt.trim()" class="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-60">
          <span v-if="!isLoading">Ask</span>
          <span v-else>Searching…</span>
        </button>

        <button @click="clear" class="px-3 py-2 border rounded">Clear</button>

        <button v-if="answer && onSaveToCase" @click="saveToCase" class="ml-auto px-3 py-2 bg-green-600 text-white rounded">
          Save to Case
        </button>
      </div>

      <div v-if="error" class="mt-3 text-sm text-red-600">{{ error }}</div>

      <div v-if="answer" class="mt-4 p-3 border rounded bg-gray-50">
        <h4 class="font-medium mb-2">Answer</h4>
        <div class="prose prose-sm max-w-none whitespace-pre-wrap text-sm text-gray-800">{{ answer }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from '@/plugins/axios'
import { casesService } from '@/services/api/cases'

// Props: caseId (optional), onSaveToCase (optional callback)
defineProps({
  caseId: { type: [String, null], default: null },
  onSaveToCase: { type: Function, default: null }
})

const prompt = ref('')
const answer = ref('')
const isLoading = ref(false)
const error = ref('')
const availableCases = ref([])
const selectedCaseIds = ref([])

async function ask() {
  error.value = ''
  answer.value = ''
  if (!prompt.value || !prompt.value.trim()) {
    error.value = 'Please enter a question.'
    return
  }

  isLoading.value = true
    try {
      const payload = {
        prompt: prompt.value,
        add_context_from_internet: true,
        case_ids: selectedCaseIds.value
      }

      const res = await axios.post('/llm/generate', payload)
    // backend returns { response }
    if (res && res.data && res.data.response) {
      answer.value = typeof res.data.response === 'string' ? res.data.response : JSON.stringify(res.data.response, null, 2)
    } else {
      error.value = 'No response from LLM service.'
    }
  } catch (e) {
    console.error('LLM request failed:', e)
    error.value = e.response?.data?.message || e.message || 'LLM request failed.'
  } finally {
    isLoading.value = false
  }
}

function clear() {
  prompt.value = ''
  answer.value = ''
  error.value = ''
}

function saveToCase() {
  if (!onSaveToCase) return
  const research = {
    query: prompt.value,
    result: answer.value,
    type: 'LLM Research',
    jurisdiction: null,
    caseId: null
  }
  onSaveToCase(research)
}

onMounted(async () => {
  try {
    const list = await casesService.getCases()
    // casesService.getCases returns an array of case objects
    availableCases.value = list || []
  } catch (err) {
    console.warn('Could not load cases for LegalResearchAssistant:', err)
  }
})
</script>

<style scoped>
.legal-research-assistant textarea { min-height: 80px; }
</style>
