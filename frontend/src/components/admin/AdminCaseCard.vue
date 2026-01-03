<template>
  <Card 
    class="border hover:shadow-lg transition-all duration-200 relative"
    :class="{ 
      'ring-2 ring-blue-500 ring-opacity-50': isSelected,
      'border-red-200 bg-red-50/20': !caseData.assigned_lawyer,
      'border-yellow-200 bg-yellow-50/20': caseData.client_status === 'needs_attention',
      'border-red-300 bg-red-50/30': caseData.client_status === 'at_risk'
    }"
  >
    <CardContent class="p-6">
      <!-- Selection Checkbox -->
      <div class="absolute top-4 right-4">
        <Checkbox :checked="isSelected" @update:checked="$emit('select', $event)" />
      </div>

      <!-- Header -->
      <div class="mb-4 pr-8">
        <h3 class="font-semibold text-gray-900 text-lg mb-1">
          {{ caseData.title }}
        </h3>
        <div class="flex items-center gap-2 text-sm text-gray-500">
          <span>#{{ caseData.case_number }}</span>
          <span>•</span>
          <span class="capitalize">{{ caseData.case_type || 'General' }}</span>
        </div>
      </div>

      <!-- Status and Priority Badges -->
      <div class="flex items-center gap-2 mb-4">
        <Badge :class="getStatusColor(caseData.status)" class="border text-xs">
          {{ caseData.status?.replace('_', ' ').toUpperCase() || 'OPEN' }}
        </Badge>
        <Badge :class="getPriorityColor(caseData.priority)" class="border text-xs">
          {{ caseData.priority?.toUpperCase() || 'MEDIUM' }}
        </Badge>
        <div v-if="!hasAssignedLawyer" class="ml-auto">
          <Badge class="bg-red-100 text-red-700 border-red-200 text-xs">
            <AlertTriangle class="w-3 h-3 mr-1" />
            Unassigned
          </Badge>
        </div>
      </div>

      <!-- Client Information -->
      <div class="mb-4">
        <div class="flex items-center justify-between mb-2">
          <p class="text-xs font-semibold text-gray-600 uppercase tracking-wide">Client</p>
          <div class="flex items-center gap-1">
            <div 
              class="w-2 h-2 rounded-full" 
              :class="getClientStatusColor(caseData.client_status)"
            ></div>
            <span class="text-xs text-gray-500 capitalize">
              {{ caseData.client_status || 'satisfied' }}
            </span>
          </div>
        </div>
        <div v-if="caseData.customers && caseData.customers.length > 0">
          <p class="font-medium text-gray-900">
            {{ caseData.customers[0].full_name }}
          </p>
          <p class="text-sm text-gray-500">{{ caseData.customers[0].email }}</p>
          <p v-if="caseData.customers.length > 1" class="text-xs text-gray-400 mt-1">
            +{{ caseData.customers.length - 1 }} more client{{ caseData.customers.length > 2 ? 's' : '' }}
          </p>
        </div>
        <div v-else class="text-sm text-gray-400 italic">
          No client assigned
        </div>
      </div>

      <!-- Lawyer Assignment -->
      <div class="mb-4">
        <div class="flex items-center justify-between mb-2">
          <p class="text-xs font-semibold text-gray-600 uppercase tracking-wide">Assigned Lawyer</p>
          <Button 
            v-if="caseData.client_status !== 'satisfied'"
            @click="$emit('update-client-status', caseData)" 
            size="sm" 
            variant="ghost"
            class="h-6 px-2 text-xs"
          >
            <Edit class="w-3 h-3 mr-1" />
            Update
          </Button>
        </div>
        
        <div v-if="assignedLawyer" class="flex items-center gap-3">
          <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <span class="text-blue-700 font-semibold text-xs">
              {{ getInitials(assignedLawyer.full_name) }}
            </span>
          </div>
          <div class="flex-1 min-w-0">
            <p class="font-medium text-gray-900 truncate">
              {{ assignedLawyer.full_name }}
            </p>
            <p class="text-xs text-gray-500 truncate">{{ assignedLawyer.email }}</p>
            <Button
              @click="$emit('assign-lawyer', { case: caseData })"
              size="sm"
              variant="ghost"
              class="mt-1 h-6 text-xs px-2"
            >
              <Edit class="w-3 h-3 mr-1" />
              Reassign
            </Button>
          </div>
        </div>

        <div v-else class="flex items-center gap-2">
          <div class="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
            <UserX class="w-4 h-4 text-gray-400" />
          </div>
          <div class="flex-1">
            <p class="text-sm text-gray-500">No lawyer assigned</p>
            <Button
              @click="$emit('assign-lawyer', { case: caseData })"
              size="sm"
              variant="outline"
              class="mt-1 h-6 text-xs"
            >
              <UserCheck class="w-3 h-3 mr-1" />
              Assign Now
            </Button>
          </div>
        </div>
      </div>

      <!-- Case Details -->
      <div class="mb-4 text-sm text-gray-600">
        <div class="flex justify-between items-center mb-1">
          <span>Created:</span>
          <span>{{ formatDate(caseData.created_date) }}</span>
        </div>
        <div class="flex justify-between items-center mb-1">
          <span>Updated:</span>
          <span>{{ formatDate(caseData.updated_date || caseData.created_date) }}</span>
        </div>
        <div v-if="caseData.due_date" class="flex justify-between items-center">
          <span>Due:</span>
          <span :class="{ 'text-red-600 font-medium': isOverdue(caseData.due_date) }">
            {{ formatDate(caseData.due_date) }}
            <span v-if="isOverdue(caseData.due_date)" class="ml-1 text-xs">(Overdue)</span>
          </span>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex items-center justify-between pt-4 border-t border-gray-100">
        <div class="flex items-center gap-1">
          <Button @click="$emit('view', caseData)" size="sm" variant="outline" class="h-8">
            <Eye class="w-4 h-4 mr-1" />
            View
          </Button>
          <Button @click="$emit('edit', caseData)" size="sm" variant="outline" class="h-8">
            <Edit class="w-4 h-4 mr-1" />
            Edit
          </Button>
        </div>
        
        <!-- Status Update Dropdown -->
        <div class="flex items-center gap-1">
          <Select 
            :model-value="caseData.status" 
            @update:model-value="(value) => $emit('update-status', { case: caseData, status: value })"
            class="h-8 text-xs"
          >
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="on_hold">On Hold</option>
            <option value="closed">Closed</option>
            <option value="archived">Archived</option>
          </Select>
        </div>
      </div>

      <!-- Urgent/Attention Indicators -->
      <div v-if="caseData.priority === 'urgent' || caseData.client_status === 'at_risk'" 
           class="absolute top-0 right-0 flex">
        <div v-if="caseData.priority === 'urgent'" 
             class="bg-red-500 text-white px-2 py-1 text-xs font-bold rounded-bl-lg rounded-tr-lg">
          <Flame class="w-3 h-3 inline mr-1" />
          URGENT
        </div>
        <div v-else-if="caseData.client_status === 'at_risk'" 
             class="bg-orange-500 text-white px-2 py-1 text-xs font-bold rounded-bl-lg rounded-tr-lg">
          <AlertCircle class="w-3 h-3 inline mr-1" />
          AT RISK
        </div>
      </div>
    </CardContent>
  </Card>
