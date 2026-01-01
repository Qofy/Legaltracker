<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h2 class="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <svg class="w-7 h-7 text-[#003aca]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Reports
        </h2>
        <p class="text-gray-500 mt-1">Generate reports for your assigned cases</p>
      </div>
      <button @click="generateReport" class="px-4 py-2 bg-[#003aca] text-white rounded-md hover:bg-[#0031a0] text-sm font-medium">
        Generate Report
      </button>
    </div>

    <!-- Report Type Selection -->
    <div class="bg-white rounded-lg border border-gray-200 p-6">
      <h3 class="text-lg font-semibold text-gray-800 mb-4">Select Report Type</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          @click="selectedReportType = 'case-progress'"
          :class="[
            'p-4 border-2 rounded-lg text-left transition',
            selectedReportType === 'case-progress' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
          ]"
        >
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div>
              <h4 class="font-semibold text-gray-900">Case Progress</h4>
              <p class="text-sm text-gray-600">Detailed case status</p>
            </div>
          </div>
        </button>

        <button
          @click="selectedReportType = 'client-summary'"
          :class="[
            'p-4 border-2 rounded-lg text-left transition',
            selectedReportType === 'client-summary' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
          ]"
        >
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <h4 class="font-semibold text-gray-900">Client Summary</h4>
              <p class="text-sm text-gray-600">Client-facing report</p>
            </div>
          </div>
        </button>

        <button
          @click="selectedReportType = 'performance'"
          :class="[
            'p-4 border-2 rounded-lg text-left transition',
            selectedReportType === 'performance' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
          ]"
        >
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h4 class="font-semibold text-gray-900">Performance</h4>
              <p class="text-sm text-gray-600">Your metrics</p>
            </div>
          </div>
        </button>
      </div>
    </div>

    <!-- Report Filters -->
    <div class="bg-white rounded-lg border border-gray-200 p-6">
      <h3 class="text-lg font-semibold text-gray-800 mb-4">Report Filters</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Case</label>
          <select v-model="filters.caseId" class="w-full px-3 py-2 border border-gray-300 rounded-md">
            <option value="">All Cases</option>
            <option v-for="c in cases" :key="c.id" :value="c.id">{{ c.title }}</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
          <select v-model="filters.dateRange" class="w-full px-3 py-2 border border-gray-300 rounded-md">
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="quarter">Last Quarter</option>
            <option value="year">Last Year</option>
            <option value="all">All Time</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select v-model="filters.status" class="w-full px-3 py-2 border border-gray-300 rounded-md">
            <option value="">All Statuses</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="closed">Closed</option>
            <option value="on_hold">On Hold</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Report Preview -->
    <div v-if="selectedReportType" class="bg-white rounded-lg border border-gray-200 p-6">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-lg font-semibold text-gray-800">Report Preview</h3>
        <div class="flex items-center gap-2">
          <button class="px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50">
            Export PDF
          </button>
          <button class="px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50">
            Export Excel
          </button>
        </div>
      </div>

      <!-- Case Progress Report -->
      <div v-if="selectedReportType === 'case-progress'" class="space-y-6">
        <div>
          <h4 class="font-semibold text-gray-900 mb-3">Case Overview</h4>
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div class="p-4 bg-gray-50 rounded-lg">
              <p class="text-sm text-gray-600">Total Cases</p>
              <p class="text-2xl font-bold text-gray-900 mt-1">{{ reportData.totalCases }}</p>
            </div>
            <div class="p-4 bg-blue-50 rounded-lg">
              <p class="text-sm text-gray-600">Active Cases</p>
              <p class="text-2xl font-bold text-blue-900 mt-1">{{ reportData.activeCases }}</p>
            </div>
            <div class="p-4 bg-green-50 rounded-lg">
              <p class="text-sm text-gray-600">Closed Cases</p>
              <p class="text-2xl font-bold text-green-900 mt-1">{{ reportData.closedCases }}</p>
            </div>
            <div class="p-4 bg-yellow-50 rounded-lg">
              <p class="text-sm text-gray-600">Success Rate</p>
              <p class="text-2xl font-bold text-yellow-900 mt-1">{{ reportData.successRate }}%</p>
            </div>
          </div>
        </div>

        <div>
          <h4 class="font-semibold text-gray-900 mb-3">Cases by Status</h4>
          <div class="space-y-2">
            <div v-for="status in ['open', 'in_progress', 'on_hold', 'closed']" :key="status" class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span class="text-sm font-medium text-gray-700 capitalize">{{ status.replace('_', ' ') }}</span>
              <div class="flex items-center gap-3">
                <span class="text-sm font-semibold text-gray-900">{{ getCaseCountByStatus(status) }}</span>
                <div class="w-32 bg-gray-200 rounded-full h-2">
                  <div :class="['h-2 rounded-full', getStatusColor(status)]" :style="`width: ${getStatusPercentage(status)}%`"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h4 class="font-semibold text-gray-900 mb-3">Recent Case Activities</h4>
          <div class="space-y-2">
            <div v-for="activity in recentActivities" :key="activity.id" class="p-3 border border-gray-200 rounded-lg">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-900">{{ activity.case_title }}</p>
                  <p class="text-xs text-gray-600 mt-1">{{ activity.description }}</p>
                </div>
                <span class="text-xs text-gray-500">{{ formatDate(activity.date) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Client Summary Report -->
      <div v-else-if="selectedReportType === 'client-summary'" class="space-y-6">
        <div class="border-b border-gray-200 pb-4">
          <h4 class="text-xl font-bold text-gray-900">Client Summary Report</h4>
          <p class="text-sm text-gray-600 mt-1">Generated on {{ formatDate(new Date()) }}</p>
        </div>

        <div>
          <h4 class="font-semibold text-gray-900 mb-3">Case Summary</h4>
          <div class="space-y-3">
            <div v-for="caseItem in filteredCases" :key="caseItem.id" class="p-4 border border-gray-200 rounded-lg">
              <div class="flex items-start justify-between">
                <div>
                  <h5 class="font-semibold text-gray-900">{{ caseItem.title }}</h5>
                  <p class="text-sm text-gray-600 mt-1">Case #{{ caseItem.case_number }}</p>
                  <div class="flex items-center gap-2 mt-2">
                    <span :class="['px-2 py-1 rounded text-xs font-medium', getStatusBadge(caseItem.status)]">
                      {{ caseItem.status }}
                    </span>
                    <span class="text-xs text-gray-600">Last updated: {{ formatDate(caseItem.updated_date) }}</span>
                  </div>
                </div>
              </div>
              <p class="text-sm text-gray-700 mt-3">{{ caseItem.description || 'No description available' }}</p>
            </div>
          </div>
        </div>

        <div>
          <h4 class="font-semibold text-gray-900 mb-3">Next Steps</h4>
          <ul class="list-disc list-inside space-y-2 text-sm text-gray-700">
            <li>Review upcoming deadlines and court dates</li>
            <li>Prepare necessary documentation</li>
            <li>Schedule follow-up consultation</li>
          </ul>
        </div>
      </div>

      <!-- Performance Report -->
      <div v-else-if="selectedReportType === 'performance'" class="space-y-6">
        <div>
          <h4 class="font-semibold text-gray-900 mb-3">Performance Metrics</h4>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="p-4 bg-gray-50 rounded-lg">
              <p class="text-sm text-gray-600">Cases Handled</p>
              <p class="text-2xl font-bold text-gray-900 mt-1">{{ reportData.totalCases }}</p>
              <p class="text-xs text-green-600 mt-1">+12% from last period</p>
            </div>
            <div class="p-4 bg-gray-50 rounded-lg">
              <p class="text-sm text-gray-600">Avg. Case Duration</p>
              <p class="text-2xl font-bold text-gray-900 mt-1">45 days</p>
              <p class="text-xs text-green-600 mt-1">-8% from last period</p>
            </div>
            <div class="p-4 bg-gray-50 rounded-lg">
              <p class="text-sm text-gray-600">Client Satisfaction</p>
              <p class="text-2xl font-bold text-gray-900 mt-1">4.8/5.0</p>
              <p class="text-xs text-green-600 mt-1">+0.2 from last period</p>
            </div>
          </div>
        </div>

        <div>
          <h4 class="font-semibold text-gray-900 mb-3">Case Type Distribution</h4>
          <div class="space-y-2">
            <div v-for="type in caseTypes" :key="type.name" class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span class="text-sm font-medium text-gray-700">{{ type.name }}</span>
              <div class="flex items-center gap-3">
                <span class="text-sm font-semibold text-gray-900">{{ type.count }}</span>
                <div class="w-32 bg-gray-200 rounded-full h-2">
                  <div class="bg-blue-600 h-2 rounded-full" :style="`width: ${type.percentage}%`"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { Case } from '@/services/entities';
import { useAuthStore } from '@/stores/auth';
import { format } from 'date-fns';

const authStore = useAuthStore();

const selectedReportType = ref('case-progress');
const filters = ref({
  caseId: '',
  dateRange: 'month',
  status: '',
});

const cases = ref([]);
const recentActivities = ref([]);

const reportData = ref({
  totalCases: 0,
  activeCases: 0,
  closedCases: 0,
  successRate: 0,
});

const caseTypes = ref([
  { name: 'Civil', count: 12, percentage: 40 },
  { name: 'Criminal', count: 8, percentage: 27 },
  { name: 'Family', count: 6, percentage: 20 },
  { name: 'Corporate', count: 4, percentage: 13 },
]);

const filteredCases = computed(() => {
  let filtered = cases.value;

  if (filters.value.caseId) {
    filtered = filtered.filter(c => c.id === filters.value.caseId);
  }

  if (filters.value.status) {
    filtered = filtered.filter(c => c.status === filters.value.status);
  }

  return filtered;
});

const loadReportData = async () => {
  try {
    const userId = authStore.user?.id;
    if (!userId) return;

    cases.value = await Case.filter({ lawyer_id: userId });

    reportData.value.totalCases = cases.value.length;
    reportData.value.activeCases = cases.value.filter(c => c.status === 'open' || c.status === 'in_progress').length;
    reportData.value.closedCases = cases.value.filter(c => c.status === 'closed').length;
    reportData.value.successRate = reportData.value.totalCases > 0
      ? Math.round((reportData.value.closedCases / reportData.value.totalCases) * 100)
      : 0;

    // Mock recent activities
    recentActivities.value = [
      { id: 1, case_title: 'Case #12345', description: 'Status updated to In Progress', date: new Date() },
      { id: 2, case_title: 'Case #12346', description: 'New document uploaded', date: new Date(Date.now() - 86400000) },
      { id: 3, case_title: 'Case #12347', description: 'Meeting scheduled', date: new Date(Date.now() - 172800000) },
    ];
  } catch (error) {
    console.error('Failed to load report data:', error);
  }
};

const getCaseCountByStatus = (status) => {
  return cases.value.filter(c => c.status === status).length;
};

const getStatusPercentage = (status) => {
  if (reportData.value.totalCases === 0) return 0;
  return Math.round((getCaseCountByStatus(status) / reportData.value.totalCases) * 100);
};

const getStatusColor = (status) => {
  switch (status) {
    case 'open': return 'bg-blue-600';
    case 'in_progress': return 'bg-yellow-600';
    case 'closed': return 'bg-green-600';
    case 'on_hold': return 'bg-gray-600';
    default: return 'bg-gray-600';
  }
};

const getStatusBadge = (status) => {
  switch (status) {
    case 'open': return 'bg-blue-100 text-blue-700';
    case 'in_progress': return 'bg-yellow-100 text-yellow-700';
    case 'closed': return 'bg-green-100 text-green-700';
    case 'on_hold': return 'bg-gray-100 text-gray-700';
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

const generateReport = () => {
  alert('Report generation feature will be implemented with PDF/Excel export functionality');
};

onMounted(() => {
  loadReportData();
});
</script>
