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
          Admin Case Management
        </h2>
        <p class="text-gray-600 mt-1">
          Oversee all cases, assign lawyers, and manage client statuses
        </p>
      </div>

      <!-- Admin Tools Section -->
      <div class="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h3 class="text-lg font-semibold text-gray-800">Case Administration</h3>
            <p class="text-sm text-gray-600 mt-1">Manage all cases across the system</p>
          </div>
          <div class="flex gap-3">
            <Button @click="showBulkActions = !showBulkActions" variant="outline" class="h-10">
              <Settings class="w-4 h-4 mr-2" />
              Bulk Actions
            </Button>
            <Dialog v-model:open="showNewCase">
              <DialogTrigger as-child>
                <Button class="bg-[#003aca] hover:bg-[#002a8a] text-white h-10">
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

        <!-- Bulk Actions Panel -->
        <div v-if="showBulkActions" class="mt-4 p-4 bg-gray-50 rounded-lg border">
          <div class="flex items-center gap-4 flex-wrap">
            <div class="flex items-center gap-2">
              <Checkbox v-model:checked="selectAll" @update:checked="toggleSelectAll" />
              <span class="text-sm font-medium">Select All ({{ selectedCases.length }} selected)</span>
            </div>
            <div class="flex gap-2">
              <Button 
                v-if="selectedCases.length > 0" 
                @click="bulkAssignLawyer" 
                size="sm" 
                variant="outline"
              >
                <UserCheck class="w-4 h-4 mr-1" />
                Assign Lawyer
              </Button>
              <Button 
                v-if="selectedCases.length > 0" 
                @click="bulkUpdateStatus" 
                size="sm" 
                variant="outline"
              >
                <Clock class="w-4 h-4 mr-1" />
                Update Status
              </Button>
            </div>
          </div>
        </div>
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
          <p class="text-2xl font-bold text-gray-900">{{ allCases.length }}</p>
          <p class="text-xs text-gray-500 mt-1">All system cases</p>
        </div>

        <div class="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
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
            <Select v-model="filters.status" class="min-w-[140px]">
              <option value="all">All Statuses</option>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="on_hold">On Hold</option>
              <option value="closed">Closed</option>
              <option value="archived">Archived</option>
            </Select>

            <!-- Assignment Filter -->
            <Select v-model="filters.assignment" class="min-w-[140px]">
              <option value="all">All Assignments</option>
              <option value="assigned">Assigned</option>
              <option value="unassigned">Unassigned</option>
            </Select>

            <!-- Lawyer Filter -->
            <Select v-model="filters.lawyer" class="min-w-[150px]">
              <option value="all">All Lawyers</option>
              <option 
                v-for="lawyer in lawyers" 
                :key="lawyer.id" 
                :value="lawyer.id"
              >
                {{ lawyer.full_name }}
              </option>
            </Select>

            <!-- Priority Filter -->
            <Select v-model="filters.priority" class="min-w-[120px]">
              <option value="all">All Priorities</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </Select>

            <!-- Client Status Filter -->
            <Select v-model="filters.clientStatus" class="min-w-[140px]">
              <option value="all">All Client Status</option>
              <option value="satisfied">Satisfied</option>
              <option value="needs_attention">Needs Attention</option>
              <option value="at_risk">At Risk</option>
            </Select>
          </div>
        </div>

        <!-- Quick Filters -->
        <div class="flex gap-2 flex-wrap">
          <Button
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
          <Button
            @click="setQuickFilter('overdue')"
            :variant="quickFilter === 'overdue' ? 'default' : 'outline'"
            size="sm"
          >
            <Clock class="w-4 h-4 mr-1" />
            Overdue ({{ overdueCases.length }})
          </Button>
          <Button
            @click="setQuickFilter('urgent')"
            :variant="quickFilter === 'urgent' ? 'default' : 'outline'"
            size="sm"
          >
            <Flame class="w-4 h-4 mr-1" />
            Urgent ({{ urgentCases.length }})
          </Button>
        </div>
      </div>

      <!-- Cases Table/Cards View -->
      <div class="bg-white rounded-lg border border-gray-200 shadow-sm">
        <!-- View Toggle -->
        <div class="p-4 border-b border-gray-200 flex items-center justify-between">
          <div class="flex items-center gap-4">
            <h3 class="font-semibold text-gray-800">
              Cases ({{ filteredCases.length }})
            </h3>
            <div v-if="selectedCases.length > 0" class="text-sm text-gray-600">
              {{ selectedCases.length }} selected
            </div>
          </div>
          <div class="flex items-center gap-2">
            <Button
              @click="viewMode = 'table'"
              :variant="viewMode === 'table' ? 'default' : 'outline'"
              size="sm"
            >
              <List class="w-4 h-4" />
            </Button>
            <Button
              @click="viewMode = 'cards'"
              :variant="viewMode === 'cards' ? 'default' : 'outline'"
              size="sm"
            >
              <Grid class="w-4 h-4" />
            </Button>
          </div>
        </div>

        <!-- Table View -->
        <div v-if="viewMode === 'table'" class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50/80 border-b border-gray-200">
              <tr>
                <th class="p-4 text-left">
                  <Checkbox v-model:checked="selectAll" @update:checked="toggleSelectAll" />
                </th>
                <th class="p-4 text-left font-semibold text-gray-800 text-sm">Case</th>
                <th class="p-4 text-left font-semibold text-gray-800 text-sm">Client</th>
                <th class="p-4 text-left font-semibold text-gray-800 text-sm">Lawyer</th>
                <th class="p-4 text-left font-semibold text-gray-800 text-sm">Status</th>
                <th class="p-4 text-left font-semibold text-gray-800 text-sm">Priority</th>
                <th class="p-4 text-left font-semibold text-gray-800 text-sm">Client Status</th>
                <th class="p-4 text-left font-semibold text-gray-800 text-sm">Last Update</th>
                <th class="p-4 text-right font-semibold text-gray-800 text-sm">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-if="filteredCases.length === 0">
                <td colspan="9" class="p-8 text-center text-gray-500">
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
                :class="{ 'bg-blue-50/20': selectedCases.includes(caseItem.id) }"
              >
                <td class="p-4">
                  <Checkbox 
                    :checked="selectedCases.includes(caseItem.id)"
                    @update:checked="(checked) => toggleCaseSelection(caseItem.id, checked)"
                  />
                </td>
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
                    <p class="font-medium text-gray-900">{{ caseItem.assigned_lawyer.full_name }}</p>
                    <p class="text-sm text-gray-500">{{ caseItem.assigned_lawyer.email }}</p>
                  </div>
                  <div v-else class="flex items-center gap-2">
                    <Badge class="bg-red-100 text-red-700 border-red-200">Unassigned</Badge>
                    <Button 
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
                  <Badge :class="getPriorityColor(caseItem.priority)" class="border">
                    {{ caseItem.priority?.toUpperCase() || 'MEDIUM' }}
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
                      @click="editCase(caseItem)" 
                      size="sm" 
                      variant="ghost"
                      class="h-8 w-8 p-0"
                    >
                      <Edit class="w-4 h-4" />
                    </Button>
                    <Button 
                      @click="openCaseActions(caseItem)" 
                      size="sm" 
                      variant="ghost"
                      class="h-8 w-8 p-0"
                    >
                      <MoreVertical class="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Cards View -->
        <div v-else class="p-6">
          <div v-if="filteredCases.length === 0" class="text-center py-12">
            <div class="inline-block p-4 bg-gray-100 rounded-full mb-4">
              <FileText class="w-12 h-12 text-gray-400" />
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">No cases found</h3>
            <p class="text-gray-500 mb-6">Try adjusting your filters or search criteria</p>
          </div>
          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AdminCaseCard
              v-for="caseItem in filteredCases"
              :key="caseItem.id"
              :case-data="caseItem"
              :is-selected="selectedCases.includes(caseItem.id)"
              :lawyers="lawyers"
              @select="(checked) => toggleCaseSelection(caseItem.id, checked)"
              @assign-lawyer="handleLawyerAssignment"
              @update-status="handleStatusUpdate"
              @update-client-status="updateClientStatus"
              @view="viewCase"
              @edit="editCase"
            />
          </div>
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
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Notes (optional):
            </label>
            <textarea
              v-model="clientStatusNotes"
              class="w-full p-3 border border-gray-300 rounded-md"
              rows="3"
              placeholder="Add any notes about the client status..."
            ></textarea>
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

    <!-- Case Details Modal -->
    <AdminCaseDetailsModal
      v-model:open="showCaseDetailsModal"
      :case-data="selectedCaseForView"
      @assign-lawyer="handleModalAssignLawyer"
      @edit="handleModalEdit"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { format } from 'date-fns';
