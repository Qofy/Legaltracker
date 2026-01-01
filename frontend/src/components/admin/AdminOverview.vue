<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-2xl font-bold text-gray-800">System Overview</h2>
      <p class="text-gray-600 mt-1">View system-wide analytics and statistics</p>
    </div>

    <!-- System-wide Stats -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 font-medium">Total Users</p>
            <p class="text-3xl font-bold text-gray-900 mt-2">{{ stats.totalUsers }}</p>
            <p class="text-xs text-gray-500 mt-1">
              <span class="text-blue-600">{{ stats.activeUsers }}</span> active
            </p>
          </div>
          <div class="bg-blue-100 p-3 rounded-lg">
            <UsersIcon class="w-6 h-6 text-blue-600" />
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 font-medium">Total Cases</p>
            <p class="text-3xl font-bold text-gray-900 mt-2">{{ stats.totalCases }}</p>
            <p class="text-xs text-gray-500 mt-1">
              <span class="text-green-600">{{ stats.activeCases }}</span> active
            </p>
          </div>
          <div class="bg-green-100 p-3 rounded-lg">
            <FileTextIcon class="w-6 h-6 text-green-600" />
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 font-medium">Total Revenue</p>
            <p class="text-3xl font-bold text-gray-900 mt-2">${{ formatNumber(stats.totalRevenue) }}</p>
            <p class="text-xs text-gray-500 mt-1">
              <span class="text-green-600">+{{ stats.revenueGrowth }}%</span> this month
            </p>
          </div>
          <div class="bg-emerald-100 p-3 rounded-lg">
            <DollarSign class="w-6 h-6 text-emerald-600" />
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 font-medium">Active Lawyers</p>
            <p class="text-3xl font-bold text-gray-900 mt-2">{{ stats.activeLawyers }}</p>
            <p class="text-xs text-gray-500 mt-1">
              {{ stats.totalLawyers }} total
            </p>
          </div>
          <div class="bg-purple-100 p-3 rounded-lg">
            <BriefcaseIcon class="w-6 h-6 text-purple-600" />
          </div>
        </div>
      </div>
    </div>

    <!-- User Breakdown -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">User Breakdown</h3>
        <div class="space-y-3">
          <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div class="flex items-center gap-3">
              <div class="bg-blue-100 p-2 rounded">
                <ShieldIcon class="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p class="text-sm font-medium text-gray-900">Administrators</p>
                <p class="text-xs text-gray-500">Full system access</p>
              </div>
            </div>
            <span class="text-lg font-bold text-gray-900">{{ stats.adminCount }}</span>
          </div>

          <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div class="flex items-center gap-3">
              <div class="bg-purple-100 p-2 rounded">
                <BriefcaseIcon class="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p class="text-sm font-medium text-gray-900">Lawyers</p>
                <p class="text-xs text-gray-500">Legal professionals</p>
              </div>
            </div>
            <span class="text-lg font-bold text-gray-900">{{ stats.lawyerCount }}</span>
          </div>

          <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div class="flex items-center gap-3">
              <div class="bg-green-100 p-2 rounded">
                <UserIcon class="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p class="text-sm font-medium text-gray-900">Customers</p>
                <p class="text-xs text-gray-500">Client accounts</p>
              </div>
            </div>
            <span class="text-lg font-bold text-gray-900">{{ stats.customerCount }}</span>
          </div>
        </div>
      </div>

      <!-- Case Status Breakdown -->
      <div class="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">Case Status Overview</h3>
        <div class="space-y-3">
          <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div class="flex items-center gap-3">
              <div class="bg-orange-100 p-2 rounded">
                <ClockIcon class="w-5 h-5 text-orange-600" />
              </div>
              <span class="text-sm font-medium text-gray-900">Open</span>
            </div>
            <span class="text-lg font-bold text-gray-900">{{ stats.casesByStatus.open || 0 }}</span>
          </div>

          <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div class="flex items-center gap-3">
              <div class="bg-yellow-100 p-2 rounded">
                <AlertTriangleIcon class="w-5 h-5 text-yellow-600" />
              </div>
              <span class="text-sm font-medium text-gray-900">In Progress</span>
            </div>
            <span class="text-lg font-bold text-gray-900">{{ stats.casesByStatus.in_progress || 0 }}</span>
          </div>

          <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div class="flex items-center gap-3">
              <div class="bg-green-100 p-2 rounded">
                <CheckCircleIcon class="w-5 h-5 text-green-600" />
              </div>
              <span class="text-sm font-medium text-gray-900">Closed</span>
            </div>
            <span class="text-lg font-bold text-gray-900">{{ stats.casesByStatus.closed || 0 }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
      <h3 class="text-lg font-semibold text-gray-800 mb-4">Recent System Activity</h3>
      <div class="space-y-3">
        <div v-for="activity in recentActivity" :key="activity.id" class="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition">
          <div :class="['p-2 rounded-lg', getActivityColor(activity.type)]">
            <component :is="getActivityIcon(activity.type)" class="w-4 h-4" />
          </div>
          <div class="flex-1">
            <p class="text-sm font-medium text-gray-900">{{ activity.title }}</p>
            <p class="text-xs text-gray-600">{{ activity.description }}</p>
          </div>
          <span class="text-xs text-gray-500">{{ formatTime(activity.timestamp) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { usersService, casesService } from '@/services/api';
import {
  Users as UsersIcon,
  FileText as FileTextIcon,
  DollarSign,
  Briefcase as BriefcaseIcon,
  Shield as ShieldIcon,
  User as UserIcon,
  Clock as ClockIcon,
  AlertTriangle as AlertTriangleIcon,
  CheckCircle as CheckCircleIcon,
  UserPlus,
  FileCheck,
  Bell
} from 'lucide-vue-next';

const stats = ref({
  totalUsers: 0,
  activeUsers: 0,
  totalCases: 0,
  activeCases: 0,
  totalRevenue: 0,
  revenueGrowth: 0,
  activeLawyers: 0,
  totalLawyers: 0,
  adminCount: 0,
  lawyerCount: 0,
  customerCount: 0,
  casesByStatus: {
    open: 0,
    in_progress: 0,
    closed: 0,
    on_hold: 0
  }
});

const recentActivity = ref([
  {
    id: 1,
    type: 'user',
    title: 'New user registered',
    description: 'Jane Smith joined as a customer',
    timestamp: new Date(Date.now() - 1000 * 60 * 15)
  },
  {
    id: 2,
    type: 'case',
    title: 'New case created',
    description: 'Case #2024-001 was created by John Doe',
    timestamp: new Date(Date.now() - 1000 * 60 * 30)
  },
  {
    id: 3,
    type: 'system',
    title: 'System backup completed',
    description: 'Daily backup completed successfully',
    timestamp: new Date(Date.now() - 1000 * 60 * 60)
  }
]);

const loadStats = async () => {
  try {
    const [users, cases] = await Promise.all([
      usersService.getUsers(),
      casesService.getCases()
    ]);

    stats.value.totalUsers = users.length;
    stats.value.activeUsers = users.filter(u => u.is_active).length;
    stats.value.adminCount = users.filter(u => u.user_type === 'admin').length;
    stats.value.lawyerCount = users.filter(u => u.user_type === 'lawyer').length;
    stats.value.customerCount = users.filter(u => u.user_type === 'customer').length;
    stats.value.totalLawyers = stats.value.lawyerCount;
    stats.value.activeLawyers = users.filter(u => u.user_type === 'lawyer' && u.is_active).length;

    stats.value.totalCases = cases.length;
    stats.value.activeCases = cases.filter(c => c.status !== 'closed' && c.status !== 'archived').length;

    // Calculate cases by status
    stats.value.casesByStatus = cases.reduce((acc, c) => {
      acc[c.status] = (acc[c.status] || 0) + 1;
      return acc;
    }, {});

    // Mock revenue data (you would get this from a financial API)
    stats.value.totalRevenue = cases.reduce((sum, c) => sum + (parseFloat(c.case_value) || 0), 0);
    stats.value.revenueGrowth = 12.5; // Mock growth percentage

  } catch (error) {
    console.error('Failed to load admin stats:', error);
  }
};

const formatNumber = (num) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(num);
};

const formatTime = (date) => {
  const now = new Date();
  const diff = now - date;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
};

const getActivityColor = (type) => {
  const colors = {
    user: 'bg-blue-100 text-blue-600',
    case: 'bg-green-100 text-green-600',
    system: 'bg-purple-100 text-purple-600'
  };
  return colors[type] || 'bg-gray-100 text-gray-600';
};

const getActivityIcon = (type) => {
  const icons = {
    user: UserPlus,
    case: FileCheck,
    system: Bell
  };
  return icons[type] || Bell;
};

onMounted(() => {
  loadStats();
});
</script>
