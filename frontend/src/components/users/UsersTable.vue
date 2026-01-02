<template>
  <div class="overflow-x-auto bg-white rounded-lg">
    <table class="w-full">
      <thead class="bg-gray-50/80 border-b border-gray-200">
        <tr>
          <th class="text-left py-4 px-6 font-semibold text-gray-800 text-sm uppercase tracking-wide">
            User
          </th>
          <th class="text-left py-4 px-6 font-semibold text-gray-800 text-sm uppercase tracking-wide">
            Contact
          </th>
          <th class="text-left py-4 px-6 font-semibold text-gray-800 text-sm uppercase tracking-wide">
            Phone
          </th>
          <th class="text-left py-4 px-6 font-semibold text-gray-800 text-sm uppercase tracking-wide">
            Status
          </th>
          <th class="text-right py-4 px-6 font-semibold text-gray-800 text-sm uppercase tracking-wide">
            Actions
          </th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-100">
        <tr v-if="users.length === 0">
          <td colspan="5" class="text-center py-12 text-gray-500">
            <div class="flex flex-col items-center gap-3">
              <UsersIcon class="w-12 h-12 text-gray-300" />
              <p class="font-medium">No users found</p>
              <p class="text-sm">Users will appear here when they are added to the system.</p>
            </div>
          </td>
        </tr>
        <tr
          v-for="user in users"
          :key="user.id"
          class="hover:bg-blue-50/30 transition-colors duration-150 group"
        >
          <td class="py-4 px-6">
            <div class="flex items-center space-x-4">
              <div class="relative">
                <div class="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center shadow-sm">
                  <span class="text-blue-700 font-bold text-sm">
                    {{ getInitials(user.full_name) }}
                  </span>
                </div>
                <div class="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white shadow-sm"
                     :class="user.is_active ? 'bg-green-400' : 'bg-gray-300'">
                </div>
              </div>
              <div>
                <p class="font-semibold text-gray-900 group-hover:text-[#003aca] transition-colors">
                  {{ user.full_name }}
                </p>
                <p v-if="user.user_type === 'lawyer' && user.bar_number" class="text-xs text-gray-500 mt-0.5">
                  Bar License #{{ user.bar_number }}
                </p>
                <p v-else class="text-xs text-gray-500 mt-0.5 capitalize">
                  {{ user.user_type }}
                </p>
              </div>
            </div>
          </td>
          <td class="py-4 px-6">
            <div class="flex flex-col">
              <span class="text-gray-900 font-medium">{{ user.email }}</span>
              <span v-if="user.email_verified_at" class="text-xs text-green-600 mt-0.5 flex items-center gap-1">
                <CheckCircle class="w-3 h-3" />
                Verified
              </span>
              <span v-else class="text-xs text-orange-600 mt-0.5 flex items-center gap-1">
                <AlertCircle class="w-3 h-3" />
                Unverified
              </span>
            </div>
          </td>
          <td class="py-4 px-6">
            <span class="text-gray-700">{{ user.phone || '—' }}</span>
          </td>
          <td class="py-4 px-6">
            <Badge 
              :class="user.is_active 
                ? 'bg-green-100 text-green-700 border-green-200' 
                : 'bg-gray-100 text-gray-600 border-gray-200'"
              class="border"
            >
              <div class="flex items-center gap-1.5">
                <div class="w-1.5 h-1.5 rounded-full" 
                     :class="user.is_active ? 'bg-green-500' : 'bg-gray-400'">
                </div>
                {{ user.is_active ? 'Active' : 'Inactive' }}
              </div>
            </Badge>
          </td>
          <td class="py-4 px-6 text-right">
            <div class="flex items-center justify-end gap-2">
              <Button
                variant="ghost"
                size="sm"
                @click="$emit('edit', user)"
                class="text-gray-600 hover:text-[#003aca] hover:bg-blue-50 transition-all duration-150"
              >
                <Edit class="w-4 h-4 mr-1.5" />
                Edit
              </Button>
              <Button
                variant="ghost"
                size="sm"
                class="text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-all duration-150"
              >
                <MoreVertical class="w-4 h-4" />
              </Button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, MoreVertical, CheckCircle, AlertCircle, Users as UsersIcon } from 'lucide-vue-next';

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
