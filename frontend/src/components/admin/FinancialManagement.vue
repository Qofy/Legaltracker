<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-2xl font-bold text-gray-800">Financial Management</h2>
      <p class="text-gray-600 mt-1">View and manage billing and financial records</p>
    </div>

    <!-- Financial Overview -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-lg text-white shadow-lg">
        <p class="text-sm opacity-90 font-medium">Total Revenue</p>
        <p class="text-4xl font-bold mt-2">${{ formatCurrency(financials.totalRevenue) }}</p>
        <p class="text-sm mt-2 opacity-75">All time earnings</p>
      </div>

      <div class="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-lg text-white shadow-lg">
        <p class="text-sm opacity-90 font-medium">Pending Invoices</p>
        <p class="text-4xl font-bold mt-2">${{ formatCurrency(financials.pendingAmount) }}</p>
        <p class="text-sm mt-2 opacity-75">{{ financials.pendingCount }} invoices</p>
      </div>

      <div class="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-lg text-white shadow-lg">
        <p class="text-sm opacity-90 font-medium">This Month</p>
        <p class="text-4xl font-bold mt-2">${{ formatCurrency(financials.monthlyRevenue) }}</p>
        <p class="text-sm mt-2 opacity-75">
          <span :class="financials.monthlyGrowth >= 0 ? 'text-green-200' : 'text-red-200'">
            {{ financials.monthlyGrowth >= 0 ? '+' : '' }}{{ financials.monthlyGrowth }}%
          </span> vs last month
        </p>
      </div>
    </div>

    <!-- Cases by Value -->
    <div class="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-gray-800">Cases by Value</h3>
        <select v-model="sortBy" class="px-3 py-2 border border-gray-300 rounded-md text-sm">
          <option value="value">Highest Value</option>
          <option value="hours">Most Hours</option>
          <option value="recent">Most Recent</option>
        </select>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Case Number</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Title</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Case Value</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Billing Rate</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Est. Hours</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Status</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="caseItem in sortedCases" :key="caseItem.id" class="hover:bg-gray-50">
              <td class="px-4 py-3 text-sm font-medium text-gray-900">{{ caseItem.case_number }}</td>
              <td class="px-4 py-3 text-sm text-gray-700">{{ caseItem.title }}</td>
              <td class="px-4 py-3 text-sm font-semibold text-green-600">
                ${{ formatCurrency(caseItem.case_value || 0) }}
              </td>
              <td class="px-4 py-3 text-sm text-gray-700">
                ${{ caseItem.billing_rate || 0 }}/hr
              </td>
              <td class="px-4 py-3 text-sm text-gray-700">{{ caseItem.estimated_hours || 0 }}h</td>
              <td class="px-4 py-3">
                <span :class="getStatusClass(caseItem.status)">
                  {{ formatStatus(caseItem.status) }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Revenue Trends + Chat -->
    <div class="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
      <h3 class="text-lg font-semibold text-gray-800 mb-4">Revenue Trends</h3>
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <!-- Chart area: Bar chart (last 6 months) + small pie chart -->
        <div class="lg:col-span-2 h-64 flex items-center justify-center bg-white rounded-lg border border-gray-200 p-4">
          <div class="flex-1 flex items-center gap-4">
            <!-- Bar chart -->
            <div class="flex-1 h-full flex flex-col">
              <div class="text-sm font-medium text-gray-700 mb-2">Revenue (last 6 months)</div>
              <div class="flex-1 flex items-end">
                <svg viewBox="0 0 600 240" class="w-full h-full">
                  <g transform="translate(20,10)">
                    <!-- grid lines -->
                    <g stroke="#e6e6e6">
                      <line x1="0" y1="0" x2="520" y2="0" />
                      <line x1="0" y1="48" x2="520" y2="48" />
                      <line x1="0" y1="96" x2="520" y2="96" />
                      <line x1="0" y1="144" x2="520" y2="144" />
                      <line x1="0" y1="192" x2="520" y2="192" />
                    </g>
                    <!-- bars -->
                    <g>
                      <!-- computed bars -->
                      <template v-for="(val, idx) in monthlySeries" :key="idx">
                        <rect
                          :x="idx * 86"
                          :y="(200 - Math.round((val / monthlyMax) * 180))"
                          :width="60"
                          :height="Math.max(4, Math.round((val / monthlyMax) * 180))"
                          :fill="`url(#barGrad${idx})`">
                          <title>{{ months[idx] }}: ${{ formatCurrency(val) }}</title>
                        </rect>
                      </template>
                    </g>
                    <!-- labels -->
                    <g transform="translate(0,205)" fill="#6b7280" font-size="12">
                      <template v-for="(m, i) in months" :key="i">
                        <text :x="i * 86 + 30" text-anchor="middle">{{ m }}</text>
                      </template>
                    </g>
                    <!-- gradients defs -->
                    <defs>
                      <linearGradient id="barGrad0" x1="0" x2="1">
                        <stop offset="0%" stop-color="#60a5fa" />
                        <stop offset="100%" stop-color="#3b82f6" />
                      </linearGradient>
                      <linearGradient id="barGrad1" x1="0" x2="1">
                        <stop offset="0%" stop-color="#93c5fd" />
                        <stop offset="100%" stop-color="#3b82f6" />
                      </linearGradient>
                      <linearGradient id="barGrad2" x1="0" x2="1">
                        <stop offset="0%" stop-color="#a7f3d0" />
                        <stop offset="100%" stop-color="#10b981" />
                      </linearGradient>
                      <linearGradient id="barGrad3" x1="0" x2="1">
                        <stop offset="0%" stop-color="#fef9c3" />
                        <stop offset="100%" stop-color="#f97316" />
                      </linearGradient>
                      <linearGradient id="barGrad4" x1="0" x2="1">
                        <stop offset="0%" stop-color="#fbcfe8" />
                        <stop offset="100%" stop-color="#ec4899" />
                      </linearGradient>
                      <linearGradient id="barGrad5" x1="0" x2="1">
                        <stop offset="0%" stop-color="#c7b2ff" />
                        <stop offset="100%" stop-color="#7c3aed" />
                      </linearGradient>
                    </defs>
                  </g>
                </svg>
              </div>
            </div>

            <!-- Small pie chart (revenue by lawyer) -->
            <div class="w-40 flex-shrink-0">
              <div class="text-sm font-medium text-gray-700 mb-2">By Lawyer</div>
              <svg viewBox="0 0 120 120" class="w-40 h-40">
                <g transform="translate(60,60)">
                  <template v-for="(slice, idx) in pieData" :key="idx">
                    <path :d="slice.path" :fill="slice.color">
                      <title>{{ slice.label }}: ${{ formatCurrency(slice.value) }}</title>
                    </path>
                  </template>
                </g>
              </svg>
              <div class="mt-2 text-xs text-gray-600 space-y-1">
                <div v-for="(slice,i) in pieData" :key="i" class="flex items-center gap-2">
                  <span :style="{background:slice.color}" class="w-3 h-3 rounded-sm inline-block"></span>
                  <span class="truncate">{{ slice.label }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Chat panel for Revenue Trends -->
        <div class="h-64 flex flex-col bg-white border rounded-lg p-2">
          <div class="px-3 py-2 border-b border-gray-100 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <TrendingUpIcon class="w-5 h-5 text-blue-600" />
              <div>
                <p class="text-sm font-semibold">Revenue Trends Chat</p>
                <p class="text-xs text-gray-400">Discussion and notes about revenue</p>
              </div>
            </div>
            <div class="text-xs text-gray-400">Admin only</div>
          </div>

          <div ref="chatContainer" class="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50">
            <div v-if="messages.length === 0" class="text-center text-sm text-gray-400 py-6">
              No messages yet. Start the conversation about Revenue Trends.
            </div>
            <div v-else>
              <div v-for="msg in messages" :key="msg.id" class="flex items-start gap-3">
                <div class="flex-1">
                  <div class="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
                    <p class="text-sm text-gray-900">{{ msg.text }}</p>
                  </div>
                  <p class="text-xs text-gray-400 mt-1">{{ formatTime(msg.ts) }}</p>
                </div>
              </div>
            </div>
          </div>

          <div class="p-3 border-t border-gray-100 bg-white">
            <div class="flex items-center gap-2">
              <input v-model="newMessage" @keydown.enter.prevent="sendMessage" placeholder="Write a note or question..." class="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500" />
              <button @click="sendMessage" :disabled="!newMessage.trim()" class="px-3 py-2 bg-blue-600 text-white rounded-md disabled:opacity-50">Send</button>
            </div>
            <p class="text-xs text-gray-400 mt-2">Messages are stored locally (for now).</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Billing Summary by Lawyer -->
    <div class="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
      <h3 class="text-lg font-semibold text-gray-800 mb-4">Billing by Lawyer</h3>
      <div class="space-y-3">
        <div v-for="lawyer in lawyerBilling" :key="lawyer.id" class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <BriefcaseIcon class="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p class="text-sm font-medium text-gray-900">{{ lawyer.name }}</p>
              <p class="text-xs text-gray-500">{{ lawyer.caseCount }} active cases</p>
              <div class="mt-2 text-xs text-gray-600">
                <div v-if="lawyer.casesList && lawyer.casesList.length">
                  <ul class="list-disc list-inside">
                    <li v-for="c in lawyer.casesList" :key="c.id">{{ c.title }}</li>
                  </ul>
                </div>
                <div v-else class="text-xs text-gray-500">No active cases</div>
              </div>
            </div>
          </div>
          <div class="text-right">
            <p class="text-lg font-bold text-gray-900">${{ formatCurrency(lawyer.totalBilled) }}</p>
            <p class="text-xs text-gray-500">{{ lawyer.totalHours }}h billed</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue';
import { casesService, usersService } from '@/services/api';
import { TrendingUp as TrendingUpIcon, Briefcase as BriefcaseIcon } from 'lucide-vue-next';

const cases = ref([]);
const lawyers = ref([]);
const sortBy = ref('value');

const financials = ref({
  totalRevenue: 0,
  pendingAmount: 0,
  pendingCount: 0,
  monthlyRevenue: 0,
  monthlyGrowth: 0
});

const sortedCases = computed(() => {
  const sorted = [...cases.value];
  if (sortBy.value === 'value') {
    return sorted.sort((a, b) => (b.case_value || 0) - (a.case_value || 0));
  } else if (sortBy.value === 'hours') {
    return sorted.sort((a, b) => (b.estimated_hours || 0) - (a.estimated_hours || 0));
  } else {
    return sorted.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
  }
});

const lawyerBilling = computed(() => {
  const billing = lawyers.value
    .filter(l => l.user_type === 'lawyer')
    .map(lawyer => {
      const lawyerCases = cases.value.filter(c => {
        // check common assignment fields: assigned_lawyer object or id aliases
        const assignedId = c.assigned_lawyer?.id || c.assigned_lawyer_id || c.lawyer_id || c.lawyerId || c.assignedLawyerId || null;
        const isAssigned = assignedId && String(assignedId) === String(lawyer.id);
        const isOwner = c.owners && c.owners.some(o => String(o.id) === String(lawyer.id));
        // also consider cases where the lawyer may appear in an owners array or other fields
        return !!(isAssigned || isOwner);
      });

      return {
        id: lawyer.id,
        name: lawyer.full_name,
        caseCount: lawyerCases.length,
        totalBilled: lawyerCases.reduce((sum, c) => sum + (parseFloat(c.case_value) || 0), 0),
        totalHours: lawyerCases.reduce((sum, c) => sum + (parseInt(c.estimated_hours) || 0), 0),
        // include the actual case objects so the template can list them
        casesList: lawyerCases
      };
    })
    .sort((a, b) => b.totalBilled - a.totalBilled);

  return billing;
});

const loadData = async () => {
  try {
    [cases.value, lawyers.value] = await Promise.all([
      casesService.getCases(),
      usersService.getUsers()
    ]);

    // Calculate financials
    financials.value.totalRevenue = cases.value.reduce((sum, c) => sum + (parseFloat(c.case_value) || 0), 0);
    financials.value.pendingAmount = cases.value
      .filter(c => c.status !== 'closed')
      .reduce((sum, c) => sum + (parseFloat(c.case_value) || 0), 0);
    financials.value.pendingCount = cases.value.filter(c => c.status !== 'closed').length;

    // Calculate monthly revenue (mock - would need actual date filtering)
    const thisMonth = new Date();
    thisMonth.setDate(1);
    const monthlyCases = cases.value.filter(c => new Date(c.created_date) >= thisMonth);
    financials.value.monthlyRevenue = monthlyCases.reduce((sum, c) => sum + (parseFloat(c.case_value) || 0), 0);
    financials.value.monthlyGrowth = 12.5; // Mock growth

  } catch (error) {
    console.error('Failed to load financial data:', error);
  }
};

const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

const formatStatus = (status) => {
  return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

const getStatusClass = (status) => {
  const classes = {
    open: 'px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full',
    in_progress: 'px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full',
    closed: 'px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full',
    on_hold: 'px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full'
  };
  return classes[status] || classes.open;
};

onMounted(() => {
  loadData();
  // load revenue trends chat from localStorage
  try {
    const raw = localStorage.getItem('financial.revenueTrends.messages')
    if (raw) messages.value = JSON.parse(raw)
  } catch (e) {
    console.debug('Failed to load revenue chat from storage', e)
  }
});

// Chat state for Revenue Trends
const messages = ref([])
const newMessage = ref('')
const chatContainer = ref(null)

const persistMessages = () => {
  try {
    localStorage.setItem('financial.revenueTrends.messages', JSON.stringify(messages.value))
  } catch (e) {
    console.debug('Failed to persist revenue chat', e)
  }
}

const sendMessage = () => {
  const text = (newMessage.value || '').trim()
  if (!text) return
  const msg = { id: `m-${Date.now()}`, text, ts: new Date().toISOString() }
  messages.value.push(msg)
  newMessage.value = ''
  persistMessages()
  nextTick(() => {
    try { chatContainer.value.scrollTop = chatContainer.value.scrollHeight } catch (e) {}
  })
}

const formatTime = (iso) => {
  try { return new Date(iso).toLocaleString() } catch (e) { return '' }
}

// --- Chart computations ---
const getLastNMonths = (n) => {
  const months = []
  const now = new Date()
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    months.push(d)
  }
  return months
}

const monthsRef = getLastNMonths(6)

const months = monthsRef.map(d => d.toLocaleString(undefined, { month: 'short' }))

const monthlySeries = computed(() => {
  const series = monthsRef.map(m => 0)
  cases.value.forEach(c => {
    const created = c.created_date ? new Date(c.created_date) : null
    if (!created) return
    monthsRef.forEach((m, idx) => {
      if (created.getFullYear() === m.getFullYear() && created.getMonth() === m.getMonth()) {
        series[idx] += parseFloat(c.case_value) || 0
      }
    })
  })
  return series
})

const monthlyMax = computed(() => Math.max(1, ...monthlySeries.value))

const pieData = computed(() => {
  // take top 6 lawyers by billed amount (from lawyerBilling computed)
  const data = lawyerBilling.value.slice(0, 6).map((l, i) => ({ label: l.name, value: l.totalBilled }))
  const total = data.reduce((s, x) => s + x.value, 0) || 1
  let angle = 0
  const colors = ['#60a5fa', '#93c5fd', '#10b981', '#f97316', '#ec4899', '#7c3aed']
  return data.map((d, idx) => {
    const portion = d.value / total
    const start = angle
    const end = angle + portion * Math.PI * 2
    angle = end
    const large = end - start > Math.PI ? 1 : 0
    const x1 = Math.cos(start) * 40
    const y1 = Math.sin(start) * 40
    const x2 = Math.cos(end) * 40
    const y2 = Math.sin(end) * 40
    const path = `M 0 0 L ${x1} ${y1} A 40 40 0 ${large} 1 ${x2} ${y2} Z`
    return { label: d.label, value: d.value, path, color: colors[idx % colors.length] }
  })
})
</script>
