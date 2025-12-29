<template>
  <form @submit.prevent="handleSubmit" class="space-y-6 max-h-[80vh] overflow-y-auto p-2">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label for="case_number">Case Number</Label>
        <Input id="case_number" v-model="formData.case_number" required />
      </div>

      <div>
        <Label for="case_type">Case Type</Label>
        <Select v-model:value="formData.case_type">
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="civil">Civil</SelectItem>
            <SelectItem value="criminal">Criminal</SelectItem>
            <SelectItem value="family">Family</SelectItem>
            <SelectItem value="corporate">Corporate</SelectItem>
            <SelectItem value="immigration">Immigration</SelectItem>
            <SelectItem value="personal_injury">Personal Injury</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>

    <div>
      <Label for="title">Case Title</Label>
      <Input id="title" v-model="formData.title" placeholder="Enter a descriptive case title" required />
    </div>

    <div>
      <Label for="description">Description</Label>
      <Textarea id="description" v-model="formData.description" placeholder="Provide details about the case..." rows="3" />
    </div>

    <div>
      <Label>Assign Customer(s)</Label>
      <Popover :open="openCustomerSelector" @open-change="(v) => openCustomerSelector = v">
        <PopoverTrigger as-child>
          <Button variant="outline" role="combobox" :aria-expanded="openCustomerSelector" class="w-full justify-between">
            <span class="truncate">{{ selectedCustomersLabel }}</span>
            <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent class="w-full p-0">
          <Command>
            <CommandInput placeholder="Search customers..." />
            <CommandEmpty>No customer found.</CommandEmpty>
            <CommandGroup>
              <CommandItem v-for="customer in customers" :key="customer.id" @select="toggleCustomer(customer.id)">
                <Check :class="['mr-2 h-4 w-4', formData.customer_ids.includes(customer.id) ? 'opacity-100' : 'opacity-0']" />
                {{ customer.full_name }} ({{ customer.email }})
              </CommandItem>
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
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

      <div>
        <Label for="status">Initial Status</Label>
        <Select v-model:value="formData.status">
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="on_hold">On Hold</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <Label for="case_value">Case Value ($)</Label>
        <Input id="case_value" type="number" v-model="formData.case_value" placeholder="0.00" />
      </div>

      <div>
        <Label for="billing_rate">Billing Rate ($/hr)</Label>
        <Input id="billing_rate" type="number" v-model="formData.billing_rate" placeholder="0.00" />
      </div>

      <div>
        <Label for="estimated_hours">Estimated Hours</Label>
        <Input id="estimated_hours" type="number" v-model="formData.estimated_hours" placeholder="0" />
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label>Due Date (Optional)</Label>
        <Popover>
          <PopoverTrigger as-child>
            <Button variant="outline" class="w-full justify-start">
              <CalendarIcon class="mr-2 h-4 w-4" />
              {{ formData.due_date ? formatDate(formData.due_date) : 'Select due date' }}
            </Button>
          </PopoverTrigger>
          <PopoverContent class="w-auto p-0">
            <Calendar mode="single" :selected="formData.due_date ? new Date(formData.due_date) : undefined" @select="onSelectDueDate" />
          </PopoverContent>
        </Popover>
      </div>

      <div>
        <Label>Court Date (Optional)</Label>
        <Popover>
          <PopoverTrigger as-child>
            <Button variant="outline" class="w-full justify-start">
              <CalendarIcon class="mr-2 h-4 w-4" />
              {{ formData.court_date ? formatDate(formData.court_date) : 'Select court date' }}
            </Button>
          </PopoverTrigger>
          <PopoverContent class="w-auto p-0">
            <Calendar mode="single" :selected="formData.court_date ? new Date(formData.court_date) : undefined" @select="onSelectCourtDate" />
          </PopoverContent>
        </Popover>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label for="court_name">Court Name</Label>
        <Input id="court_name" v-model="formData.court_name" placeholder="Superior Court of..." />
      </div>

      <div>
        <Label for="judge_name">Judge Name</Label>
        <Input id="judge_name" v-model="formData.judge_name" placeholder="Honorable..." />
      </div>
    </div>

    <div>
      <Label for="opposing_counsel">Opposing Counsel</Label>
      <Input id="opposing_counsel" v-model="formData.opposing_counsel" placeholder="Name and firm of opposing counsel" />
    </div>

    <div class="flex justify-end space-x-3 pt-4">
      <Button type="button" variant="outline" @click="onCancel">
        <X class="w-4 h-4 mr-2" />
        Cancel
      </Button>
      <Button type="submit" :disabled="isSubmitting" class="bg-blue-600 hover:bg-blue-700">
        <Save class="w-4 h-4 mr-2" />
        {{ isSubmitting ? 'Creating...' : 'Create Case' }}
      </Button>
    </div>
  </form>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { User } from '@/entities/User';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar as UiCalendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon, Save, X } from 'lucide-vue-next';
import { Check, ChevronsUpDown } from 'lucide-vue-next';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Command as CommandAlias } from '@/components/ui/command';

const props = defineProps({ onSubmit: { type: Function, required: true }, onCancel: { type: Function, required: true }, pinnedCaseId: { type: [String,Number], required: false }, currentUser: { type: Object, required: false } });

const customers = ref([]);
const isSubmitting = ref(false);
const openCustomerSelector = ref(false);

const formData = ref({
  case_number: `CASE-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`,
  title: '',
  description: '',
  status: 'open',
  priority: 'medium',
  case_type: 'civil',
  due_date: '',
  court_date: '',
  customer_ids: [],
  owner_ids: [],
  shared_with_users: [],
  case_value: '',
  billing_rate: '',
  estimated_hours: '',
  court_name: '',
  judge_name: '',
  opposing_counsel: '',
  tags: []
});

onMounted(async () => {
  const allUsers = await User.list();
  customers.value = (allUsers || []).filter(u => u.user_type === 'customer');
});

const selectedCustomersLabel = computed(() => {
  const selected = customers.value.filter(c => formData.value.customer_ids.includes(c.id));
  return selected.length > 0 ? selected.map(s => s.full_name).join(', ') : 'Select customer(s)...';
});

const toggleCustomer = (id) => {
  const ids = formData.value.customer_ids || [];
  if (ids.includes(id)) {
    formData.value.customer_ids = ids.filter(x => x !== id);
  } else {
    formData.value.customer_ids = [...ids, id];
  }
};

const onSelectDueDate = (date) => {
  formData.value.due_date = date ? date.toISOString().split('T')[0] : '';
};

const onSelectCourtDate = (date) => {
  formData.value.court_date = date ? date.toISOString().split('T')[0] : '';
};

const formatDate = (d) => {
  try { return format(new Date(d), 'PPP'); } catch (e) { return ''; }
};

const handleSubmit = async () => {
  isSubmitting.value = true;
  try {
    const dataWithOwner = { ...formData.value, owner_ids: props.currentUser ? [props.currentUser.id] : [] };
    await props.onSubmit(dataWithOwner);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Failed to create case:', err);
  }
  isSubmitting.value = false;
};
</script>

<style scoped>
/* no custom styles */
</style>
