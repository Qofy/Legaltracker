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
      <div
        class="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0"
      >
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
          <TabsTrigger value="recent">
            <Clock class="w-4 h-4 mr-2" />
            Recent Research ({{ recentResearch.length }})
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
              <div class="relative">
                <select
                  v-model="selectedCase"
                  class="appearance-none w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8 bg-white"
                >
                  <option :value="null">No case selected</option>
                  <option
                    v-for="caseItem in cases"
                    :key="caseItem.id"
                    :value="caseItem.id"
                  >
                    {{ caseItem.case_number }} - {{ caseItem.title }}
                  </option>
                </select>
                <ChevronDown
                  class="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
                />
              </div>
            </CardContent>
          </Card>

          <!-- Filters: Law Types -->
          <Card class="mb-4">
            <CardHeader>
              <CardTitle class="text-sm">Law Type Filters</CardTitle>
              <p class="text-xs text-gray-500">
                Select one or more law types to narrow the research results.
              </p>
            </CardHeader>
            <CardContent>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2"
                    >Law Types</label
                  >
                  <select
                    v-model="selectedLawTypes"
                    multiple
                    class="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="criminal">Criminal Law</option>
                    <option value="civil">Civil Law</option>
                    <option value="family">Family Law</option>
                    <option value="corporate">Corporate / Commercial</option>
                    <option value="immigration">Immigration</option>
                    <option value="intellectual-property">Intellectual Property</option>
                    <option value="labor">Labor / Employment</option>
                    <option value="tax">Tax Law</option>
                    <option value="environmental">Environmental Law</option>
                  </select>
                  <p class="text-xs text-gray-500 mt-2">
                    Hold Shift/Cmd (or Ctrl) to select multiple.
                  </p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2"
                    >Selected</label
                  >
                  <div class="flex flex-wrap gap-2">
                    <span
                      v-for="lt in selectedLawTypes"
                      :key="lt"
                      class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded"
                    >
                      {{ lt.replace("-", " ") }}
                    </span>
                    <span
                      v-if="selectedLawTypes.length === 0"
                      class="text-xs text-gray-500"
                      >No law types selected — results will be broader.</span
                    >
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <!-- Research Assistant -->
          <LegalResearchAssistant
            :case-id="selectedCase"
            :law-types="selectedLawTypes"
            :on-save-to-case="selectedCase ? handleSaveToCase : null"
            :on-research-complete="handleResearchComplete"
          />
        </TabsContent>

        <TabsContent value="recent" class="space-y-4">
          <!-- Recent Research Header -->
          <div class="flex justify-between items-center">
            <div>
              <h2 class="text-xl font-semibold text-gray-900">Recent Research History</h2>
              <p class="text-sm text-gray-600 mt-1">
                Your latest research queries and results
              </p>
            </div>
            <div class="flex space-x-2">
              <button
                @click="clearRecentResearch"
                class="px-3 py-2 text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 transition-colors"
                :disabled="recentResearch.length === 0"
              >
                Clear History
              </button>
            </div>
          </div>

          <Card v-if="recentResearch.length === 0">
            <CardContent class="text-center py-12">
              <Clock class="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 class="text-lg font-semibold text-gray-900 mb-2">No Recent Research</h3>
              <p class="text-gray-500">
                Your research history will appear here as you conduct searches
              </p>
            </CardContent>
          </Card>

          <div v-else class="grid gap-4">
            <Card
              v-for="(research, index) in recentResearch"
              :key="index"
              class="hover:shadow-md transition-shadow border-l-4"
              :class="{
                'border-l-green-400': research.status === 'completed',
                'border-l-yellow-400': research.status === 'pending',
                'border-l-red-400': research.status === 'error',
              }"
            >
              <CardHeader>
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <div class="flex items-center space-x-2 mb-2">
                      <CardTitle class="text-lg">{{ research.query }}</CardTitle>
                      <span
                        class="text-xs px-2 py-1 rounded-full"
                        :class="{
                          'bg-green-100 text-green-800': research.status === 'completed',
                          'bg-yellow-100 text-yellow-800': research.status === 'pending',
                          'bg-red-100 text-red-800': research.status === 'error',
                        }"
                      >
                        {{ research.status }}
                      </span>
                    </div>
                    <div class="flex flex-wrap gap-2">
                      <span
                        v-if="research.research_type"
                        class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded"
                      >
                        {{ research.research_type.replace("-", " ") }}
                      </span>
                      <span
                        v-if="research.jurisdiction"
                        class="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded"
                      >
                        {{ research.jurisdiction.replace("-", " ") }}
                      </span>
                      <span
                        v-for="lt in research.law_types || []"
                        :key="lt"
                        class="text-xs bg-blue-50 text-blue-800 px-2 py-1 rounded"
                      >
                        {{ lt.replace("-", " ") }}
                      </span>
                      <span
                        v-if="research.caseId && getCaseById(research.caseId)"
                        class="text-xs bg-green-100 text-green-800 px-2 py-1 rounded"
                      >
                        {{ getCaseById(research.caseId).case_number }}
                      </span>
                    </div>
                  </div>
                  <div class="flex items-center space-x-4">
                    <div class="flex items-center space-x-2 text-xs text-gray-500">
                      <Clock class="w-3 h-3" />
                      <span>{{ formatDateTime(research.timestamp) }}</span>
                    </div>
                    <div class="flex space-x-1">
                      <button
                        v-if="research.status === 'completed' && research.result"
                        @click="saveRecentToSaved(research)"
                        class="p-1 text-green-600 hover:bg-green-50 rounded transition-colors"
                        title="Save Research"
                      >
                        <BookOpen class="w-4 h-4" />
                      </button>
                      <button
                        @click="deleteRecentResearch(index)"
                        class="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Delete"
                      >
                        <X class="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent v-if="research.status === 'completed' && research.result">
                <div class="prose prose-sm max-w-none">
                  <div v-if="research.expanded" class="whitespace-pre-wrap text-gray-700">
                    {{ research.result }}
                  </div>
                  <div v-else class="line-clamp-3 text-gray-600">
                    {{ research.result.substring(0, 300)
                    }}{{ research.result.length > 300 ? "..." : "" }}
                  </div>
                  <button
                    v-if="research.result.length > 300"
                    @click="research.expanded = !research.expanded"
                    class="mt-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    {{ research.expanded ? "Show Less" : "Read More" }}
                  </button>
                </div>
              </CardContent>
              <CardContent v-else-if="research.status === 'error'">
                <p class="text-sm text-red-600">
                  {{ research.error || "An error occurred during research" }}
                </p>
              </CardContent>
              <CardContent v-else-if="research.status === 'pending'">
                <div class="flex items-center space-x-2 text-sm text-gray-600">
                  <div
                    class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"
                  ></div>
                  <span>Research in progress...</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="saved" class="space-y-4">
          <Card v-if="savedResearch.length === 0">
            <CardContent class="text-center py-12">
              <BookOpen class="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 class="text-lg font-semibold text-gray-900 mb-2">No Saved Research</h3>
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
                      <span
                        class="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded"
                      >
                        {{ research.jurisdiction }}
                      </span>
                      <span
                        v-for="lt in research.law_types || []"
                        :key="lt"
                        class="text-xs bg-blue-50 text-blue-800 px-2 py-1 rounded"
                      >
                        {{ lt.replace("-", " ") }}
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
          <p>
            <strong>Be specific:</strong> Include relevant details like jurisdiction, time
            period, or specific legal issues
          </p>
          <p>
            <strong>Use legal terminology:</strong> The AI understands legal concepts and
            will provide more accurate results
          </p>
          <p>
            <strong>Ask follow-up questions:</strong> You can conduct multiple related
            searches to build comprehensive research
          </p>
          <p>
            <strong>Verify citations:</strong> Always verify important citations with
            primary sources
          </p>
          <p>
            <strong>Save your research:</strong> Link research to cases for easy reference
            during case work
          </p>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { User, Case } from "@/services/entities";
