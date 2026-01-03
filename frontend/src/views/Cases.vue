<template>
  <div class="space-y-6">
    <!-- Loading State -->
    <div v-if="isLoading" class="space-y-6">
      <div class="animate-pulse space-y-4">
        <div class="h-8 bg-gray-200 rounded w-1/3"></div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-for="i in 6" :key="i" class="h-48 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div v-else class="space-y-6">
      <!-- Header Section -->
      <div class="mb-6">
        <h2 class="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <Scale class="w-7 h-7 text-[#003aca]" />
          {{ pageTitle }}
        </h2>
        <p class="text-gray-600 mt-1">
          {{ pageSubtitle }}
        </p>
      </div>

      <!-- Stats Cards -->
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <div class="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
            <div class="flex items-center justify-between mb-2">
              <p class="text-xs font-semibold text-gray-600 uppercase tracking-wide">Total Cases</p>
              <div class="p-2 bg-blue-50 rounded-lg">
                <FileText class="w-4 h-4 text-blue-600" />
              </div>
            </div>
            <p class="text-2xl font-bold text-gray-900">{{ displayedCases.length }}</p>
            <p class="text-xs text-gray-500 mt-1">{{ isLawyer ? 'Assigned to you' : 'All system cases' }}</p>
          </div>        <div class="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between mb-2">
            <p class="text-xs font-semibold text-gray-600 uppercase tracking-wide">Unassigned</p>
            <div class="p-2 bg-red-50 rounded-lg">
              <AlertTriangle class="w-4 h-4 text-red-600" />
            </div>
          </div>
          <p class="text-2xl font-bold text-gray-900">{{ unassignedCases.length }}</p>
          <p class="text-xs text-red-600 mt-1 font-medium">Need assignment</p>
        </div>

        <div class="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between mb-2">
            <p class="text-xs font-semibold text-gray-600 uppercase tracking-wide">Open</p>
            <div class="p-2 bg-orange-50 rounded-lg">
              <Clock class="w-4 h-4 text-orange-600" />
            </div>
          </div>
          <p class="text-2xl font-bold text-gray-900">{{ openCases.length }}</p>
          <p class="text-xs text-gray-500 mt-1">Recently opened</p>
        </div>

        <div class="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between mb-2">
            <p class="text-xs font-semibold text-gray-600 uppercase tracking-wide">In Progress</p>
            <div class="p-2 bg-yellow-50 rounded-lg">
              <TrendingUp class="w-4 h-4 text-yellow-600" />
            </div>
          </div>
          <p class="text-2xl font-bold text-gray-900">{{ inProgressCases.length }}</p>
          <p class="text-xs text-gray-500 mt-1">Active work</p>
        </div>

        <div class="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between mb-2">
            <p class="text-xs font-semibold text-gray-600 uppercase tracking-wide">Client Issues</p>
            <div class="p-2 bg-purple-50 rounded-lg">
              <AlertCircle class="w-4 h-4 text-purple-600" />
            </div>
          </div>
          <p class="text-2xl font-bold text-gray-900">{{ clientIssues.length }}</p>
          <p class="text-xs text-purple-600 mt-1 font-medium">Require attention</p>
        </div>

        <div class="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between mb-2">
            <p class="text-xs font-semibold text-gray-600 uppercase tracking-wide">Closed</p>
            <div class="p-2 bg-green-50 rounded-lg">
              <CheckCircle class="w-4 h-4 text-green-600" />
            </div>
          </div>
          <p class="text-2xl font-bold text-gray-900">{{ closedCases.length }}</p>
          <p class="text-xs text-gray-500 mt-1">Successfully closed</p>
        </div>
      </div>

      <!-- Filters and Search -->
      <div class="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <div class="flex flex-col lg:flex-row gap-4 mb-4">
          <!-- Search Bar -->
          <div class="flex-1">
            <div class="relative">
              <Search class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                v-model="searchQuery"
                placeholder="Search cases by title, number, client name, or lawyer..."
                class="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          <!-- Admin-specific Filters -->
          <div class="flex gap-2 flex-wrap">
            <!-- Status Filter -->
            <select v-model="filters.status" class="min-w-[140px] px-3 py-2 border border-gray-300 rounded-md bg-white text-sm">
              <option value="all">All Statuses</option>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="on_hold">On Hold</option>
              <option value="closed">Closed</option>
              <option value="archived">Archived</option>
            </select>

            <!-- Assignment Filter -->
            <select v-model="filters.assignment" class="min-w-[140px] px-3 py-2 border border-gray-300 rounded-md bg-white text-sm">
              <option value="all">All Assignments</option>
              <option value="assigned">Assigned</option>
              <option value="unassigned">Unassigned</option>
            </select>

            <!-- Lawyer Filter -->
            <select v-model="filters.lawyer" class="min-w-[150px] px-3 py-2 border border-gray-300 rounded-md bg-white text-sm">
              <option value="all">All Lawyers</option>
              <option 
                v-for="lawyer in lawyers" 
                :key="lawyer.id" 
                :value="lawyer.id"
              >
                {{ lawyer.full_name }}
              </option>
            </select>

            <!-- Client Status Filter -->
            <select v-model="filters.clientStatus" class="min-w-[140px] px-3 py-2 border border-gray-300 rounded-md bg-white text-sm">
              <option value="all">All Client Status</option>
              <option value="satisfied">Satisfied</option>
              <option value="needs_attention">Needs Attention</option>
              <option value="at_risk">At Risk</option>
            </select>
          </div>
        </div>

        <!-- Quick Filters -->
        <div class="flex gap-2 flex-wrap">
          <Button
            v-if="isAdmin"
            @click="setQuickFilter('unassigned')"
            :variant="quickFilter === 'unassigned' ? 'default' : 'outline'"
            size="sm"
          >
            <AlertTriangle class="w-4 h-4 mr-1" />
            Unassigned ({{ unassignedCases.length }})
          </Button>
          <Button
            @click="setQuickFilter('client_issues')"
            :variant="quickFilter === 'client_issues' ? 'default' : 'outline'"
            size="sm"
          >
            <AlertCircle class="w-4 h-4 mr-1" />
            Client Issues ({{ clientIssues.length }})
          </Button>
        </div>
      </div>

      <!-- Lawyer Assignment Section (Admin Only) -->
      <div v-if="isAdmin && unassignedCases.length > 0" class="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div class="p-6 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <UserCheck class="w-5 h-5 text-blue-600" />
                Quick Lawyer Assignment
              </h3>
              <p class="text-sm text-gray-600 mt-1">Assign lawyers to unassigned cases quickly</p>
            </div>
            <Badge class="bg-red-100 text-red-700 border-red-200">
              {{ unassignedCases.length }} Unassigned
            </Badge>
          </div>
        </div>
        
        <div class="p-6">
          <div class="space-y-4">
            <!-- Bulk Assignment -->
            <div class="flex items-center gap-4 pb-4 border-b border-gray-100">
              <div class="flex-1">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Bulk Assign Lawyer
                </label>
                <select
                  v-model="bulkAssignLawyer"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="">Select a lawyer...</option>
                  <option v-for="lawyer in lawyers" :key="lawyer.id" :value="lawyer.id">
                    {{ lawyer.full_name }} ({{ assignedCasesCount(lawyer.id) }} cases)
                  </option>
                </select>
              </div>
              <div class="pt-6">
                <Button 
                  @click="bulkAssignUnassigned" 
                  :disabled="!bulkAssignLawyer || selectedCasesForBulk.length === 0"
                  class="px-4 py-2"
                >
                  Assign Selected ({{ selectedCasesForBulk.length }})
                </Button>
              </div>
            </div>

            <!-- Unassigned Cases List -->
            <div class="space-y-2">
              <div class="flex items-center justify-between mb-3">
                <h4 class="font-medium text-gray-700">Unassigned Cases</h4>
                <div class="flex items-center gap-2">
                  <Button 
                    @click="toggleSelectAll" 
                    variant="outline" 
                    size="sm"
                  >
                    {{ allSelected ? 'Deselect All' : 'Select All' }}
                  </Button>
                </div>
              </div>
              
              <div class="max-h-64 overflow-y-auto space-y-2">
                <div 
                  v-for="caseItem in unassignedCases" 
                  :key="caseItem.id"
                  class="flex items-center gap-3 p-3 border border-gray-200 rounded-md hover:bg-gray-50"
                >
                  <input
                    type="checkbox"
                    :value="caseItem.id"
                    v-model="selectedCasesForBulk"
                    class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center justify-between">
                      <div>
                        <p class="font-medium text-gray-900 truncate">{{ caseItem.title }}</p>
                        <p class="text-sm text-gray-500">#{{ caseItem.case_number }} • {{ caseItem.case_type }}</p>
                        <p class="text-xs text-gray-400">
                          Client: {{ caseItem.customers?.[0]?.full_name || 'No client' }}
                        </p>
                      </div>
                      <div class="flex items-center gap-2 ml-4">
                        <Badge :class="getStatusColor(caseItem.status)" class="text-xs">
                          {{ caseItem.status.replace('_', ' ').toUpperCase() }}
                        </Badge>
                        <select
                          @change="quickAssignLawyer(caseItem.id, $event.target.value)"
                          class="text-xs px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                        >
                          <option value="">Quick assign...</option>
                          <option v-for="lawyer in lawyers" :key="lawyer.id" :value="lawyer.id">
                            {{ lawyer.full_name }}
                          </option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Cases Table -->
      <div class="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div class="p-4 border-b border-gray-200">
          <h3 class="font-semibold text-gray-800">
            Cases ({{ filteredCases.length }})
          </h3>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50/80 border-b border-gray-200">
              <tr>
                <th class="p-4 text-left font-semibold text-gray-800 text-sm">Case</th>
                <th class="p-4 text-left font-semibold text-gray-800 text-sm">Client</th>
                <th class="p-4 text-left font-semibold text-gray-800 text-sm">Assigned Lawyer</th>
                <th class="p-4 text-left font-semibold text-gray-800 text-sm">Status</th>
                <th class="p-4 text-left font-semibold text-gray-800 text-sm">Client Status</th>
                <th class="p-4 text-left font-semibold text-gray-800 text-sm">Last Update</th>
                <th class="p-4 text-right font-semibold text-gray-800 text-sm">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-if="filteredCases.length === 0">
                <td colspan="7" class="p-8 text-center text-gray-500">
                  <div class="flex flex-col items-center gap-3">
                    <FileText class="w-12 h-12 text-gray-300" />
                    <p class="font-medium">No cases found</p>
                    <p class="text-sm">Try adjusting your filters or search criteria</p>
                  </div>
                </td>
              </tr>
              <tr
                v-for="caseItem in filteredCases"
                :key="caseItem.id"
                class="hover:bg-blue-50/30 transition-colors"
              >
                <td class="p-4">
                  <div>
                    <p class="font-semibold text-gray-900">{{ caseItem.title }}</p>
                    <p class="text-sm text-gray-500">#{{ caseItem.case_number }}</p>
                    <p class="text-xs text-gray-400 mt-1">{{ caseItem.case_type }}</p>
                  </div>
                </td>
                <td class="p-4">
                  <div v-if="caseItem.customers && caseItem.customers.length > 0">
                    <p class="font-medium text-gray-900">
                      {{ caseItem.customers[0].full_name }}
                    </p>
                    <p class="text-sm text-gray-500">{{ caseItem.customers[0].email }}</p>
                    <p v-if="caseItem.customers.length > 1" class="text-xs text-gray-400">
                      +{{ caseItem.customers.length - 1 }} more
                    </p>
                  </div>
                  <div v-else class="text-sm text-gray-400">
                    No client assigned
                  </div>
                </td>
                <td class="p-4">
                  <div v-if="caseItem.assigned_lawyer">
                    <div class="flex items-center gap-2 mb-1">
                      <Badge class="bg-green-100 text-green-700 border-green-200 text-xs">Assigned</Badge>
                    </div>
                    <p class="font-medium text-gray-900">{{ caseItem.assigned_lawyer.full_name }}</p>
                    <p class="text-sm text-gray-500">{{ caseItem.assigned_lawyer.email }}</p>
                  </div>
                  <div v-else class="flex items-center gap-2">
                    <Badge class="bg-red-100 text-red-700 border-red-200">Unassigned</Badge>
                    <Button 
                      v-if="isAdmin"
                      @click="openLawyerAssignment(caseItem)" 
                      size="sm" 
                      variant="outline"
                      class="h-6 px-2 text-xs"
                    >
                      Assign
                    </Button>
                  </div>
                </td>
                <td class="p-4">
                  <Badge :class="getStatusColor(caseItem.status)" class="border">
                    {{ caseItem.status.replace('_', ' ').toUpperCase() }}
                  </Badge>
                </td>
                <td class="p-4">
                  <div class="flex items-center gap-2">
                    <div 
                      class="w-2 h-2 rounded-full"
                      :class="getClientStatusColor(caseItem.client_status)"
                    ></div>
                    <span class="text-sm capitalize">
                      {{ caseItem.client_status || 'satisfied' }}
                    </span>
                    <Button 
                      v-if="isAdmin"
                      @click="updateClientStatus(caseItem)" 
                      size="sm" 
                      variant="ghost"
                      class="h-6 w-6 p-0"
                    >
                      <Edit class="w-3 h-3" />
                    </Button>
                  </div>
                </td>
                <td class="p-4 text-sm text-gray-500">
                  {{ formatDate(caseItem.updated_date || caseItem.created_date) }}
                </td>
                <td class="p-4 text-right">
                  <div class="flex items-center justify-end gap-1">
                    <Button 
                      @click="viewCase(caseItem)" 
                      size="sm" 
                      variant="ghost"
                      class="h-8 w-8 p-0"
                    >
                      <Eye class="w-4 h-4" />
                    </Button>
                    <Button 
                      v-if="caseItem.assigned_lawyer && isAdmin"
                      @click="openLawyerAssignment(caseItem)" 
                      size="sm" 
                      variant="ghost"
                      class="h-8 w-8 p-0"
                    >
                      <UserCheck class="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Lawyer Assignment Dialog -->
    <Dialog v-model:open="showLawyerAssignment">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign Lawyer</DialogTitle>
        </DialogHeader>
        <div v-if="selectedCaseForAssignment" class="space-y-4">
          <div>
            <p class="text-sm text-gray-600">Case:</p>
            <p class="font-medium">{{ selectedCaseForAssignment.title }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Select Lawyer:
            </label>
            <Select v-model="selectedLawyerId">
              <option value="">Choose a lawyer...</option>
              <option 
                v-for="lawyer in lawyers" 
                :key="lawyer.id" 
                :value="lawyer.id"
              >
                {{ lawyer.full_name }} - {{ lawyer.email }}
              </option>
            </Select>
          </div>
          <div class="flex gap-2 justify-end pt-4">
            <Button variant="outline" @click="showLawyerAssignment = false">
              Cancel
            </Button>
            <Button @click="confirmLawyerAssignment" :disabled="!selectedLawyerId">
              Assign Lawyer
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>

    <!-- Client Status Update Dialog -->
    <Dialog v-model:open="showClientStatusUpdate">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Client Status</DialogTitle>
        </DialogHeader>
        <div v-if="selectedCaseForStatus" class="space-y-4">
          <div>
            <p class="text-sm text-gray-600">Case:</p>
            <p class="font-medium">{{ selectedCaseForStatus.title }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Client Status:
            </label>
            <Select v-model="newClientStatus">
              <option value="satisfied">Satisfied</option>
              <option value="needs_attention">Needs Attention</option>
              <option value="at_risk">At Risk</option>
            </Select>
          </div>
          <div class="flex gap-2 justify-end pt-4">
            <Button variant="outline" @click="showClientStatusUpdate = false">
              Cancel
            </Button>
            <Button @click="confirmClientStatusUpdate">
              Update Status
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { format } from 'date-fns';
import { Case, User } from '@/services/entities';
import { useAuthStore } from '@/stores/auth';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Scale, Search, FileText, AlertTriangle, Clock, 
  TrendingUp, AlertCircle, CheckCircle, UserCheck, Edit, Eye
} from 'lucide-vue-next';

const router = useRouter();
const authStore = useAuthStore();

// Reactive data
const isLoading = ref(true);
const allCases = ref([]);
const lawyers = ref([]);
const searchQuery = ref('');
const quickFilter = ref('');
const showLawyerAssignment = ref(false);
const showClientStatusUpdate = ref(false);

// Assignment/Status update state
const selectedCaseForAssignment = ref(null);
const selectedCaseForStatus = ref(null);
const selectedLawyerId = ref('');
const newClientStatus = ref('satisfied');

// Bulk assignment state
const bulkAssignLawyer = ref('');
const selectedCasesForBulk = ref([]);

// Filters
const filters = ref({
  status: 'all',
  assignment: 'all',
  lawyer: 'all',
  clientStatus: 'all'
});

// Computed properties
const isAdmin = computed(() => authStore.user?.user_type === 'admin');
const isLawyer = computed(() => authStore.user?.user_type === 'lawyer');

const pageTitle = computed(() => {
  if (isAdmin.value) return 'Admin Case Management';
  if (isLawyer.value) return 'My Assigned Cases';
  return 'Cases';
});

const pageSubtitle = computed(() => {
  if (isAdmin.value) return 'Oversee all cases, assign lawyers, and manage client statuses';
  if (isLawyer.value) return 'View and manage cases assigned to you';
  return 'Your cases overview';
});

const displayedCases = computed(() => {
  let cases = [...allCases.value];
  
  // Filter by user role
  if (isLawyer.value) {
    // Lawyers only see cases assigned to them
    cases = cases.filter(c => c.assigned_lawyer?.id === authStore.user?.id);
  }
  // Admin sees all cases by default
  
  return cases;
});

const unassignedCases = computed(() => {
  const filtered = displayedCases.value.filter(c => !c.assigned_lawyer && !c.assigned_lawyer_id);
  console.log('Unassigned cases count:', filtered.length);
  return filtered;
});

const openCases = computed(() => 
  displayedCases.value.filter(c => c.status === 'open')
);

const inProgressCases = computed(() => 
  displayedCases.value.filter(c => c.status === 'in_progress')
);

const closedCases = computed(() => 
  displayedCases.value.filter(c => c.status === 'closed')
);

const clientIssues = computed(() => 
  displayedCases.value.filter(c => c.client_status === 'needs_attention' || c.client_status === 'at_risk')
);

const allSelected = computed(() => 
  selectedCasesForBulk.value.length === unassignedCases.value.length && unassignedCases.value.length > 0
);

const filteredCases = computed(() => {
  let filtered = [...displayedCases.value];

  // Apply quick filter first
  if (quickFilter.value === 'unassigned') {
    filtered = unassignedCases.value;
  } else if (quickFilter.value === 'client_issues') {
    filtered = clientIssues.value;
  }

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(c =>
      c.title?.toLowerCase().includes(query) ||
      c.case_number?.toLowerCase().includes(query) ||
      c.customers?.some(customer => customer.full_name?.toLowerCase().includes(query)) ||
      c.assigned_lawyer?.full_name?.toLowerCase().includes(query)
    );
  }

  // Status filter
  if (filters.value.status !== 'all') {
    filtered = filtered.filter(c => c.status === filters.value.status);
  }

  // Assignment filter
  if (filters.value.assignment === 'assigned') {
    filtered = filtered.filter(c => c.assigned_lawyer);
  } else if (filters.value.assignment === 'unassigned') {
    filtered = filtered.filter(c => !c.assigned_lawyer);
  }

  // Lawyer filter
  if (filters.value.lawyer !== 'all') {
    filtered = filtered.filter(c => c.assigned_lawyer?.id === filters.value.lawyer);
  }

  // Client status filter
  if (filters.value.clientStatus !== 'all') {
    filtered = filtered.filter(c => c.client_status === filters.value.clientStatus);
  }

  return filtered;
});

// Methods
const loadData = async () => {
  isLoading.value = true;
  try {
    console.log('Loading data from server...');
    const [casesData, lawyersData] = await Promise.all([
      Case.list('-updated_date'),
      User.list().then(users => users.filter(u => u.user_type === 'lawyer'))
    ]);
    
    console.log('Server returned cases:', casesData.length);
    console.log('Cases with assigned lawyers:', casesData.filter(c => c.assigned_lawyer || c.assigned_lawyer_id).length);
    
    allCases.value = casesData;
    lawyers.value = lawyersData;
  } catch (error) {
    console.error('Failed to load data:', error);
  }
  isLoading.value = false;
};

const setQuickFilter = (filter) => {
  if (quickFilter.value === filter) {
    quickFilter.value = '';
  } else {
    quickFilter.value = filter;
  }
  // Clear other filters when using quick filters
  if (quickFilter.value) {
    filters.value = {
      status: 'all',
      assignment: 'all',
      lawyer: 'all',
      clientStatus: 'all'
    };
  }
};

const openLawyerAssignment = (caseItem) => {
  selectedCaseForAssignment.value = caseItem;
  selectedLawyerId.value = caseItem.assigned_lawyer?.id || '';
  showLawyerAssignment.value = true;
};

const confirmLawyerAssignment = async () => {
  try {
    const lawyer = lawyers.value.find(l => l.id === selectedLawyerId.value);
    const caseId = selectedCaseForAssignment.value.id;
    
    console.log('Dialog assignment:', { caseId, lawyerId: selectedLawyerId.value, lawyer: lawyer?.full_name });
    
    await Case.update(caseId, {
      assigned_lawyer_id: selectedLawyerId.value
    });
    
    // Update the case locally immediately
    const caseIndex = allCases.value.findIndex(c => c.id === caseId);
    if (caseIndex !== -1) {
      allCases.value[caseIndex] = {
        ...allCases.value[caseIndex],
        assigned_lawyer: lawyer,
        assigned_lawyer_id: selectedLawyerId.value
      };
    }
    
    showLawyerAssignment.value = false;
    const caseName = selectedCaseForAssignment.value.title;
    selectedCaseForAssignment.value = null;
    selectedLawyerId.value = '';
    
    // Refresh from server after delay
    setTimeout(() => loadData(), 500);
    
    console.log('Dialog assignment successful');
  } catch (error) {
    console.error('Failed to assign lawyer:', error);
    alert('Failed to assign lawyer. Please try again.');
  }
};

const updateClientStatus = (caseItem) => {
  selectedCaseForStatus.value = caseItem;
  newClientStatus.value = caseItem.client_status || 'satisfied';
  showClientStatusUpdate.value = true;
};

const confirmClientStatusUpdate = async () => {
  try {
    await Case.update(selectedCaseForStatus.value.id, {
      client_status: newClientStatus.value
    });
    await loadData(); // Refresh data
    showClientStatusUpdate.value = false;
    selectedCaseForStatus.value = null;
  } catch (error) {
    console.error('Failed to update client status:', error);
    alert('Failed to update client status. Please try again.');
  }
};

const viewCase = (caseItem) => {
  router.push(`/case-details/${caseItem.id}`);
};

// Bulk assignment methods
const assignedCasesCount = (lawyerId) => {
  return displayedCases.value.filter(c => c.assigned_lawyer?.id === lawyerId).length;
};

const toggleSelectAll = () => {
  if (allSelected.value) {
    selectedCasesForBulk.value = [];
  } else {
    selectedCasesForBulk.value = unassignedCases.value.map(c => c.id);
  }
};

const quickAssignLawyer = async (caseId, lawyerId) => {
  if (!lawyerId) return;
  
  try {
    // Find lawyer name for confirmation message
    const lawyer = lawyers.value.find(l => l.id === lawyerId);
    const caseItem = allCases.value.find(c => c.id === caseId);
    
    console.log('Assigning lawyer:', { caseId, lawyerId, lawyer: lawyer?.full_name });
    
    // Make the server update first
    const updateResponse = await Case.update(caseId, { assigned_lawyer_id: lawyerId });
    console.log('Server update response:', updateResponse);
    
    // Reload data from server immediately to see what was saved
    await loadData();
    
    // Remove from bulk selection if it was selected
    selectedCasesForBulk.value = selectedCasesForBulk.value.filter(id => id !== caseId);
    
    console.log('Assignment completed - check if case still appears in unassigned list');
    
  } catch (error) {
    console.error('Failed to assign lawyer:', error);
    console.error('Error details:', error.response?.data || error.message);
    alert('Failed to assign lawyer. Please try again.');
  }
};

const bulkAssignUnassigned = async () => {
  if (!bulkAssignLawyer.value || selectedCasesForBulk.value.length === 0) return;
  
  const lawyer = lawyers.value.find(l => l.id === bulkAssignLawyer.value);
  const confirmed = confirm(`Assign ${selectedCasesForBulk.value.length} cases to ${lawyer?.full_name || 'selected lawyer'}?`);
  if (!confirmed) return;
  
  try {
    console.log('Bulk assignment:', { lawyerId: bulkAssignLawyer.value, caseIds: selectedCasesForBulk.value, lawyer: lawyer?.full_name });
    
    const promises = selectedCasesForBulk.value.map(caseId =>
      Case.update(caseId, { assigned_lawyer_id: bulkAssignLawyer.value })
    );
    
    await Promise.all(promises);
    
    // Update cases locally immediately
    selectedCasesForBulk.value.forEach(caseId => {
      const caseIndex = allCases.value.findIndex(c => c.id === caseId);
      if (caseIndex !== -1) {
        allCases.value[caseIndex] = {
          ...allCases.value[caseIndex],
          assigned_lawyer: lawyer,
          assigned_lawyer_id: bulkAssignLawyer.value
        };
      }
    });
    
    const assignedCount = promises.length;
    // Clear selections
    selectedCasesForBulk.value = [];
    bulkAssignLawyer.value = '';
    
    // Refresh from server after delay
    setTimeout(() => loadData(), 500);
    
    console.log('Bulk assignment successful');
  } catch (error) {
    console.error('Failed to bulk assign cases:', error);
    alert('Failed to assign some cases. Please try again.');
  }
};

// Utility functions
const formatDate = (date) => {
  if (!date) return 'N/A';
  try {
    return format(new Date(date), 'MMM d, yyyy');
  } catch {
    return 'Invalid date';
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case 'open': return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'in_progress': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    case 'closed': return 'bg-green-100 text-green-700 border-green-200';
    case 'on_hold': return 'bg-gray-100 text-gray-700 border-gray-200';
    case 'archived': return 'bg-purple-100 text-purple-700 border-purple-200';
    default: return 'bg-gray-100 text-gray-700 border-gray-200';
  }
};

const getClientStatusColor = (status) => {
  switch (status) {
    case 'satisfied': return 'bg-green-400';
    case 'needs_attention': return 'bg-yellow-400';
    case 'at_risk': return 'bg-red-400';
    default: return 'bg-green-400';
  }
};

// Lifecycle
onMounted(() => {
  loadData();
});
</script>