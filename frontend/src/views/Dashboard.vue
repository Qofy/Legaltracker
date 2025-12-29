<template>
  <div class=" bg-gray-50 min-h-screen flex">
    <aside class="w-64 flex flex-col gap-6 bg-white border-r">
      <header class="flex flex-col bg-[#003aca] py-4 px-4 text-amber-50">
        <h1 class="font-bold text-2xl flex gap-2 items-center">
          <Scale size="26" />
          LegalCases
        </h1>
        <p class="mt-2 text-sm">Welcome back, {{ user?.full_name?.split(' ')[0] || 'User' }}</p>
      </header>

      <div class=" w-30 h-30 mx-auto my-1 flex flex-col items-center justify-center">
      <div class="w-15 h-15 bg-amber-100 flex items-center justify-center rounded-full"> 
        <UserIcon/>
      </div>
        <h2 class="font-bold">Profile</h2>
      </div>

      <nav class="px-3 py-4 space-y-2">
        <button type="button" @click="selectedView = 'Dashboard'" :class="['nav-link', {active: selectedView === 'Dashboard'}]">
          <House class="nav-icon" />
          <span class="nav-text">Dashboard</span>
        </button>

        <button type="button" @click="selectedView = 'Cases'" :class="['nav-link', {active: selectedView === 'Cases'}]">
          <FileText class="nav-icon" />
          <span class="nav-text">Cases</span>
        </button>

        <button type="button" @click="selectedView = 'MyCases'" :class="['nav-link', {active: selectedView === 'MyCases'}]">
          <FileText class="nav-icon" />
          <span class="nav-text">My Cases</span>
        </button>

        <button type="button" @click="selectedView = 'Documents'" :class="['nav-link', {active: selectedView === 'Documents'}]">
          <File class="nav-icon" />
          <span class="nav-text">Documents</span>
        </button>

        <button type="button" @click="selectedView = 'Schedule'" :class="['nav-link', {active: selectedView === 'Schedule'}]">
          <Calendar class="nav-icon" />
          <span class="nav-text">Schedule</span>
        </button>

        <button type="button" @click="selectedView = 'LegalResearch'" :class="['nav-link', {active: selectedView === 'LegalResearch'}]">
          <Search class="nav-icon" />
          <span class="nav-text">Legal Research</span>
        </button>

        <button type="button" @click="selectedView = 'Users'" :class="['nav-link', {active: selectedView === 'Users'}]">
          <Users class="nav-icon" />
          <span class="nav-text">Users</span>
        </button>

        <button type="button" @click="selectedView = 'Settings'" :class="['nav-link', {active: selectedView === 'Settings'}]">
          <Settings class="nav-icon" />
          <span class="nav-text">Settings</span>
        </button>

        <button type="button" @click="selectedView = 'Help'" :class="['nav-link', {active: selectedView === 'Help'}]">
          <HelpCircle class="nav-icon" />
          <span class="nav-text">Help</span>
        </button>

        <button type="button" @click="selectedView = 'GuestAccess'" :class="['nav-link', {active: selectedView === 'GuestAccess'}]">
          <House class="nav-icon" />
          <span class="nav-text">Guest Access</span>
        </button>
      </nav>
    </aside>

<div class="w-1/6">
  <h1 class="bg-[#003aca] h-23 text-amber-50  border-r-4 border-gray-50">Ai Assistant</h1>
</div>

    <main class="flex-1 p-6">
      <div v-if="selectedView === 'Dashboard'">
        <h2 class="text-2xl font-semibold mb-4">Dashboard</h2>
        <p class="text-gray-600">Overview and widgets will appear here.</p>
      </div>

      <div v-else-if="selectedView === 'Cases'">
        <h2 class="text-2xl font-semibold mb-4">Cases</h2>
        <p class="text-gray-600">Cases list / filters will appear here.</p>
      </div>

      <div v-else-if="selectedView === 'MyCases'">
        <h2 class="text-2xl font-semibold mb-4">My Cases</h2>
        <p class="text-gray-600">Your personal cases will appear here.</p>
      </div>

      <div v-else-if="selectedView === 'Documents'">
        <h2 class="text-2xl font-semibold mb-4">Documents</h2>
        <p class="text-gray-600">Document manager will appear here.</p>
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

 <div class="w-1/6">
  <h1 class="bg-[#003aca] h-23 text-amber-50  border-l-4 border-gray-50">Comment</h1>
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


const user = ref(null);
const cases = ref([]);
const recentComments = ref([]);
const pendingActions = ref([]);
const conflictAlerts = ref([]);
const stats = ref({ totalCases: 0, activeCases: 0, completedActions: 0, pendingActions: 0 });
const isLoading = ref(true);

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

// Local view selection for aside -> main content behavior
const selectedView = ref('Dashboard');

// `createPageUrl` is imported above and available to the template

</script>

<style scoped>
.nav-link{
  display:flex;
  align-items:center;
  gap:0.75rem;
  padding:0.45rem 0.6rem;
  border-radius:0.5rem;
  color:var(--tw-text-opacity, 1) ;
  color: #374151; /* gray-700 */
  text-decoration:none;
}
.nav-link .nav-icon{ width:20px; height:20px; color:#4b5563; }
.nav-link:hover{ background-color:#f3f4f6; color:#0ea5e9; }
.router-link-active{ background-color:#eef2ff; color:#075985; }
.nav-text{ font-size:0.95rem; }
main{ background-color: #f8fafc; min-height:100vh; }
</style>