import {
  Scale,
  BookOpen,
  TrendingUp,
  Clock,
  Sparkles,
  ChevronDown,
  X,
} from "lucide-vue-next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LegalResearchAssistant from "../components/ai/LegalResearchAssistant.vue";

const user = ref(null);
const cases = ref([]);
const selectedCase = ref(null);
const selectedLawTypes = ref([]);
const isLoading = ref(true);
const savedResearch = ref([]);
const recentResearch = ref([]);

onMounted(() => {
  loadData();
});

const loadData = async () => {
  isLoading.value = true;
  try {
    const userData = await User.me();
    user.value = userData;

    // Load user's cases
    const allCases = await Case.list("-updated_date");
    const userCases = allCases.filter(
      (c) =>
        c.lawyer_id === userData.id ||
        c.customer_ids?.includes(userData.id) ||
        userData.user_type === "admin"
    );
    cases.value = userCases;

    // Load saved research from localStorage
    const saved = localStorage.getItem("legalResearch");
    if (saved) {
      try {
        savedResearch.value = JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse saved research:", e);
      }
    }

    // Load recent research from localStorage
    const recent = localStorage.getItem("recentLegalResearch");
    if (recent) {
      try {
        recentResearch.value = JSON.parse(recent);
      } catch (e) {
        console.error("Failed to parse recent research:", e);
      }
    }
  } catch (error) {
    console.error("Failed to load data:", error);
  }
  isLoading.value = false;
};

