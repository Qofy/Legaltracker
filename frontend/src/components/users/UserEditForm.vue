<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <div>
      <Label for="full_name">Full Name</Label>
      <Input
        id="full_name"
        v-model="formData.full_name"
        required
      />
    </div>

    <div>
      <Label for="email">Email</Label>
      <Input
        id="email"
        type="email"
        v-model="formData.email"
        required
      />
    </div>

    <div>
      <Label for="phone">Phone</Label>
      <Input
        id="phone"
        type="tel"
        v-model="formData.phone"
      />
    </div>

    <div v-if="user.user_type === 'lawyer'">
      <Label for="bar_number">Bar Number</Label>
      <Input
        id="bar_number"
        v-model="formData.bar_number"
      />
    </div>

    <div v-if="user.user_type === 'lawyer'">
      <Label for="specialization">Specializations (comma-separated)</Label>
      <Input
        id="specialization"
        v-model="specializationString"
        placeholder="Corporate Law, Criminal Defense"
      />
    </div>

    <div>
      <Label for="address">Address</Label>
      <Textarea
        id="address"
        v-model="formData.address"
        :rows="3"
      />
    </div>

    <div class="flex items-center space-x-2">
      <Switch
        :checked="formData.is_active"
        @update:checked="formData.is_active = $event"
      />
      <Label>Active User</Label>
    </div>

    <div class="flex justify-end space-x-2 pt-4">
      <Button
        type="button"
        variant="outline"
        @click="$emit('cancel')"
      >
        Cancel
      </Button>
      <Button
        type="submit"
        :disabled="isSaving"
      >
        {{ isSaving ? 'Saving...' : 'Save Changes' }}
      </Button>
    </div>
  </form>
</template>

<script setup>
import { ref, computed } from 'vue';
import { User } from '@/services/entities';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';

const props = defineProps({
  user: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['save', 'cancel']);
const { toast } = useToast();

const formData = ref({
  full_name: props.user.full_name || '',
  email: props.user.email || '',
  phone: props.user.phone || '',
  bar_number: props.user.bar_number || '',
  specialization: props.user.specialization || [],
  address: props.user.address || '',
  is_active: props.user.is_active !== false
});

const isSaving = ref(false);

const specializationString = computed({
  get: () => {
    return Array.isArray(formData.value.specialization)
      ? formData.value.specialization.join(', ')
      : '';
  },
  set: (value) => {
    formData.value.specialization = value
      .split(',')
      .map(s => s.trim())
      .filter(s => s);
  }
});

const handleSubmit = async () => {
  isSaving.value = true;
  try {
    await User.update(props.user.id, formData.value);

    toast({
      title: 'User Updated',
      description: 'User information has been successfully updated.'
    });

    emit('save');
  } catch (error) {
    console.error('Failed to update user:', error);
    toast({
      variant: 'destructive',
      title: 'Update Failed',
      description: error.message || 'Failed to update user information.'
    });
  }
  isSaving.value = false;
};
</script>
