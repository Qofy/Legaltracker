<template>
  <Dialog :open="open" @update:open="$emit('update:open', $event)">
    <DialogContent class="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
      <DialogHeader>
        <DialogTitle class="text-2xl font-bold text-gray-900">
          {{ caseData?.title || 'Case Details' }}
        </DialogTitle>
      </DialogHeader>

      <div v-if="caseData" class="overflow-y-auto flex-1 space-y-6 pr-2">
        <!-- Case Header Info -->
        <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p class="text-xs text-gray-600 font-medium uppercase tracking-wide mb-1">Case Number</p>
              <p class="font-semibold text-gray-900">#{{ caseData.case_number }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-600 font-medium uppercase tracking-wide mb-1">Status</p>
              <Badge :class="getStatusColor(caseData.status)" class="border">
                {{ caseData.status?.replace('_', ' ').toUpperCase() || 'OPEN' }}
              </Badge>
            </div>
            <div>
              <p class="text-xs text-gray-600 font-medium uppercase tracking-wide mb-1">Priority</p>
              <Badge :class="getPriorityColor(caseData.priority)" class="border">
                {{ caseData.priority?.toUpperCase() || 'MEDIUM' }}
              </Badge>
            </div>
            <div>
              <p class="text-xs text-gray-600 font-medium uppercase tracking-wide mb-1">Case Type</p>
              <p class="font-medium text-gray-900 capitalize">{{ caseData.case_type || 'General' }}</p>
            </div>
          </div>
        </div>

        <!-- Description -->
        <div>
          <h3 class="font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <FileText class="w-4 h-4" />
            Description
          </h3>
          <p class="text-gray-700 text-sm leading-relaxed bg-gray-50 p-4 rounded-lg border">
            {{ caseData.description || 'No description provided.' }}
          </p>
        </div>

        <!-- Client Information -->
        <div>
          <h3 class="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Users class="w-4 h-4" />
            Client Information
          </h3>
          <div v-if="caseData.customers && caseData.customers.length > 0" class="space-y-2">
            <div
              v-for="customer in caseData.customers"
              :key="customer.id"
              class="bg-white border border-gray-200 rounded-lg p-4 flex items-center gap-4"
            >
              <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span class="text-blue-700 font-semibold text-lg">
                  {{ getInitials(customer.full_name) }}
                </span>
              </div>
              <div class="flex-1">
                <p class="font-semibold text-gray-900">{{ customer.full_name }}</p>
                <p class="text-sm text-gray-600">{{ customer.email }}</p>
                <p v-if="customer.phone" class="text-sm text-gray-500">{{ customer.phone }}</p>
              </div>
              <div
                class="w-3 h-3 rounded-full"
                :class="getClientStatusColor(caseData.client_status)"
                :title="caseData.client_status || 'satisfied'"
              ></div>
            </div>
          </div>
          <div v-else class="text-sm text-gray-500 italic bg-gray-50 p-4 rounded-lg border">
            No clients assigned to this case
          </div>
        </div>

        <!-- Assigned Lawyer -->
        <div>
          <h3 class="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Briefcase class="w-4 h-4" />
            Assigned Lawyer
          </h3>
          <div v-if="assignedLawyer" class="bg-white border border-gray-200 rounded-lg p-4 flex items-center gap-4">
            <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <span class="text-blue-700 font-semibold text-lg">
                {{ getInitials(assignedLawyer.full_name) }}
              </span>
            </div>
            <div class="flex-1">
              <p class="font-semibold text-gray-900">{{ assignedLawyer.full_name }}</p>
              <p class="text-sm text-gray-600">{{ assignedLawyer.email }}</p>
              <p v-if="assignedLawyer.phone" class="text-sm text-gray-500">
                {{ assignedLawyer.phone }}
              </p>
              <p v-if="assignedLawyer.bar_number" class="text-xs text-gray-500 mt-1">
                Bar #{{ assignedLawyer.bar_number }}
              </p>
            </div>
            <Button
              @click="$emit('assign-lawyer', caseData)"
              size="sm"
              variant="outline"
            >
              <Edit class="w-4 h-4 mr-1" />
              Reassign
            </Button>
          </div>
          <div v-else class="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <UserX class="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p class="font-medium text-red-900">No lawyer assigned</p>
                <p class="text-sm text-red-700">This case requires a lawyer assignment</p>
              </div>
            </div>
            <Button
              @click="$emit('assign-lawyer', caseData)"
              class="bg-red-600 hover:bg-red-700 text-white"
            >
              <UserCheck class="w-4 h-4 mr-1" />
              Assign Now
            </Button>
          </div>
        </div>

        <!-- Dates -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="bg-gray-50 rounded-lg p-4 border">
            <div class="flex items-center gap-2 mb-2">
              <Calendar class="w-4 h-4 text-gray-600" />
              <p class="text-xs text-gray-600 font-medium uppercase tracking-wide">Created</p>
            </div>
            <p class="font-semibold text-gray-900">{{ formatDate(caseData.created_date) }}</p>
          </div>
          <div class="bg-gray-50 rounded-lg p-4 border">
            <div class="flex items-center gap-2 mb-2">
              <Clock class="w-4 h-4 text-gray-600" />
              <p class="text-xs text-gray-600 font-medium uppercase tracking-wide">Last Updated</p>
            </div>
            <p class="font-semibold text-gray-900">
              {{ formatDate(caseData.updated_date || caseData.created_date) }}
            </p>
          </div>
          <div class="bg-gray-50 rounded-lg p-4 border">
            <div class="flex items-center gap-2 mb-2">
              <AlertCircle class="w-4 h-4 text-gray-600" />
              <p class="text-xs text-gray-600 font-medium uppercase tracking-wide">Due Date</p>
            </div>
            <p
              v-if="caseData.due_date"
              class="font-semibold"
              :class="isOverdue(caseData.due_date) ? 'text-red-600' : 'text-gray-900'"
            >
              {{ formatDate(caseData.due_date) }}
              <span v-if="isOverdue(caseData.due_date)" class="text-xs">(Overdue)</span>
            </p>
            <p v-else class="text-gray-500 italic text-sm">Not set</p>
          </div>
        </div>

        <!-- Additional Info -->
        <div v-if="caseData.notes" class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 class="font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <MessageSquare class="w-4 h-4" />
            Notes
          </h3>
          <p class="text-sm text-gray-700">{{ caseData.notes }}</p>
        </div>
      </div>

      <div class="flex items-center justify-end gap-2 pt-4 border-t mt-4">
        <Button variant="outline" @click="$emit('update:open', false)">
          Close
        </Button>
        <Button @click="handleEdit" class="bg-[#003aca] hover:bg-[#002a8a]">
          <Edit class="w-4 h-4 mr-1" />
          Edit Case
        </Button>
      </div>
    </DialogContent>
  </Dialog>
</template>

<script setup>
import { computed } from 'vue';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  FileText,
  Users,
  Briefcase,
  Calendar,
  Clock,
  AlertCircle,
  MessageSquare,
  Edit,
  UserX,
  UserCheck,
} from 'lucide-vue-next';

const props = defineProps({
  open: {
    type: Boolean,
    required: true
  },
  caseData: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['update:open', 'assign-lawyer', 'edit']);

const handleEdit = () => {
  emit('edit', props.caseData);
  emit('update:open', false);
};

// Computed property to get the assigned lawyer from owners array
const assignedLawyer = computed(() => {
  if (props.caseData?.owners && props.caseData.owners.length > 0) {
    // Get the first lawyer owner
    return props.caseData.owners.find(owner => owner.user_type === 'lawyer') || props.caseData.owners[0];
  }
  return null;
});

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
    return format(new Date(date), 'MMM d, yyyy h:mm a');
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
