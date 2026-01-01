<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h2 class="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <svg class="w-7 h-7 text-[#003aca]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          My Dashboard
        </h2>
        <p class="text-gray-500 mt-1">Welcome back! Here's an overview of your case</p>
      </div>
    </div>

    <!-- Case Status Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="bg-white rounded-lg border border-gray-200 p-5">
        <div class="flex items-center justify-between mb-2">
          <p class="text-sm text-gray-600 font-medium">My Cases</p>
          <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <p class="text-3xl font-bold text-gray-900">{{ myCases.length }}</p>
        <p class="text-xs text-gray-500 mt-1">{{ activeCases }} active</p>
      </div>

      <div class="bg-white rounded-lg border border-gray-200 p-5">
        <div class="flex items-center justify-between mb-2">
          <p class="text-sm text-gray-600 font-medium">Unread Messages</p>
          <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </div>
        <p class="text-3xl font-bold text-gray-900">{{ unreadMessages }}</p>
        <p class="text-xs text-gray-500 mt-1">from your lawyer</p>
      </div>

      <div class="bg-white rounded-lg border border-gray-200 p-5">
        <div class="flex items-center justify-between mb-2">
          <p class="text-sm text-gray-600 font-medium">Upcoming Deadlines</p>
          <svg class="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p class="text-3xl font-bold text-gray-900">{{ upcomingDeadlines }}</p>
        <p class="text-xs text-gray-500 mt-1">next 7 days</p>
      </div>
    </div>

    <!-- My Case(s) -->
    <div class="bg-white rounded-lg border border-gray-200 p-6">
      <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <svg class="w-5 h-5 text-[#003aca]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        My Cases
      </h3>

      <div v-if="myCases.length === 0" class="text-center py-12 text-gray-500">
        <svg class="w-16 h-16 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p class="text-sm">No cases assigned yet</p>
      </div>

      <div v-else class="space-y-4">
        <div v-for="caseItem in myCases" :key="caseItem.id" class="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center gap-3 mb-2">
                <h4 class="font-semibold text-gray-900">{{ caseItem.title }}</h4>
                <span :class="['px-2 py-1 rounded text-xs font-medium', getStatusBadge(caseItem.status)]">
                  {{ caseItem.status }}
                </span>
              </div>
              <p class="text-sm text-gray-600 mb-2">Case #{{ caseItem.case_number }}</p>
              <p class="text-sm text-gray-700 mb-3">{{ caseItem.description || 'No description available' }}</p>

              <div class="flex items-center gap-4 text-xs text-gray-600">
                <div class="flex items-center gap-1">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>{{ caseItem.lawyer_name || 'Lawyer not assigned' }}</span>
                </div>
                <div class="flex items-center gap-1">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>Updated {{ formatDate(caseItem.updated_date) }}</span>
                </div>
              </div>
            </div>
            <button class="ml-4 px-4 py-2 border border-blue-600 text-blue-600 rounded-md text-sm font-medium hover:bg-blue-50">
              View Details
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Important Updates & Recent Communications -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Important Updates -->
      <div class="bg-white rounded-lg border border-gray-200 p-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <svg class="w-5 h-5 text-[#003aca]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          Important Updates
        </h3>
        <div class="space-y-3 max-h-64 overflow-y-auto">
          <div v-if="importantUpdates.length === 0" class="text-center py-8 text-gray-500">
            <p class="text-sm">No updates available</p>
          </div>
          <div v-else v-for="update in importantUpdates" :key="update.id" class="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0">
            <div class="w-2 h-2 rounded-full bg-blue-600 mt-2"></div>
            <div class="flex-1">
              <p class="text-sm text-gray-700">{{ update.message }}</p>
              <p class="text-xs text-gray-500 mt-1">{{ formatDate(update.date) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Communications -->
      <div class="bg-white rounded-lg border border-gray-200 p-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <svg class="w-5 h-5 text-[#003aca]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          Recent Messages
        </h3>
        <div class="space-y-3 max-h-64 overflow-y-auto">
          <div v-if="recentMessages.length === 0" class="text-center py-8 text-gray-500">
            <p class="text-sm">No messages yet</p>
          </div>
          <div v-else v-for="message in recentMessages" :key="message.id" class="p-3 rounded-lg border border-gray-200">
            <div class="flex items-start justify-between mb-2">
              <div class="flex items-center gap-2">
                <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <p class="text-sm font-semibold text-gray-900">{{ message.sender_name }}</p>
                  <p class="text-xs text-gray-500">{{ formatDate(message.created_date) }}</p>
                </div>
              </div>
            </div>
            <p class="text-sm text-gray-700">{{ message.message }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Documents & Invoices Overview -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Recent Documents -->
      <div class="bg-white rounded-lg border border-gray-200 p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <svg class="w-5 h-5 text-[#003aca]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Recent Documents
          </h3>
          <button class="text-sm text-blue-600 hover:text-blue-700 font-medium">View All</button>
        </div>
        <div class="space-y-2">
          <div v-if="recentDocuments.length === 0" class="text-center py-8 text-gray-500">
            <p class="text-sm">No documents available</p>
          </div>
          <div v-else v-for="doc in recentDocuments" :key="doc.id" class="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
                <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-900">{{ doc.file_name }}</p>
                <p class="text-xs text-gray-500">{{ formatDate(doc.upload_date) }}</p>
              </div>
            </div>
            <button class="text-blue-600 hover:text-blue-700">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Invoice Status -->
      <div class="bg-white rounded-lg border border-gray-200 p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <svg class="w-5 h-5 text-[#003aca]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
            </svg>
            Payment Status
          </h3>
          <button class="text-sm text-blue-600 hover:text-blue-700 font-medium">View All</button>
        </div>
        <div class="space-y-4">
          <div class="p-4 bg-blue-50 rounded-lg">
            <div class="flex items-center justify-between mb-2">
              <p class="text-sm text-gray-600">Total Billed</p>
              <p class="text-2xl font-bold text-gray-900">${{ invoiceStats.total.toLocaleString() }}</p>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div class="p-3 bg-green-50 rounded-lg">
              <p class="text-xs text-gray-600 mb-1">Paid</p>
              <p class="text-lg font-bold text-green-900">${{ invoiceStats.paid.toLocaleString() }}</p>
            </div>
            <div class="p-3 bg-orange-50 rounded-lg">
              <p class="text-xs text-gray-600 mb-1">Pending</p>
              <p class="text-lg font-bold text-orange-900">${{ invoiceStats.pending.toLocaleString() }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { Case, ChatMessage, Document } from '@/services/entities';
import { useAuthStore } from '@/stores/auth';
import { format } from 'date-fns';

const authStore = useAuthStore();

const myCases = ref([]);
const recentMessages = ref([]);
const importantUpdates = ref([]);
const recentDocuments = ref([]);

const unreadMessages = ref(0);
const upcomingDeadlines = ref(0);

const invoiceStats = ref({
  total: 0,
  paid: 0,
  pending: 0,
});

const activeCases = computed(() => {
  return myCases.value.filter(c => c.status === 'open' || c.status === 'in_progress').length;
});

const loadCustomerDashboard = async () => {
  try {
    const userId = authStore.user?.id;
    if (!userId) return;

    // Fetch all cases and filter for customer's cases
    const allCases = await Case.list();
    myCases.value = allCases.filter(c =>
      c.customer_ids && Array.isArray(c.customer_ids) && c.customer_ids.includes(userId)
    );

    if (myCases.value.length > 0) {
      const caseIds = myCases.value.map(c => c.id);

      // Fetch messages for customer's cases
      const allMessages = await ChatMessage.list('-created_date', 10);
      recentMessages.value = allMessages
        .filter(m => caseIds.includes(m.case_id))
        .slice(0, 5)
        .map(m => ({
          ...m,
          sender_name: 'Your Lawyer', // In production, fetch from user data
        }));

      unreadMessages.value = 3; // Mock data - implement read/unread tracking

      // Fetch documents for customer's cases
      const allDocuments = await Document.list();
      recentDocuments.value = allDocuments
        .filter(d => caseIds.includes(d.case_id) && (d.visibility_type === 'public' || d.visibility_type === 'client'))
        .slice(0, 5);

      // Mock important updates
      importantUpdates.value = [
        { id: 1, message: 'Your case status has been updated to "In Progress"', date: new Date() },
        { id: 2, message: 'New document has been uploaded by your lawyer', date: new Date(Date.now() - 86400000) },
        { id: 3, message: 'Upcoming court date scheduled for next week', date: new Date(Date.now() - 172800000) },
      ];

      upcomingDeadlines.value = 2; // Mock data

      // Mock invoice stats
      invoiceStats.value = {
        total: 5000,
        paid: 3000,
        pending: 2000,
      };
    }
  } catch (error) {
    console.error('Failed to load customer dashboard:', error);
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

const formatDate = (date) => {
  try {
    return format(new Date(date), 'MMM d, yyyy');
  } catch (e) {
    return '';
  }
};

onMounted(() => {
  loadCustomerDashboard();
});
</script>
