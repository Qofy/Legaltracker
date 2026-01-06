<template>
  <div class="space-y-6">
    <!-- Task Report Modal (moved here to keep inside root) -->
    <div v-if="showTaskReportModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click.self="showTaskReportModal = false">
      <div class="bg-white rounded-lg p-6 max-w-lg w-full">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">Report on Task</h3>
        <div v-if="taskToReport" class="space-y-3">
          <p class="text-sm text-gray-600">Reporting for: <strong>{{ taskToReport.title }}</strong></p>
          <p class="text-xs text-gray-500">Case: {{ cases.find(c => c.id === taskToReport.case_id)?.title || '—' }}</p>
          <label class="block text-sm font-medium text-gray-700 mt-3 mb-1">Report</label>
          <textarea v-model="taskReportContent" rows="6" class="w-full px-3 py-2 border border-gray-300 rounded-md"></textarea>
          <div class="flex justify-end gap-3 mt-4">
            <button @click="showTaskReportModal = false" class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">Cancel</button>
            <button @click="sendTaskReport" class="px-4 py-2 bg-[#003aca] text-white rounded-md hover:bg-[#0031a0]">Send Report</button>
          </div>
        </div>
        <div v-else class="text-sm text-gray-500">No task selected.</div>
      </div>
    </div>
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

      <!-- Task Reports (Lawyer -> Admin) -->
      <div class="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-800">Task Reports</h3>
          <p class="text-sm text-gray-500">Send a report about a task to admin</p>
        </div>

        <div v-if="assignedTasks.length === 0" class="text-sm text-gray-500">No tasks found to report on.</div>

        <div v-else class="space-y-3">
          <div v-for="t in assignedTasks" :key="t.id" class="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
            <div>
              <div class="font-medium text-gray-900">{{ t.title }}</div>
              <div class="text-xs text-gray-500">{{ t.case_title }} • Due: {{ formatDate(t.due_date) }}</div>
            </div>
            <div>
              <button @click="openTaskReportModal(t)" class="px-3 py-1 bg-[#003aca] text-white rounded text-sm">Report</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Report Preview -->
    <div v-if="selectedReportType" class="bg-white rounded-lg border border-gray-200 p-6">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-lg font-semibold text-gray-800">Report Preview</h3>
        <div class="flex items-center gap-2">
          <button @click="exportPDF" class="px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50">
              Export PDF
          </button>
            <button @click="exportExcel" class="px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50">
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
   <!-- Export & Save Section -->
            <div class="bg-white rounded-lg border border-gray-200 p-6 mt-6">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-semibold text-gray-800">Export & Save</h3>
                <p class="text-sm text-gray-500">Save this report as a PDF or Excel file</p>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="md:col-span-2">
                  <label class="block text-sm font-medium text-gray-700 mb-2">File name</label>
                  <input v-model="exportFilename" type="text" placeholder="report" class="w-full px-3 py-2 border border-gray-300 rounded-md" />
                  <p class="text-xs text-gray-500 mt-2">Leave empty to use the default filename.</p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Include</label>
                  <div class="flex flex-col gap-2">
                    <label class="text-sm"><input type="checkbox" v-model="includeCaseDetails" class="mr-2"> Case details</label>
                    <label class="text-sm"><input type="checkbox" v-model="includeRecentActivities" class="mr-2"> Recent activities</label>
                  </div>
                </div>
              </div>

              <div class="flex items-center gap-3 mt-4">
                <button @click="savePDF" class="px-4 py-2 bg-[#003aca] text-white rounded-md hover:bg-[#0031a0]">Save PDF</button>
                <button @click="saveExcel" class="px-4 py-2 border border-gray-300 rounded-md">Save Excel</button>
                <div class="text-sm text-gray-500">If advanced exports fail, allow popups or install optional libs (SheetJS/jsPDF).</div>
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
import { Case, ActionItem } from '@/services/entities';
import { useAuthStore } from '@/stores/auth';
import { format } from 'date-fns';
import { useToast } from '@/components/ui/use-toast';
import api from '@/plugins/axios';

const authStore = useAuthStore();

const selectedReportType = ref('case-progress');
const filters = ref({
  caseId: '',
  dateRange: 'month',
  status: '',
});

const cases = ref([]);
const recentActivities = ref([]);
const assignedTasks = ref([]);

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
  // Build HTML for the selected report and open in a print-friendly window.
  try {
    const html = buildReportHTML();
    const w = window.open('', '_blank');
    if (!w) {
      alert('Popup blocked. Please allow popups for this site to generate the report.');
      return;
    }
    w.document.open();
    w.document.write(html);
    w.document.close();
    // Give the new window a moment to render, then focus it.
    setTimeout(() => {
      try { w.focus(); } catch (e) {}
    }, 300);
  } catch (e) {
    console.error('Failed to generate report', e);
    alert('Failed to generate report');
  }
};

