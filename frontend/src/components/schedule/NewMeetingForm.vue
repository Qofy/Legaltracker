<template>
  <form @submit.prevent="handleSubmit" novalidate class="space-y-4">
    <div>
      <Label for="title">Meeting Title</Label>
      <Input
        id="title"
        v-model="formData.title"
        required
      />
    </div>

    <!-- Associated Case (native select) -->
    <div class="flex items-start flex-col">
      <Label for="case-select">Associated Case (Required)</Label>
      <select
        id="case-select"
        v-model="formData.case_id"
        class="border rounded px-3 py-2 w-full max-w-md"
        @change="onCaseChange"
        required
      >
        <option value="">Select a case...</option>
        <option
          v-for="caseItem in allCases"
          :key="caseItem.id"
          :value="caseItem.id"
        >
          {{ caseItem.case_number }} - {{ caseItem.title }}
        </option>
      </select>
      
      <!-- Show selected case details -->
      <div v-if="selectedCaseInfo" class="mt-2 p-3 bg-blue-50 rounded-md">
        <p class="text-sm font-medium text-blue-900 mb-2">Meeting attendees will include:</p>
        <div class="space-y-1 text-sm text-blue-800">
          <div v-if="selectedCaseInfo.assigned_lawyer" class="flex items-center gap-2">
            <div class="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Lawyer: {{ selectedCaseInfo.assigned_lawyer.full_name }}</span>
          </div>
          <div v-for="client in selectedCaseInfo.clients" :key="client.id" class="flex items-center gap-2">
            <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span>Client: {{ client.full_name }}</span>
          </div>
        </div>
      </div>
    </div>

    <div >
      <Label class="font-bold">Date</Label>
      <Popover>
        <PopoverTrigger as-child>
          <Button variant="outline" class="w-full justify-start text-left font-normal">
            <CalendarIcon class="mr-2 h-4 w-4" />
            <span v-if="formData.start_time">{{ formatDate(formData.start_time) }}</span>
            <span v-else>Pick a date</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent class="w-auto p-0">
          <Calendar
            mode="single"
            :selected="formData.start_time"
            @update:selected="date => formData.start_time = date"
          />
        </PopoverContent>
      </Popover>
    </div>

    <div class="grid grid-cols-2 gap-4 mt-60">
      <div>
        <Label>Start Time</Label>
        <Input type="time" v-model="startTime" />
      </div>
      <div>
        <Label>End Time</Label>
        <Input type="time" v-model="endTime" />
      </div>
    </div>

    <!-- Auto-selected Attendees Display -->
    <div v-if="formData.case_id && autoSelectedAttendees.length > 0">
      <Label>Meeting Attendees (Auto-selected from case)</Label>
      <div class="mt-2 space-y-2">
        <div 
          v-for="attendee in autoSelectedAttendees" 
          :key="attendee.id"
          class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border"
        >
          <div :class="[
            'w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold',
            attendee.user_type === 'lawyer' ? 'bg-purple-500' : 'bg-blue-500'
          ]">
            {{ attendee.full_name?.charAt(0) || '?' }}
          </div>
          <div class="flex-1">
            <p class="font-medium text-gray-900">{{ attendee.full_name || 'Unknown' }}</p>
            <p class="text-sm text-gray-500 capitalize">
              {{ attendee.user_type === 'customer' ? 'Client' : (attendee.user_type === 'lawyer' ? 'Assigned Lawyer' : attendee.user_type) }}
            </p>
            <p v-if="attendee.email" class="text-xs text-gray-400">{{ attendee.email }}</p>
          </div>
          <div class="ml-auto">
            <div class="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
              <svg class="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      <div class="mt-2 text-sm text-gray-600">
        💡 Attendees are automatically selected based on the case assignment (lawyer + clients)
      </div>
    </div>

    <div>
      <Label for="location">Location / URL</Label>
      <Input
        id="location"
        v-model="formData.location"
        placeholder="e.g., Conference Room A or Zoom link"
      />
    </div>

    <div>
      <Label for="description">Description (Optional)</Label>
      <Textarea
        id="description"
        v-model="formData.description"
      />
    </div>

    <div class="grid grid-cols-2 gap-4 items-end">
      <div class="flex items-center gap-2">
        <input id="add-label" type="checkbox" v-model="formData.add_label" class="w-4 h-4" />
        <label for="add-label" class="text-sm text-gray-700">Add calendar label</label>
      </div>

      <div>
        <label class="text-sm text-gray-700">Reminder</label>
        <div class="mt-1">
          <select v-model.number="formData.reminder_offset_minutes" class="border rounded px-3 py-2 w-full">
            <option :value="0">No reminder</option>
            <option :value="15">15 minutes before</option>
            <option :value="30">30 minutes before</option>
            <option :value="60">1 hour before</option>
          </select>
        </div>
      </div>
    </div>

    <div class="flex justify-end items-center gap-3">
      <button
        type="button"
        @click="handleCancel"
        class="inline-flex items-center gap-2 px-4 py-2 border border-red-600 text-red-600 rounded-md bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-300 transition"
      >
        <X class="w-4 h-4" />
        <span class="text-sm font-medium">Cancel</span>
      </button>

      <button
        type="submit"
        :disabled="isSubmitting"
        class="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#003aca] to-[#0052e8] text-white rounded-md shadow hover:from-[#002a8a] hover:to-[#003aca] disabled:opacity-60 disabled:cursor-not-allowed transition"
      >
        <Save class="w-4 h-4" />
        <span class="text-sm font-semibold">{{ isSubmitting ? 'Scheduling...' : 'Schedule Meeting' }}</span>
      </button>
    </div>
  </form>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue';
