<template>
  <div class=" bg-gray-50 min-h-screen flex">
    <aside class="w-64 flex flex-col gap-6 bg-white border-r-2 border-r-gray-400">
      <header class="flex flex-col bg-white py-4 px-4 text-gray-800 border-b border-b-gray-400">
        <h1 class="font-bold text-2xl flex gap-2 items-center text-[#003aca]">
          <Scale size="26" />
          LegalHub
        </h1>
        <p class="mt-2 text-sm text-gray-500">Welcome back, {{ user?.full_name?.split(' ')[0] || 'User' }}</p>
      </header>

      <div class="w-30 h-30 mx-auto my-1 flex flex-col items-center justify-center">
        <div class="w-14 h-14 bg-gray-100 flex items-center justify-center rounded-full">
          <UserIcon class="text-[#003aca]" />
        </div>
        <h2 class="font-semibold text-gray-700 mt-2">Profile</h2>
      </div>

      <nav class="px-3 py-4 space-y-2">
        <button type="button" @click="selectedView = 'Dashboard'" :class="['nav-link', {active: selectedView === 'Dashboard'}]">
          <span class="icon-wrap bg-white rounded-md p-2 flex items-center justify-center">
            <House class="nav-icon" size="20" />
          </span>
          <span class="nav-text">Dashboard</span>
        </button>

        <button type="button" @click="selectedView = 'Cases'" :class="['nav-link', {active: selectedView === 'Cases'}]">
          <span class="icon-wrap bg-white rounded-md p-2 flex items-center justify-center">
            <FileText class="nav-icon" size="20" />
          </span>
          <span class="nav-text">Cases</span>
        </button>

        <button type="button" @click="selectedView = 'MyCases'" :class="['nav-link', {active: selectedView === 'MyCases'}]">
          <span class="icon-wrap bg-white rounded-md p-2 flex items-center justify-center">
            <FileText class="nav-icon" size="20" />
          </span>
          <span class="nav-text">My Cases</span>
          
        </button>

        <button type="button" @click="selectedView = 'Documents'" :class="['nav-link', {active: selectedView === 'Documents'}]">
          <span class="icon-wrap bg-white rounded-md p-2 flex items-center justify-center">
            <File class="nav-icon" size="20" />
          </span>
          <span class="nav-text">Documents</span>
        </button>

        <button type="button" @click="selectedView = 'Schedule'" :class="['nav-link', {active: selectedView === 'Schedule'}]">
          <span class="icon-wrap bg-white rounded-md p-2 flex items-center justify-center">
            <Calendar class="nav-icon" size="20" />
          </span>
          <span class="nav-text">Schedule</span>
        </button>

        <button type="button" @click="selectedView = 'LegalResearch'" :class="['nav-link', {active: selectedView === 'LegalResearch'}]">
          <span class="icon-wrap bg-white rounded-md p-2 flex items-center justify-center">
            <Search class="nav-icon" size="20" />
          </span>
          <span class="nav-text">Legal Research</span>
        </button>

        <button type="button" @click="selectedView = 'Users'" :class="['nav-link', {active: selectedView === 'Users'}]">
          <span class="icon-wrap bg-white rounded-md p-2 flex items-center justify-center">
            <Users class="nav-icon" size="20" />
          </span>
          <span class="nav-text">Users</span>
        </button>

        <button type="button" @click="selectedView = 'Settings'" :class="['nav-link', {active: selectedView === 'Settings'}]">
          <span class="icon-wrap bg-white rounded-md p-2 flex items-center justify-center">
            <Settings class="nav-icon" size="20" />
          </span>
          <span class="nav-text">Settings</span>
        </button>

        <button type="button" @click="selectedView = 'Help'" :class="['nav-link', {active: selectedView === 'Help'}]">
          <span class="icon-wrap bg-white rounded-md p-2 flex items-center justify-center">
            <HelpCircle class="nav-icon" size="20" />
          </span>
          <span class="nav-text">Help</span>
        </button>

        <button type="button" @click="selectedView = 'GuestAccess'" :class="['nav-link', {active: selectedView === 'GuestAccess'}]">
          <span class="icon-wrap bg-white rounded-md p-2 flex items-center justify-center">
            <House class="nav-icon" size="20" />
          </span>
          <span class="nav-text">Guest Access</span>
        </button>
      </nav>
    </aside>

