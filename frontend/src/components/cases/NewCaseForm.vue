<template>
  <form @submit.prevent="handleSubmit" class="space-y-6 max-h-[80vh] overflow-y-auto p-2">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label for="case_number">Case Number</Label>
        <Input id="case_number" v-model="formData.case_number" required />
      </div>

      <div>
        <Label for="case_type">Case Type</Label>
        <div class="relative">
          <select
            id="case_type"
            v-model="formData.case_type"
            class="appearance-none w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8 bg-white"
          >
            <option value="civil">Civil</option>
            <option value="criminal">Criminal</option>
            <option value="family">Family</option>
            <option value="corporate">Corporate</option>
            <option value="immigration">Immigration</option>
            <option value="personal_injury">Personal Injury</option>
            <option value="other">Other</option>
          </select>
          <ChevronDown class="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
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

    <!-- Case Parties Section -->
    <div class="border-t pt-4 mt-2">
      <h3 class="text-sm font-semibold text-gray-700 mb-3 flex items-center">
        <Users class="w-4 h-4 mr-2 text-blue-600" />
        Case Parties
      </h3>
      <div class="flex items-center gap-4.5">
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
    </div>

    <!-- Case Details Section -->
    <div class="border-t pt-4 mt-2">
      <h3 class="text-sm font-semibold text-gray-700 mb-3 flex items-center">
        <Settings class="w-4 h-4 mr-2 text-blue-600" />
        Case Details
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label for="priority">Priority</Label>
          <div class="relative">
            <select
              id="priority"
              v-model="formData.priority"
              class="appearance-none w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8 bg-white"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
            <ChevronDown class="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <div>
          <Label for="status">Initial Status</Label>
          <div class="relative">
            <select
              id="status"
              v-model="formData.status"
              class="appearance-none w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8 bg-white"
            >
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="on_hold">On Hold</option>
            </select>
            <ChevronDown class="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>
    </div>

    <!-- Financial Information Section -->
    <div class="border-t pt-4 mt-2">
      <h3 class="text-sm font-semibold text-gray-700 mb-3 flex items-center">
        <DollarSign class="w-4 h-4 mr-2 text-blue-600" />
        Financial Information
      </h3>
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
    </div>

    <!-- Court & Schedule Section -->
    <div class="border-t pt-4 mt-2 h-120 flex flex-col ">
      <h3 class="text-sm font-semibold text-gray-700 mb-3 flex items-center">
        <CalendarIcon class="w-4 h-4 mr-2 text-blue-600" />
        Court & Schedule
      </h3>
      <div class="space-y-4 flex flex-col gap-60">
        <div class="grid grid-cols-2  gap-4">
          <div>
            <Label class="font-bold">Due Date (Optional)</Label>
            <Popover>
              <PopoverTrigger as-child >
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
            <Label class="font-bold">Court Date (Optional)</Label>
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
      </div>
    </div>

    <!-- Additional Information Section -->
    <div class="border-t pt-4 mt-2">
      <h3 class="text-sm font-semibold text-gray-700 mb-3 flex items-center">
        <FileText class="w-4 h-4 mr-2 text-blue-600" />
        Additional Information
      </h3>
      <div>
        <Label for="opposing_counsel">Opposing Counsel</Label>
        <Input id="opposing_counsel" v-model="formData.opposing_counsel" placeholder="Name and firm of opposing counsel" />
      </div>
    </div>

    <div class="flex justify-end space-x-3 pt-4">
      <Button type="button" variant="outline" @click="onCancel">
        <!-- <X class="w-4 h-4 mr-2" /> -->
        Cancel
      </Button>
      <Button type="submit" :disabled="isSubmitting" class="bg-blue-600 hover:bg-blue-700 h-10 px-2">
        <Save class="w-4 h-4 mr-2" />
        {{ isSubmitting ? 'Creating...' : 'Create Case' }}
      </Button>
    </div>
  </form>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { User } from '@/services/entities';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon, Save, X, Check, ChevronsUpDown, Users, Settings, DollarSign, FileText, ChevronDown } from 'lucide-vue-next';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';

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
    // Set default status based on user type - customers create drafts, others create open cases
    const defaultStatus = props.currentUser?.user_type === 'customer' ? 'draft' : 'open';
    const dataWithOwner = { 
      ...formData.value, 
      owner_ids: props.currentUser ? [props.currentUser.id] : [],
      status: formData.value.status || defaultStatus
    };
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
