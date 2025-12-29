<template>
  <div v-if="isLoading" class="p-6 space-y-6">
    <div class="animate-pulse space-y-4">
      <div class="h-8 bg-gray-200 rounded w-1/3"></div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card v-for="i in 6" :key="i" class="h-48">
          <CardContent class="p-4">
            <div class="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
            <div class="h-3 bg-gray-200 rounded w-full mb-4"></div>
            <div class="space-y-2">
              <div class="h-3 bg-gray-200 rounded w-1/2"></div>
              <div class="h-3 bg-gray-200 rounded w-1/3"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>

  <div v-else class="p-6 bg-gray-50 min-h-screen">
    <div class="max-w-7xl mx-auto space-y-6">
      <!-- Header -->
      <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 flex items-center">
            <FileText class="w-8 h-8 text-blue-600 mr-3" />
            Cases Management
          </h1>
          <p class="text-gray-600 mt-1">
            Manage and track all your legal cases
          </p>
        </div>

        <div class="flex space-x-2">
          <Button
            @click="showAISummary = !showAISummary"
            variant="outline"
            class="border-purple-300 text-purple-700 hover:bg-purple-50"
          >
            <Sparkles class="w-4 h-4 mr-2" />
            AI Analysis
          </Button>
          <Dialog v-model:open="showNewCase">
            <DialogTrigger as-child>
              <Button class="bg-blue-600 hover:bg-blue-700 material-elevation-2">
                <Plus class="w-4 h-4 mr-2" />
                New Case
              </Button>
            </DialogTrigger>
            <DialogContent class="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Case</DialogTitle>
              </DialogHeader>
              <NewCaseForm
                :current-user="user"
                @submit="handleNewCase"
                @cancel="showNewCase = false"
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <!-- AI Summary Section -->
      <AIMultiCaseSummary v-if="showAISummary" :cases="cases" :users="[user]" />

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card class="material-elevation-1 clean-border">
          <CardContent class="p-4">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600">Total Cases</p>
                <p class="text-2xl font-bold text-gray-900">{{ cases.length }}</p>
              </div>
              <FileText class="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card class="material-elevation-1 clean-border">
          <CardContent class="p-4">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600">Open</p>
                <p class="text-2xl font-bold text-gray-900">
                  {{ activeCases.filter(c => c.status === 'open').length }}
                </p>
              </div>
              <Clock class="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card class="material-elevation-1 clean-border">
          <CardContent class="p-4">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600">In Progress</p>
                <p class="text-2xl font-bold text-gray-900">
                  {{ activeCases.filter(c => c.status === 'in_progress').length }}
                </p>
              </div>
              <AlertTriangle class="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card class="material-elevation-1 clean-border">
          <CardContent class="p-4">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600">Closed</p>
                <p class="text-2xl font-bold text-gray-900">
                  {{ activeCases.filter(c => c.status === 'closed').length }}
                </p>
              </div>
              <CheckCircle class="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card
          class="material-elevation-1 clean-border cursor-pointer hover:bg-purple-50 transition-colors"
          @click="activeTab = 'archived'"
        >
          <CardContent class="p-4">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600">Archived</p>
                <p class="text-2xl font-bold text-gray-900">
                  {{ archivedCases.length }}
                </p>
              </div>
              <Archive class="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Tabs for Active/Archived -->
      <Tabs v-model="activeTab">
        <TabsList class="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="active" class="flex items-center space-x-2">
            <Eye class="w-4 h-4" />
            <span>Active Cases</span>
            <Badge variant="secondary" class="ml-2">{{ activeCases.length }}</Badge>
          </TabsTrigger>
          <TabsTrigger value="archived" class="flex items-center space-x-2">
            <Archive class="w-4 h-4" />
            <span>Archived</span>
            <Badge variant="secondary" class="ml-2">{{ archivedCases.length }}</Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" class="mt-6 space-y-6">
          <!-- Filters and Search -->
          <Card class="material-elevation-1 clean-border">
            <CardContent class="p-6">
              <div class="flex flex-col lg:flex-row gap-4">
                <!-- Search -->
                <div class="flex-1">
                  <div class="relative">
                    <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      v-model="searchQuery"
                      placeholder="Search cases by title, number, or description..."
                      class="pl-10 clean-border"
                    />
                  </div>
                </div>

                <!-- Filters -->
                <CaseFilters :filters="filters" @filter-change="handleFilterChange" />
              </div>
            </CardContent>
          </Card>

          <!-- Cases Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-if="filteredCases.length === 0" class="col-span-full">
              <Card class="material-elevation-1 clean-border">
                <CardContent class="text-center py-12">
                  <FileText class="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 class="text-lg font-semibold text-gray-900 mb-2">No active cases found</h3>
                  <p class="text-gray-500 mb-4">
                    {{
                      searchQuery || Object.values(filters).some(f => f !== "all")
                        ? "Try adjusting your search or filters"
                        : "Get started by creating your first case"
                    }}
                  </p>
                  <Button
                    v-if="!searchQuery && Object.values(filters).every(f => f === 'all')"
                    @click="showNewCase = true"
                    class="bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus class="w-4 h-4 mr-2" />
                    Create First Case
                  </Button>
                </CardContent>
              </Card>
            </div>
            <CaseCard
              v-else
              v-for="caseItem in filteredCases"
              :key="caseItem.id"
              :case-data="caseItem"
              :get-status-color="getStatusColor"
              :get-priority-color="getPriorityColor"
              :get-status-icon="getStatusIcon"
              :is-pinned="pinnedCaseId === caseItem.id"
              @pin="handlePinCase(caseItem.id)"
              @update="loadUserAndCases"
            />
          </div>
        </TabsContent>

        <TabsContent value="archived" class="mt-6 space-y-6">
          <!-- Archived Cases Info Card -->
          <Card class="bg-purple-50 border-purple-200">
            <CardContent class="p-4">
              <div class="flex items-start space-x-3">
                <Archive class="w-5 h-5 text-purple-600 mt-0.5" />
                <div>
                  <h3 class="font-semibold text-purple-900 mb-1">Archived Cases</h3>
                  <p class="text-sm text-purple-800">
                    These cases have been archived and are hidden from the active cases view.
                    They remain fully searchable and accessible. You can unarchive a case at any time.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <!-- Search for Archived Cases -->
          <Card class="material-elevation-1 clean-border">
            <CardContent class="p-6">
              <div class="relative">
                <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  v-model="searchQuery"
                  placeholder="Search archived cases..."
                  class="pl-10 clean-border"
                />
              </div>
            </CardContent>
          </Card>

          <!-- Archived Cases Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-if="filteredCases.length === 0" class="col-span-full">
              <Card class="material-elevation-1 clean-border">
                <CardContent class="text-center py-12">
                  <Archive class="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 class="text-lg font-semibold text-gray-900 mb-2">No archived cases</h3>
                  <p class="text-gray-500">
                    {{ searchQuery ? "No archived cases match your search" : "Archived cases will appear here" }}
                  </p>
                </CardContent>
              </Card>
            </div>
            <CaseCard
              v-else
              v-for="caseItem in filteredCases"
              :key="caseItem.id"
              :case-data="caseItem"
              :get-status-color="getStatusColor"
              :get-priority-color="getPriorityColor"
              :get-status-icon="getStatusIcon"
              :is-pinned="false"
              @pin="() => {}"
              @update="loadUserAndCases"
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
// TODO: Import Case and User entities when API is ready
// import { Case } from '@/entities/Case';
// import { User } from '@/entities/User';
import {
  FileText,
  Plus,
  Search,
  Clock,
  AlertTriangle,
  CheckCircle,
  Archive,
  Eye,
  Sparkles,
} from 'lucide-vue-next';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import NewCaseForm from '@/components/cases/NewCaseForm.vue';
import CaseFilters from '@/components/cases/CaseFilters.vue';
import CaseCard from '@/components/cases/CaseCard.vue';
import AIMultiCaseSummary from '@/components/ai/AIMultiCaseSummary.vue';

