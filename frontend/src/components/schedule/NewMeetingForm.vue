<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
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

    <div class="flex justify-end space-x-2">
      <Button type="button" variant="outline" @click="handleCancel">
        Cancel
      </Button>
      <Button type="submit" :disabled="isSubmitting">
        {{ isSubmitting ? 'Scheduling...' : 'Schedule Meeting' }}
      </Button>
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
  }
});

const emit = defineEmits(['meetingCreated', 'cancel']);

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
    // await Meeting.create(finalFormData);
    console.log('Meeting data (API call commented out):', finalFormData);

    toast({
      title: 'Meeting Created!',
      description: `Meeting "${formData.title}" has been scheduled.`
    });
    emit('meetingCreated');
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

onMounted(() => {
  loadData();
});
</script>
