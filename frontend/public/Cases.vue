<template>
  <!-- Loading State -->
  <div v-if="isLoading" class="space-y-6">
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

  <!-- Main Content -->
  <div v-else class="space-y-6">
    <!-- ==================== HEADER SECTION ==================== -->
    <div class="mb-6">
      <h2 class="text-3xl font-bold text-gray-800 flex items-center gap-3">
        <FileText class="w-7 h-7 text-[#003aca]" />
        Cases Management
      </h2>
      <p class="text-gray-600 mt-1">
        Manage and track all your legal cases
      </p>
    </div>

    <!-- ==================== CASE MANAGEMENT TOOLS ==================== -->
    <div class="bg-white rounded-lg border border-gray-200 p-6">
      <div class="flex items-center justify-between mb-4">
        <div>
          <h3 class="text-lg font-semibold text-gray-800">Case Management</h3>
          <p class="text-sm text-gray-600 mt-1">Create new cases and manage existing ones</p>
        </div>
        <div>
          <DialogTitle>Create New Case</DialogTitle>
          <Button @click="showNewCase = true" class="bg-[#003aca] hover:bg-[#002a8a] text-white h-10 px-2">
            <Plus class="w-4 h-4 mr-2" />
            New Case
          </Button>
        </div>
         
      </div>
        <Dialog v-model:open="showNewCase">
          <DialogContent class="max-w-2xl">
           
          </DialogContent>
            <NewCaseForm
              :current-user="user"
              @submit="handleNewCase"
              @cancel="showNewCase = false"
            />
        </Dialog>

      <!-- AI Summary Toggle (Optional) -->
      <div v-if="false" class="mt-4 pt-4 border-t border-gray-200">
        <Button
          @click="showAISummary = !showAISummary"
          variant="outline"
          class="border-purple-300 text-purple-700 hover:bg-purple-50"
        >
          <Sparkles class="w-4 h-4 mr-2" />
          {{ showAISummary ? 'Hide' : 'Show' }} AI Analysis
        </Button>
      </div>
    </div>

    <!-- ==================== AI SUMMARY SECTION ==================== -->
    <AIMultiCaseSummary v-if="showAISummary" :cases="cases" :users="[user]" />

    <!-- ==================== STATS CARDS ==================== -->
    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      <!-- Total Cases -->
      <div class="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
        <div class="flex items-center justify-between mb-2">
          <p class="text-xs font-semibold text-gray-600 uppercase tracking-wide">Total Cases</p>
          <div class="p-2 bg-blue-50 rounded-lg">
            <FileText class="w-4 h-4 text-blue-600" />
          </div>
        </div>
        <p class="text-2xl font-bold text-gray-900">{{ cases.length }}</p>
        <p class="text-xs text-gray-500 mt-1">All cases in system</p>
      </div>

      <!-- Open Cases -->
      <div class="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
        <div class="flex items-center justify-between mb-2">
          <p class="text-xs font-semibold text-gray-600 uppercase tracking-wide">Open</p>
          <div class="p-2 bg-orange-50 rounded-lg">
            <Clock class="w-4 h-4 text-orange-600" />
          </div>
        </div>
        <p class="text-2xl font-bold text-gray-900">
          {{ activeCases.filter(c => c.status === 'open').length }}
        </p>
        <p class="text-xs text-gray-500 mt-1">Newly opened</p>
      </div>

      <!-- In Progress Cases -->
      <div class="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
        <div class="flex items-center justify-between mb-2">
          <p class="text-xs font-semibold text-gray-600 uppercase tracking-wide">In Progress</p>
          <div class="p-2 bg-yellow-50 rounded-lg">
            <AlertTriangle class="w-4 h-4 text-yellow-600" />
          </div>
        </div>
        <p class="text-2xl font-bold text-gray-900">
          {{ activeCases.filter(c => c.status === 'in_progress').length }}
        </p>
        <p class="text-xs text-gray-500 mt-1">Active work</p>
      </div>

      <!-- Closed Cases -->
      <div class="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
        <div class="flex items-center justify-between mb-2">
          <p class="text-xs font-semibold text-gray-600 uppercase tracking-wide">Closed</p>
          <div class="p-2 bg-green-50 rounded-lg">
            <CheckCircle class="w-4 h-4 text-green-600" />
          </div>
        </div>
        <p class="text-2xl font-bold text-gray-900">
          {{ activeCases.filter(c => c.status === 'closed').length }}
        </p>
        <p class="text-xs text-gray-500 mt-1">Successfully closed</p>
      </div>

      <!-- Archived Cases -->
      <div
        class="bg-white rounded-lg border border-gray-200 p-4 cursor-pointer hover:shadow-lg hover:border-purple-300 transition-all"
        @click="activeTab = 'archived'"
      >
        <div class="flex items-center justify-between mb-2">
          <p class="text-xs font-semibold text-gray-600 uppercase tracking-wide">Archived</p>
          <div class="p-2 bg-purple-50 rounded-lg">
            <Archive class="w-4 h-4 text-purple-600" />
          </div>
        </div>
        <p class="text-2xl font-bold text-gray-900">
          {{ archivedCases.length }}
        </p>
        <p class="text-xs text-purple-600 mt-1 font-medium">Click to view →</p>
      </div>
    </div>

    <!-- ==================== TABS SECTION ==================== -->
    <Tabs v-model="activeTab" class="space-y-6">
      <TabsList class="grid w-full max-w-md grid-cols-2 bg-gray-100 p-1">
        <TabsTrigger
          value="active"
          class="flex items-center justify-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
        >
          <Eye class="w-4 h-4" />
          <span>Active Cases</span>
          <Badge variant="secondary" class="ml-1 bg-blue-100 text-blue-800">
            {{ activeCases.length }}
          </Badge>
        </TabsTrigger>
        <TabsTrigger
          value="archived"
          class="flex items-center justify-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
        >
          <Archive class="w-4 h-4" />
          <span>Archived</span>
          <Badge variant="secondary" class="ml-1 bg-purple-100 text-purple-800">
            {{ archivedCases.length }}
          </Badge>
        </TabsTrigger>
      </TabsList>

      <!-- ==================== ACTIVE CASES TAB ==================== -->
      <TabsContent value="active" class="space-y-6">
        <!-- Filters and Search -->
        <div class="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div class="flex flex-col lg:flex-row gap-4">
            <!-- Search Bar -->
            <div class="flex-1">
              <div class="relative">
                <Search class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  v-model="searchQuery"
                  placeholder="Search cases by title, number, or description..."
                  class="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            <!-- Filters Component -->
            <CaseFilters :filters="filters" @filter-change="handleFilterChange" />
          </div>
        </div>

        <!-- Cases Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <!-- Empty State -->
          <div v-if="filteredCases.length === 0" class="col-span-full">
            <Card class="border-2 border-dashed border-gray-300 bg-gray-50">
              <CardContent class="text-center py-16">
                <div class="inline-block p-4 bg-gray-100 rounded-full mb-4">
                  <FileText class="w-12 h-12 text-gray-400" />
                </div>
                <h3 class="text-lg font-semibold text-gray-900 mb-2">No active cases found</h3>
                <p class="text-gray-500 mb-6 max-w-md mx-auto">
                  {{
                    searchQuery || Object.values(filters).some(f => f !== "all")
                      ? "Try adjusting your search criteria or filters to find what you're looking for"
                      : "Get started by creating your first case to begin managing your legal work"
                  }}
                </p>
                <Button
                  v-if="!searchQuery && Object.values(filters).every(f => f === 'all')"
                  @click="showNewCase = true"
                  class="bg-[#003aca] hover:bg-[#002a8a] text-white"
                >
                  <Plus class="w-4 h-4 mr-2" />
                  Create Your First Case
                </Button>
              </CardContent>
            </Card>
          </div>

          <!-- Case Cards -->
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

      <!-- ==================== ARCHIVED CASES TAB ==================== -->
      <TabsContent value="archived" class="space-y-6">
        <!-- Archived Info Banner -->
        <Card class="bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200 shadow-sm">
          <CardContent class="p-6">
            <div class="flex items-start gap-4">
              <div class="p-3 bg-purple-100 rounded-lg">
                <Archive class="w-6 h-6 text-purple-600" />
              </div>
              <div class="flex-1">
                <h3 class="font-semibold text-purple-900 text-lg mb-2">Archived Cases</h3>
                <p class="text-sm text-purple-800 leading-relaxed">
                  These cases have been archived and are hidden from the active cases view.
                  They remain fully searchable and accessible. You can unarchive a case at any time
                  to return it to your active cases list.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Search for Archived Cases -->
        <div class="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div class="relative">
            <Search class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              v-model="searchQuery"
              placeholder="Search archived cases by title, number, or description..."
              class="pl-10 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
            />
          </div>
        </div>

        <!-- Archived Cases Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <!-- Empty State -->
          <div v-if="filteredCases.length === 0" class="col-span-full">
            <Card class="border-2 border-dashed border-gray-300 bg-gray-50">
              <CardContent class="text-center py-16">
                <div class="inline-block p-4 bg-purple-100 rounded-full mb-4">
                  <Archive class="w-12 h-12 text-purple-400" />
                </div>
                <h3 class="text-lg font-semibold text-gray-900 mb-2">
                  {{ searchQuery ? "No archived cases match your search" : "No archived cases" }}
                </h3>
                <p class="text-gray-500 max-w-md mx-auto">
                  {{ searchQuery
                    ? "Try adjusting your search query to find what you're looking for"
                    : "Cases that you archive will appear here for easy reference and future access"
                  }}
                </p>
              </CardContent>
            </Card>
          </div>

          <!-- Archived Case Cards -->
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
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
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