import { Case, User } from '@/services/entities';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Scale, Plus, Settings, Search, FileText, AlertTriangle, Clock, 
  TrendingUp, AlertCircle, CheckCircle, UserCheck, Edit, Eye, 
  MoreVertical, List, Grid, Flame
} from 'lucide-vue-next';
import NewCaseForm from '@/components/cases/NewCaseForm.vue';
import AdminCaseCard from '@/components/admin/AdminCaseCard.vue';
import AdminCaseDetailsModal from '@/components/admin/AdminCaseDetailsModal.vue';

const router = useRouter();

// Reactive data
const isLoading = ref(true);
const allCases = ref([]);
const lawyers = ref([]);
const user = ref(null);
const searchQuery = ref('');
const viewMode = ref('table');
const quickFilter = ref('');
const showBulkActions = ref(false);
const showNewCase = ref(false);
const showLawyerAssignment = ref(false);
const showClientStatusUpdate = ref(false);
const showCaseDetailsModal = ref(false);
const selectedCaseForView = ref(null);
const selectedCases = ref([]);
const selectAll = ref(false);

// Assignment/Status update state
const selectedCaseForAssignment = ref(null);
const selectedCaseForStatus = ref(null);
const selectedLawyerId = ref('');
const newClientStatus = ref('satisfied');
const clientStatusNotes = ref('');

