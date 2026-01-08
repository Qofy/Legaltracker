<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h2 class="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <svg class="w-7 h-7 text-[#003aca]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Lawyer Reports
        </h2>
        <p class="text-gray-500 mt-1">View and manage reports submitted by lawyers</p>
      </div>
      <button @click="refreshReports" class="px-4 py-2 bg-[#003aca] text-white rounded-md hover:bg-[#0031a0] text-sm font-medium flex items-center gap-2">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        Refresh
      </button>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-lg border border-gray-200 p-6">
      <h3 class="text-lg font-semibold text-gray-800 mb-4">Filter Reports</h3>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
          <select v-model="filters.reportType" class="w-full px-3 py-2 border border-gray-300 rounded-md">
            <option value="">All Types</option>
            <option value="case_report">Case Reports</option>
            <option value="report">Task Reports</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Lawyer</label>
          <select v-model="filters.lawyerId" class="w-full px-3 py-2 border border-gray-300 rounded-md">
            <option value="">All Lawyers</option>
            <option v-for="lawyer in lawyers" :key="lawyer.id" :value="lawyer.id">
              {{ lawyer.full_name }}
            </option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
          <select v-model="filters.dateRange" class="w-full px-3 py-2 border border-gray-300 rounded-md">
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="all">All Time</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select v-model="filters.status" class="w-full px-3 py-2 border border-gray-300 rounded-md">
            <option value="">All Status</option>
            <option value="new">New</option>
            <option value="reviewed">Reviewed</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Reports Summary -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="bg-white rounded-lg border border-gray-200 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Total Reports</p>
            <p class="text-3xl font-bold text-gray-900 mt-1">{{ totalReports }}</p>
          </div>
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg border border-gray-200 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">New Reports</p>
            <p class="text-3xl font-bold text-orange-600 mt-1">{{ newReports }}</p>
          </div>
          <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg border border-gray-200 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Case Reports</p>
            <p class="text-3xl font-bold text-green-600 mt-1">{{ caseReports }}</p>
          </div>
          <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg border border-gray-200 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Task Reports</p>
            <p class="text-3xl font-bold text-purple-600 mt-1">{{ taskReports }}</p>
          </div>
          <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Reports List -->
    <div class="bg-white rounded-lg border border-gray-200">
      <div class="px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-semibold text-gray-800">Reports</h3>
      </div>

      <div v-if="loading" class="p-6 text-center">
        <svg class="animate-spin h-8 w-8 text-gray-400 mx-auto" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p class="text-gray-500 mt-2">Loading reports...</p>
      </div>

      <div v-else-if="filteredReports.length === 0" class="p-6 text-center text-gray-500">
        <svg class="w-12 h-12 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p>No reports found matching your criteria.</p>
      </div>

      <div v-else class="divide-y divide-gray-200">
        <div v-for="report in paginatedReports" :key="report.id" class="p-6 hover:bg-gray-50">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center gap-3 mb-2">
                <h4 class="font-semibold text-gray-900">{{ report.subject }}</h4>
                <span :class="[
                  'px-2 py-1 rounded-full text-xs font-medium',
                  getReportTypeStyle(report.message_type)
                ]">
                  {{ getReportTypeLabel(report.message_type) }}
                </span>
                <span :class="[
                  'px-2 py-1 rounded-full text-xs font-medium',
                  getStatusStyle(report.status)
                ]">
                  {{ report.status || 'new' }}
                </span>
              </div>
              
              <p class="text-sm text-gray-600 mb-3">
                From: <strong>{{ report.from_user?.full_name || 'Unknown Lawyer' }}</strong>
              </p>
              
              <div class="text-sm text-gray-700 mb-3">
                {{ truncateText(report.content, 150) }}
              </div>

              <div v-if="report.report_data" class="bg-gray-50 rounded-md p-3 mb-3">
                <h5 class="font-medium text-gray-800 mb-2">Report Details:</h5>
                <div class="text-sm text-gray-600 space-y-1">
                  <div v-if="getReportData(report).case_id">
                    <strong>Case ID:</strong> {{ getReportData(report).case_id }}
                  </div>
                  <div v-if="getReportData(report).report_type">
                    <strong>Report Type:</strong> {{ getReportData(report).report_type }}
                  </div>
                  <div v-if="getReportData(report).format">
                    <strong>Format:</strong> {{ getReportData(report).format.toUpperCase() }}
                  </div>
                  <div v-if="getReportData(report).generated_at">
                    <strong>Generated:</strong> {{ formatDate(getReportData(report).generated_at) }}
                  </div>
                </div>
              </div>

              <div class="flex items-center gap-4 text-xs text-gray-500">
                <span>{{ formatDate(report.created_date) }}</span>
                <span v-if="report.file_attachment">📎 File Attached</span>
              </div>
            </div>

            <div class="flex items-center gap-2 ml-4">
              <button 
                @click="viewReport(report)"
                class="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
              >
                View
              </button>
              
              <button 
                v-if="report.file_attachment"
                @click="downloadAttachment(report)"
                class="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
              >
                Download
              </button>
              
              <button 
                @click="markAsReviewed(report)"
                v-if="!report.status || report.status === 'new'"
                class="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
              >
                Mark Reviewed
              </button>

              <button 
                @click="archiveReport(report)"
                class="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
              >
                Archive
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
        <div class="text-sm text-gray-500">
          Showing {{ (currentPage - 1) * pageSize + 1 }} to {{ Math.min(currentPage * pageSize, filteredReports.length) }} of {{ filteredReports.length }} reports
        </div>
        <div class="flex items-center gap-2">
          <button 
            @click="currentPage--" 
            :disabled="currentPage === 1"
            class="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span class="px-3 py-1 text-sm">Page {{ currentPage }} of {{ totalPages }}</span>
          <button 
            @click="currentPage++" 
            :disabled="currentPage === totalPages"
            class="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>

    <!-- View Report Modal -->
    <div v-if="showReportModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" @click.self="showReportModal = false">
      <div class="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-800">{{ selectedReport?.subject }}</h3>
          <button @click="showReportModal = false" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div class="p-6" v-if="selectedReport">
          <div class="space-y-4">
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div><strong>From:</strong> {{ selectedReport.from_user?.full_name || 'Unknown' }}</div>
              <div><strong>Date:</strong> {{ formatDate(selectedReport.created_date) }}</div>
              <div><strong>Type:</strong> {{ getReportTypeLabel(selectedReport.message_type) }}</div>
              <div><strong>Status:</strong> {{ selectedReport.status || 'new' }}</div>
            </div>
            
            <div class="border-t pt-4">
              <h4 class="font-semibold text-gray-800 mb-2">Content:</h4>
              <div class="whitespace-pre-wrap text-gray-700 bg-gray-50 rounded-md p-4">{{ selectedReport.content }}</div>
            </div>

            <div v-if="selectedReport.report_data" class="border-t pt-4">
              <h4 class="font-semibold text-gray-800 mb-2">Report Data:</h4>
              <pre class="text-xs text-gray-600 bg-gray-50 rounded-md p-4 overflow-x-auto">{{ formatReportData(selectedReport.report_data) }}</pre>
            </div>

            <div v-if="selectedReport.file_attachment" class="border-t pt-4">
              <h4 class="font-semibold text-gray-800 mb-2">Attachment:</h4>
              <button 
                @click="downloadAttachment(selectedReport)"
                class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                📎 Download {{ selectedReport.file_attachment.name }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { format } from 'date-fns';
import api from '@/plugins/axios';
import { useToast } from '@/components/ui/use-toast';

const { toast } = useToast();

// State
const reports = ref([]);
const lawyers = ref([]);
const loading = ref(false);
const currentPage = ref(1);
const pageSize = ref(10);

// Modal state
const showReportModal = ref(false);
const selectedReport = ref(null);

// Filters
const filters = ref({
  reportType: '',
  lawyerId: '',
  dateRange: 'month',
  status: ''
});

// Computed properties
const filteredReports = computed(() => {
  let filtered = reports.value;

  if (filters.value.reportType) {
    filtered = filtered.filter(r => r.message_type === filters.value.reportType);
  }

  if (filters.value.lawyerId) {
    filtered = filtered.filter(r => r.from_user_id === filters.value.lawyerId);
  }

  if (filters.value.status) {
    filtered = filtered.filter(r => (r.status || 'new') === filters.value.status);
  }

  if (filters.value.dateRange !== 'all') {
    const now = new Date();
    let startDate = new Date();
    
    switch (filters.value.dateRange) {
      case 'today':
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
    }
    
    filtered = filtered.filter(r => new Date(r.created_date) >= startDate);
  }

  return filtered.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
});

const paginatedReports = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return filteredReports.value.slice(start, end);
});

