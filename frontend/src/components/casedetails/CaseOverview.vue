<template>
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <div class="lg:col-span-2 space-y-6">
      <div class="material-elevation-1 clean-border bg-white rounded-lg">
        <div class="p-6 border-b">
          <h3 class="text-lg font-semibold">Case Details</h3>
        </div>
        <div class="p-6 space-y-4">
          <div class="flex flex-wrap gap-2">
            <span :class="['px-3 py-1 rounded-md text-sm font-medium border', getStatusColor(caseData.status)]">
              {{ caseData.status.replace('_', ' ') }}
            </span>
            <span :class="['px-3 py-1 rounded-md text-sm font-medium border', getPriorityColor(caseData.priority)]">
              {{ caseData.priority }} priority
            </span>
            <span class="px-3 py-1 rounded-md text-sm font-medium border border-gray-300 text-gray-700">
              {{ caseData.case_type.replace('_', ' ') }}
            </span>
          </div>
          <div>
            <h4 class="font-semibold text-gray-800 mb-2">Description</h4>
            <p class="text-gray-600">{{ caseData.description || "No description provided." }}</p>
          </div>
        </div>
      </div>

      <div class="material-elevation-1 clean-border bg-white rounded-lg">
        <div class="p-6 border-b">
          <h3 class="text-lg font-semibold">Important Dates</h3>
        </div>
        <div class="p-6 space-y-4">
          <div class="flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-500">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            <span class="font-medium">Due Date:</span>
            <span>{{ caseData.due_date ? formatDate(caseData.due_date) : 'Not set' }}</span>
          </div>
          <div class="flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-500">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            <span class="font-medium">Court Date:</span>
            <span>{{ caseData.court_date ? formatDate(caseData.court_date) : 'Not set' }}</span>
          </div>
          <div class="flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-500">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            <span class="font-medium">Last Updated:</span>
            <span>{{ formatDateTime(caseData.updated_date) }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="space-y-6">
      <div class="material-elevation-1 clean-border bg-white rounded-lg">
        <div class="p-6 border-b">
          <h3 class="text-lg font-semibold flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            Customers
          </h3>
        </div>
        <div class="p-6">
          <ul v-if="customers && customers.length > 0" class="list-disc list-inside">
            <li v-for="customer in customers" :key="customer.id">{{ customer.full_name || customer.name || customer.email || 'Unknown' }}</li>
          </ul>
          <p v-else>No customers assigned.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  caseData: {
    type: Object,
    required: true
  },
  lawyer: {
    type: Object,
    default: null
  },
  customers: {
    type: Array,
    default: () => []
  }
});

const getStatusColor = (status) => {
  switch(status) {
    case 'open': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'in_progress': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'closed': return 'bg-green-100 text-green-800 border-green-200';
    case 'on_hold': return 'bg-gray-100 text-gray-800 border-gray-200';
    case 'archived': return 'bg-neutral-200 text-neutral-800 border-neutral-300';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getPriorityColor = (priority) => {
  switch(priority) {
    case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
    case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'low': return 'bg-green-100 text-green-800 border-green-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const formatDate = (date) => {
  if (!date) return 'Not set';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const formatDateTime = (date) => {
  if (!date) return 'Not set';
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });
};
</script>