<div class="w-1/6 border-gray-400 border-r">
  <h1 class="bg-white h-23 text-gray-600 border-b border-gray-400">AI Assistant</h1>
</div>

    <main class="flex-1 p-6">
      <div v-if="selectedView === 'Dashboard'">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h2 class="text-3xl font-bold text-gray-800 flex items-center gap-3">
              <FileText class="w-7 h-7 text-[#003aca]" />
              Cases Management
            </h2>
            <p class="text-gray-500 mt-1">Manage and track all your legal cases</p>
          </div>
          <div class="flex items-center gap-3">
            <button class="px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 text-sm">AI Analysis</button>
            <button class="px-4 py-2 bg-[#003aca] text-white rounded-md hover:bg-[#0031a0] text-sm font-medium">New Case</button>
          </div>
        </div>

        <!-- Stats row -->
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
          <div class="p-4 bg-white rounded-lg border border-gray-200">
            <div class="flex items-center justify-between">
              <p class="text-xs text-gray-600 font-medium">Total Cases</p>
              <FileText class="w-4 h-4 text-blue-600" />
            </div>
            <p class="text-2xl font-bold text-gray-900 mt-2">{{ stats.totalCases }}</p>
          </div>
          <div class="p-4 bg-white rounded-lg border border-gray-200">
            <div class="flex items-center justify-between">
              <p class="text-xs text-gray-600 font-medium">Open</p>
              <Clock class="w-4 h-4 text-orange-600" />
            </div>
            <p class="text-2xl font-bold text-gray-900 mt-2">{{ casesStats.open }}</p>
          </div>
          <div class="p-4 bg-white rounded-lg border border-gray-200">
            <div class="flex items-center justify-between">
              <p class="text-xs text-gray-600 font-medium">In Progress</p>
              <AlertTriangle class="w-4 h-4 text-yellow-600" />
            </div>
            <p class="text-2xl font-bold text-gray-900 mt-2">{{ casesStats.in_progress }}</p>
          </div>
          <div class="p-4 bg-white rounded-lg border border-gray-200">
            <div class="flex items-center justify-between">
              <p class="text-xs text-gray-600 font-medium">Closed</p>
              <CheckSquare class="w-4 h-4 text-green-600" />
            </div>
            <p class="text-2xl font-bold text-gray-900 mt-2">{{ casesStats.closed }}</p>
          </div>
          <div class="p-4 bg-white rounded-lg border border-gray-200">
            <div class="flex items-center justify-between">
              <p class="text-xs text-gray-600 font-medium">Archived</p>
              <File class="w-4 h-4 text-purple-600" />
            </div>
            <p class="text-2xl font-bold text-gray-900 mt-2">{{ casesStats.archived }}</p>
          </div>
          <div class="p-4 bg-white rounded-lg border border-gray-200">
            <div class="flex items-center justify-between">
              <p class="text-xs text-gray-600 font-medium">On Hold</p>
              <Clock class="w-4 h-4 text-gray-600" />
            </div>
            <p class="text-2xl font-bold text-gray-900 mt-2">{{ casesStats.on_hold }}</p>
          </div>
        </div>

        <!-- Tabs and Filters -->
        <div class="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div class="flex items-center justify-between mb-4 border-b border-gray-200 pb-3">
            <div class="flex items-center gap-6">
              <button
                @click="activeTab = 'active'"
                :class="['text-sm font-medium pb-2 border-b-2 transition', activeTab === 'active' ? 'text-blue-600 border-blue-600' : 'text-gray-500 border-transparent hover:text-gray-700']"
              >
                Active Cases
                <span class="ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs">{{ activeCasesCount }}</span>
              </button>
              <button
                @click="activeTab = 'archived'"
                :class="['text-sm font-medium pb-2 border-b-2 transition', activeTab === 'archived' ? 'text-blue-600 border-blue-600' : 'text-gray-500 border-transparent hover:text-gray-700']"
              >
                Archived
                <span class="ml-2 px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs">{{ casesStats.archived }}</span>
              </button>
            </div>
          </div>

          <!-- Search and Filters -->
          <div class="flex items-center gap-3 mb-6">
            <div class="flex-1 relative">
              <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search cases by title, number, or description..."
                class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select v-model="filterStatus" class="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">All Status</option>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="closed">Closed</option>
              <option value="on_hold">On Hold</option>
            </select>
            <select v-model="filterPriority" class="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">All Priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
            <select v-model="filterType" class="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">All Types</option>
              <option value="civil">Civil</option>
              <option value="criminal">Criminal</option>
              <option value="family">Family</option>
              <option value="corporate">Corporate</option>
              <option value="immigration">Immigration</option>
              <option value="personal_injury">Personal Injury</option>
              <option value="other">Other</option>
            </select>
          </div>

          <!-- Case Cards Grid -->
          <div v-if="isLoading" class="text-center py-12">
            <div class="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p class="text-gray-500 mt-3">Loading cases...</p>
          </div>
          <div v-else-if="filteredCases.length === 0" class="text-center py-12">
            <FileText class="w-16 h-16 text-gray-300 mx-auto mb-3" />
            <p class="text-gray-500">No cases found</p>
          </div>
          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div
              v-for="caseItem in filteredCases"
              :key="caseItem.id"
              class="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
            >
              <div class="flex items-start justify-between mb-2">
                <h3 class="font-semibold text-gray-900 text-base">{{ caseItem.title }}</h3>
                <button class="text-gray-400 hover:text-gray-600">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                </button>
              </div>
              <p class="text-xs text-gray-500 mb-2">Case #{{ caseItem.case_number }}</p>
              <p class="text-sm text-gray-600 mb-3 line-clamp-2">{{ caseItem.description || 'No description available' }}</p>

              <div class="flex items-center gap-2 mb-3">
                <span :class="['px-2 py-1 rounded text-xs font-medium', getStatusBadgeColor(caseItem.status)]">
                  {{ caseItem.status }}
                </span>
                <span :class="['px-2 py-1 rounded text-xs font-medium', getPriorityBadgeColor(caseItem.priority)]">
                  {{ caseItem.priority }} priority
                </span>
                <span class="px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700">
                  {{ caseItem.case_type || 'civil' }}
                </span>
              </div>

              <div class="flex items-center justify-between text-xs text-gray-500 mb-3">
                <span class="flex items-center gap-1">
                  <Clock class="w-3 h-3" />
                  Updated: {{ formatDate(caseItem.updated_date || caseItem.created_date) }}
                </span>
              </div>

              <button class="w-full py-2 border border-blue-600 text-blue-600 rounded-md text-sm font-medium hover:bg-blue-50 transition">
                View Case
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-else-if="selectedView === 'Cases'">
        <h2 class="text-2xl font-semibold mb-4">Cases</h2>
        <p class="text-gray-600">Cases list / filters will appear here.</p>
      </div>

      <div v-else-if="selectedView === 'MyCases'">
        <h2 class="text-2xl font-semibold mb-4">My Cases</h2>
        <p class="text-gray-600">Your personal cases will appear here.</p>
        <MyCases/>
      </div>

      <div v-else-if="selectedView === 'Documents'">
        <h2 class="text-2xl font-semibold mb-4">Documents</h2>
        <p class="text-gray-600">Document manager will appear here.</p>
        <!-- <MyDocument/> -->
      </div>

      <div v-else-if="selectedView === 'Schedule'">
        <h2 class="text-2xl font-semibold mb-4">Schedule</h2>
        <p class="text-gray-600">Schedule and calendar will appear here.</p>
      </div>

      <div v-else-if="selectedView === 'LegalResearch'">
        <h2 class="text-2xl font-semibold mb-4">Legal Research</h2>
        <p class="text-gray-600">Research tools will appear here.</p>
      </div>

      <div v-else-if="selectedView === 'Users'">
        <h2 class="text-2xl font-semibold mb-4">Users</h2>
        <p class="text-gray-600">User management will appear here.</p>
      </div>

      <div v-else-if="selectedView === 'Settings'">
        <h2 class="text-2xl font-semibold mb-4">Settings</h2>
        <p class="text-gray-600">Application settings will appear here.</p>
      </div>

      <div v-else-if="selectedView === 'Help'">
        <h2 class="text-2xl font-semibold mb-4">Help</h2>
        <p class="text-gray-600">Help content will appear here.</p>
      </div>

      <div v-else-if="selectedView === 'GuestAccess'">
        <h2 class="text-2xl font-semibold mb-4">Guest Access</h2>
        <p class="text-gray-600">Guest access controls will appear here.</p>
      </div>
    </main>

 <div class="w-1/6  border-gray-400 border-l">
  <h1 class="bg-white h-23 text-gray-600 border-b border-gray-400">Comment</h1>
 </div>
   

  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { Case, Comment, ActionItem } from '@/services/entities';
