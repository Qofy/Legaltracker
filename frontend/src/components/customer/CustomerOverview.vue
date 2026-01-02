<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h2 class="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <svg class="w-7 h-7 text-[#003aca]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          My Dashboard
          <button
            v-if="!isLoading"
            @click="refreshDashboard"
            class="ml-2 p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
            title="Refresh Dashboard"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </h2>
        <p class="text-gray-500 mt-1">
          {{ isLoading ? 'Loading dashboard...' : 'Welcome back! Here\'s an overview of your case' }}
        </p>
      </div>
      <button
        @click="showNewCaseModal = true"
        class="px-4 py-2 bg-[#003aca] text-white rounded-md hover:bg-[#0031a0] text-sm font-medium flex items-center gap-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Request New Case
      </button>
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
        <div v-if="isLoading" class="animate-pulse">
          <div class="h-8 bg-gray-200 rounded mb-2"></div>
          <div class="h-4 bg-gray-200 rounded w-20"></div>
        </div>
        <div v-else>
          <p class="text-3xl font-bold text-gray-900">{{ myCases.length }}</p>
          <p class="text-xs text-gray-500 mt-1">{{ activeCases }} active</p>
        </div>
      </div>

      <div class="bg-white rounded-lg border border-gray-200 p-5">
        <div class="flex items-center justify-between mb-2">
          <p class="text-sm text-gray-600 font-medium">Unread Messages</p>
          <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </div>
        <div v-if="isLoading" class="animate-pulse">
          <div class="h-8 bg-gray-200 rounded mb-2"></div>
          <div class="h-4 bg-gray-200 rounded w-24"></div>
        </div>
        <div v-else>
          <p class="text-3xl font-bold text-gray-900">{{ unreadMessages }}</p>
          <p class="text-xs text-gray-500 mt-1">from your lawyer</p>
        </div>
      </div>

      <div class="bg-white rounded-lg border border-gray-200 p-5">
        <div class="flex items-center justify-between mb-2">
          <p class="text-sm text-gray-600 font-medium">Upcoming Deadlines</p>
          <svg class="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div v-if="isLoading" class="animate-pulse">
          <div class="h-8 bg-gray-200 rounded mb-2"></div>
          <div class="h-4 bg-gray-200 rounded w-16"></div>
        </div>
        <div v-else>
          <p class="text-3xl font-bold text-gray-900">{{ upcomingDeadlines }}</p>
          <p class="text-xs text-gray-500 mt-1">next 7 days</p>
        </div>
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

    <!-- New Case Modal -->
    <div
      v-if="showNewCaseModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="showNewCaseModal = false"
    >
      <div class="bg-white rounded-lg p-6 max-w-3xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col">
        <div class="flex items-center justify-between mb-4 pb-4 border-b">
          <h3 class="text-xl font-semibold text-gray-800">Request New Case</h3>
          <button @click="showNewCaseModal = false" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="overflow-y-auto flex-1">
          <CustomerNewCaseForm
            :onSubmit="handleCreateCase"
            :onCancel="() => showNewCaseModal = false"
            :currentUser="authStore.user"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { Case, ChatMessage, Document, ActionItem } from '@/services/entities';
import { useAuthStore } from '@/stores/auth';
import { format } from 'date-fns';
import CustomerNewCaseForm from './CustomerNewCaseForm.vue';

const authStore = useAuthStore();

const myCases = ref([]);
const recentMessages = ref([]);
const importantUpdates = ref([]);
const recentDocuments = ref([]);

const unreadMessages = ref(0);
const upcomingDeadlines = ref(0);
const showNewCaseModal = ref(false);
const isLoading = ref(true);

const invoiceStats = ref({
  total: 0,
  paid: 0,
  pending: 0,
});

const activeCases = computed(() => {
  return myCases.value.filter(c => c.status === 'open' || c.status === 'in_progress').length;
});

const loadCustomerDashboard = async (showLoader = true) => {
  try {
    if (showLoader) isLoading.value = true;
    
    const userId = authStore.user?.id;
    if (!userId) return;

    console.log('Loading customer dashboard for user:', userId);

    // Fetch all cases and filter for customer's cases
    const allCases = await Case.list();
    console.log('All cases:', allCases.length);
    
    myCases.value = allCases.filter(c => {
      // Check multiple possible customer relationship structures
      if (c.customer_ids && Array.isArray(c.customer_ids) && c.customer_ids.includes(userId)) {
        return true;
      }
      if (c.customers && Array.isArray(c.customers)) {
        return c.customers.some(customer => 
          typeof customer === 'string' ? customer === userId : customer.id === userId
        );
      }
      return false;
    });

    console.log('Customer cases found:', myCases.value.length);

    if (myCases.value.length > 0) {
      const caseIds = myCases.value.map(c => c.id);

      // Fetch messages for customer's cases with better filtering
      try {
        const allMessages = await ChatMessage.list('-created_date', 20);
        recentMessages.value = allMessages
          .filter(m => caseIds.includes(m.case_id))
          .slice(0, 5)
          .map(m => ({
            ...m,
            sender_name: m.sender_name || (m.sent_by_customer ? 'You' : 'Your Lawyer'),
          }));

        // Count unread messages (messages not sent by customer and not marked as read)
        unreadMessages.value = allMessages
          .filter(m => caseIds.includes(m.case_id) && !m.sent_by_customer && !m.is_read)
          .length;
      } catch (error) {
        console.warn('Could not load messages:', error);
        recentMessages.value = [];
        unreadMessages.value = 0;
      }

      // Fetch documents for customer's cases with improved filtering
      try {
        const allDocuments = await Document.list();
        recentDocuments.value = allDocuments
          .filter(d => {
            const matchesCase = caseIds.includes(d.case_id);
            const visibilityAllowed = !d.visibility_type || 
              d.visibility_type === 'public' || 
              d.visibility_type === 'client' || 
              d.visibility_type === 'case_members';
            return matchesCase && visibilityAllowed;
          })
          .sort((a, b) => new Date(b.created_date || b.upload_date) - new Date(a.created_date || a.upload_date))
          .slice(0, 5);
      } catch (error) {
        console.warn('Could not load documents:', error);
        recentDocuments.value = [];
      }

      // Load action items for deadlines with better calculation
      try {
        const allTasks = await ActionItem.list();
        const caseTasks = allTasks.filter(t => caseIds.includes(t.case_id));

        const now = new Date();
        const sevenDaysFromNow = new Date();
        sevenDaysFromNow.setDate(now.getDate() + 7);
        
        upcomingDeadlines.value = caseTasks.filter(t => {
          if (!t.due_date || t.status === 'completed') return false;
          const dueDate = new Date(t.due_date);
          return dueDate >= now && dueDate <= sevenDaysFromNow;
        }).length;
      } catch (error) {
        console.warn('Could not load action items:', error);
        upcomingDeadlines.value = 0;
      }

      // Create important updates from recent activity with better logic
      importantUpdates.value = [];

      // Add recent case status changes (last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      myCases.value
        .filter(c => new Date(c.updated_date || c.created_date) >= sevenDaysAgo)
        .slice(0, 2)
        .forEach((c, index) => {
          const isNew = new Date(c.created_date) >= sevenDaysAgo;
          importantUpdates.value.push({
            id: `case-${index}`,
            message: isNew ? 
              `New case "${c.title}" has been created and is ${c.status}` :
              `Case "${c.title}" status updated to ${c.status}`,
            date: c.updated_date || c.created_date
          });
        });

      // Add recent document updates
      if (recentDocuments.value.length > 0) {
        recentDocuments.value.slice(0, 2).forEach((doc, index) => {
          importantUpdates.value.push({
            id: `doc-${index}`,
            message: `New document available: ${doc.file_name}`,
            date: doc.created_date || doc.upload_date
          });
        });
      }

      // Add upcoming deadline alerts
      if (upcomingDeadlines.value > 0) {
        importantUpdates.value.push({
          id: 'deadline-alert',
          message: `You have ${upcomingDeadlines.value} upcoming deadline${upcomingDeadlines.value > 1 ? 's' : ''} in the next 7 days`,
          date: new Date().toISOString()
        });
      }

      // Sort updates by date (most recent first)
      importantUpdates.value.sort((a, b) => new Date(b.date) - new Date(a.date));
      importantUpdates.value = importantUpdates.value.slice(0, 5);

      // TODO: Load real invoice data from backend when invoice API is ready
      invoiceStats.value = {
        total: 0,
        paid: 0,
        pending: 0,
      };
    } else {
      // No cases found - reset all data
      recentMessages.value = [];
      importantUpdates.value = [];
      recentDocuments.value = [];
      unreadMessages.value = 0;
      upcomingDeadlines.value = 0;
      
      // Add welcome message for new customers
      importantUpdates.value = [{
        id: 'welcome',
        message: 'Welcome! Submit your first case request to get started.',
        date: new Date().toISOString()
      }];
    }
  } catch (error) {
    console.error('Failed to load customer dashboard:', error);
    // Set default empty states on error
    myCases.value = [];
    recentMessages.value = [];
    importantUpdates.value = [{
      id: 'error',
      message: 'Unable to load dashboard data. Please refresh the page.',
      date: new Date().toISOString()
    }];
    recentDocuments.value = [];
    unreadMessages.value = 0;
    upcomingDeadlines.value = 0;
  } finally {
    isLoading.value = false;
  }
};

const refreshDashboard = async () => {
  await loadCustomerDashboard(true);
};

const handleCreateCase = async (caseData) => {
  try {
    // Create the new case
    const newCase = await Case.create(caseData);

    // Close the modal
    showNewCaseModal.value = false;

    // Show success message
    alert('Case request submitted successfully! A lawyer will review your case and contact you soon.');

    // Reload dashboard to ensure consistency
    await loadCustomerDashboard(false); // Don't show loader for refresh after creation
  } catch (error) {
    console.error('Failed to create case:', error);
    alert('Failed to submit case request. Please try again.');
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
