<template>
  <div v-if="isLoading" class="p-6 space-y-6">
    <div class="animate-pulse space-y-4">
      <div class="h-8 bg-gray-200 rounded w-1/3"></div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="i in 3" :key="i" class="h-48 bg-gray-200 rounded-lg"></div>
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
        <p class="text-gray-500 mt-1">View and track your legal cases</p>
      </div>
      <div class="flex items-center gap-3">
        <button 
          @click="$emit('newCase')"
          class="px-4 py-2 bg-[#003aca] text-white rounded-md hover:bg-[#0031a0] text-sm font-medium flex items-center gap-2"
        >
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
        <p class="text-xs text-gray-500 mt-1">All time</p>
      </div>
      
      <div class="p-4 bg-white rounded-lg border border-gray-200">
        <div class="flex items-center justify-between">
          <p class="text-xs text-gray-600 font-medium">Active</p>
          <Clock class="w-4 h-4 text-orange-600" />
        </div>
        <p class="text-2xl font-bold text-gray-900 mt-2">{{ activeCasesCount }}</p>
        <p class="text-xs text-gray-500 mt-1">In progress</p>
      </div>
      
      <div class="p-4 bg-white rounded-lg border border-gray-200">
        <div class="flex items-center justify-between">
          <p class="text-xs text-gray-600 font-medium">Completed</p>
          <CheckCircle class="w-4 h-4 text-green-600" />
        </div>
        <p class="text-2xl font-bold text-gray-900 mt-2">{{ completedCasesCount }}</p>
        <p class="text-xs text-gray-500 mt-1">Closed cases</p>
      </div>
      
      <div class="p-4 bg-white rounded-lg border border-gray-200">
        <div class="flex items-center justify-between">
          <p class="text-xs text-gray-600 font-medium">Next Hearing</p>
          <Calendar class="w-4 h-4 text-purple-600" />
        </div>
        <p class="text-sm font-bold text-gray-900 mt-2">{{ nextHearingDate || 'None' }}</p>
        <p class="text-xs text-gray-500 mt-1">Upcoming</p>
      </div>
    </div>

    <!-- Search and Filters -->
    <div class="bg-white rounded-lg border border-gray-200 p-4 mb-6">
      <div class="flex items-center gap-3">
        <div class="flex-1 relative">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search your cases..."
            class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
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

    <!-- Cases List -->
    <div>
      <div v-if="filteredCases.length === 0" class="col-span-full">
        <div class="bg-white rounded-lg border border-gray-200 text-center py-12">
          <FileText class="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 class="text-base font-semibold text-gray-900 mb-1">No cases found</h3>
          <p class="text-sm text-gray-500">
            {{
              searchQuery || statusFilter !== "all" || priorityFilter !== 'all'
                ? "Try adjusting your search or filters"
                : "You don't have any cases yet. Create your first case to get started."
            }}
          </p>
          <button 
            v-if="!searchQuery && statusFilter === 'all' && priorityFilter === 'all'"
            @click="$emit('newCase')"
            class="mt-4 px-4 py-2 bg-[#003aca] text-white rounded-md hover:bg-[#0031a0] text-sm font-medium"
          >
            Create Your First Case
          </button>
        </div>
      </div>
      
      <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div
          v-for="caseItem in filteredCases"
          :key="caseItem.id"
          class="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition cursor-pointer"
          @click="viewCaseDetails(caseItem)"
        >
          <div class="flex items-start justify-between mb-3">
            <div>
              <h3 class="font-semibold text-gray-900 text-base mb-1">{{ caseItem.title }}</h3>
              <p class="text-xs text-gray-500">Case #{{ caseItem.case_number }}</p>
            </div>
            <span :class="['px-2 py-1 rounded text-xs font-medium', getStatusColor(caseItem.status)]">
              {{ caseItem.status }}
            </span>
          </div>
          
          <p class="text-sm text-gray-600 mb-3 line-clamp-2">{{ caseItem.description || 'No description available' }}</p>

          <div class="flex items-center gap-2 mb-3">
            <span :class="['px-2 py-1 rounded text-xs font-medium', getPriorityColor(caseItem.priority)]">
              {{ caseItem.priority }} priority
            </span>
            <span class="px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700">
              {{ caseItem.case_type || 'Civil' }}
            </span>
          </div>

          <!-- Lawyer Info -->
          <div v-if="caseItem.lawyerInfo" class="flex items-center gap-2 mb-3 p-2 bg-blue-50 rounded-md">
            <div class="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center">
              <User class="w-3 h-3 text-blue-600" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-xs font-medium text-blue-900 truncate">{{ caseItem.lawyerInfo.name }}</p>
              <p class="text-xs text-blue-600">Your Lawyer</p>
            </div>
          </div>
          
          <!-- Important Dates -->
          <div class="space-y-1 mb-3">
            <div v-if="caseItem.court_date" class="flex items-center gap-2 text-xs text-gray-600">
              <Calendar class="w-3 h-3" />
              <span>Next hearing: {{ formatDate(caseItem.court_date) }}</span>
            </div>
            <div class="flex items-center gap-2 text-xs text-gray-500">
              <Clock class="w-3 h-3" />
              <span>Updated: {{ formatDate(caseItem.updated_date || caseItem.created_date) }}</span>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <button 
              @click.stop="viewCaseDetails(caseItem)"
              class="flex-1 py-2 border border-blue-600 text-blue-600 rounded-md text-sm font-medium hover:bg-blue-50 transition flex items-center justify-center gap-1"
            >
              <Eye class="w-3 h-3" />
              View Details
            </button>
            <button 
              v-if="caseItem.status !== 'closed'"
              @click.stop="contactLawyer(caseItem)"
              class="px-3 py-2 bg-gray-100 text-gray-600 rounded-md text-sm font-medium hover:bg-gray-200 transition"
            >
              Contact Lawyer
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { Case, User } from '@/services/entities';
import { useAuthStore } from '@/stores/auth';
import { format } from 'date-fns';
import {
  FileText,
  Calendar,
  Clock,
  CheckCircle,
  Search,
  Eye,
  ChevronDown,
  Plus,
  User as UserIcon,
} from 'lucide-vue-next';