const handleSaveToCase = (research) => {
  try {
    // Validate that we have a selected case
    if (!selectedCase.value) {
      console.warn("No case selected for saving research");
      return;
    }

    // Save to localStorage with case association
    const saved = {
      ...research,
      caseId: selectedCase.value,
      savedBy: user.value?.email,
      savedAt: new Date().toISOString(),
    };

    const updatedResearch = [saved, ...savedResearch.value];
    savedResearch.value = updatedResearch;
    localStorage.setItem("legalResearch", JSON.stringify(updatedResearch));

    console.log("Research saved successfully:", saved);
  } catch (error) {
    console.error("Failed to save research to case:", error);
    throw error; // Re-throw to allow component to handle the error
  }
};

const getCaseById = (caseId) => {
  return cases.value.find((c) => c.id === caseId);
};

const handleResearchComplete = (researchData) => {
  // Add to recent research history
  const recentEntry = {
    ...researchData,
    caseId: selectedCase.value,
    timestamp: new Date().toISOString(),
    status: researchData.result ? "completed" : "error",
    expanded: false,
  };

  // Add to beginning of array and limit to 50 entries
  recentResearch.value = [recentEntry, ...recentResearch.value].slice(0, 50);
  localStorage.setItem("recentLegalResearch", JSON.stringify(recentResearch.value));
};

const saveRecentToSaved = (research) => {
  const saved = {
    query: research.query,
    result: research.result,
    type: "LLM Research",
    jurisdiction: research.jurisdiction,
    research_type: research.research_type,
    caseId: research.caseId,
    savedBy: user.value?.email,
    savedAt: new Date().toISOString(),
  };

  const updatedResearch = [saved, ...savedResearch.value];
  savedResearch.value = updatedResearch;
  localStorage.setItem("legalResearch", JSON.stringify(updatedResearch));
};

const deleteRecentResearch = (index) => {
  recentResearch.value.splice(index, 1);
  localStorage.setItem("recentLegalResearch", JSON.stringify(recentResearch.value));
};

const clearRecentResearch = () => {
  if (confirm("Are you sure you want to clear all recent research history?")) {
    recentResearch.value = [];
    localStorage.removeItem("recentLegalResearch");
  }
};

const formatDateTime = (isoString) => {
  const date = new Date(isoString);
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
</script>
