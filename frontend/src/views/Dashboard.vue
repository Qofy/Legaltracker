<template>
  <div class="p-6 space-y-6 bg-gray-50 min-h-screen">
    <!-- Welcome Header -->
    <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Welcome back, {{ user?.full_name?.split(' ')[0] || 'User' }}</h1>
        <p class="text-gray-600 mt-1">Here's what's happening with your {{ user?.user_type === 'lawyer' ? 'practice' : 'cases' }} today</p>
      </div>
      <div class="flex space-x-3">
        <router-link v-if="user && (user.user_type === 'lawyer' || user.user_type === 'admin')" :to="createPageUrl('Cases')">
          <Button class="bg-blue-600 hover:bg-blue-700 material-elevation-2">
            <Plus class="w-4 h-4 mr-2" />
            New Case
          </Button>
        </router-link>
      </div>
    </div>

    <!-- Conflict Alerts -->
    <Card v-if="conflictAlerts.length > 0" class="border-red-300 bg-red-50 material-elevation-2">
      <CardHeader>
        <CardTitle class="text-lg font-semibold text-red-900 flex items-center">
          <AlertTriangle class="w-5 h-5 mr-2" />
          Conflict Alerts ({{ conflictAlerts.length }})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div class="space-y-2">
          <div v-for="case_ in conflictAlerts.slice(0,3)" :key="case_.id">
            <router-link :to="createPageUrl('CaseDetails') + `?caseId=${case_.id}`" class="block">
              <div class="flex items-center justify-between p-3 rounded-lg bg-red-100 hover:bg-red-200 transition-colors">
                <div class="flex-1">
                  <p class="font-medium text-red-900">{{ case_.title }}</p>
                  <p class="text-xs text-red-800">Case #{{ case_.case_number }} • {{ (case_.ai_conflict_assessment?.conflicts_found?.length) || 0 }} conflict(s) detected</p>
                </div>
                <Badge class="bg-red-600 text-white">{{ (case_.ai_conflict_assessment?.conflict_level || '').toUpperCase() }}</Badge>
              </div>
            </router-link>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card class="material-elevation-2 hover:material-elevation-3 transition-shadow duration-300">
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium text-gray-600">Total Cases</CardTitle>
          <FileText class="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold text-gray-900">{{ stats.totalCases }}</div>
          <p class="text-xs text-gray-500 mt-1">
            <span class="text-green-600 font-medium">
              <TrendingUp class="inline w-3 h-3 mr-1" />
              {{ stats.activeCases }} active
            </span>
          </p>
        </CardContent>
      </Card>

      <Card class="material-elevation-2 hover:material-elevation-3 transition-shadow duration-300">
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium text-gray-600">Pending Actions</CardTitle>
          <Clock class="h-4 w-4 text-orange-600" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold text-gray-900">{{ stats.pendingActions }}</div>
          <p class="text-xs text-gray-500 mt-1">Require your attention</p>
        </CardContent>
      </Card>

      <Card class="material-elevation-2 hover:material-elevation-3 transition-shadow duration-300">
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium text-gray-600">Completed Actions</CardTitle>
          <CheckSquare class="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold text-gray-900">{{ stats.completedActions }}</div>
          <p class="text-xs text-gray-500 mt-1">This month</p>
        </CardContent>
      </Card>

      <Card class="material-elevation-2 hover:material-elevation-3 transition-shadow duration-300">
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium text-gray-600">Productivity</CardTitle>
          <TrendingUp class="h-4 w-4 text-purple-600" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold text-gray-900">{{ productivityPercent }}%</div>
          <Progress :value="productivityPercent" class="mt-2 h-1" />
        </CardContent>
      </Card>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Recent Cases -->
      <Card class="lg:col-span-2 material-elevation-2">
        <CardHeader class="flex flex-row items-center justify-between">
          <CardTitle class="text-lg font-semibold text-gray-900">Recent Cases</CardTitle>
          <router-link :to="createPageUrl(user?.user_type === 'customer' ? 'MyCases' : 'Cases')">
            <Button variant="outline" size="sm">View All</Button>
          </router-link>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            <div v-if="cases.length === 0" class="text-center py-8">
              <FileText class="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p class="text-gray-500">No cases found</p>
            </div>

            <div v-else>
              <div v-for="case_ in cases.slice(0,5)" :key="case_.id">
                <router-link :to="createPageUrl('CaseDetails') + `?caseId=${case_.id}`" class="block">
                  <div class="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors duration-200 border border-gray-100">
                    <div class="flex-1">
                      <div class="flex items-center space-x-3 mb-2">
                        <h3 class="font-medium text-gray-900">{{ case_.title }}</h3>
                        <Badge :class="getStatusColor(case_.status)">{{ case_.status?.replace('_',' ') }}</Badge>
                        <Badge :class="getPriorityColor(case_.priority)">{{ case_.priority }}</Badge>
                      </div>
                      <p class="text-sm text-gray-600 truncate">Case #{{ case_.case_number }} • {{ case_.case_type?.replace('_',' ') }}</p>
                    </div>
                    <div class="text-right text-sm text-gray-500">
                      <div v-if="case_.due_date" class="flex items-center space-x-1">
                        <Calendar class="w-4 h-4" />
                        <span>{{ formatDate(case_.due_date) }}</span>
                      </div>
                    </div>
                  </div>
                </router-link>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Right Column -->
      <div class="space-y-6">
        <!-- Pending Actions -->
        <Card class="material-elevation-2">
          <CardHeader>
            <CardTitle class="text-lg font-semibold text-gray-900 flex items-center">
              <AlertTriangle class="w-5 h-5 text-orange-600 mr-2" />
              Pending Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div class="space-y-3">
              <div v-if="pendingActions.length === 0" class="text-center text-gray-500 py-4">No pending actions</div>
              <div v-else>
                <div v-for="action in pendingActions.slice(0,3)" :key="action.id" class="flex items-center space-x-3 p-3 rounded-lg bg-orange-50 border border-orange-200">
                  <div class="flex-1">
                    <h4 class="font-medium text-gray-900 text-sm">{{ action.title }}</h4>
                    <p class="text-xs text-gray-600">Due: {{ action.due_date ? formatDate(action.due_date) : 'No due date' }}</p>
                  </div>
                  <Badge :class="getPriorityColor(action.priority)">{{ action.priority }}</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Recent Comments -->
        <Card class="material-elevation-2">
          <CardHeader>
            <CardTitle class="text-lg font-semibold text-gray-900 flex items-center">
              <MessageCircle class="w-5 h-5 text-blue-600 mr-2" />
              Recent Comments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div class="space-y-3">
              <div v-if="recentComments.length === 0" class="text-center text-gray-500 py-4">No recent comments</div>
              <div v-else>
                <div v-for="comment in recentComments" :key="comment.id" class="flex space-x-3">
                  <Avatar class="h-8 w-8">
                    <AvatarFallback class="bg-blue-100 text-blue-600 text-xs">{{ comment.created_by?.[0]?.toUpperCase() || 'U' }}</AvatarFallback>
                  </Avatar>
                  <div class="flex-1">
                    <p class="text-sm text-gray-800 line-clamp-2">{{ comment.content }}</p>
                    <p class="text-xs text-gray-500 mt-1">{{ formatDate(comment.created_date) }}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { Case, Comment, ActionItem } from '@/services/entities';
import { User } from '@/services/entities';
import { createPageUrl } from '@/utils';
import { FileText, MessageCircle, CheckSquare, Clock, AlertTriangle, TrendingUp, Calendar, Plus } from 'lucide-vue-next';
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

// `createPageUrl` is imported above and available to the template

</script>

<style scoped></style>