// Props
defineProps({
  currentUser: Object,
});

// Emits
const emit = defineEmits(['newCase', 'viewCase', 'contactLawyer']);

// Auth store
const authStore = useAuthStore();

// State
const cases = ref([]);
const filteredCases = ref([]);
const isLoading = ref(true);
const searchQuery = ref('');
const statusFilter = ref('all');
const priorityFilter = ref('all');

// Options for selects
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

// Computed
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

const activeCasesCount = computed(() => {
  return cases.value.filter(c => c.status === 'open' || c.status === 'in_progress').length;
});

const completedCasesCount = computed(() => {
  return cases.value.filter(c => c.status === 'closed').length;
});

const nextHearingDate = computed(() => {
  const upcomingHearings = cases.value
    .filter(c => c.court_date && new Date(c.court_date) > new Date())
    .sort((a, b) => new Date(a.court_date) - new Date(b.court_date));
  
  return upcomingHearings.length > 0 ? formatDate(upcomingHearings[0].court_date) : null;
});

// Methods
const loadMyCases = async () => {
  isLoading.value = true;
  try {
    const userId = authStore.user?.id;
    if (!userId) return;

    // Load all cases and filter for customer cases
    const allCases = await Case.list();
    const myCases = allCases.filter(c =>
      c.customers && Array.isArray(c.customers) && c.customers.some(customer => customer.id === userId)
    );

    // Load lawyer information for each case
    for (const caseItem of myCases) {
      if (caseItem.lawyer_id) {
        try {
          const lawyer = await User.get(caseItem.lawyer_id);
          caseItem.lawyerInfo = {
            name: lawyer.full_name,
            email: lawyer.email,
            phone: lawyer.phone,
          };
        } catch (error) {
          console.error('Failed to load lawyer info:', error);
        }
      }
    }

    cases.value = myCases;
  } catch (error) {
    console.error('Failed to load cases:', error);
  }
  isLoading.value = false;
};

const applyFilters = () => {
  let filtered = cases.value;

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(caseItem =>
      caseItem.title.toLowerCase().includes(query) ||
      caseItem.case_number.toLowerCase().includes(query) ||
      caseItem.description?.toLowerCase().includes(query) ||
      caseItem.lawyerInfo?.name?.toLowerCase().includes(query)
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
  try {
    return format(new Date(date), 'MMM d, yyyy');
  } catch (e) {
    return '';
  }
};

const viewCaseDetails = (caseItem) => {
  emit('viewCase', caseItem);
};

const contactLawyer = (caseItem) => {
  emit('contactLawyer', caseItem);
};

// Lifecycle
onMounted(() => {
  loadMyCases();
});

// Watchers
watch([cases, searchQuery, statusFilter, priorityFilter], () => {
  applyFilters();
});
</script>