import { User } from '@/services/entities';
import { createPageUrl } from '@/utils';
import { FileText, MessageCircle, CheckSquare, Clock, AlertTriangle, TrendingUp, Calendar, Plus, Scale, House, Users,Settings, HelpCircle, File, Search, UserIcon} from 'lucide-vue-next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { format } from 'date-fns';
import MyCases from "../views/MyCases.vue";
import MyDocument from "../views/Documents.vue";
import DocumentViewer from "../views/DocumentViewer.vue"



const user = ref(null);
const cases = ref([]);
const recentComments = ref([]);
const pendingActions = ref([]);
const conflictAlerts = ref([]);
const stats = ref({ totalCases: 0, activeCases: 0, completedActions: 0, pendingActions: 0 });
const isLoading = ref(true);

// Dashboard filters and state
const activeTab = ref('active');
const searchQuery = ref('');
const filterStatus = ref('');
const filterPriority = ref('');
const filterType = ref('');

const loadDashboardData = async () => {
  isLoading.value = true;
  try {
    const userData = await User.me();
    user.value = userData;

    let userCases = [];
    if (userData.user_type === 'lawyer' || userData.user_type === 'admin') {
      userCases = await Case.filter(userData.user_type === 'admin' ? {} : { lawyer_id: userData.id }, '-updated_date', 10);
    } else if (userData.user_type === 'customer') {
      userCases = await Case.list('-updated_date', 10);
      userCases = userCases.filter(c => c.customer_ids?.includes(userData.id));
    }

    cases.value = userCases;

    const casesWithConflicts = userCases.filter(c => c.ai_conflict_assessment?.has_conflicts && c.ai_conflict_assessment?.conflict_level && c.ai_conflict_assessment.conflict_level !== 'low');
    conflictAlerts.value = casesWithConflicts;

    if (userCases.length > 0) {
      const caseIds = userCases.map(c => c.id);
      const commentsList = await Comment.list('-created_date', 5);
      recentComments.value = commentsList.filter(c => caseIds.includes(c.case_id));

      const actions = await ActionItem.filter({ status: 'pending' }, '-due_date', 10);
      pendingActions.value = actions.filter(a => caseIds.includes(a.case_id));

      const activeCases = userCases.filter(c => c.status === 'open' || c.status === 'in_progress').length;
      const totalActions = await ActionItem.list();
      const userActions = totalActions.filter(a => caseIds.includes(a.case_id));
      const completedActions = userActions.filter(a => a.status === 'completed').length;

      stats.value = {
        totalCases: userCases.length,
        activeCases,
        completedActions,
        pendingActions: pendingActions.value.length,
      };
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Failed to load dashboard data:', err);
  }
  isLoading.value = false;
};

onMounted(() => loadDashboardData());

const getStatusColor = (status) => {
  switch (status) {
    case 'open': return 'bg-blue-100 text-blue-800';
    case 'in_progress': return 'bg-yellow-100 text-yellow-800';
    case 'closed': return 'bg-green-100 text-green-800';
    case 'on_hold': return 'bg-gray-100 text-gray-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getPriorityColor = (priority) => {
  switch (priority) {
    case 'urgent': return 'bg-red-100 text-red-800';
    case 'high': return 'bg-orange-100 text-orange-800';
    case 'medium': return 'bg-yellow-100 text-yellow-800';
    case 'low': return 'bg-green-100 text-green-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const formatDate = (d) => {
  try { return format(new Date(d), 'MMM d, yyyy'); } catch (e) { return ''; }
};

const productivityPercent = computed(() => {
  const completed = stats.value.completedActions || 0;
  const pending = stats.value.pendingActions || 0;
  const total = completed + pending;
  return total > 0 ? Math.round((completed / total) * 100) : 0;
});

// Cases stats breakdown
const casesStats = computed(() => {
  const allCases = cases.value || [];
  return {
    open: allCases.filter(c => c.status === 'open').length,
    in_progress: allCases.filter(c => c.status === 'in_progress').length,
    closed: allCases.filter(c => c.status === 'closed').length,
    on_hold: allCases.filter(c => c.status === 'on_hold').length,
    archived: allCases.filter(c => c.status === 'archived').length,
  };
});

// Filtered cases based on tab, search, and filters
const filteredCases = computed(() => {
  let filtered = cases.value || [];

  // Filter by tab
  if (activeTab.value === 'active') {
    filtered = filtered.filter(c => c.status !== 'archived');
  } else if (activeTab.value === 'archived') {
    filtered = filtered.filter(c => c.status === 'archived');
  }

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(c =>
      c.title?.toLowerCase().includes(query) ||
      c.case_number?.toLowerCase().includes(query) ||
      c.description?.toLowerCase().includes(query)
    );
  }

  // Status filter
  if (filterStatus.value) {
    filtered = filtered.filter(c => c.status === filterStatus.value);
  }

  // Priority filter
  if (filterPriority.value) {
    filtered = filtered.filter(c => c.priority === filterPriority.value);
  }

  // Type filter
  if (filterType.value) {
    filtered = filtered.filter(c => c.case_type === filterType.value);
  }

  return filtered;
});

// Active cases count
const activeCasesCount = computed(() => {
  return (cases.value || []).filter(c => c.status !== 'archived').length;
});

// Badge color helpers
const getStatusBadgeColor = (status) => {
  switch (status) {
    case 'open': return 'bg-blue-100 text-blue-700 border border-blue-200';
    case 'in_progress': return 'bg-yellow-100 text-yellow-700 border border-yellow-200';
    case 'closed': return 'bg-green-100 text-green-700 border border-green-200';
    case 'on_hold': return 'bg-gray-100 text-gray-700 border border-gray-200';
    case 'archived': return 'bg-purple-100 text-purple-700 border border-purple-200';
    default: return 'bg-gray-100 text-gray-700 border border-gray-200';
  }
};

const getPriorityBadgeColor = (priority) => {
  switch (priority) {
    case 'urgent': return 'bg-red-100 text-red-700 border border-red-200';
    case 'high': return 'bg-orange-100 text-orange-700 border border-orange-200';
    case 'medium': return 'bg-yellow-100 text-yellow-700 border border-yellow-200';
    case 'low': return 'bg-green-100 text-green-700 border border-green-200';
    default: return 'bg-gray-100 text-gray-700 border border-gray-200';
  }
};

// Local view selection for aside -> main content behavior
const selectedView = ref('Dashboard');

// `createPageUrl` is imported above and available to the template

</script>

<style scoped>
.nav-link{
  display:flex;
  align-items:center;
  gap:0.75rem;
  padding:0.45rem 1.6rem;
  border-radius:0.5rem;
  color: #374151; /* gray-700 */
  text-decoration:none;
}
.nav-link .nav-icon{ width:20px; height:20px; color:#4b5563; }
.icon-wrap{ width:36px; height:36px; display:inline-flex; align-items:center; justify-content:center; }
.nav-link:hover{ background-color:#f8fafc; color:#0ea5e9; width:100%;}
.nav-link:active{ background-color:#f8fafc; color:#0ea5e9; width:100%;}
.nav-link.active{ background-color:#eef2ff; width:100%;}
.nav-link.active .nav-icon{ color:#003aca; width:100%;}
.router-link-active{ background-color:#eef2ff; color:#075985; }
.nav-text{ font-size:0.95rem; }
main{ background-color: #f8fafc; min-height:100vh; }

/* Line clamp utility for truncating text */
.line-clamp-2 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
}
</style>
