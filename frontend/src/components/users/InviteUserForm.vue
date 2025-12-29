<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <div>
      <Label for="email">Invitee's Email</Label>
      <Input
        id="email"
        type="email"
        v-model="email"
        placeholder="name@example.com"
        required
      />
    </div>

    <div>
      <Label for="role">Assign Role</Label>
      <Select v-model="role">
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="customer">Customer</SelectItem>
          <SelectItem value="lawyer">Lawyer</SelectItem>
          <SelectItem value="guest">Guest</SelectItem>
          <SelectItem value="admin">Admin</SelectItem>
        </SelectContent>
      </Select>
    </div>

    <div>
      <Label for="message">Personal Message (Optional)</Label>
      <Textarea
        id="message"
        v-model="message"
        placeholder="Include a personal message with your invitation..."
        :rows="3"
      />
    </div>

    <div v-if="error" class="text-red-600 text-sm flex items-center">
      <AlertCircle class="w-4 h-4 mr-2" />
      {{ error }}
    </div>

    <div class="flex justify-end gap-2">
      <Button type="button" variant="outline" @click="handleCancel">
        Cancel
      </Button>
      <Button type="submit" :disabled="isSubmitting">
        {{ isSubmitting ? 'Sending...' : 'Send Invitation' }}
      </Button>
    </div>
  </form>
</template>

<script setup>
import { ref } from 'vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle } from 'lucide-vue-next';

const emit = defineEmits(['invite', 'cancel']);

const email = ref('');
const role = ref('customer');
const message = ref('');
const isSubmitting = ref(false);
const error = ref('');

const handleSubmit = async () => {
  if (!email.value) {
    error.value = 'Email is required.';
    return;
  }

  error.value = '';
  isSubmitting.value = true;

  try {
    await emit('invite', {
      email: email.value,
      role: role.value,
      message: message.value
    });
  } catch (err) {
    error.value = err.message || 'An unexpected error occurred.';
  } finally {
    isSubmitting.value = false;
  }
};

const handleCancel = () => {
  emit('cancel');
};
</script>