const totalPages = computed(() => Math.ceil(filteredReports.value.length / pageSize.value));

const totalReports = computed(() => reports.value.length);
const newReports = computed(() => reports.value.filter(r => !r.status || r.status === 'new').length);
const caseReports = computed(() => reports.value.filter(r => r.message_type === 'case_report').length);
const taskReports = computed(() => reports.value.filter(r => r.message_type === 'report').length);

// Methods
const loadReports = async () => {
  loading.value = true;
  try {
    const response = await api.get('/messages', {
      params: {
        to_role: 'admin',
        message_type: 'report,case_report'
      }
    });
    reports.value = response.data || [];
  } catch (error) {
    console.error('Failed to load reports:', error);
    toast({
      variant: 'destructive',
      title: 'Error',
      description: 'Failed to load reports'
    });
  } finally {
    loading.value = false;
  }
};

const loadLawyers = async () => {
  try {
    const response = await api.get('/users', {
      params: { user_type: 'lawyer' }
    });
    lawyers.value = response.data || [];
  } catch (error) {
    console.error('Failed to load lawyers:', error);
  }
};

const refreshReports = async () => {
  await loadReports();
  toast({
    title: 'Reports Refreshed',
    description: 'Report list has been updated'
  });
};

const viewReport = (report) => {
  selectedReport.value = report;
  showReportModal.value = true;
};

