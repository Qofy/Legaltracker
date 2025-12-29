<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <div>
      <Label for="title">Case Title</Label>
      <Input id="title" v-model="formData.title" required />
    </div>

    <div>
      <Label for="description">Description</Label>
      <Textarea id="description" v-model="formData.description" rows="3" />
    </div>

    <div v-if="currentUser?.user_type === 'admin'">
      <Label for="lawyer">Assign Lawyer</Label>
      <Select v-model:value="formData.lawyer_id">
        <SelectTrigger><SelectValue placeholder="Select a lawyer..." /></SelectTrigger>
        <SelectContent>
          <SelectItem v-for="lawyer in allLawyers" :key="lawyer.id" :value="lawyer.id">
            {{ lawyer.full_name }}
          </SelectItem>
          <SelectItem :value="null">Unassigned</SelectItem>
        </SelectContent>
      </Select>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label for="status">Status</Label>
        <Select v-model:value="formData.status">
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="on_hold">On Hold</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label for="priority">Priority</Label>
        <Select v-model:value="formData.priority">
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="urgent">Urgent</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>

    <div class="flex justify-end space-x-2">
      <Button type="button" variant="outline" @click="handleCancel">
        <X class="w-4 h-4 mr-2" /> Cancel
      </Button>
      <Button type="submit" :disabled="isSubmitting" class="bg-blue-600 hover:bg-blue-700">
        <Save class="w-4 h-4 mr-2" /> {{ isSubmitting ? 'Saving...' : 'Save Changes' }}
      </Button>
    </div>
  </form>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Save, X } from 'lucide-vue-next';
import { User } from '@/services/entities';

const props = defineProps({
  caseData: { type: Object, required: true },
  onSubmit: { type: Function, required: false },
  onCancel: { type: Function, required: false }
});

const emit = defineEmits(['submit', 'cancel']);

const formData = ref({
  title: props.caseData.title || '',
  description: props.caseData.description || '',
  status: props.caseData.status || 'open',
  priority: props.caseData.priority || 'medium',
  case_type: props.caseData.case_type || 'civil',
  lawyer_id: props.caseData.lawyer_id ?? null
});

const isSubmitting = ref(false);
const currentUser = ref(null);
const allLawyers = ref([]);

const fetchData = async () => {
  try {
    const [user, lawyers] = await Promise.all([User.me(), User.filter({ user_type: 'lawyer' })]);
    currentUser.value = user;
    allLawyers.value = lawyers || [];
  } catch (err) {
    // keep behavior simple — log error
    // eslint-disable-next-line no-console
    console.error('Failed to fetch user or lawyers:', err);
  }
};

onMounted(fetchData);

watch(() => props.caseData, (newVal) => {
  formData.value = {
    title: newVal.title || '',
    description: newVal.description || '',
    status: newVal.status || 'open',
    priority: newVal.priority || 'medium',
    case_type: newVal.case_type || 'civil',
    lawyer_id: newVal.lawyer_id ?? null
  };
});

const handleSubmit = async () => {
  isSubmitting.value = true;
  try {
    if (props.onSubmit) {
      await props.onSubmit(formData.value);
    } else {
      emit('submit', formData.value);
    }
  } finally {
    isSubmitting.value = false;
  }
};

const handleCancel = () => {
  if (props.onCancel) props.onCancel();
  else emit('cancel');
};
</script>

<style scoped>
/* no custom styles */
</style>
