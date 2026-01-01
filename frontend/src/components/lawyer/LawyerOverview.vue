<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h2 class="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <svg class="w-7 h-7 text-[#003aca]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          Lawyer Dashboard
        </h2>
        <p class="text-gray-500 mt-1">Your personal caseload and activities</p>
      </div>
    </div>

    <!-- Stats Overview -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-white rounded-lg border border-gray-200 p-5">
        <div class="flex items-center justify-between mb-2">
          <p class="text-sm text-gray-600 font-medium">My Cases</p>
          <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <p class="text-3xl font-bold text-gray-900">{{ stats.totalCases }}</p>
        <p class="text-xs text-gray-500 mt-1">{{ stats.activeCases }} active</p>
      </div>

      <div class="bg-white rounded-lg border border-gray-200 p-5">
        <div class="flex items-center justify-between mb-2">
          <p class="text-sm text-gray-600 font-medium">Pending Tasks</p>
          <svg class="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <p class="text-3xl font-bold text-gray-900">{{ stats.pendingTasks }}</p>
        <p class="text-xs text-gray-500 mt-1">{{ stats.dueSoon }} due soon</p>
      </div>

      <div class="bg-white rounded-lg border border-gray-200 p-5">
        <div class="flex items-center justify-between mb-2">
          <p class="text-sm text-gray-600 font-medium">Active Clients</p>
          <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <p class="text-3xl font-bold text-gray-900">{{ stats.activeClients }}</p>
        <p class="text-xs text-gray-500 mt-1">{{ stats.totalClients }} total</p>
      </div>

      <div class="bg-white rounded-lg border border-gray-200 p-5">
        <div class="flex items-center justify-between mb-2">
          <p class="text-sm text-gray-600 font-medium">Upcoming Deadlines</p>
          <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p class="text-3xl font-bold text-gray-900">{{ stats.upcomingDeadlines }}</p>
        <p class="text-xs text-gray-500 mt-1">Next 7 days</p>
      </div>
    </div>

    <!-- Recent Activities and Case Status -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Assigned Cases Status -->
      <div class="bg-white rounded-lg border border-gray-200 p-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <svg class="w-5 h-5 text-[#003aca]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Case Status Breakdown
        </h3>
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 rounded-full bg-blue-600"></div>
              <span class="text-sm text-gray-700">Open</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-sm font-semibold text-gray-900">{{ casesByStatus.open }}</span>
              <div class="w-24 bg-gray-200 rounded-full h-2">
                <div class="bg-blue-600 h-2 rounded-full" :style="`width: ${getPercentage(casesByStatus.open)}%`"></div>
              </div>
            </div>
          </div>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 rounded-full bg-yellow-600"></div>
              <span class="text-sm text-gray-700">In Progress</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-sm font-semibold text-gray-900">{{ casesByStatus.in_progress }}</span>
              <div class="w-24 bg-gray-200 rounded-full h-2">
                <div class="bg-yellow-600 h-2 rounded-full" :style="`width: ${getPercentage(casesByStatus.in_progress)}%`"></div>
              </div>
            </div>
          </div>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 rounded-full bg-gray-600"></div>
              <span class="text-sm text-gray-700">On Hold</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-sm font-semibold text-gray-900">{{ casesByStatus.on_hold }}</span>
              <div class="w-24 bg-gray-200 rounded-full h-2">
                <div class="bg-gray-600 h-2 rounded-full" :style="`width: ${getPercentage(casesByStatus.on_hold)}%`"></div>
              </div>
            </div>
          </div>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 rounded-full bg-green-600"></div>
              <span class="text-sm text-gray-700">Closed</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-sm font-semibold text-gray-900">{{ casesByStatus.closed }}</span>
              <div class="w-24 bg-gray-200 rounded-full h-2">
                <div class="bg-green-600 h-2 rounded-full" :style="`width: ${getPercentage(casesByStatus.closed)}%`"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Activities -->
      <div class="bg-white rounded-lg border border-gray-200 p-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <svg class="w-5 h-5 text-[#003aca]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Recent Activities
        </h3>
        <div class="space-y-3 max-h-64 overflow-y-auto">
          <div v-if="recentActivities.length === 0" class="text-center py-8 text-gray-500">
            <p class="text-sm">No recent activities</p>
          </div>
          <div v-else v-for="activity in recentActivities" :key="activity.id" class="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0">
            <div class="w-2 h-2 rounded-full bg-blue-600 mt-2"></div>
            <div class="flex-1">
              <p class="text-sm text-gray-700">{{ activity.description }}</p>
              <p class="text-xs text-gray-500 mt-1">{{ formatDate(activity.created_at) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Client Communications Summary -->
    <div class="bg-white rounded-lg border border-gray-200 p-6">
      <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <svg class="w-5 h-5 text-[#003aca]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
        Recent Client Communications
      </h3>
      <div class="space-y-3">
        <div v-if="recentCommunications.length === 0" class="text-center py-8 text-gray-500">
          <p class="text-sm">No recent communications</p>
        </div>
        <div v-else v-for="comm in recentCommunications" :key="comm.id" class="flex items-start gap-4 p-4 rounded-lg border border-gray-200 hover:bg-gray-50">
          <div class="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
            <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div class="flex-1">
            <div class="flex items-center justify-between">
              <h4 class="font-semibold text-gray-900">{{ comm.client_name }}</h4>
              <span class="text-xs text-gray-500">{{ formatDate(comm.created_at) }}</span>
            </div>
            <p class="text-sm text-gray-600 mt-1">{{ comm.case_title }}</p>
            <p class="text-sm text-gray-700 mt-2">{{ comm.message }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { Case, ActionItem, ChatMessage } from '@/services/entities';
import { useAuthStore } from '@/stores/auth';
import { format } from 'date-fns';

const authStore = useAuthStore();

const stats = ref({
  totalCases: 0,
  activeCases: 0,
  pendingTasks: 0,
  dueSoon: 0,
  activeClients: 0,
  totalClients: 0,
  upcomingDeadlines: 0,
});

const casesByStatus = ref({
  open: 0,
  in_progress: 0,
  on_hold: 0,
  closed: 0,
});

const recentActivities = ref([]);
const recentCommunications = ref([]);

const loadLawyerDashboard = async () => {
  try {
    const userId = authStore.user?.id;
    if (!userId) return;

    // Fetch lawyer's assigned cases
    const cases = await Case.filter({ lawyer_id: userId });

    stats.value.totalCases = cases.length;
    stats.value.activeCases = cases.filter(c => c.status === 'open' || c.status === 'in_progress').length;

    // Count cases by status
    casesByStatus.value = {
      open: cases.filter(c => c.status === 'open').length,
      in_progress: cases.filter(c => c.status === 'in_progress').length,
      on_hold: cases.filter(c => c.status === 'on_hold').length,
      closed: cases.filter(c => c.status === 'closed').length,
    };

    // Fetch pending tasks for lawyer's cases
    const caseIds = cases.map(c => c.id);
    if (caseIds.length > 0) {
      const allTasks = await ActionItem.list();
      const lawyerTasks = allTasks.filter(t => caseIds.includes(t.case_id) && t.status === 'pending');
      stats.value.pendingTasks = lawyerTasks.length;

      // Count tasks due soon (within 3 days)
      const threeDaysFromNow = new Date();
      threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
      stats.value.dueSoon = lawyerTasks.filter(t => {
        if (!t.due_date) return false;
        const dueDate = new Date(t.due_date);
        return dueDate <= threeDaysFromNow;
      }).length;

      // Count upcoming deadlines
      const sevenDaysFromNow = new Date();
      sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
      stats.value.upcomingDeadlines = lawyerTasks.filter(t => {
        if (!t.due_date) return false;
        const dueDate = new Date(t.due_date);
        return dueDate <= sevenDaysFromNow;
      }).length;

      // Get unique clients
      const clientIds = new Set();
      cases.forEach(c => {
        if (c.customer_ids && Array.isArray(c.customer_ids)) {
          c.customer_ids.forEach(id => clientIds.add(id));
        }
      });
      stats.value.totalClients = clientIds.size;
      stats.value.activeClients = cases.filter(c => c.status === 'open' || c.status === 'in_progress')
        .reduce((acc, c) => {
          if (c.customer_ids && Array.isArray(c.customer_ids)) {
            c.customer_ids.forEach(id => acc.add(id));
          }
          return acc;
        }, new Set()).size;

      // Mock recent activities (in production, fetch from activity log)
      recentActivities.value = [
        { id: 1, description: 'Updated case status for Case #12345', created_at: new Date() },
        { id: 2, description: 'Uploaded new document to Case #12346', created_at: new Date(Date.now() - 3600000) },
        { id: 3, description: 'Added comment to Case #12347', created_at: new Date(Date.now() - 7200000) },
      ];

      // Fetch recent communications
      const messages = await ChatMessage.list('-created_date', 5);
      recentCommunications.value = messages
        .filter(m => caseIds.includes(m.case_id))
        .slice(0, 5)
        .map(m => ({
          id: m.id,
          client_name: 'Client Name', // In production, fetch from user data
          case_title: cases.find(c => c.id === m.case_id)?.title || 'Unknown Case',
          message: m.message,
          created_at: m.created_date,
        }));
    }
  } catch (error) {
    console.error('Failed to load lawyer dashboard:', error);
  }
};

const getPercentage = (count) => {
  if (stats.value.totalCases === 0) return 0;
  return Math.round((count / stats.value.totalCases) * 100);
};

const formatDate = (date) => {
  try {
    return format(new Date(date), 'MMM d, yyyy h:mm a');
  } catch (e) {
    return '';
  }
};

onMounted(() => {
  loadLawyerDashboard();
});
</script>