// Props
const props = defineProps({
  pinnedCaseId: {
    type: String,
    default: null,
  },
});

// State
const cases = ref([]);
const filteredCases = ref([]);
const user = ref(null);
const isLoading = ref(true);
const searchQuery = ref('');
const filters = ref({
  status: 'all',
  priority: 'all',
  type: 'all',
  lawyer: 'all',
});
const showNewCase = ref(false);
const pinnedCaseId = ref(null);
const impersonatedRole = ref(null);
const activeTab = ref('active');
const showAISummary = ref(false);

// Computed
const activeCases = computed(() => cases.value.filter(c => c.status !== 'archived'));
const archivedCases = computed(() => cases.value.filter(c => c.status === 'archived'));

// Methods
const loadUserAndCases = async () => {
  isLoading.value = true;
  try {
    // TODO: Replace with actual API calls when ready
    // const userData = await User.me();
    // user.value = userData;

    // const allCases = await Case.list('-updated_date');

    // Apply role-based filtering
    // const savedRole = localStorage.getItem('impersonatedRole');
    // const currentRole = savedRole || userData.user_type;

    // let filteredByRole = allCases;

    // if (currentRole === 'lawyer') {
    //   filteredByRole = allCases.filter(c => c.lawyer_id === userData.id);
    // } else if (currentRole === 'customer') {
    //   filteredByRole = allCases.filter(c =>
    //     c.customer_ids && c.customer_ids.includes(userData.id)
    //   );
    // } else if (currentRole === 'guest') {
    //   filteredByRole = [];
    // }

    // cases.value = filteredByRole;
    console.log('TODO: Load user and cases from API');
  } catch (error) {
    console.error('Failed to load data:', error);
  }
  isLoading.value = false;
};