const markAsReviewed = async (report) => {
  try {
    await api.patch(`/messages/${report.id}`, { status: 'reviewed' });
    report.status = 'reviewed';
    toast({
      title: 'Report Reviewed',
      description: 'Report marked as reviewed'
    });
  } catch (error) {
    console.error('Failed to mark as reviewed:', error);
    toast({
      variant: 'destructive',
      title: 'Error',
      description: 'Failed to update report status'
    });
  }
};

const archiveReport = async (report) => {
  try {
    await api.patch(`/messages/${report.id}`, { status: 'archived' });
    report.status = 'archived';
    toast({
      title: 'Report Archived',
      description: 'Report has been archived'
    });
  } catch (error) {
    console.error('Failed to archive report:', error);
    toast({
      variant: 'destructive',
      title: 'Error',
      description: 'Failed to archive report'
    });
  }
};

const downloadAttachment = (report) => {
  if (!report.file_attachment) return;

  try {
    const { content, name, type } = report.file_attachment;
    const blob = new Blob([atob(content)], { type });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Failed to download attachment:', error);
    toast({
      variant: 'destructive',
      title: 'Download Failed',
      description: 'Could not download the attachment'
    });
  }
};

// Utility methods
const formatDate = (date) => {
  try {
    return format(new Date(date), 'PPP p');
  } catch (e) {
    return 'Invalid date';
  }
};

const truncateText = (text, maxLength) => {
  if (!text) return '';
  return text.length <= maxLength ? text : text.substring(0, maxLength) + '...';
};

const getReportTypeLabel = (type) => {
  switch (type) {
    case 'case_report': return 'Case Report';
    case 'report': return 'Task Report';
    default: return 'Report';
  }
};

const getReportTypeStyle = (type) => {
  switch (type) {
    case 'case_report': return 'bg-blue-100 text-blue-700';
    case 'report': return 'bg-purple-100 text-purple-700';
    default: return 'bg-gray-100 text-gray-700';
  }
};

const getStatusStyle = (status) => {
  switch (status || 'new') {
    case 'new': return 'bg-orange-100 text-orange-700';
    case 'reviewed': return 'bg-green-100 text-green-700';
    case 'archived': return 'bg-gray-100 text-gray-700';
    default: return 'bg-gray-100 text-gray-700';
  }
};

const getReportData = (report) => {
  try {
    return JSON.parse(report.report_data || '{}');
  } catch (e) {
    return {};
  }
};

const formatReportData = (reportData) => {
  try {
    return JSON.stringify(JSON.parse(reportData), null, 2);
  } catch (e) {
    return reportData;
  }
};

// Lifecycle
onMounted(() => {
  loadReports();
  loadLawyers();
});
</script>