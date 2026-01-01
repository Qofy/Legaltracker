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

    <!-- Revenue Trends (Placeholder for chart) -->
    <div class="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
      <h3 class="text-lg font-semibold text-gray-800 mb-4">Revenue Trends</h3>
      <div class="h-64 flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <div class="text-center">
          <TrendingUpIcon class="w-12 h-12 text-gray-400 mx-auto mb-2" />
          <p class="text-gray-600 text-sm">Revenue chart visualization</p>
          <p class="text-gray-500 text-xs mt-1">Integrate chart library for visual analytics</p>
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
import { ref, computed, onMounted } from 'vue';
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
      const lawyerCases = cases.value.filter(c =>
        c.owners?.some(o => o.id === lawyer.id) || false
      );

      return {
        id: lawyer.id,
        name: lawyer.full_name,
        caseCount: lawyerCases.length,
        totalBilled: lawyerCases.reduce((sum, c) => sum + (parseFloat(c.case_value) || 0), 0),
        totalHours: lawyerCases.reduce((sum, c) => sum + (parseInt(c.estimated_hours) || 0), 0)
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
});
</script>
