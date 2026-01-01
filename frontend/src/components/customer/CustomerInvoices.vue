<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h2 class="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <svg class="w-7 h-7 text-[#003aca]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
          </svg>
          Invoices & Payments
        </h2>
        <p class="text-gray-500 mt-1">View your invoices and payment history</p>
      </div>
    </div>

    <!-- Payment Summary -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="bg-white rounded-lg border border-gray-200 p-6">
        <div class="flex items-center justify-between mb-2">
          <p class="text-sm text-gray-600 font-medium">Total Billed</p>
          <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p class="text-3xl font-bold text-gray-900">${{ stats.totalBilled.toLocaleString() }}</p>
        <p class="text-xs text-gray-500 mt-1">All time</p>
      </div>

      <div class="bg-green-50 rounded-lg border border-green-200 p-6">
        <div class="flex items-center justify-between mb-2">
          <p class="text-sm text-gray-600 font-medium">Paid</p>
          <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p class="text-3xl font-bold text-green-900">${{ stats.paid.toLocaleString() }}</p>
        <p class="text-xs text-green-700 mt-1">{{ stats.paidPercentage }}% of total</p>
      </div>

      <div class="bg-orange-50 rounded-lg border border-orange-200 p-6">
        <div class="flex items-center justify-between mb-2">
          <p class="text-sm text-gray-600 font-medium">Outstanding</p>
          <svg class="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p class="text-3xl font-bold text-orange-900">${{ stats.outstanding.toLocaleString() }}</p>
        <p class="text-xs text-orange-700 mt-1">Due now</p>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-lg border border-gray-200 p-4">
      <div class="flex items-center gap-4">
        <select v-model="statusFilter" class="px-3 py-2 border border-gray-300 rounded-md text-sm">
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
          <option value="overdue">Overdue</option>
        </select>
        <select v-model="dateFilter" class="px-3 py-2 border border-gray-300 rounded-md text-sm">
          <option value="all">All Time</option>
          <option value="month">This Month</option>
          <option value="quarter">This Quarter</option>
          <option value="year">This Year</option>
        </select>
      </div>
    </div>

    <!-- Invoices List -->
    <div class="bg-white rounded-lg border border-gray-200 p-6">
      <h3 class="text-lg font-semibold text-gray-800 mb-4">Invoice History</h3>

      <div v-if="filteredInvoices.length === 0" class="text-center py-12 text-gray-500">
        <svg class="w-16 h-16 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
        </svg>
        <p class="text-sm">No invoices found</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600">Invoice #</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600">Description</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600">Issue Date</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600">Due Date</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600">Amount</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600">Status</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="invoice in filteredInvoices" :key="invoice.id" class="hover:bg-gray-50">
              <td class="px-4 py-3 text-sm font-medium text-gray-900">#{{ invoice.invoice_number }}</td>
              <td class="px-4 py-3 text-sm text-gray-600">{{ invoice.description }}</td>
              <td class="px-4 py-3 text-sm text-gray-600">{{ formatDate(invoice.issue_date) }}</td>
              <td class="px-4 py-3 text-sm text-gray-600">{{ formatDate(invoice.due_date) }}</td>
              <td class="px-4 py-3 text-sm font-semibold text-gray-900">${{ invoice.amount.toLocaleString() }}</td>
              <td class="px-4 py-3">
                <span :class="['px-2 py-1 rounded text-xs font-medium', getStatusBadge(invoice.status)]">
                  {{ invoice.status }}
                </span>
              </td>
              <td class="px-4 py-3">
                <div class="flex items-center gap-2">
                  <button class="text-blue-600 hover:text-blue-700 text-sm">
                    View
                  </button>
                  <button class="text-gray-600 hover:text-gray-700 text-sm">
                    Download
                  </button>
                  <button v-if="invoice.status === 'pending' || invoice.status === 'overdue'" class="text-green-600 hover:text-green-700 text-sm font-medium">
                    Pay Now
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Payment History -->
    <div class="bg-white rounded-lg border border-gray-200 p-6">
      <h3 class="text-lg font-semibold text-gray-800 mb-4">Payment History</h3>

      <div v-if="paymentHistory.length === 0" class="text-center py-12 text-gray-500">
        <p class="text-sm">No payment history</p>
      </div>

      <div v-else class="space-y-3">
        <div v-for="payment in paymentHistory" :key="payment.id" class="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p class="font-semibold text-gray-900">Payment for Invoice #{{ payment.invoice_number }}</p>
              <p class="text-sm text-gray-600">{{ payment.payment_method }} • {{ formatDate(payment.payment_date) }}</p>
            </div>
          </div>
          <div class="text-right">
            <p class="font-bold text-green-900">${{ payment.amount.toLocaleString() }}</p>
            <p class="text-xs text-gray-500">{{ payment.status }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Payment Information -->
    <div class="bg-blue-50 rounded-lg border border-blue-200 p-4">
      <div class="flex items-start gap-3">
        <svg class="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          <h4 class="font-semibold text-blue-900 mb-1">Payment Information</h4>
          <ul class="text-sm text-blue-800 space-y-1">
            <li>• All invoices are due within 30 days of the issue date</li>
            <li>• Late payments may incur additional fees</li>
            <li>• Multiple payment methods are accepted</li>
            <li>• Contact your lawyer if you have any questions about billing</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { format } from 'date-fns';

const statusFilter = ref('');
const dateFilter = ref('all');

const stats = computed(() => {
  const totalBilled = invoices.value.reduce((sum, inv) => sum + inv.amount, 0);
  const paid = invoices.value
    .filter(inv => inv.status === 'paid')
    .reduce((sum, inv) => sum + inv.amount, 0);
  const outstanding = totalBilled - paid;
  const paidPercentage = totalBilled > 0 ? Math.round((paid / totalBilled) * 100) : 0;

  return {
    totalBilled,
    paid,
    outstanding,
    paidPercentage,
  };
});

// Mock invoice data
const invoices = ref([
  {
    id: '1',
    invoice_number: '2024-001',
    description: 'Legal consultation and case filing',
    issue_date: new Date('2024-01-15'),
    due_date: new Date('2024-02-15'),
    amount: 2500,
    status: 'paid',
  },
  {
    id: '2',
    invoice_number: '2024-002',
    description: 'Document preparation and court representation',
    issue_date: new Date('2024-02-15'),
    due_date: new Date('2024-03-15'),
    amount: 3500,
    status: 'pending',
  },
  {
    id: '3',
    invoice_number: '2024-003',
    description: 'Case research and legal advice',
    issue_date: new Date('2023-12-10'),
    due_date: new Date('2024-01-10'),
    amount: 1500,
    status: 'overdue',
  },
]);

const paymentHistory = ref([
  {
    id: '1',
    invoice_number: '2024-001',
    amount: 2500,
    payment_date: new Date('2024-02-10'),
    payment_method: 'Credit Card',
    status: 'Completed',
  },
]);

const filteredInvoices = computed(() => {
  let filtered = invoices.value;

  // Filter by status
  if (statusFilter.value) {
    filtered = filtered.filter(inv => inv.status === statusFilter.value);
  }

  // Filter by date
  if (dateFilter.value !== 'all') {
    const now = new Date();
    filtered = filtered.filter(inv => {
      const issueDate = new Date(inv.issue_date);
      switch (dateFilter.value) {
        case 'month':
          return issueDate.getMonth() === now.getMonth() && issueDate.getFullYear() === now.getFullYear();
        case 'quarter':
          const currentQuarter = Math.floor(now.getMonth() / 3);
          const invoiceQuarter = Math.floor(issueDate.getMonth() / 3);
          return currentQuarter === invoiceQuarter && issueDate.getFullYear() === now.getFullYear();
        case 'year':
          return issueDate.getFullYear() === now.getFullYear();
        default:
          return true;
      }
    });
  }

  return filtered.sort((a, b) => new Date(b.issue_date) - new Date(a.issue_date));
});

const getStatusBadge = (status) => {
  switch (status) {
    case 'paid': return 'bg-green-100 text-green-700 border border-green-200';
    case 'pending': return 'bg-yellow-100 text-yellow-700 border border-yellow-200';
    case 'overdue': return 'bg-red-100 text-red-700 border border-red-200';
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
  // Load invoices from API in production
});
</script>