const handlePinCase = (caseId) => {
  if (pinnedCaseId.value === caseId) {
    // Unpin
    pinnedCaseId.value = null;
    localStorage.removeItem('pinnedCaseId');
  } else {
    // Pin
    pinnedCaseId.value = caseId;
    localStorage.setItem('pinnedCaseId', caseId);
  }
};

const applyFilters = () => {
  let filtered = [...cases.value];

  // Filter by active/archived tab
  if (activeTab.value === 'active') {
    filtered = filtered.filter(caseItem => caseItem.status !== 'archived');
  } else {
    filtered = filtered.filter(caseItem => caseItem.status === 'archived');
  }

  // Prioritize pinned case at the top (only in active tab)
  if (activeTab.value === 'active' && pinnedCaseId.value) {
    const pinnedCase = filtered.find(caseItem => caseItem.id === pinnedCaseId.value);
    if (pinnedCase) {
      filtered = filtered.filter(caseItem => caseItem.id !== pinnedCaseId.value);
      filtered.unshift(pinnedCase);
    }
  }

  if (searchQuery.value) {
    filtered = filtered.filter(caseItem =>
      caseItem.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      caseItem.case_number.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      caseItem.description?.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  }

  if (filters.value.status !== 'all' && filters.value.status !== 'archived') {
    filtered = filtered.filter(caseItem => caseItem.status === filters.value.status);
  }

  if (filters.value.priority !== 'all') {
    filtered = filtered.filter(caseItem => caseItem.priority === filters.value.priority);
  }

  if (filters.value.type !== 'all') {
    filtered = filtered.filter(caseItem => caseItem.case_type === filters.value.type);
  }

  filteredCases.value = filtered;
};

const handleNewCase = async (caseData) => {
  try {
    // TODO: Replace with actual API call when ready
    // const newCase = await Case.create({
    //   ...caseData,
    //   lawyer_id: user.value?.id,
    //   owner_ids: user.value ? [user.value.id] : []
    // });
    // cases.value = [newCase, ...cases.value];
    console.log('TODO: Create new case:', caseData);
    showNewCase.value = false;
  } catch (error) {
    console.error('Failed to create case:', error);
  }
};

const handleFilterChange = (key, value) => {
  filters.value = { ...filters.value, [key]: value };
};

const getStatusColor = (status) => {
  switch (status) {
    case 'open':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'in_progress':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'closed':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'on_hold':
      return 'bg-gray-100 text-gray-800 border-gray-200';
    case 'archived':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getPriorityColor = (priority) => {
  switch (priority) {
    case 'urgent':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'high':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'low':
      return 'bg-green-100 text-green-800 border-green-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getStatusIcon = (status) => {
  switch (status) {
    case 'open':
      return Clock;
    case 'in_progress':
      return AlertTriangle;
    case 'closed':
      return CheckCircle;
    case 'on_hold':
      return Clock;
    case 'archived':
      return Archive;
    default:
      return Clock;
  }
};

// Lifecycle
onMounted(() => {
  loadUserAndCases();
  // Load pinned case from localStorage
  const pinned = localStorage.getItem('pinnedCaseId');
  if (pinned) {
    pinnedCaseId.value = pinned;
  }
  // Load impersonated role from localStorage
  const savedRole = localStorage.getItem('impersonatedRole');
  if (savedRole) {
    impersonatedRole.value = savedRole;
  }
});

// Watchers
watch(
  [cases, searchQuery, filters, user, impersonatedRole, activeTab],
  () => {
    applyFilters();
  },
  { deep: true }
);
</script>
