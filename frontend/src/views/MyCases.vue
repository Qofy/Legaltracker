<template>
  <div v-if="isLoading" class="p-6 space-y-6">
    <div class="animate-pulse space-y-4">
      <div class="h-8 bg-gray-200 rounded w-1/3"></div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card v-for="i in 3" :key="i" class="h-48">
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

  <div v-else class="space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <FileText class="w-7 h-7 text-[#003aca]" />
            My Cases
          </h2>
          <p class="text-gray-500 mt-1">Overview of your assigned and created cases</p>
        </div>
        <div class="flex items-center gap-3">
          <div class="flex items-center bg-white border border-gray-300 rounded-md">
            <button @click="setView('cards')" :class="['p-2 rounded-l-md transition', viewMode === 'cards' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100']" aria-label="Cards view">
              <Grid class="w-4 h-4" />
            </button>
            <button @click="setView('table')" :class="['p-2 rounded-r-md transition', viewMode === 'table' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100']" aria-label="Table view">
              <List class="w-4 h-4" />
            </button>
          </div>

          <button class="px-4 py-2 bg-[#003aca] text-white rounded-md hover:bg-[#0031a0] text-sm font-medium flex items-center gap-2">
            <Plus class="w-4 h-4" />
            New Case
          </button>
        </div>
      </div>
    

      <!-- Stats Cards -->
      <div class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <div class="p-4 bg-white rounded-lg border border-gray-200">
          <div class="flex items-center justify-between">
            <p class="text-xs text-gray-600 font-medium">Total Cases</p>
            <FileText class="w-4 h-4 text-blue-600" />
          </div>
          <p class="text-2xl font-bold text-gray-900 mt-2">{{ cases.length }}</p>
        </div>

        <div class="p-4 bg-white rounded-lg border border-gray-200">
          <div class="flex items-center justify-between">
            <p class="text-xs text-gray-600 font-medium">Active Cases</p>
            <Clock class="w-4 h-4 text-orange-600" />
          </div>
          <p class="text-2xl font-bold text-gray-900 mt-2">
            {{ cases.filter(c => ['open', 'in_progress'].includes(c.status)).length }}
          </p>
        </div>

        <div class="p-4 bg-white rounded-lg border border-gray-200">
          <div class="flex items-center justify-between">
            <p class="text-xs text-gray-600 font-medium">High Priority</p>
            <AlertTriangle class="w-4 h-4 text-red-600" />
          </div>
          <p class="text-2xl font-bold text-gray-900 mt-2">
            {{ cases.filter(c => ['urgent', 'high'].includes(c.priority)).length }}
          </p>
        </div>

        <div class="p-4 bg-white rounded-lg border border-gray-200">
          <div class="flex items-center justify-between">
            <p class="text-xs text-gray-600 font-medium">Upcoming Deadlines</p>
            <Calendar class="w-4 h-4 text-purple-600" />
          </div>
          <p class="text-2xl font-bold text-gray-900 mt-2">
            {{ cases.filter(c => c.next_deadline && new Date(c.next_deadline) > new Date()).length }}
          </p>
        </div>
      </div>

      <!-- Filters and Search -->
      <div class="bg-white rounded-lg border border-gray-200 p-4">
        <div class="flex flex-col lg:flex-row gap-3 items-center">
          <div class="flex-1 w-full">
            <div class="relative">
              <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                v-model="searchQuery"
                placeholder="Search your cases by title, number or description..."
                class="pl-10 border-gray-300 h-10"
              />
            </div>
          </div>

          <div class="flex items-center gap-2">
            <div class="relative">
              <select
                v-model="statusFilter"
                class="appearance-none px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8 bg-white w-40"
              >
                <option v-for="opt in statusOptionsWithCounts" :key="opt.value" :value="opt.value">
                  {{ opt.display }}
                </option>
              </select>
              <ChevronDown class="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            <div class="relative">
              <select
                v-model="priorityFilter"
                class="appearance-none px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8 bg-white w-36"
              >
                <option v-for="opt in priorityOptionsWithCounts" :key="opt.value" :value="opt.value">
                  {{ opt.display }}
                </option>
              </select>
              <ChevronDown class="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      <!-- Cases Grid / Table -->
      <div>
        <div v-if="filteredCases.length === 0" class="col-span-full">
          <div class="bg-white rounded-lg border border-gray-200 text-center py-12">
            <FileText class="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 class="text-base font-semibold text-gray-900 mb-1">No cases found</h3>
            <p class="text-sm text-gray-500">
                {{
                  searchQuery || statusFilter !== "all" || priorityFilter !== 'all'
                    ? "Try adjusting your search or filters"
                    : "You don't have any cases yet"
                }}
            </p>
          </div>
        </div>
        <div v-else>
          <div v-if="viewMode === 'cards'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div
              v-for="caseItem in filteredCases"
              :key="caseItem.id"
              class="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200"
            >
              <div class="flex items-start justify-between mb-3">
                <div class="flex-1 min-w-0">
                  <router-link
                    :to="`/case-details?caseId=${caseItem.id}`"
                    class="text-base font-semibold text-gray-900 hover:text-[#003aca] transition-colors truncate block"
                  >
                    {{ caseItem.title }}
                  </router-link>
                  <p class="text-xs text-gray-500 mt-1">Case #{{ caseItem.case_number }}</p>
                </div>
              </div>

              <p class="text-sm text-gray-600 line-clamp-2 mb-3">
                {{ caseItem.description }}
              </p>

              <div class="flex flex-wrap gap-1.5 mb-3">
                <Badge :class="`${getStatusColor(caseItem.status)} text-xs`">
                  {{ caseItem.status.replace('_', ' ') }}
                </Badge>
                <Badge :class="`${getPriorityColor(caseItem.priority)} text-xs`">
                  {{ caseItem.priority }}
                </Badge>
                <Badge variant="outline" class="text-xs border-gray-300">
                  {{ caseItem.case_type?.replace('_', ' ') }}
                </Badge>
              </div>

              <div class="space-y-1.5 text-xs text-gray-500 mb-3">
                <div v-if="caseItem.due_date" class="flex items-center space-x-1.5">
                  <Calendar class="w-3.5 h-3.5" />
                  <span>Due: {{ formatDate(caseItem.due_date) }}</span>
                </div>
                <div v-if="caseItem.next_deadline" class="flex items-center space-x-1.5">
                  <AlertTriangle class="w-3.5 h-3.5 text-orange-500" />
                  <span>Next: {{ formatDate(caseItem.next_deadline) }}</span>
                </div>
                <div class="flex items-center space-x-1.5">
                  <Clock class="w-3.5 h-3.5" />
                  <span>Updated: {{ formatDate(caseItem.updated_date) }}</span>
                </div>
              </div>

              <router-link :to="`/case-details?caseId=${caseItem.id}`" class="block">
                <button class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                  <Eye class="w-4 h-4" />
                  View Case Details
                </button>
              </router-link>
            </div>
          </div>

          <div v-else class="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Title</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Case #</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Status</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Priority</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Next Deadline</th>
                  <th class="px-4 py-3 text-right text-xs font-medium text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="caseItem in filteredCases" :key="caseItem.id" class="hover:bg-gray-50">
                  <td class="px-4 py-3 text-sm">
                    <router-link :to="`/case-details?caseId=${caseItem.id}`" class="font-medium text-gray-900 hover:text-[#003aca]">{{ caseItem.title }}</router-link>
                    <div class="text-xs text-gray-500 mt-0.5">{{ caseItem.description?.slice(0, 60) }}{{ caseItem.description?.length > 60 ? '…' : '' }}</div>
                  </td>
                  <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{{ caseItem.case_number }}</td>
                  <td class="px-4 py-3 whitespace-nowrap text-sm">
                    <Badge :class="`${getStatusColor(caseItem.status)} text-xs`">{{ caseItem.status.replace('_',' ') }}</Badge>
                  </td>
                  <td class="px-4 py-3 whitespace-nowrap text-sm">
                    <Badge :class="`${getPriorityColor(caseItem.priority)} text-xs`">{{ caseItem.priority }}</Badge>
                  </td>
                  <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{{ caseItem.next_deadline ? formatDate(caseItem.next_deadline) : '-' }}</td>
                  <td class="px-4 py-3 whitespace-nowrap text-right text-sm">
                    <router-link :to="`/case-details?caseId=${caseItem.id}`">
                      <button class="text-[#003aca] hover:text-[#0031a0] font-medium">View</button>
                    </router-link>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { format } from 'date-fns';
// TODO: Import Case and User entities when API is ready
// import { Case } from '@/entities/Case';
// import { User } from '@/entities/User';
import {
  FileText,
  Calendar,
  Clock,
  AlertTriangle,
  Search,
  Eye,
  ChevronDown,
} from 'lucide-vue-next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Grid, List } from 'lucide-vue-next';

// State
const cases = ref([]);
const filteredCases = ref([]);
const user = ref(null);
const isLoading = ref(true);
const searchQuery = ref('');
const statusFilter = ref('all');
const priorityFilter = ref('all');
const viewMode = ref('cards');

// Options for selects (label shown to user, value used internally)
const statusOptions = [
  { value: 'all', label: 'All Status' },
  { value: 'open', label: 'Open' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'closed', label: 'Closed' },
  { value: 'on_hold', label: 'On Hold' }
];

const priorityOptions = [
  { value: 'all', label: 'All Priorities' },
  { value: 'urgent', label: 'Urgent' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' }
];

// Computed options with dynamic counts for better UX
const statusOptionsWithCounts = computed(() => {
  return statusOptions.map(o => {
    const count = o.value === 'all' ? cases.value.length : cases.value.filter(c => c.status === o.value).length;
    return { ...o, count, display: `${o.label} (${count})` };
  });
});

const priorityOptionsWithCounts = computed(() => {
  return priorityOptions.map(o => {
    const count = o.value === 'all' ? cases.value.length : cases.value.filter(c => c.priority === o.value).length;
    return { ...o, count, display: `${o.label} (${count})` };
  });
});

// Computed

// Methods
const loadUserAndCases = async () => {
  isLoading.value = true;
  try {
    // TODO: Replace with actual API calls when ready
    // const userData = await User.me();
    // user.value = userData;

    // const allCases = await Case.list('-updated_date');
    // const userCases = allCases.filter(caseItem =>
    //   caseItem.customer_ids && caseItem.customer_ids.includes(userData.id)
    // );
    // cases.value = userCases;
    console.log('TODO: Load user and cases from API');
  } catch (error) {
    console.error('Failed to load cases:', error);
  }
  isLoading.value = false;
};

const applyFilters = () => {
  let filtered = cases.value;

  if (searchQuery.value) {
    filtered = filtered.filter(caseItem =>
      caseItem.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      caseItem.case_number.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      caseItem.description?.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  }

  if (statusFilter.value !== 'all') {
    filtered = filtered.filter(caseItem => caseItem.status === statusFilter.value);
  }

  if (priorityFilter.value !== 'all') {
    filtered = filtered.filter(caseItem => caseItem.priority === priorityFilter.value);
  }

  filteredCases.value = filtered;
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
      return 'bg-neutral-200 text-neutral-800 border-neutral-300';
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

const formatDate = (date) => {
  return format(new Date(date), 'MMM d, yyyy');
};

// Lifecycle
onMounted(() => {
  loadUserAndCases();
});

const setView = (mode) => {
  viewMode.value = mode;
};

// Watchers
watch([cases, searchQuery, statusFilter, priorityFilter], () => {
  applyFilters();
});
</script>