// Filters
const filters = ref({
  status: 'all',
  assignment: 'all',
  lawyer: 'all',
  priority: 'all',
  clientStatus: 'all'
});

// Computed properties
const unassignedCases = computed(() => 
  allCases.value.filter(c => !c.assigned_lawyer)
);

const openCases = computed(() => 
  allCases.value.filter(c => c.status === 'open')
);

const inProgressCases = computed(() => 
  allCases.value.filter(c => c.status === 'in_progress')
);

const closedCases = computed(() => 
  allCases.value.filter(c => c.status === 'closed')
);

const clientIssues = computed(() => 
  allCases.value.filter(c => c.client_status === 'needs_attention' || c.client_status === 'at_risk')
);

const overdueCases = computed(() => 
  allCases.value.filter(c => {
    if (!c.due_date) return false;
    return new Date(c.due_date) < new Date();
  })
);

const urgentCases = computed(() => 
  allCases.value.filter(c => c.priority === 'urgent')
);

const filteredCases = computed(() => {
  let filtered = [...allCases.value];

  // Apply quick filter first
  if (quickFilter.value === 'unassigned') {
    filtered = unassignedCases.value;
  } else if (quickFilter.value === 'client_issues') {
    filtered = clientIssues.value;
  } else if (quickFilter.value === 'overdue') {
    filtered = overdueCases.value;
  } else if (quickFilter.value === 'urgent') {
    filtered = urgentCases.value;
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

  // Priority filter
  if (filters.value.priority !== 'all') {
    filtered = filtered.filter(c => c.priority === filters.value.priority);
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
    const [userData, casesData, lawyersData] = await Promise.all([
      User.me(),
      Case.list('-updated_date'),
      User.list().then(users => users.filter(u => u.user_type === 'lawyer'))
    ]);
    
    user.value = userData;
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
      priority: 'all',
      clientStatus: 'all'
    };
  }
};

const toggleSelectAll = (checked) => {
  if (checked) {
    selectedCases.value = filteredCases.value.map(c => c.id);
  } else {
    selectedCases.value = [];
  }
};

const toggleCaseSelection = (caseId, checked) => {
  if (checked) {
    selectedCases.value.push(caseId);
  } else {
    selectedCases.value = selectedCases.value.filter(id => id !== caseId);
  }
  selectAll.value = selectedCases.value.length === filteredCases.value.length;
};

const openLawyerAssignment = (caseItem) => {
  selectedCaseForAssignment.value = caseItem;
  // Get the first owner (lawyer) if exists
  const currentOwner = caseItem.owners && caseItem.owners.length > 0 ? caseItem.owners[0] : null;
  selectedLawyerId.value = currentOwner?.id || '';
  showLawyerAssignment.value = true;
};

const confirmLawyerAssignment = async () => {
  try {
    // Assign lawyer by adding them to owners array
    await Case.update(selectedCaseForAssignment.value.id, {
      owner_ids: [selectedLawyerId.value]
    });
    await loadData(); // Refresh data
    showLawyerAssignment.value = false;
    selectedCaseForAssignment.value = null;
    selectedLawyerId.value = '';
    alert('Lawyer assigned successfully!');
  } catch (error) {
    console.error('Failed to assign lawyer:', error);
    alert('Failed to assign lawyer. Please try again.');
  }
};

const updateClientStatus = (caseItem) => {
  selectedCaseForStatus.value = caseItem;
  newClientStatus.value = caseItem.client_status || 'satisfied';
  clientStatusNotes.value = '';
  showClientStatusUpdate.value = true;
};

const confirmClientStatusUpdate = async () => {
  try {
    await Case.update(selectedCaseForStatus.value.id, {
      client_status: newClientStatus.value,
      client_status_notes: clientStatusNotes.value
    });
    await loadData(); // Refresh data
    showClientStatusUpdate.value = false;
    selectedCaseForStatus.value = null;
  } catch (error) {
    console.error('Failed to update client status:', error);
    alert('Failed to update client status. Please try again.');
  }
};

const handleNewCase = async (caseData) => {
  try {
    await Case.create(caseData);
    await loadData(); // Refresh data
    showNewCase.value = false;
  } catch (error) {
    console.error('Failed to create case:', error);
    alert('Failed to create case. Please try again.');
  }
};

const handleLawyerAssignment = (caseData) => {
  openLawyerAssignment(caseData.case);
};

const handleStatusUpdate = async (data) => {
  try {
    await Case.update(data.case.id, { status: data.status });
    await loadData();
  } catch (error) {
    console.error('Failed to update status:', error);
  }
};

const viewCase = (caseItem) => {
  selectedCaseForView.value = caseItem;
  showCaseDetailsModal.value = true;
};

const editCase = (caseItem) => {
  // Navigate to edit case or open edit dialog
  router.push(`/case-details/${caseItem.id}?mode=edit`);
};

const handleModalAssignLawyer = (caseItem) => {
  showCaseDetailsModal.value = false;
  openLawyerAssignment(caseItem);
};

const handleModalEdit = (caseItem) => {
  showCaseDetailsModal.value = false;
  editCase(caseItem);
};

const openCaseActions = (caseItem) => {
  // Show context menu or actions dropdown
  console.log('Open actions for case:', caseItem);
};

const bulkAssignLawyer = () => {
  console.log('Bulk assign lawyer to:', selectedCases.value);
};

const bulkUpdateStatus = () => {
  console.log('Bulk update status for:', selectedCases.value);
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

const getPriorityColor = (priority) => {
  switch (priority) {
    case 'urgent': return 'bg-red-100 text-red-700 border-red-200';
    case 'high': return 'bg-orange-100 text-orange-700 border-orange-200';
    case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    case 'low': return 'bg-green-100 text-green-700 border-green-200';
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

// Watchers
watch(selectedCases, (newVal) => {
  selectAll.value = newVal.length > 0 && newVal.length === filteredCases.value.length;
});

watch(quickFilter, () => {
  selectedCases.value = [];
  selectAll.value = false;
});

// Lifecycle
onMounted(() => {
  loadData();
});
</script>