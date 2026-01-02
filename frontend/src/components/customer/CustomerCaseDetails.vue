<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h2 class="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <svg class="w-7 h-7 text-[#003aca]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          My Case Details
        </h2>
        <p class="text-gray-500 mt-1">View your case information and progress</p>
      </div>
    </div>

    <!-- Case Selection (if multiple cases) -->
    <div v-if="myCases.length > 1" class="bg-white rounded-lg border border-gray-200 p-4">
      <label class="block text-sm font-medium text-gray-700 mb-2">Select Case</label>
      <select v-model="selectedCaseId" @change="loadCaseDetails" class="w-full md:w-96 px-3 py-2 border border-gray-300 rounded-md">
        <option v-for="c in myCases" :key="c.id" :value="c.id">
          {{ c.title }} - #{{ c.case_number }}
        </option>
      </select>
    </div>

    <!-- Case Information -->
    <div v-if="selectedCase" class="bg-white rounded-lg border border-gray-200 p-6">
      <div class="flex items-start justify-between mb-6">
        <div>
          <h3 class="text-2xl font-bold text-gray-900">{{ selectedCase.title }}</h3>
          <p class="text-sm text-gray-600 mt-1">Case #{{ selectedCase.case_number }}</p>
        </div>
        <span :class="['px-3 py-1 rounded-full text-sm font-medium', getStatusBadge(selectedCase.status)]">
          {{ selectedCase.status }}
        </span>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <div>
          <p class="text-sm text-gray-600 mb-1">Case Type</p>
          <p class="font-semibold text-gray-900 capitalize">{{ selectedCase.case_type || 'Civil' }}</p>
        </div>
        <div>
          <p class="text-sm text-gray-600 mb-1">Priority</p>
          <span :class="['px-2 py-1 rounded text-sm font-medium', getPriorityBadge(selectedCase.priority)]">
            {{ selectedCase.priority }}
          </span>
        </div>
        <div>
          <p class="text-sm text-gray-600 mb-1">Filing Date</p>
          <p class="font-semibold text-gray-900">{{ formatDate(selectedCase.filing_date) }}</p>
        </div>
        <div>
          <p class="text-sm text-gray-600 mb-1">Last Updated</p>
          <p class="font-semibold text-gray-900">{{ formatDate(selectedCase.updated_date) }}</p>
        </div>
        <div>
          <p class="text-sm text-gray-600 mb-1">Court</p>
          <p class="font-semibold text-gray-900">{{ selectedCase.court || 'Not specified' }}</p>
        </div>
        <div>
          <p class="text-sm text-gray-600 mb-1">Judge</p>
          <p class="font-semibold text-gray-900">{{ selectedCase.judge || 'Not assigned' }}</p>
        </div>
      </div>

      <div class="border-t border-gray-200 pt-4">
        <p class="text-sm text-gray-600 mb-2">Description</p>
        <p class="text-gray-900">{{ selectedCase.description || 'No description available' }}</p>
      </div>
    </div>

    <!-- Lawyer Information -->
    <div v-if="selectedCase" class="bg-white rounded-lg border border-gray-200 p-6">
      <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <svg class="w-5 h-5 text-[#003aca]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        Your Lawyer
      </h3>
      <div class="flex items-start gap-4">
        <div class="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
          <svg class="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <div class="flex-1">
          <h4 class="font-semibold text-gray-900">{{ lawyerInfo.name || 'Not assigned' }}</h4>
          <p class="text-sm text-gray-600 mt-1">{{ lawyerInfo.email || 'N/A' }}</p>
          <p class="text-sm text-gray-600">{{ lawyerInfo.phone || 'N/A' }}</p>
          <div v-if="lawyerInfo.specializations" class="flex items-center gap-2 mt-2">
            <span v-for="spec in lawyerInfo.specializations.split(',').slice(0, 3)" :key="spec" class="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
              {{ spec.trim() }}
            </span>
          </div>
        </div>
        <button class="px-4 py-2 bg-[#003aca] text-white rounded-md text-sm font-medium hover:bg-[#0031a0]">
          Send Message
        </button>
      </div>
    </div>

    <!-- Case Timeline -->
    <div v-if="selectedCase" class="bg-white rounded-lg border border-gray-200 p-6">
      <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <svg class="w-5 h-5 text-[#003aca]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Case Timeline
      </h3>
      <div class="relative">
        <div class="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
        <div class="space-y-6">
          <div v-if="timeline.length === 0" class="text-center py-8 text-gray-500">
            <p class="text-sm">No timeline events yet</p>
          </div>
          <div v-else v-for="event in timeline" :key="event.id" class="relative pl-10">
            <div class="absolute left-2 top-1 w-4 h-4 rounded-full bg-blue-600 border-4 border-white"></div>
            <div class="bg-gray-50 rounded-lg p-4">
              <div class="flex items-start justify-between">
                <div>
                  <h4 class="font-semibold text-gray-900">{{ event.title }}</h4>
                  <p class="text-sm text-gray-600 mt-1">{{ event.description }}</p>
                </div>
                <span class="text-xs text-gray-500">{{ formatDate(event.date) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Upcoming Deadlines -->
    <div v-if="selectedCase" class="bg-white rounded-lg border border-gray-200 p-6">
      <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <svg class="w-5 h-5 text-[#003aca]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        Important Dates & Deadlines
      </h3>
      <div class="space-y-3">
        <div v-if="deadlines.length === 0" class="text-center py-8 text-gray-500">
          <p class="text-sm">No upcoming deadlines</p>
        </div>
        <div v-else v-for="deadline in deadlines" :key="deadline.id" class="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div class="flex items-center gap-3">
            <div :class="['w-12 h-12 rounded-lg flex items-center justify-center', isOverdue(deadline.due_date) ? 'bg-red-100' : 'bg-blue-100']">
              <svg :class="['w-6 h-6', isOverdue(deadline.due_date) ? 'text-red-600' : 'text-blue-600']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h4 class="font-semibold text-gray-900">{{ deadline.title }}</h4>
              <p class="text-sm text-gray-600">{{ deadline.description }}</p>
            </div>
          </div>
          <div class="text-right">
            <p :class="['font-semibold', isOverdue(deadline.due_date) ? 'text-red-600' : 'text-gray-900']">
              {{ formatDate(deadline.due_date) }}
            </p>
            <p class="text-xs text-gray-500">{{ deadline.type }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Case, User, ActionItem } from '@/services/entities';
import { useAuthStore } from '@/stores/auth';
import { format } from 'date-fns';

const authStore = useAuthStore();

const myCases = ref([]);
const selectedCaseId = ref('');
const selectedCase = ref(null);
const lawyerInfo = ref({});
const timeline = ref([]);
const deadlines = ref([]);

const loadMyCases = async () => {
  try {
    const userId = authStore.user?.id;
    if (!userId) return;

    const allCases = await Case.list();
    myCases.value = allCases.filter(c =>
      c.customer_ids && Array.isArray(c.customer_ids) && c.customer_ids.includes(userId)
    );

    if (myCases.value.length > 0) {
      selectedCaseId.value = myCases.value[0].id;
      await loadCaseDetails();
    }
  } catch (error) {
    console.error('Failed to load cases:', error);
  }
};

const loadCaseDetails = async () => {
  try {
    if (!selectedCaseId.value) return;

    selectedCase.value = myCases.value.find(c => c.id === selectedCaseId.value);

    if (selectedCase.value) {
      // Load lawyer information
      if (selectedCase.value.lawyer_id) {
        try {
          const lawyer = await User.get(selectedCase.value.lawyer_id);
          lawyerInfo.value = {
            name: lawyer.full_name,
            email: lawyer.email,
            phone: lawyer.phone,
            specializations: lawyer.specializations,
          };
        } catch (error) {
          console.error('Failed to load lawyer info:', error);
          lawyerInfo.value = { name: 'Not assigned' };
        }
      }

      // Build timeline from case data and comments
      timeline.value = [];

      // Add case filing
      if (selectedCase.value.filing_date) {
        timeline.value.push({
          id: 'filed',
          title: 'Case Filed',
          description: 'Your case has been officially filed',
          date: selectedCase.value.filing_date
        });
      }

      // Add case creation
      timeline.value.push({
        id: 'created',
        title: 'Case Created',
        description: lawyerInfo.value.name ? `Case assigned to ${lawyerInfo.value.name}` : 'Case created in system',
        date: selectedCase.value.created_date
      });

      // Add status updates
      if (selectedCase.value.updated_date && selectedCase.value.updated_date !== selectedCase.value.created_date) {
        timeline.value.push({
          id: 'updated',
          title: 'Status Updated',
          description: `Case status changed to ${selectedCase.value.status}`,
          date: selectedCase.value.updated_date
        });
      }

      // TODO: Add comments and other activities to timeline when comment API is integrated

      // Sort timeline by date (newest first)
      timeline.value.sort((a, b) => new Date(b.date) - new Date(a.date));

      // Load deadlines
      const allTasks = await ActionItem.list();
      deadlines.value = allTasks
        .filter(t => t.case_id === selectedCaseId.value && t.due_date)
        .map(t => ({
          id: t.id,
          title: t.title,
          description: t.description || 'No description',
          due_date: t.due_date,
          type: t.action_type || 'Task',
        }))
        .sort((a, b) => new Date(a.due_date) - new Date(b.due_date));
    }
  } catch (error) {
    console.error('Failed to load case details:', error);
  }
};

const getStatusBadge = (status) => {
  switch (status) {
    case 'open': return 'bg-blue-100 text-blue-700 border border-blue-200';
    case 'in_progress': return 'bg-yellow-100 text-yellow-700 border border-yellow-200';
    case 'closed': return 'bg-green-100 text-green-700 border border-green-200';
    case 'on_hold': return 'bg-gray-100 text-gray-700 border border-gray-200';
    default: return 'bg-gray-100 text-gray-700 border border-gray-200';
  }
};

const getPriorityBadge = (priority) => {
  switch (priority) {
    case 'urgent': return 'bg-red-100 text-red-700';
    case 'high': return 'bg-orange-100 text-orange-700';
    case 'medium': return 'bg-yellow-100 text-yellow-700';
    case 'low': return 'bg-green-100 text-green-700';
    default: return 'bg-gray-100 text-gray-700';
  }
};

const formatDate = (date) => {
  try {
    return format(new Date(date), 'MMM d, yyyy');
  } catch (e) {
    return '';
  }
};

const isOverdue = (date) => {
  return new Date(date) < new Date();
};

onMounted(() => {
  loadMyCases();
});
</script>