// ==================== STATE ====================
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

// ==================== COMPUTED ====================
const activeCases = computed(() => {
  // Active cases are those that are still ongoing
  const activeStatuses = ['open', 'in_progress', 'on_hold'];
  return cases.value.filter(c => activeStatuses.includes(c.status));
});

const archivedCases = computed(() => {
  // Archived cases are those that are completed or closed
  const archivedStatuses = ['closed', 'won', 'lost', 'archived'];
  return cases.value.filter(c => archivedStatuses.includes(c.status));
});

// ==================== API IMPORTS ====================
import { Case, User } from '@/services/entities';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();

// ==================== METHODS ====================
const loadUserAndCases = async () => {
  isLoading.value = true;
  try {
    // Load current user
    user.value = await User.me();

    // Load cases based on user role
    if (user.value.user_type === 'admin') {
      // Admin sees all cases
      cases.value = await Case.list('-updated_date');
    } else if (user.value.user_type === 'lawyer') {
      // Lawyer sees only assigned cases
      const allCases = await Case.list('-updated_date');
      cases.value = allCases.filter(c => c.lawyer_id === user.value.id);
    } else if (user.value.user_type === 'customer') {
      // Customer sees only their cases
      const allCases = await Case.list('-updated_date');
      cases.value = allCases.filter(c =>
        c.customer_ids && Array.isArray(c.customer_ids) && c.customer_ids.includes(user.value.id)
      );
    }

    applyFilters();
  } catch (error) {
    console.error('Failed to load data:', error);
  }
  isLoading.value = false;
};