const buildReportHTML = () => {
  const title = selectedReportType.value === 'case-progress' ? 'Case Progress Report'
    : selectedReportType.value === 'client-summary' ? 'Client Summary Report'
    : 'Performance Report';

  const stylesheet = `
    <style>
      body{font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial;line-height:1.4;color:#111827;padding:20px}
      h1{font-size:20px;margin-bottom:6px}
      .meta{color:#6b7280;margin-bottom:18px}
      table{width:100%;border-collapse:collapse;margin-top:12px}
      th,td{border:1px solid #e5e7eb;padding:8px;text-align:left}
      th{background:#f9fafb}
      .section{margin-top:18px}
      .print-btn{position:fixed;right:20px;top:20px;padding:8px 12px;background:#003aca;color:white;border-radius:6px;cursor:pointer}
    </style>
  `;

  let body = `<h1>${title}</h1><div class="meta">Generated: ${format(new Date(), 'PPP p')}</div>`;

  if (selectedReportType.value === 'case-progress') {
    body += `
      <div class="section">
        <h2>Summary</h2>
        <p>Total cases: ${reportData.value.totalCases} • Active: ${reportData.value.activeCases} • Closed: ${reportData.value.closedCases} • Success Rate: ${reportData.value.successRate}%</p>
      </div>
      <div class="section">
        <h2>Cases</h2>
        <table><thead><tr><th>Case</th><th>Status</th><th>Updated</th></tr></thead><tbody>`;
    (cases.value || []).forEach(c => {
      body += `<tr><td>${c.title || c.case_number || c.id}</td><td>${c.status || '—'}</td><td>${format(c.updated_date || c.updatedAt || new Date(), 'PPP')}</td></tr>`;
    });
    body += `</tbody></table></div>`;
  } else if (selectedReportType.value === 'client-summary') {
    body += `
      <div class="section">
        <h2>Client Cases</h2>
        <table><thead><tr><th>Case</th><th>Client</th><th>Case #</th><th>Notes</th></tr></thead><tbody>`;
    (filteredCases.value || []).forEach(c => {
      const clientName = (c.customers && c.customers[0] && (c.customers[0].name || c.customers[0].full_name)) || c.customer_name || '-';
      body += `<tr><td>${c.title || c.id}</td><td>${clientName}</td><td>${c.case_number || '—'}</td><td>${(c.description || '').replace(/</g,'&lt;')}</td></tr>`;
    });
    body += `</tbody></table></div>`;
  } else {
    body += `
      <div class="section">
        <h2>Performance Metrics</h2>
        <table><thead><tr><th>Metric</th><th>Value</th></tr></thead><tbody>
          <tr><td>Cases Handled</td><td>${reportData.value.totalCases}</td></tr>
          <tr><td>Active Cases</td><td>${reportData.value.activeCases}</td></tr>
          <tr><td>Closed Cases</td><td>${reportData.value.closedCases}</td></tr>
        </tbody></table>
      </div>
    `;
  }

  // Append recent activities if present
  if ((recentActivities.value || []).length > 0) {
    body += `<div class="section"><h2>Recent Activities</h2><table><thead><tr><th>Case</th><th>Activity</th><th>Date</th></tr></thead><tbody>`;
    (recentActivities.value || []).forEach(a => {
      body += `<tr><td>${a.case_title || '—'}</td><td>${a.description || '—'}</td><td>${format(a.date || new Date(), 'PPP')}</td></tr>`;
    });
    body += `</tbody></table></div>`;
  }

  // Print helper button + script
  const script = `
    <script>
      function doPrint(){ window.print(); }
      window.onload = function(){ /* optional auto-open print dialog: comment out if undesired */ }
    <\/script>
  `;

  return `<!doctype html><html><head><meta charset="utf-8"><title>${title}</title>${stylesheet}</head><body><button class="print-btn" onclick="doPrint()">Print / Save PDF</button>${body}${script}</body></html>`;
};

