<template>
  <div v-if="isLoading" class="p-6 space-y-6">
    <div class="animate-pulse space-y-4">
      <div class="h-8 bg-gray-200 rounded w-1/3"></div>
      <div class="h-60 bg-gray-200 rounded"></div>
    </div>
  </div>

  <div v-else class="p-6 bg-gray-50 min-h-screen">
    <div class="max-w-7xl mx-auto space-y-6">
      <!-- Header -->
      <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 flex items-center">
            <Scale class="w-8 h-8 text-blue-600 mr-3" />
            Legal Research Center
          </h1>
          <p class="text-gray-600 mt-1">
            AI-powered legal research with access to case law, statutes, and precedents
          </p>
        </div>
      </div>

      <!-- Quick Info Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card class="border-blue-200 bg-blue-50">
          <CardContent class="p-4">
            <div class="flex items-center space-x-3">
              <div class="p-2 bg-blue-100 rounded-lg">
                <BookOpen class="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p class="text-sm font-medium text-gray-600">Research Capabilities</p>
                <p class="text-xs text-gray-500 mt-1">
                  Case law, statutes, regulations, and legal analysis
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card class="border-purple-200 bg-purple-50">
          <CardContent class="p-4">
            <div class="flex items-center space-x-3">
              <div class="p-2 bg-purple-100 rounded-lg">
                <Sparkles class="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p class="text-sm font-medium text-gray-600">AI-Powered</p>
                <p class="text-xs text-gray-500 mt-1">
                  Real-time internet access for current legal information
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card class="border-green-200 bg-green-50">
          <CardContent class="p-4">
            <div class="flex items-center space-x-3">
              <div class="p-2 bg-green-100 rounded-lg">
                <TrendingUp class="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p class="text-sm font-medium text-gray-600">Multi-Jurisdictional</p>
                <p class="text-xs text-gray-500 mt-1">
                  Federal, state, and international law coverage
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Main Content -->
      <Tabs default-value="research" class="space-y-6">
        <TabsList>
          <TabsTrigger value="research">
            <Scale class="w-4 h-4 mr-2" />
            New Research
          </TabsTrigger>
          <TabsTrigger value="saved">
            <BookOpen class="w-4 h-4 mr-2" />
            Saved Research ({{ savedResearch.length }})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="research" class="space-y-6">
          <!-- Case Selection (Optional) -->
          <Card v-if="cases.length > 0">
            <CardHeader>
              <CardTitle class="text-lg">Link to Case (Optional)</CardTitle>
              <p class="text-sm text-gray-600">
                Associate this research with a specific case for easy reference
              </p>
            </CardHeader>
            <CardContent>
              <Select v-model="selectedCase">
                <SelectTrigger>
                  <SelectValue placeholder="Select a case (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem :value="null">No case selected</SelectItem>
                  <SelectItem v-for="caseItem in cases" :key="caseItem.id" :value="caseItem.id">
                    {{ caseItem.case_number }} - {{ caseItem.title }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <!-- Research Assistant -->
          <LegalResearchAssistant
            :case-id="selectedCase"
            :on-save-to-case="selectedCase ? handleSaveToCase : null"
          />
        </TabsContent>

        <TabsContent value="saved" class="space-y-4">
          <Card v-if="savedResearch.length === 0">
            <CardContent class="text-center py-12">
              <BookOpen class="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 class="text-lg font-semibold text-gray-900 mb-2">
                No Saved Research
              </h3>
              <p class="text-gray-500">
                Research you save will appear here for easy access
              </p>
            </CardContent>
          </Card>
          <div v-else class="grid gap-4">
            <Card
              v-for="(research, index) in savedResearch"
              :key="index"
              class="hover:shadow-md transition-shadow"
            >
              <CardHeader>
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <CardTitle class="text-lg">{{ research.query }}</CardTitle>
                    <div class="flex flex-wrap gap-2 mt-2">
                      <span class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {{ research.type }}
                      </span>
                      <span class="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                        {{ research.jurisdiction }}
                      </span>
                      <span
                        v-if="getCaseById(research.caseId)"
                        class="text-xs bg-green-100 text-green-800 px-2 py-1 rounded"
                      >
                        {{ getCaseById(research.caseId).case_number }}
                      </span>
                    </div>
                  </div>
                  <div class="flex items-center space-x-2 text-xs text-gray-500">
                    <Clock class="w-3 h-3" />
                    <span>{{ new Date(research.savedAt).toLocaleDateString() }}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div class="prose prose-sm max-w-none line-clamp-3">
                  {{ research.result.substring(0, 300) }}...
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <!-- Research Tips -->
      <Card class="bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200">
        <CardHeader>
          <CardTitle class="text-lg flex items-center space-x-2">
            <Sparkles class="w-5 h-5 text-amber-600" />
            <span>Research Tips</span>
          </CardTitle>
        </CardHeader>
        <CardContent class="space-y-2 text-sm text-gray-700">
          <p><strong>Be specific:</strong> Include relevant details like jurisdiction, time period, or specific legal issues</p>
          <p><strong>Use legal terminology:</strong> The AI understands legal concepts and will provide more accurate results</p>
          <p><strong>Ask follow-up questions:</strong> You can conduct multiple related searches to build comprehensive research</p>
          <p><strong>Verify citations:</strong> Always verify important citations with primary sources</p>
          <p><strong>Save your research:</strong> Link research to cases for easy reference during case work</p>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { User } from '@/entities/User'
import { Case } from '@/entities/Case'
import { Scale, BookOpen, TrendingUp, Clock, Sparkles } from 'lucide-vue-next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import LegalResearchAssistant from '../components/ai/LegalResearchAssistant.vue'

const user = ref(null)
const cases = ref([])
const selectedCase = ref(null)
const isLoading = ref(true)
const savedResearch = ref([])

onMounted(() => {
  loadData()
})

const loadData = async () => {
  isLoading.value = true
  try {
    const userData = await User.me()
    user.value = userData

    // Load user's cases
    const allCases = await Case.list('-updated_date')
    const userCases = allCases.filter(c =>
      c.lawyer_id === userData.id ||
      c.customer_ids?.includes(userData.id) ||
      userData.user_type === 'admin'
    )
    cases.value = userCases

    // Load saved research from localStorage
    const saved = localStorage.getItem('legalResearch')
    if (saved) {
      try {
        savedResearch.value = JSON.parse(saved)
      } catch (e) {
        console.error('Failed to parse saved research:', e)
      }
    }
  } catch (error) {
    console.error('Failed to load data:', error)
  }
  isLoading.value = false
}

const handleSaveToCase = (research) => {
  // Save to localStorage with case association
  const saved = {
    ...research,
    caseId: selectedCase.value,
    savedBy: user.value?.email,
    savedAt: new Date().toISOString()
  }

  const updatedResearch = [saved, ...savedResearch.value]
  savedResearch.value = updatedResearch
  localStorage.setItem('legalResearch', JSON.stringify(updatedResearch))
}

const getCaseById = (caseId) => {
  return cases.value.find(c => c.id === caseId)
}
</script>
