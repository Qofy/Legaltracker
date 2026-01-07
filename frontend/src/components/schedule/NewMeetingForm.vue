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
      <Label for="case-select">Associated Case (Optional)</Label>
      <select
        id="case-select"
        v-model="formData.case_id"
        class="border rounded px-3 py-2 w-full max-w-md "
      >
        <option value="">No case</option>
        <option
          v-for="caseItem in allCases"
          :key="caseItem.id"
          :value="caseItem.id"
        >
          {{ caseItem.title }}
        </option>
      </select>
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

    <div>
      <Label>Attendees</Label>
      <Popover v-model:open="openUserSelector">
        <PopoverTrigger as-child>
          <Button variant="outline" role="combobox" class="w-full justify-between">
            <span class="truncate">
              {{ selectedUsersText }}
            </span>
            <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent class="w-[300px] p-0">
          <Command>
            <CommandInput placeholder="Search users..." />
            <CommandEmpty>No users found.</CommandEmpty>
            <CommandGroup>
              <CommandItem
                v-for="user in allUsers"
                :key="user.id"
                @select="toggleAttendee(user.id)"
              >
                <Check
                  :class="[
                    'mr-2 h-4 w-4',
                    formData.attendee_ids.includes(user.id) ? 'opacity-100' : 'opacity-0'
                  ]"
                />
                {{ user.full_name }}
              </CommandItem>
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
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
// import { Meeting } from '@/entities/Meeting'; // Commented out - API call
// import { User } from '@/entities/User'; // Commented out - API call
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
    // API calls commented out
    // const users = await User.list();
    // allUsers.value = users;

    // Mock data for demonstration
    allUsers.value = [
      { id: 'user-1', full_name: 'John Doe' },
      { id: 'user-2', full_name: 'Jane Smith' },
      { id: 'user-3', full_name: 'Bob Johnson' }
    ];

    allCases.value = [
      { id: 'case-abc', title: 'Acme Corp Project Launch' },
      { id: 'case-xyz', title: 'Internal Strategy Review' },
      { id: 'case-123', title: 'Client Follow-up Z' }
    ];
  } catch (error) {
    console.error('Failed to load data:', error);
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
  console.log('NewMeetingForm: handleSubmit called', { title: formData.title, start_time: formData.start_time, attendees: formData.attendee_ids })
  if (!formData.title || !formData.start_time || formData.attendee_ids.length === 0) {
    toast({
      variant: 'destructive',
      title: 'Missing Information',
      description: 'Title, start date, and at least one attendee are required.'
    });
    return;
  }

  isSubmitting.value = true;

  const finalFormData = {
    ...formData,
    start_time: combineDateAndTime(formData.start_time, startTime.value)?.toISOString(),
    end_time: combineDateAndTime(formData.start_time, endTime.value)?.toISOString(),
    case_id: formData.case_id === '' ? null : formData.case_id
  };

    try {
      // API call commented out
      // const created = await Meeting.create(finalFormData);
      // For now create a local meeting object so UI can update immediately
      const created = {
        id: `local-${Date.now()}`,
        title: formData.title,
        meeting_date: finalFormData.start_time,
        start_time: finalFormData.start_time,
        end_time: finalFormData.end_time,
        case_id: finalFormData.case_id,
        attendee_ids: formData.attendee_ids,
        location: formData.location,
        description: formData.description,
        // mark this local meeting as a discussion event so the calendar can render it accordingly
        event_type: 'discussion',
        // whether to add a calendar label on the meeting date
        add_label: !!formData.add_label,
        // number of minutes before meeting to create a reminder (0 = none)
        reminder_offset_minutes: Number(formData.reminder_offset_minutes || 0)
      };

      toast({
        title: 'Meeting Created!',
        description: `Meeting "${formData.title}" has been scheduled.`
      });

      // Optional immediate alert popup for visibility
      try { window.alert(`Meeting "${formData.title}" scheduled for ${format(new Date(created.meeting_date), 'PPP p')}`) } catch (e) { /* ignore */ }

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
  const currentIds = formData.attendee_ids;
  if (currentIds.includes(userId)) {
    formData.attendee_ids = currentIds.filter(id => id !== userId);
  } else {
    formData.attendee_ids = [...currentIds, userId];
  }
};

const selectedUsers = computed(() => {
  return allUsers.value.filter(u => formData.attendee_ids.includes(u.id));
});

const selectedUsersText = computed(() => {
  return selectedUsers.value.length > 0
    ? selectedUsers.value.map(u => u.full_name).join(', ')
    : 'Select attendees...';
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