const downloadCSV = (filename, rows) => {
  const csv = rows.map(r => r.map(cell => `"${String(cell).replace(/"/g,'""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
};

const exportExcel = () => {
  try {
    // For simplicity export CSV representing the current view
    if (selectedReportType.value === 'case-progress') {
      const rows = [["Case","Status","Updated"]];
      (cases.value || []).forEach(c => rows.push([c.title || c.id, c.status || '', format(c.updated_date || c.updatedAt || new Date(), 'PPP')]));
      downloadCSV('case-progress.csv', rows);
    } else if (selectedReportType.value === 'client-summary') {
      const rows = [["Case","Client","Case #","Notes"]];
      (filteredCases.value || []).forEach(c => rows.push([c.title || c.id, (c.customers && c.customers[0] && (c.customers[0].name || c.customers[0].full_name)) || c.customer_name || '-', c.case_number || '', c.description || '']));
      downloadCSV('client-summary.csv', rows);
    } else {
      const rows = [["Metric","Value"],["Total Cases", reportData.value.totalCases],["Active Cases", reportData.value.activeCases],["Closed Cases", reportData.value.closedCases],["Success Rate", reportData.value.successRate + '%']];
      downloadCSV('performance-report.csv', rows);
    }
  } catch (e) {
    console.error('Failed to export CSV', e);
    alert('Failed to export Excel/CSV');
  }
};

const exportPDF = () => {
  // Reuse generateReport: open printable window and let user Save as PDF
  try {
    const html = buildReportHTML();
    const w = window.open('', '_blank');
    if (!w) { alert('Popup blocked. Please allow popups for this site to export PDF.'); return; }
    w.document.open();
    w.document.write(html);
    w.document.close();
    // Delay to allow rendering then call print
    setTimeout(() => { try { w.print(); } catch (e) { console.error(e); } }, 500);
  } catch (e) {
    console.error('Failed to export PDF', e);
    alert('Failed to export PDF');
  }
};

onMounted(() => {
  loadReportData();
  loadAssignedTasks();
});

// Task report modal
// Insert modal HTML at end of template via patch

const { toast } = useToast ? useToast() : { toast: (opts) => console.info('toast', opts) };

// Export & Save state
const exportFilename = ref('report');
const includeCaseDetails = ref(true);
const includeRecentActivities = ref(true);

const saveExcel = async () => {
  const filename = (exportFilename.value && exportFilename.value.trim() !== '' ? exportFilename.value.trim() : 'report') + '.xlsx';
  try {
    // Try to use SheetJS (xlsx) if available
    let XLSX;
    try {
      // Avoid Vite import analysis for optional dependency by using a variable specifier
      const xlsxPkg = 'xlsx';
      XLSX = (await import(/* @vite-ignore */ xlsxPkg)).default || (await import(/* @vite-ignore */ xlsxPkg));
    } catch (e) {
      XLSX = null;
    }

    if (XLSX) {
      // Build workbook
      const wb = XLSX.utils.book_new();
      const rows = [];
      if (includeCaseDetails.value) {
        rows.push(['Case', 'Status', 'Updated']);
        (cases.value || []).forEach(c => rows.push([c.title || c.id, c.status || '', format(c.updated_date || c.updatedAt || new Date(), 'PPP')]));
        const ws = XLSX.utils.aoa_to_sheet(rows);
        XLSX.utils.book_append_sheet(wb, ws, 'Cases');
      }
      if (includeRecentActivities.value) {
        const actRows = [['Case', 'Activity', 'Date']];
        (recentActivities.value || []).forEach(a => actRows.push([a.case_title || '', a.description || '', format(a.date || new Date(), 'PPP')]));
        const ws2 = XLSX.utils.aoa_to_sheet(actRows);
        XLSX.utils.book_append_sheet(wb, ws2, 'Activities');
      }
      const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([wbout], { type: 'application/octet-stream' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } else {
      // Fallback to CSV download with provided filename
      const csvName = (exportFilename.value && exportFilename.value.trim() !== '' ? exportFilename.value.trim() : 'report') + '.csv';
      const rows = [];
      if (includeCaseDetails.value) {
        rows.push(["Case","Status","Updated"]);
        (cases.value || []).forEach(c => rows.push([c.title || c.id, c.status || '', format(c.updated_date || c.updatedAt || new Date(), 'PPP')]));
      }
      if (includeRecentActivities.value) {
        rows.push([]);
        rows.push(["Case","Activity","Date"]);
        (recentActivities.value || []).forEach(a => rows.push([a.case_title || '', a.description || '', format(a.date || new Date(), 'PPP')]));
      }
      downloadCSV(csvName, rows);
    }
  } catch (e) {
    console.error('saveExcel failed', e);
    alert('Failed to save Excel. Check console for details.');
  }
};

const savePDF = async () => {
  const filename = (exportFilename.value && exportFilename.value.trim() !== '' ? exportFilename.value.trim() : 'report') + '.pdf';
  try {
    // Try to use jsPDF + html2canvas if available
    let jsPDFModule = null;
    let html2canvas = null;
    try {
      // Avoid Vite import analysis for optional dependencies by using variable specifiers
      const jspdfPkg = 'jspdf';
      const html2Pkg = 'html2canvas';
      jsPDFModule = (await import(/* @vite-ignore */ jspdfPkg)).jsPDF || (await import(/* @vite-ignore */ jspdfPkg));
      html2canvas = (await import(/* @vite-ignore */ html2Pkg)).default || (await import(/* @vite-ignore */ html2Pkg));
    } catch (e) {
      jsPDFModule = null;
      html2canvas = null;
    }

    if (jsPDFModule && html2canvas) {
      // Build a temporary element with the report HTML
      const html = buildReportHTML();
      const container = document.createElement('div');
      container.style.position = 'fixed';
      container.style.left = '-9999px';
      container.innerHTML = html;
      document.body.appendChild(container);
      const canvas = await html2canvas(container, { scale: 2 });
      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const pdf = new jsPDFModule('p', 'pt', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgProps = pdf.getImageProperties(imgData);
      const imgWidth = pageWidth;
      const imgHeight = (imgProps.height * pageWidth) / imgProps.width;
      pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);
      pdf.save(filename);
      container.remove();
    } else {
      // Fallback: open printable window and inform user to Save as PDF manually
      exportPDF();
      toast({ title: 'PDF export', description: 'If Save failed, install jsPDF + html2canvas for direct PDF downloads.' });
    }
  } catch (e) {
    console.error('savePDF failed', e);
    alert('Failed to save PDF');
  }
};

const loadAssignedTasks = async () => {
  try {
    const userId = authStore.user?.id;
    if (!userId) return;
    const allTasks = await ActionItem.list();
    // Determine lawyer's cases robustly (handle different field shapes)
    let myCases = cases.value || [];
    if (!myCases || myCases.length === 0) {
      const allCases = await Case.list();
      myCases = (allCases || []).filter(c => {
        const assignedId = c.assigned_lawyer?.id || c.assigned_lawyer_id || c.lawyer_id || c.lawyerId || c.assignedLawyerId || null;
        if (assignedId && String(assignedId) === String(userId)) return true;
        if (Array.isArray(c.owners) && c.owners.some(o => (o && (o.id === userId || o === String(userId))) || o === userId || o === String(userId))) return true;
        if (Array.isArray(c.owner_ids) && c.owner_ids.some(id => String(id) === String(userId))) return true;
        return false;
      });
      // update cases so filters/selects reflect the lawyer's cases
      cases.value = myCases;
    }

    const caseIds = myCases.map(c => c.id);

    // Include tasks that are linked to the lawyer's cases OR assigned directly to the lawyer
    assignedTasks.value = (allTasks || []).filter(t => {
      if (t.case_id && caseIds.includes(t.case_id)) return true;
      const assignedTo = t.assigned_lawyer?.id || t.assigned_lawyer_id || t.assigned_to || t.assignee_id || t.user_id || null;
      if (assignedTo && String(assignedTo) === String(userId)) return true;
      if (Array.isArray(t.owners) && t.owners.some(o => (o && (o.id === userId || o === String(userId))) || o === userId || o === String(userId))) return true;
      return false;
    }).map(t => ({ ...t, case_title: cases.value.find(c => c.id === t.case_id)?.title || t.case_title || 'Unknown Case' }));
  } catch (e) {
    console.error('Failed to load assigned tasks', e);
  }
};

// Report modal state
const showTaskReportModal = ref(false);
const taskToReport = ref(null);
const taskReportContent = ref('');

const openTaskReportModal = (task) => {
  taskToReport.value = task;
  taskReportContent.value = '';
  showTaskReportModal.value = true;
};

const sendTaskReport = async () => {
  if (!taskToReport.value) return;
  if (!taskReportContent.value || taskReportContent.value.trim().length < 5) {
    alert('Please enter a short report (at least 5 characters)');
    return;
  }
  try {
    const payload = {
      to_role: 'admin',
      subject: `Task report: ${taskToReport.value.title || taskToReport.value.id}`,
      content: taskReportContent.value,
      message_type: 'report',
      report_data: JSON.stringify({ task_id: taskToReport.value.id, case_id: taskToReport.value.case_id })
    };
    await api.post('/messages', payload);
    toast({ title: 'Report sent', description: 'Your report was sent to admin.' });
    showTaskReportModal.value = false;
    taskToReport.value = null;
    taskReportContent.value = '';
  } catch (e) {
    console.error('Failed to send task report', e);
    alert('Failed to send task report');
  }
};
</script>
 