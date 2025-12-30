<template>
  <div class="overflow-x-auto">
    <table class="w-full">
      <thead>
        <tr class="border-b">
          <th class="text-left py-3 px-4 font-medium text-gray-700">Name</th>
          <th class="text-left py-3 px-4 font-medium text-gray-700">Email</th>
          <th class="text-left py-3 px-4 font-medium text-gray-700">Phone</th>
          <th class="text-left py-3 px-4 font-medium text-gray-700">Status</th>
          <th class="text-right py-3 px-4 font-medium text-gray-700">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="users.length === 0">
          <td colspan="5" class="text-center py-8 text-gray-500">
            No users found
          </td>
        </tr>
        <tr
          v-for="user in users"
          :key="user.id"
          class="border-b hover:bg-gray-50 transition"
        >
          <td class="py-3 px-4">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span class="text-blue-600 font-semibold">
                  {{ getInitials(user.full_name) }}
                </span>
              </div>
              <div>
                <p class="font-medium text-gray-900">{{ user.full_name }}</p>
                <p v-if="user.user_type === 'lawyer' && user.bar_number" class="text-xs text-gray-500">
                  Bar #{{ user.bar_number }}
                </p>
              </div>
            </div>
          </td>
          <td class="py-3 px-4 text-gray-700">{{ user.email }}</td>
          <td class="py-3 px-4 text-gray-700">{{ user.phone || 'N/A' }}</td>
          <td class="py-3 px-4">
            <Badge :variant="user.is_active ? 'success' : 'secondary'">
              {{ user.is_active ? 'Active' : 'Inactive' }}
            </Badge>
          </td>
          <td class="py-3 px-4 text-right">
            <Button
              variant="ghost"
              size="sm"
              @click="$emit('edit', user)"
            >
              <Edit class="w-4 h-4 mr-1" />
              Edit
            </Button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-vue-next';

defineProps({
  users: {
    type: Array,
    required: true
  }
});

defineEmits(['edit']);

const getInitials = (name) => {
  if (!name) return '?';
  const parts = name.split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};
</script>
