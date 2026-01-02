<template>
  <form @submit.prevent="handleSubmit" class="space-y-6 max-h-[80vh]  p-2">
    <!-- Basic Information -->
    <div>
      <Label for="title">Case Title *</Label>
      <Input
        id="title"
        v-model="formData.title"
        placeholder="Briefly describe your legal matter"
        required
      />
      <p class="text-xs text-gray-500 mt-1">Example: "Car Accident on Main Street" or "Employment Contract Dispute"</p>
    </div>

    <div>
      <Label for="case_type">Type of Legal Matter *</Label>
      <div class="relative">
        <select
          id="case_type"
          v-model="formData.case_type"
          class="appearance-none w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8 bg-white"
          required
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

    <div>
      <Label for="description">Description *</Label>
      <Textarea
        id="description"
        v-model="formData.description"
        placeholder="Provide details about your situation, what happened, and what outcome you're seeking..."
        rows="5"
        required
      />
      <p class="text-xs text-gray-500 mt-1">Include relevant dates, parties involved, and any actions taken so far</p>
    </div>

    <!-- Priority & Status -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label for="priority">How Urgent Is This? *</Label>
        <div class="relative">
          <select
            id="priority"
            v-model="formData.priority"
            class="appearance-none w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8 bg-white"
            required
          >
            <option value="low">Low - No rush</option>
            <option value="medium">Medium - Normal timeline</option>
            <option value="high">High - Time sensitive</option>
            <option value="urgent">Urgent - Immediate attention needed</option>
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
            <option value="open">Open - Waiting for review</option>
            <option value="in_progress">In Progress - Ready to work</option>
            <option value="on_hold">On Hold - Not ready yet</option>
          </select>
          <ChevronDown class="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      </div>
    </div>

    <!-- Court Information (Optional) -->
    <div class="border-t pt-4">
      <h3 class="text-sm font-semibold text-gray-700 mb-3">Court Information (Optional)</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label for="court_name">Court Name</Label>
          <Input
            id="court_name"
            v-model="formData.court_name"
            placeholder="If already filed, which court?"
          />
        </div>

        <div class="relative">
          <Label for="court_date">Court Date</Label>
          <div class="relative">
            <Input
              id="court_date"
              readonly
              :value="formData.court_date ? formatDate(formData.court_date) : 'Click to select date'"
              placeholder="Click to select date"
              class="w-full cursor-pointer pr-10"
              @click="showCalendar = !showCalendar"
            />
            <CalendarIcon class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
          <div v-if="showCalendar" class="absolute top-full left-0 mt-1 z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-3 w-full sm:w-auto">
            <Calendar
              mode="single"
              :selected="formData.court_date ? new Date(formData.court_date) : undefined"
              @select="(d) => { onSelectCourtDate(d); showCalendar = false }"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Additional Details (Optional) -->
    <div class="border-t pt-4">
      <h3 class="text-sm font-semibold text-gray-700 mb-3">Additional Details (Optional)</h3>
      <div class="space-y-4">
        <div>
          <Label for="opposing_counsel">Opposing Party/Counsel</Label>
          <Input
            id="opposing_counsel"
            v-model="formData.opposing_counsel"
            placeholder="Name of the other party or their lawyer"
          />
        </div>

        <div>
          <Label for="case_value">Estimated Case Value ($)</Label>
          <Input
            id="case_value"
            type="number"
            v-model="formData.case_value"
            placeholder="What is at stake financially?"
          />
        </div>
      </div>
    </div>

    <!-- Information Notice -->
    <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div class="flex items-start gap-3">
        <svg class="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div class="text-sm text-blue-800">
          <p class="font-medium mb-1">What happens next?</p>
          <p>After submitting your case, a lawyer will review your information and contact you within 1-2 business days to discuss your legal matter.</p>
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="flex justify-end space-x-3 pt-4 border-t">
      <Button type="button" variant="outline" @click="onCancel" :disabled="isSubmitting">
        Cancel
      </Button>
      <Button
        type="submit"
        :disabled="isSubmitting"
        class="bg-[#003aca] hover:bg-[#0031a0] h-10 px-2"
      >
        <Save class="w-4 h-4 mr-2" />
        {{ isSubmitting ? 'Creating Case...' : 'Submit Case Request' }}
      </Button>
    </div>
  </form>
</template>

<script setup>
import { ref } from 'vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon, Save, ChevronDown } from 'lucide-vue-next';

const props = defineProps({
  onSubmit: { type: Function, required: true },
  onCancel: { type: Function, required: true },
  currentUser: { type: Object, required: true }
});

const isSubmitting = ref(false);

// local calendar visibility state
const showCalendar = ref(false);

const formData = ref({
  case_number: `CASE-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`,
  title: '',
  description: '',
  status: 'open',
  priority: 'medium',
  case_type: 'civil',
  court_date: '',
  court_name: '',
  opposing_counsel: '',
  case_value: '',
});

const onSelectCourtDate = (date) => {
  console.log('Date selected:', date);
  formData.value.court_date = date ? date.toISOString().split('T')[0] : '';
  console.log('Court date set to:', formData.value.court_date);
};

const formatDate = (d) => {
  try {
    return format(new Date(d), 'PPP');
  } catch (e) {
    return '';
  }
};

const handleSubmit = async () => {
  isSubmitting.value = true;
  try {
    // Automatically assign the case to the current customer
    const caseData = {
      ...formData.value,
      customer_ids: [props.currentUser.id]
    };
    await props.onSubmit(caseData);
  } catch (err) {
    console.error('Failed to create case:', err);
    alert('Failed to create case. Please try again.');
  }
  isSubmitting.value = false;
};
</script>

<style scoped>
/* No custom styles needed */
</style>