</template>

<script setup>
import { computed } from 'vue';
import { format } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import {
  AlertTriangle, UserX, UserCheck, Eye, Edit, Flame,
  AlertCircle
} from 'lucide-vue-next';

const props = defineProps({
  caseData: {
    type: Object,
    required: true
  },
  isSelected: {
    type: Boolean,
    default: false
  },
  lawyers: {
    type: Array,
    default: () => []
  }
});

defineEmits([
  'select',
  'assign-lawyer',
  'update-status',
  'update-client-status',
  'view',
  'edit'
]);

// Computed property to get the assigned lawyer from owners array
const assignedLawyer = computed(() => {
  if (props.caseData.owners && props.caseData.owners.length > 0) {
    // Get the first lawyer owner
    return props.caseData.owners.find(owner => owner.user_type === 'lawyer') || props.caseData.owners[0];
  }
  return null;
});

const hasAssignedLawyer = computed(() => !!assignedLawyer.value);

// Utility functions
const getInitials = (name) => {
  if (!name) return '?';
  const parts = name.split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

const formatDate = (date) => {
  if (!date) return 'N/A';
  try {
    return format(new Date(date), 'MMM d, yyyy');
  } catch {
    return 'Invalid date';
  }
};

const isOverdue = (date) => {
  if (!date) return false;
  return new Date(date) < new Date();
};

const getStatusColor = (status) => {
  switch (status) {
    case 'open': return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'in_progress': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    case 'closed': return 'bg-green-100 text-green-700 border-green-200';
    case 'on_hold': return 'bg-gray-100 text-gray-700 border-gray-200';
    case 'archived': return 'bg-purple-100 text-purple-700 border-purple-200';
    default: return 'bg-gray-100 text-gray-700 border-gray-200';
  }
};

const getPriorityColor = (priority) => {
  switch (priority) {
    case 'urgent': return 'bg-red-100 text-red-700 border-red-200';
    case 'high': return 'bg-orange-100 text-orange-700 border-orange-200';
    case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    case 'low': return 'bg-green-100 text-green-700 border-green-200';
    default: return 'bg-gray-100 text-gray-700 border-gray-200';
  }
};

const getClientStatusColor = (status) => {
  switch (status) {
    case 'satisfied': return 'bg-green-400';
    case 'needs_attention': return 'bg-yellow-400';
    case 'at_risk': return 'bg-red-400';
    default: return 'bg-green-400';
  }
};
</script>