import { format } from 'date-fns';
import { Case, Meeting } from '@/services/entities';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { CalendarIcon, Save, X, Check, ChevronsUpDown } from 'lucide-vue-next';
import { useToast } from '@/components/ui/use-toast';

const props = defineProps({
  pinnedCaseId: {
    type: [String, Number],
    default: null
  },
  // Optional list of attendee ids to pre-select when opening the form
  initialAttendeeIds: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['meetingCreated', 'cancel', 'title-changed']);

const { toast } = useToast();

const formData = reactive({
  title: '',
  description: '',
  start_time: null,
  end_time: null,
  case_id: props.pinnedCaseId || '',
  attendee_ids: [],
  location: ''
});

// allow admin to request a calendar label and a reminder
formData.add_label = true
formData.reminder_offset_minutes = 30

// Watch for title changes and emit to parent
watch(() => formData.title, (newTitle) => {
  emit('title-changed', newTitle)
})

const startTime = ref('09:00');
const endTime = ref('10:00');
const allUsers = ref([]);
const allCases = ref([]);
const openUserSelector = ref(false);
const isSubmitting = ref(false);

const loadData = async () => {
  try {
    // Load cases from actual API
    const casesData = await Case.list('-updated_date');
    allCases.value = casesData || [];

    // Mock user data for demonstration
    allUsers.value = [
      { id: 'lawyer-1', full_name: 'Sarah Williams', user_type: 'lawyer', email: 'sarah@law.com' },
      { id: 'lawyer-2', full_name: 'Michael Brown', user_type: 'lawyer', email: 'michael@law.com' },
      { id: 'lawyer-3', full_name: 'Lisa Davis', user_type: 'lawyer', email: 'lisa@law.com' },
      { id: 'client-1', full_name: 'John Anderson', user_type: 'customer', email: 'john@client.com' },
      { id: 'client-2', full_name: 'Emma Wilson', user_type: 'customer', email: 'emma@client.com' },
      { id: 'client-3', full_name: 'Robert Taylor', user_type: 'customer', email: 'robert@client.com' },
      { id: 'admin-1', full_name: 'Admin User', user_type: 'admin', email: 'admin@law.com' }
    ];
  } catch (error) {
    console.error('Failed to load data:', error);
    // Fallback to mock data if API fails
    allCases.value = [
      { 
        id: 'case-abc', 
        title: 'Acme Corp Contract Dispute',
        case_number: 'CASE-001',
        assigned_lawyer: { id: 'lawyer-1', full_name: 'Sarah Williams' },
        clients: [{ id: 'client-1', full_name: 'John Anderson' }]
      },
      { 
        id: 'case-xyz', 
        title: 'Employment Termination Case',
        case_number: 'CASE-002',
        assigned_lawyer: { id: 'lawyer-2', full_name: 'Michael Brown' },
        clients: [{ id: 'client-2', full_name: 'Emma Wilson' }]
      },
      { 
        id: 'case-123', 
        title: 'Property Rights Issue',
        case_number: 'CASE-003', 
        assigned_lawyer: { id: 'lawyer-3', full_name: 'Lisa Davis' },
        clients: [{ id: 'client-3', full_name: 'Robert Taylor' }]
      }
    ];
  }
};

const combineDateAndTime = (date, time) => {
  if (!date || !time) return null;
  const [hours, minutes] = time.split(':');
  const newDate = new Date(date);
  newDate.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
  return newDate;
};

const handleSubmit = async (e) => {
  console.log('NewMeetingForm: handleSubmit called', { 
    title: formData.title, 
    start_time: formData.start_time, 
    attendee_ids: formData.attendee_ids,
    attendee_ids_length: formData.attendee_ids.length 
  })
  
  if (!formData.title) {
    toast({
      variant: 'destructive',
      title: 'Missing Title',
      description: 'Meeting title is required.'
    });
    return;
  }
  
  if (!formData.start_time) {
    toast({
      variant: 'destructive',
      title: 'Missing Date',
      description: 'Meeting date is required.'
    });
    return;
  }
  
  if (!formData.case_id) {
    toast({
      variant: 'destructive',
      title: 'Missing Case',
      description: 'Please select a case for this meeting.'
    });
    return;
  }
  
  if (autoSelectedAttendees.value.length === 0) {
    toast({
      variant: 'destructive',
      title: 'No Attendees',
      description: 'Selected case has no assigned lawyer or clients.'
    });
    return;
  }

  isSubmitting.value = true;

  // Normalize payload to backend expectations: use `meeting_date` and `duration_minutes`
  const startDt = combineDateAndTime(formData.start_time, startTime.value);
  const endDt = combineDateAndTime(formData.start_time, endTime.value);
  const durationMinutes = startDt && endDt ? Math.max(0, Math.round((endDt - startDt) / 60000)) : null;

  const finalFormData = {
    title: formData.title,
    description: formData.description,
    meeting_date: startDt ? startDt.toISOString() : null,
    duration_minutes: durationMinutes,
    location: formData.location,
    case_id: formData.case_id === '' ? null : formData.case_id,
    attendee_ids: Array.isArray(formData.attendee_ids) ? [...formData.attendee_ids] : [],
    // preserve optional flags for frontend use (backend will ignore unknown fields)
    add_label: !!formData.add_label,
    reminder_offset_minutes: Number(formData.reminder_offset_minutes || 0),
  };

  console.log('NewMeetingForm: finalFormData prepared:', finalFormData)

    try {
      // Save meeting to API first
      const apiResponse = await Meeting.create(finalFormData);
      console.log('Meeting saved to API:', apiResponse)
      
      // Create enriched meeting object for immediate UI update
      const created = {
        id: `local-${Date.now()}`,
        title: formData.title,
        meeting_date: finalFormData.meeting_date,
        start_time: finalFormData.meeting_date,
        end_time: endDt ? endDt.toISOString() : null,
        case_id: finalFormData.case_id,
        attendee_ids: Array.isArray(finalFormData.attendee_ids) ? [...finalFormData.attendee_ids] : [],
        attendees: autoSelectedAttendees.value, // Use auto-selected attendees
        location: formData.location,
        description: formData.description,
        // Use 'meeting' as default event type for meetings
        event_type: 'meeting',
        // whether to add a calendar label on the meeting date
        add_label: !!formData.add_label,
        // number of minutes before meeting to create a reminder (0 = none)
        reminder_offset_minutes: Number(formData.reminder_offset_minutes || 0),
        // Track who created the meeting
        created_by: 'admin',
        created_at: new Date().toISOString(),
        status: 'scheduled',
        // Include case information for display
        case_info: selectedCaseInfo.value
      };

      console.log('NewMeetingForm: created meeting object:', created)

      toast({
        title: 'Meeting Created!',
        description: `Meeting "${formData.title}" has been scheduled.`
      });

      // Optional immediate alert popup for visibility
      try { window.alert(`Meeting "${formData.title}" scheduled for ${format(new Date(created.meeting_date), 'PPP p')}`) } catch (e) { /* ignore */ }

      console.log('NewMeetingForm: about to emit meetingCreated with:', created)
      // Emit the created meeting so parent can update calendar immediately
      emit('meetingCreated', created);
  } catch (error) {
    console.error('Failed to create meeting:', error);
    toast({
      variant: 'destructive',
      title: 'Error',
      description: 'Could not create the meeting.'
    });
  }
  isSubmitting.value = false;
};

const handleCancel = () => {
  emit('cancel');
};

const toggleAttendee = (userId) => {
  console.log('toggleAttendee called with userId:', userId)
  const currentIds = formData.attendee_ids;
  console.log('current attendee_ids before toggle:', currentIds)
  
  if (currentIds.includes(userId)) {
    formData.attendee_ids = currentIds.filter(id => id !== userId);
    console.log('removed attendee, new ids:', formData.attendee_ids)
  } else {
    formData.attendee_ids = [...currentIds, userId];
    console.log('added attendee, new ids:', formData.attendee_ids)
  }
};

const selectedUsers = computed(() => {
  return autoSelectedAttendees.value;
});

// Computed property for currently selected case information
const selectedCaseInfo = computed(() => {
  if (!formData.case_id) return null
  return allCases.value.find(c => c.id === formData.case_id)
})

// Auto-selected attendees based on case
const autoSelectedAttendees = computed(() => {
  if (!formData.case_id) return []
  
  const selectedCase = allCases.value.find(c => c.id === formData.case_id)
  if (!selectedCase) return []
  
  const attendees = []
  
  // Add assigned lawyer (handle both mock and real data structures)
  if (selectedCase.assigned_lawyer) {
    // Try to find in allUsers first, otherwise use case data directly
    const lawyer = allUsers.value.find(u => u.id === selectedCase.assigned_lawyer.id) || {
      id: selectedCase.assigned_lawyer.id,
      full_name: selectedCase.assigned_lawyer.full_name,
      user_type: 'lawyer',
      email: selectedCase.assigned_lawyer.email
    }
    attendees.push(lawyer)
  }
  
  // Add clients/customers (handle both mock and real data structures)
  const clientList = selectedCase.clients || selectedCase.customers || []
  clientList.forEach(client => {
    // Try to find in allUsers first, otherwise use case data directly
    const clientUser = allUsers.value.find(u => u.id === client.id) || {
      id: client.id,
      full_name: client.full_name,
      user_type: 'customer',
      email: client.email
    }
    attendees.push(clientUser)
  })
  
  return attendees
})

// Method to handle case selection change
const onCaseChange = () => {
  // Auto-populate attendee_ids based on selected case
  formData.attendee_ids = autoSelectedAttendees.value.map(user => user.id)
  console.log('Case changed, auto-selected attendees:', formData.attendee_ids)
}

const selectedUsersText = computed(() => {
  return autoSelectedAttendees.value.length > 0
    ? `${autoSelectedAttendees.value.length} attendee(s) from selected case`
    : 'No case selected';
});

const formatDate = (date) => {
  return format(date, 'PPP');
};

// Watch pinnedCaseId and set it as default if not already set
watch(() => props.pinnedCaseId, (newPinnedCaseId) => {
  if (newPinnedCaseId && !formData.case_id) {
    formData.case_id = newPinnedCaseId;
  }
}, { immediate: true });

// Watch for initial attendee ids and apply them
watch(() => props.initialAttendeeIds, (ids) => {
  if (Array.isArray(ids) && ids.length > 0) {
    formData.attendee_ids = [...new Set([...(formData.attendee_ids || []), ...ids])];
  }
}, { immediate: true });

onMounted(() => {
  loadData();
});
</script>