const handlePinCase = (caseId) => {
  if (pinnedCaseId.value === caseId) {
    pinnedCaseId.value = null;
    localStorage.removeItem('pinnedCaseId');
  } else {
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

  // Search filter
  if (searchQuery.value) {
    filtered = filtered.filter(caseItem =>
      caseItem.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      caseItem.case_number.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      caseItem.description?.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  }

  // Status filter
  if (filters.value.status !== 'all' && filters.value.status !== 'archived') {
    filtered = filtered.filter(caseItem => caseItem.status === filters.value.status);
  }

  // Priority filter
  if (filters.value.priority !== 'all') {
    filtered = filtered.filter(caseItem => caseItem.priority === filters.value.priority);
  }

  // Type filter
  if (filters.value.type !== 'all') {
    filtered = filtered.filter(caseItem => caseItem.case_type === filters.value.type);
  }

  filteredCases.value = filtered;
};

const handleNewCase = async (caseData) => {
  try {
    // Create the new case
    const newCase = await Case.create(caseData);

    // Add to local cases array
    cases.value.unshift(newCase);

    // Close the dialog
    showNewCase.value = false;

    // Reload to ensure consistency
    await loadUserAndCases();
  } catch (error) {
    console.error('Failed to create case:', error);
    alert('Failed to create case. Please try again.');
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

// ==================== LIFECYCLE ====================
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

// ==================== WATCHERS ====================
watch(
  [cases, searchQuery, filters, user, impersonatedRole, activeTab],
  () => {
    applyFilters();
  },
  { deep: true }
);
</script>
