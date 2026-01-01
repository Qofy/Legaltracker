<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold text-gray-800">System Activity Logs</h2>
        <p class="text-gray-600 mt-1">Monitor system events and user activities</p>
      </div>
      <button @click="refreshLogs" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm flex items-center gap-2">
        <RefreshCwIcon class="w-4 h-4" />
        Refresh
      </button>
    </div>

    <!-- Filter Controls -->
    <div class="bg-white p-4 rounded-lg border border-gray-200">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Activity Type</label>
          <select v-model="filters.type" class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm">
            <option value="">All Types</option>
            <option value="user">User Activity</option>
            <option value="case">Case Activity</option>
            <option value="document">Document Activity</option>
            <option value="system">System Events</option>
            <option value="auth">Authentication</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Severity</label>
          <select v-model="filters.severity" class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm">
            <option value="">All Levels</option>
            <option value="info">Info</option>
            <option value="warning">Warning</option>
            <option value="error">Error</option>
            <option value="critical">Critical</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Time Range</label>
          <select v-model="filters.timeRange" class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm">
            <option value="1h">Last Hour</option>
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Search</label>
          <input
            v-model="filters.search"
            type="text"
            placeholder="Search logs..."
            class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          />
        </div>
      </div>
    </div>

    <!-- Activity Logs Table -->
    <div class="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Timestamp</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Type</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">User</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Action</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Details</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Severity</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="log in filteredLogs" :key="log.id" class="hover:bg-gray-50">
              <td class="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
                {{ formatTimestamp(log.timestamp) }}
              </td>
              <td class="px-4 py-3">
                <span :class="getTypeClass(log.type)">
                  {{ log.type }}
                </span>
              </td>
              <td class="px-4 py-3 text-sm text-gray-700">
                {{ log.user || 'System' }}
              </td>
              <td class="px-4 py-3 text-sm font-medium text-gray-900">
                {{ log.action }}
              </td>
              <td class="px-4 py-3 text-sm text-gray-600">
                {{ log.details }}
              </td>
              <td class="px-4 py-3">
                <span :class="getSeverityClass(log.severity)">
                  {{ log.severity }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="bg-gray-50 px-4 py-3 border-t border-gray-200 flex items-center justify-between">
        <div class="text-sm text-gray-700">
          Showing <span class="font-medium">{{ filteredLogs.length }}</span> of <span class="font-medium">{{ logs.length }}</span> logs
        </div>
        <div class="flex gap-2">
          <button class="px-3 py-1 bg-white border border-gray-300 rounded text-sm hover:bg-gray-50">
            Previous
          </button>
          <button class="px-3 py-1 bg-white border border-gray-300 rounded text-sm hover:bg-gray-50">
            Next
          </button>
        </div>
      </div>
    </div>

    <!-- System Health Indicators -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="bg-white p-4 rounded-lg border border-gray-200">
        <div class="flex items-center gap-3">
          <div class="bg-green-100 p-2 rounded">
            <CheckCircleIcon class="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p class="text-sm text-gray-600">System Status</p>
            <p class="text-lg font-bold text-green-600">Healthy</p>
          </div>
        </div>
      </div>

      <div class="bg-white p-4 rounded-lg border border-gray-200">
        <div class="flex items-center gap-3">
          <div class="bg-blue-100 p-2 rounded">
            <DatabaseIcon class="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p class="text-sm text-gray-600">Database</p>
            <p class="text-lg font-bold text-blue-600">Connected</p>
          </div>
        </div>
      </div>

      <div class="bg-white p-4 rounded-lg border border-gray-200">
        <div class="flex items-center gap-3">
          <div class="bg-purple-100 p-2 rounded">
            <ServerIcon class="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <p class="text-sm text-gray-600">API Status</p>
            <p class="text-lg font-bold text-purple-600">Online</p>
          </div>
        </div>
      </div>

      <div class="bg-white p-4 rounded-lg border border-gray-200">
        <div class="flex items-center gap-3">
          <div class="bg-orange-100 p-2 rounded">
            <ActivityIcon class="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <p class="text-sm text-gray-600">Active Users</p>
            <p class="text-lg font-bold text-orange-600">{{ activeUsersCount }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import {
  RefreshCw as RefreshCwIcon,
  CheckCircle as CheckCircleIcon,
  Database as DatabaseIcon,
  Server as ServerIcon,
  Activity as ActivityIcon
} from 'lucide-vue-next';

const logs = ref([]);
const activeUsersCount = ref(5);

const filters = ref({
  type: '',
  severity: '',
  timeRange: '24h',
  search: ''
});

// Generate sample logs (in production, fetch from backend)
const generateSampleLogs = () => {
  const types = ['user', 'case', 'document', 'system', 'auth'];
  const severities = ['info', 'warning', 'error'];
  const users = ['admin@legalhub.com', 'lawyer@legalhub.com', 'customer@legalhub.com'];
  const actions = [
    'User login',
    'Case created',
    'Document uploaded',
    'System backup',
    'Password reset',
    'Case updated',
    'User registered',
    'File deleted'
  ];

  const sampleLogs = [];
  for (let i = 0; i < 50; i++) {
    const type = types[Math.floor(Math.random() * types.length)];
    sampleLogs.push({
      id: i + 1,
      timestamp: new Date(Date.now() - Math.random() * 86400000),
      type,
      user: type === 'system' ? null : users[Math.floor(Math.random() * users.length)],
      action: actions[Math.floor(Math.random() * actions.length)],
      details: `Sample log entry #${i + 1} with additional details`,
      severity: severities[Math.floor(Math.random() * severities.length)]
    });
  }
  return sampleLogs.sort((a, b) => b.timestamp - a.timestamp);
};

const filteredLogs = computed(() => {
  let filtered = [...logs.value];

  if (filters.value.type) {
    filtered = filtered.filter(log => log.type === filters.value.type);
  }

  if (filters.value.severity) {
    filtered = filtered.filter(log => log.severity === filters.value.severity);
  }

  if (filters.value.search) {
    const search = filters.value.search.toLowerCase();
    filtered = filtered.filter(log =>
      log.action.toLowerCase().includes(search) ||
      log.details.toLowerCase().includes(search) ||
      (log.user && log.user.toLowerCase().includes(search))
    );
  }

  return filtered;
});

const formatTimestamp = (date) => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }).format(date);
};

const getTypeClass = (type) => {
  const classes = {
    user: 'px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full',
    case: 'px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full',
    document: 'px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full',
    system: 'px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full',
    auth: 'px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full'
  };
  return classes[type] || classes.system;
};

const getSeverityClass = (severity) => {
  const classes = {
    info: 'px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full',
    warning: 'px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full',
    error: 'px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full',
    critical: 'px-2 py-1 text-xs font-medium bg-red-200 text-red-900 rounded-full'
  };
  return classes[severity] || classes.info;
};

const refreshLogs = () => {
  logs.value = generateSampleLogs();
};

onMounted(() => {
  logs.value = generateSampleLogs();
});
</script>
