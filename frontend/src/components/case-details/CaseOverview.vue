<template>
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <div class="lg:col-span-2 space-y-6">
      <Card class="material-elevation-1 clean-border">
        <CardHeader>
          <CardTitle>Case Details</CardTitle>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="flex flex-wrap gap-2">
            <Badge :class="getStatusColor(caseData?.status)">{{ (caseData?.status || '').replace('_', ' ') }}</Badge>
            <Badge :class="getPriorityColor(caseData?.priority)">{{ caseData?.priority }} priority</Badge>
            <Badge variant="outline">{{ (caseData?.case_type || '').replace('_', ' ') }}</Badge>
          </div>
          <div>
            <h4 class="font-semibold text-gray-800 mb-2">Description</h4>
            <p class="text-gray-600">{{ caseData?.description || 'No description provided.' }}</p>
          </div>
        </CardContent>
      </Card>

      <Card class="material-elevation-1 clean-border">
        <CardHeader>
          <CardTitle>Important Dates</CardTitle>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="flex items-center space-x-2">
              <Calendar class="w-4 h-4 text-gray-500" />
              <span class="font-medium">Due Date:</span>
              <span>{{ dueDate }}</span>
          </div>
          <div class="flex items-center space-x-2">
              <Calendar class="w-4 h-4 text-gray-500" />
              <span class="font-medium">Court Date:</span>
              <span>{{ courtDate }}</span>
          </div>
          <div class="flex items-center space-x-2">
              <Clock class="w-4 h-4 text-gray-500" />
              <span class="font-medium">Last Updated:</span>
              <span>{{ lastUpdated }}</span>
          </div>
        </CardContent>
      </Card>
    </div>

    <div class="space-y-6">
      <Card class="material-elevation-1 clean-border">
        <CardHeader>
          <CardTitle class="flex items-center"><User class="w-5 h-5 mr-2" />Assigned Lawyer</CardTitle>
        </CardHeader>
        <CardContent>
          <div v-if="lawyer">
            <p>{{ lawyer.full_name }} ({{ lawyer.email }})</p>
          </div>
          <div v-else>
            <p>No lawyer assigned.</p>
          </div>
        </CardContent>
      </Card>

      <Card class="material-elevation-1 clean-border">
        <CardHeader>
          <CardTitle class="flex items-center"><Users class="w-5 h-5 mr-2" />Customers</CardTitle>
        </CardHeader>
        <CardContent>
          <div v-if="customers && customers.length > 0">
            <ul class="list-disc list-inside">
              <li v-for="c in customers" :key="c.id">{{ c.full_name }}</li>
            </ul>
          </div>
          <div v-else>
            <p>No customers assigned.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, User, Users } from 'lucide-vue-next';
import { format } from 'date-fns';

const props = defineProps({
  caseData: { type: Object, required: true },
  lawyer: { type: Object, required: false },
  customers: { type: Array, required: false, default: () => [] }
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

const dueDate = computed(() => {
  try {
    return props.caseData?.due_date ? format(new Date(props.caseData.due_date), 'PPP') : 'Not set';
  } catch (e) { return 'Invalid date'; }
});

const courtDate = computed(() => {
  try {
    return props.caseData?.court_date ? format(new Date(props.caseData.court_date), 'PPP') : 'Not set';
  } catch (e) { return 'Invalid date'; }
});

const lastUpdated = computed(() => {
  try {
    return props.caseData?.updated_date ? format(new Date(props.caseData.updated_date), 'PPP p') : '';
  } catch (e) { return 'Invalid date'; }
});
</script>

<style scoped>
/* small spacing helpers if needed */
</style>
