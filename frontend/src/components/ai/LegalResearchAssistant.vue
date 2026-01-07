<template>
  <div class="p-4">
    <h3 class="text-lg font-semibold mb-2">Legal Research Assistant</h3>
    <p class="text-sm text-gray-600">Ask a question and the assistant will query the LLM (Ollama) for legal research.</p>

    <div class="mt-4">
      <!-- Research Type and Jurisdiction -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Research Type</label>
          <select v-model="researchType" class="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            <option value="">Select research type</option>
            <option value="case-law">Case Law Research</option>
            <option value="statutory">Statutory Research</option>
            <option value="regulatory">Regulatory Research</option>
            <option value="constitutional">Constitutional Law</option>
            <option value="precedent">Precedent Analysis</option>
            <option value="comparative">Comparative Law</option>
            <option value="legislative-history">Legislative History</option>
            <option value="legal-analysis">Legal Analysis</option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Jurisdiction</label>
          <select v-model="jurisdiction" class="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            <option value="">Select jurisdiction</option>
            <optgroup label="Federal">
              <option value="federal">Federal Courts</option>
              <option value="supreme-court">U.S. Supreme Court</option>
              <option value="circuit-court">Federal Circuit Courts</option>
              <option value="district-court">Federal District Courts</option>
            </optgroup>
            <optgroup label="State Courts">
              <option value="california">California</option>
              <option value="new-york">New York</option>
              <option value="texas">Texas</option>
              <option value="florida">Florida</option>
              <option value="illinois">Illinois</option>
              <option value="pennsylvania">Pennsylvania</option>
              <option value="ohio">Ohio</option>
              <option value="georgia">Georgia</option>
              <option value="north-carolina">North Carolina</option>
              <option value="michigan">Michigan</option>
            </optgroup>
            <optgroup label="International">
              <option value="international">International Law</option>
              <option value="european-union">European Union</option>
              <option value="united-kingdom">United Kingdom</option>
              <option value="germany">Germany</option>
              <option value="canada">Canada</option>
              <option value="australia">Australia</option>
              <option value="ghana">Ghana</option>
            </optgroup>
          </select>
        </div>
      </div>

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

        <button 
          v-if="answer && props.onSaveToCase" 
          @click="saveToCase" 
          :disabled="isSaving"
          class="ml-auto px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
        >
          <span v-if="!isSaving && !saveSuccess">Save to Case</span>
          <span v-else-if="isSaving" class="flex items-center space-x-2">
            <div class="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
            <span>Saving...</span>
          </span>
          <span v-else-if="saveSuccess" class="flex items-center space-x-1">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
            </svg>
            <span>Saved!</span>
          </span>
        </button>
      </div>

      <div v-if="error" class="mt-3 text-sm text-red-600">{{ error }}</div>
      
      <div v-if="saveSuccess" class="mt-3 p-3 bg-green-50 border border-green-200 rounded-md">
        <div class="flex items-center space-x-2">
          <svg class="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
          </svg>
          <span class="text-sm font-medium text-green-800">Research saved to case successfully!</span>
        </div>
      </div>

      <div v-if="answer" class="mt-4 border rounded bg-white shadow-sm">
        <!-- Research Metadata Header -->
        <div class="px-4 py-3 bg-gray-50 border-b rounded-t-md">
          <div class="flex items-center justify-between flex-wrap gap-2">
            <h4 class="font-semibold text-gray-900 flex items-center">
              <svg class="w-4 h-4 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"></path>
              </svg>
              Legal Research Results
            </h4>
            <div class="flex items-center text-xs text-gray-500">
              <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"></path>
              </svg>
              {{ formatDateTime(researchTimestamp) }}
            </div>
          </div>
          
          <!-- Research Context Tags -->
          <div class="flex flex-wrap gap-2 mt-3">
            <span 
              v-if="researchType" 
              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
            >
              <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
              </svg>
              {{ formatLabel(researchType) }}
            </span>
            <span 
              v-if="jurisdiction" 
              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
            >
              <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M12 1.586l-4 4v12.828l4-4V1.586zM3.707 3.293A1 1 0 002 4v10a1 1 0 00.293.707L6 18.414V5.586L3.707 3.293zM17.707 5.293L14 1.586v12.828l2.293 2.293A1 1 0 0018 16V6a1 1 0 00-.293-.707z" clip-rule="evenodd"></path>
              </svg>
              {{ formatLabel(jurisdiction) }}
            </span>
            <span 
              v-if="selectedCaseIds.length > 0" 
              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
            >
              <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clip-rule="evenodd"></path>
              </svg>
              {{ selectedCaseIds.length }} Case{{ selectedCaseIds.length > 1 ? 's' : '' }} Referenced
            </span>
          </div>
        </div>
        
        <!-- Research Results Content -->
        <div class="p-4">
          <div class="prose prose-sm max-w-none whitespace-pre-wrap text-gray-800 leading-relaxed">
            {{ answer }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from '@/plugins/axios'
import { casesService } from '@/services/api/cases'

// Props: caseId (optional), onSaveToCase (optional callback), onResearchComplete (optional callback)
const props = defineProps({
  caseId: { type: [String, null], default: null },
  onSaveToCase: { type: Function, default: null },
  onResearchComplete: { type: Function, default: null }
})

const prompt = ref('')
const answer = ref('')
const isLoading = ref(false)
const isSaving = ref(false)
const saveSuccess = ref(false)
const researchTimestamp = ref(null)
const error = ref('')
const availableCases = ref([])
const selectedCaseIds = ref([])
const researchType = ref('')
const jurisdiction = ref('')

async function ask() {
  error.value = ''
  answer.value = ''
  if (!prompt.value || !prompt.value.trim()) {
    error.value = 'Please enter a question.'
    return
  }

  isLoading.value = true
  try {
    // Build enhanced prompt with detailed legal research instructions
    let enhancedPrompt = `You are a legal research assistant with access to current legal information via the internet. Please provide comprehensive, accurate legal information based on the following request:\n\n`
    
    enhancedPrompt += `QUESTION: ${prompt.value}\n\n`
    
    // Add specific research context and instructions
    if (researchType.value || jurisdiction.value) {
      enhancedPrompt += `RESEARCH PARAMETERS:\n`
      
      if (researchType.value) {
        const formattedType = researchType.value.replace('-', ' ')
        enhancedPrompt += `- Research Type: ${formattedType}\n`
        
        // Add specific instructions based on research type
        switch (researchType.value) {
          case 'case-law':
            enhancedPrompt += `- Focus on: Relevant case precedents, court decisions, judicial interpretations\n`
            break
          case 'statutory':
            enhancedPrompt += `- Focus on: Applicable statutes, laws, legal codes, legislative provisions\n`
            break
          case 'regulatory':
            enhancedPrompt += `- Focus on: Regulations, administrative rules, compliance requirements\n`
            break
          case 'constitutional':
            enhancedPrompt += `- Focus on: Constitutional provisions, fundamental rights, constitutional interpretations\n`
            break
          default:
            enhancedPrompt += `- Focus on: Comprehensive legal analysis covering all relevant legal sources\n`
        }
      }
      
      if (jurisdiction.value) {
        const formattedJurisdiction = jurisdiction.value.replace('-', ' ')
        enhancedPrompt += `- Jurisdiction: ${formattedJurisdiction}\n`
        
        // Add jurisdiction-specific instructions
        if (jurisdiction.value === 'ghana') {
          enhancedPrompt += `- Apply: Ghanaian laws, Constitution of Ghana, Ghanaian court decisions, local regulations\n`
          enhancedPrompt += `- Consider: Ghana's legal system, local legal practices, relevant Ghanaian authorities\n`
        } else if (jurisdiction.value === 'germany') {
          enhancedPrompt += `- Apply: German laws, Basic Law (Grundgesetz), German court decisions, EU law where applicable\n`
          enhancedPrompt += `- Consider: German legal system, German legal doctrine, relevant German authorities\n`
        } else if (jurisdiction.value === 'federal') {
          enhancedPrompt += `- Apply: Federal laws, federal regulations, federal court decisions, constitutional provisions\n`
          enhancedPrompt += `- Focus on: Federal jurisdiction matters, interstate commerce, federal agencies\n`
        } else {
          enhancedPrompt += `- Apply: Laws and regulations specific to ${formattedJurisdiction}\n`
          enhancedPrompt += `- Consider: Local legal practices, relevant authorities, jurisdictional precedents\n`
        }
      }
      
      enhancedPrompt += `\n`
    }
    
    // Add comprehensive research instructions
    enhancedPrompt += `RESEARCH INSTRUCTIONS:
1. Provide specific legal information relevant to the jurisdiction and research type
2. Cite relevant laws, regulations, or case precedents where applicable
3. Include practical implications and legal requirements
4. If information is limited, explain what additional research might be needed
5. Use current legal information and access internet sources for up-to-date information
6. Structure your response with clear sections and bullet points where appropriate

Please provide a comprehensive legal research response based on these parameters.`

    const payload = {
      prompt: enhancedPrompt,
      add_context_from_internet: true,
      case_ids: selectedCaseIds.value,
      research_type: researchType.value,
      jurisdiction: jurisdiction.value
    }

      const res = await axios.post('/llm/generate', payload)
    // backend returns { response }
    if (res && res.data && res.data.response) {
      answer.value = typeof res.data.response === 'string' ? res.data.response : JSON.stringify(res.data.response, null, 2)
      researchTimestamp.value = new Date().toISOString()
      
      // Emit research completion event
      if (props.onResearchComplete) {
        props.onResearchComplete({
          query: prompt.value,
          result: answer.value,
          research_type: researchType.value,
          jurisdiction: jurisdiction.value,
          case_ids: selectedCaseIds.value
        })
      }
    } else {
      error.value = 'No response from LLM service.'
      // Emit error research completion event
      if (props.onResearchComplete) {
        props.onResearchComplete({
          query: prompt.value,
          error: error.value,
          research_type: researchType.value,
          jurisdiction: jurisdiction.value,
          case_ids: selectedCaseIds.value
        })
      }
    }
  } catch (e) {
    console.error('LLM request failed:', e)
    error.value = e.response?.data?.message || e.message || 'LLM request failed.'
    // Emit error research completion event
    if (props.onResearchComplete) {
      props.onResearchComplete({
        query: prompt.value,
        error: error.value,
        research_type: researchType.value,
        jurisdiction: jurisdiction.value,
        case_ids: selectedCaseIds.value
      })
    }
  } finally {
    isLoading.value = false
  }
}

function clear() {
  prompt.value = ''
  answer.value = ''
  error.value = ''
  researchType.value = ''
  jurisdiction.value = ''
  saveSuccess.value = false
  researchTimestamp.value = null
}

function saveToCase() {
  if (!props.onSaveToCase) return
  
  isSaving.value = true
  saveSuccess.value = false
  
  try {
    const research = {
      query: prompt.value,
      result: answer.value,
      type: 'LLM Research',
      jurisdiction: jurisdiction.value,
      research_type: researchType.value,
      caseId: null
    }
    
    props.onSaveToCase(research)
    saveSuccess.value = true
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      saveSuccess.value = false
    }, 3000)
    
  } catch (err) {
    console.error('Failed to save research:', err)
  } finally {
    isSaving.value = false
  }
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

// Helper functions for formatting
const formatLabel = (value) => {
  return value ? value.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : ''
}

const formatDateTime = (isoString) => {
  if (!isoString) return ''
  const date = new Date(isoString)
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<style scoped>
.legal-research-assistant textarea { min-height: 80px; }
</style>
