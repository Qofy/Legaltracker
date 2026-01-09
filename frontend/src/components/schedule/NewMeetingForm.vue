<template>
  <div
    class="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
  >
    <!-- Header -->
    <div class="bg-[green] px-8 py-6 rounded-t-2xl">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <div class="bg-white/20 backdrop-blur-sm rounded-xl p-3">
            <CalendarIcon class="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 class="text-2xl font-bold text-white">Schedule New Meeting</h2>
            <p class="text-blue-100 mt-1">Create and manage your meeting details</p>
          </div>
        </div>
        <button
          type="button"
          @click="handleCancel"
          class="p-2 text-white hover:bg-white/20 rounded-xl transition-colors"
        >
          <X class="w-6 h-6" />
        </button>
      </div>
    </div>

    <form @submit.prevent="handleSubmit" novalidate class="p-8 space-y-8">
      <!-- Meeting Title Section -->
      <div class="bg-gray-50 rounded-xl p-6">
        <div class="flex items-center gap-3 mb-4">
          <div class="bg-blue-500 rounded-lg p-2">
            <svg
              class="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              ></path>
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900">Meeting Details</h3>
        </div>

        <div class="space-y-4">
          <div>
            <Label for="title" class="text-sm font-medium text-gray-700 mb-2 block"
              >Meeting Title *</Label
            >
            <Input
              id="title"
              v-model="formData.title"
              placeholder="Enter meeting title..."
              class="h-12 text-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
        </div>
      </div>

      <!-- Case Selection Section -->
      <div class="bg-gray-50 rounded-xl p-6">
        <div class="flex items-center gap-3 mb-4">
          <div class="bg-green-500 rounded-lg p-2">
            <svg
              class="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              ></path>
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900">Associated Case</h3>
        </div>

        <div>
          <Label for="case-select" class="text-sm font-medium text-gray-700 mb-2 block"
            >Select Case *</Label
          >
          <select
            id="case-select"
            v-model="formData.case_id"
            class="w-full h-12 px-4 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
            @change="onCaseChange"
            required
          >
            <option value="" disabled>Choose a case...</option>
            <option v-for="caseItem in allCases" :key="caseItem.id" :value="caseItem.id">
              {{ caseItem.case_number }} - {{ caseItem.title }}
            </option>
          </select>

          <!-- Show selected case details -->
          <div
            v-if="selectedCaseInfo"
            class="mt-4 p-4 bg-white border border-blue-200 rounded-lg"
          >
            <div class="flex items-center gap-2 mb-3">
              <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span class="text-sm font-medium text-gray-800"
                >Meeting Attendees (Auto-selected)</span
              >
            </div>
            <div class="space-y-2">
              <div
                v-if="selectedCaseInfo.assigned_lawyer"
                class="flex items-center gap-3 p-2 bg-green-50 rounded-md"
              >
                <div
                  class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold"
                >
                  {{ selectedCaseInfo.assigned_lawyer.full_name?.charAt(0) || "L" }}
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-900">
                    {{ selectedCaseInfo.assigned_lawyer.full_name }}
                  </p>
                  <p class="text-xs text-green-600">Assigned Lawyer</p>
                </div>
              </div>
              <div
                v-for="client in selectedCaseInfo.clients"
                :key="client.id"
                class="flex items-center gap-3 p-2 bg-blue-50 rounded-md"
              >
                <div
                  class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold"
                >
                  {{ client.full_name?.charAt(0) || "C" }}
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-900">{{ client.full_name }}</p>
                  <p class="text-xs text-blue-600">Client</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Date & Time Section -->
      <div class="bg-gray-50 rounded-xl p-6">
        <div class="flex items-center gap-3 mb-4">
          <div class="bg-purple-500 rounded-lg p-2">
            <svg
              class="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900">Date & Time</h3>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-60">
          <div>
            <Label class="text-sm font-medium text-gray-700 mb-2 block">Date *</Label>
            <Popover>
              <PopoverTrigger as-child>
                <Button
                  variant="outline"
                  class="w-full h-12 justify-start text-left font-normal border-gray-300 hover:border-blue-500"
                >
                  <CalendarIcon class="mr-3 h-5 w-5 text-gray-500" />
                  <span v-if="formData.start_time" class="text-gray-900">{{
                    formatDate(formData.start_time)
                  }}</span>
                  <span v-else class="text-gray-500">Pick a date</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent class="w-auto p-0">
                <Calendar
                  mode="single"
                  :selected="formData.start_time"
                  @update:selected="(date) => (formData.start_time = date)"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <Label class="text-sm font-medium text-gray-700 mb-2 block"
              >Start Time *</Label
            >
            <Input
              type="time"
              v-model="startTime"
              class="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <Label class="text-sm font-medium text-gray-700 mb-2 block">End Time *</Label>
            <Input
              type="time"
              v-model="endTime"
              class="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <!-- Meeting Options Section -->
      <div class="bg-gray-50 rounded-xl p-6">
        <div class="flex items-center gap-3 mb-4">
          <div class="bg-orange-500 rounded-lg p-2">
            <svg
              class="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              ></path>
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              ></path>
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900">Additional Details</h3>
        </div>

        <div class="space-y-4">
          <div>
            <Label for="location" class="text-sm font-medium text-gray-700 mb-2 block"
              >Location / URL</Label
            >
            <Input
              id="location"
              v-model="formData.location"
              placeholder="e.g., Conference Room A or Zoom link"
              class="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <Label for="description" class="text-sm font-medium text-gray-700 mb-2 block"
              >Description (Optional)</Label
            >
            <Textarea
              id="description"
              v-model="formData.description"
              placeholder="Add meeting agenda, notes, or additional details..."
              class="min-h-[80px] border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              class="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg"
            >
              <input
                id="add-label"
                type="checkbox"
                v-model="formData.add_label"
                class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
              <label for="add-label" class="text-sm font-medium text-gray-700"
                >Add calendar label</label
              >
            </div>

            <div>
              <label class="text-sm font-medium text-gray-700 mb-2 block">Reminder</label>
              <select
                v-model.number="formData.reminder_offset_minutes"
                class="w-full h-10 px-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500 bg-white"
              >
                <option :value="0">No reminder</option>
                <option :value="15">15 minutes before</option>
                <option :value="30">30 minutes before</option>
                <option :value="60">1 hour before</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex items-center justify-between pt-6 border-t border-gray-200">
        <div class="text-sm text-gray-500">* Required fields</div>

        <div class="flex items-center gap-3">
          <button
            type="button"
            @click="handleCancel"
            class="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all duration-200 font-medium"
          >
            Cancel
          </button>

          <button
            type="submit"
            :disabled="isSubmitting"
            class="px-8 py-3 bg-gradient-to-r from-[#003aca] to-[#0052e8] text-white rounded-xl shadow-lg hover:shadow-xl hover:from-[#002a8a] hover:to-[#003aca] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold flex items-center gap-2"
          >
            <Save class="w-5 h-5" />
            <span>{{ isSubmitting ? "Scheduling..." : "Schedule Meeting" }}</span>
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from "vue";
import { format } from "date-fns";
import { Case, Meeting } from "@/services/entities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { CalendarIcon, Save, X, Check, ChevronsUpDown } from "lucide-vue-next";
import { useToast } from "@/components/ui/use-toast";

const props = defineProps({
  pinnedCaseId: {
    type: [String, Number],
    default: null,
  },
  // Optional list of attendee ids to pre-select when opening the form
  initialAttendeeIds: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["meetingCreated", "cancel", "title-changed"]);

const { toast } = useToast();

const formData = reactive({
  title: "",
  description: "",
  start_time: null,
  end_time: null,
  case_id: props.pinnedCaseId || "",
  attendee_ids: [],
  location: "",
});

// allow admin to request a calendar label and a reminder
formData.add_label = true;
formData.reminder_offset_minutes = 30;

// Watch for title changes and emit to parent
watch(
  () => formData.title,
  (newTitle) => {
    emit("title-changed", newTitle);
  }
);

const startTime = ref("09:00");
const endTime = ref("10:00");
const allUsers = ref([]);
const allCases = ref([]);
const openUserSelector = ref(false);
const isSubmitting = ref(false);

const loadData = async () => {
  try {
    // Load cases from actual API
    const casesData = await Case.list("-updated_date");
    allCases.value = casesData || [];

    // Mock user data for demonstration
    allUsers.value = [
      {
        id: "lawyer-1",
        full_name: "Sarah Williams",
        user_type: "lawyer",
        email: "sarah@law.com",
      },
      {
        id: "lawyer-2",
        full_name: "Michael Brown",
        user_type: "lawyer",
        email: "michael@law.com",
      },
      {
        id: "lawyer-3",
        full_name: "Lisa Davis",
        user_type: "lawyer",
        email: "lisa@law.com",
      },
      {
        id: "client-1",
        full_name: "John Anderson",
        user_type: "customer",
        email: "john@client.com",
      },
      {
        id: "client-2",
        full_name: "Emma Wilson",
        user_type: "customer",
        email: "emma@client.com",
      },
      {
        id: "client-3",
        full_name: "Robert Taylor",
        user_type: "customer",
        email: "robert@client.com",
      },
      {
        id: "admin-1",
        full_name: "Admin User",
        user_type: "admin",
        email: "admin@law.com",
      },
    ];
  } catch (error) {
    console.error("Failed to load data:", error);
    // Fallback to mock data if API fails
    allCases.value = [
      {
        id: "case-abc",
        title: "Acme Corp Contract Dispute",
        case_number: "CASE-001",
        assigned_lawyer: { id: "lawyer-1", full_name: "Sarah Williams" },
        clients: [{ id: "client-1", full_name: "John Anderson" }],
      },
      {
        id: "case-xyz",
        title: "Employment Termination Case",
        case_number: "CASE-002",
        assigned_lawyer: { id: "lawyer-2", full_name: "Michael Brown" },
        clients: [{ id: "client-2", full_name: "Emma Wilson" }],
      },
      {
        id: "case-123",
        title: "Property Rights Issue",
        case_number: "CASE-003",
        assigned_lawyer: { id: "lawyer-3", full_name: "Lisa Davis" },
        clients: [{ id: "client-3", full_name: "Robert Taylor" }],
      },
    ];
  }
};

const combineDateAndTime = (date, time) => {
  if (!date || !time) return null;
  const [hours, minutes] = time.split(":");
  const newDate = new Date(date);
  newDate.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
  return newDate;
};

const handleSubmit = async (e) => {
  console.log("NewMeetingForm: handleSubmit called", {
    title: formData.title,
    start_time: formData.start_time,
    attendee_ids: formData.attendee_ids,
    attendee_ids_length: formData.attendee_ids.length,
  });

  if (!formData.title) {
    toast({
      variant: "destructive",
      title: "Missing Title",
      description: "Meeting title is required.",
    });
    return;
  }

  if (!formData.start_time) {
    toast({
      variant: "destructive",
      title: "Missing Date",
      description: "Meeting date is required.",
    });
    return;
  }

  if (!formData.case_id) {
    toast({
      variant: "destructive",
      title: "Missing Case",
      description: "Please select a case for this meeting.",
    });
    return;
  }

  if (autoSelectedAttendees.value.length === 0) {
    toast({
      variant: "destructive",
      title: "No Attendees",
      description: "Selected case has no assigned lawyer or clients.",
    });
    return;
  }

  isSubmitting.value = true;

  // Normalize payload to backend expectations: use `meeting_date` and `duration_minutes`
  const startDt = combineDateAndTime(formData.start_time, startTime.value);
  const endDt = combineDateAndTime(formData.start_time, endTime.value);
  const durationMinutes =
    startDt && endDt ? Math.max(0, Math.round((endDt - startDt) / 60000)) : null;

  const finalFormData = {
    title: formData.title,
    description: formData.description,
    meeting_date: startDt ? startDt.toISOString() : null,
    duration_minutes: durationMinutes,
    location: formData.location,
    case_id: formData.case_id === "" ? null : formData.case_id,
    attendee_ids: Array.isArray(formData.attendee_ids) ? [...formData.attendee_ids] : [],
    // preserve optional flags for frontend use (backend will ignore unknown fields)
    add_label: !!formData.add_label,
    reminder_offset_minutes: Number(formData.reminder_offset_minutes || 0),
  };

  console.log("NewMeetingForm: finalFormData prepared:", finalFormData);

  try {
    // Save meeting to API first
    const apiResponse = await Meeting.create(finalFormData);
    console.log("Meeting saved to API:", apiResponse);

    // Create enriched meeting object for immediate UI update
    const created = {
      id: `local-${Date.now()}`,
      title: formData.title,
      meeting_date: finalFormData.meeting_date,
      start_time: finalFormData.meeting_date,
      end_time: endDt ? endDt.toISOString() : null,
      case_id: finalFormData.case_id,
      attendee_ids: Array.isArray(finalFormData.attendee_ids)
        ? [...finalFormData.attendee_ids]
        : [],
      attendees: autoSelectedAttendees.value, // Use auto-selected attendees
      location: formData.location,
      description: formData.description,
      // Use 'meeting' as default event type for meetings
      event_type: "meeting",
      // whether to add a calendar label on the meeting date
      add_label: !!formData.add_label,
      // number of minutes before meeting to create a reminder (0 = none)
      reminder_offset_minutes: Number(formData.reminder_offset_minutes || 0),
      // Track who created the meeting
      created_by: "admin",
      created_at: new Date().toISOString(),
      status: "scheduled",
      // Include case information for display
      case_info: selectedCaseInfo.value,
    };

    console.log("NewMeetingForm: created meeting object:", created);

    toast({
      title: "Meeting Created!",
      description: `Meeting "${formData.title}" has been scheduled.`,
    });

    // Optional immediate alert popup for visibility
    try {
      window.alert(
        `Meeting "${formData.title}" scheduled for ${format(
          new Date(created.meeting_date),
          "PPP p"
        )}`
      );
    } catch (e) {
      /* ignore */
    }

    console.log("NewMeetingForm: about to emit meetingCreated with:", created);
    // Emit the created meeting so parent can update calendar immediately
    emit("meetingCreated", created);
  } catch (error) {
    console.error("Failed to create meeting:", error);
    toast({
      variant: "destructive",
      title: "Error",
      description: "Could not create the meeting.",
    });
  }
  isSubmitting.value = false;
};

const handleCancel = () => {
  emit("cancel");
  // Emit both 'cancel' for internal handlers and 'close' so parent modals listening
  // for `@close` (e.g., Schedule view) will close the popup.
  emit("close");
  try { emit("close") } catch (e) {}
};

const toggleAttendee = (userId) => {
  console.log("toggleAttendee called with userId:", userId);
  const currentIds = formData.attendee_ids;
  console.log("current attendee_ids before toggle:", currentIds);

  if (currentIds.includes(userId)) {
    formData.attendee_ids = currentIds.filter((id) => id !== userId);
    console.log("removed attendee, new ids:", formData.attendee_ids);
  } else {
    formData.attendee_ids = [...currentIds, userId];
    console.log("added attendee, new ids:", formData.attendee_ids);
  }
};

const selectedUsers = computed(() => {
  return autoSelectedAttendees.value;
});

// Computed property for currently selected case information
const selectedCaseInfo = computed(() => {
  if (!formData.case_id) return null;
  return allCases.value.find((c) => c.id === formData.case_id);
});

// Auto-selected attendees based on case
const autoSelectedAttendees = computed(() => {
  if (!formData.case_id) return [];

  const selectedCase = allCases.value.find((c) => c.id === formData.case_id);
  if (!selectedCase) return [];

  const attendees = [];

  // Add assigned lawyer (handle both mock and real data structures)
  if (selectedCase.assigned_lawyer) {
    // Try to find in allUsers first, otherwise use case data directly
    const lawyer = allUsers.value.find(
      (u) => u.id === selectedCase.assigned_lawyer.id
    ) || {
      id: selectedCase.assigned_lawyer.id,
      full_name: selectedCase.assigned_lawyer.full_name,
      user_type: "lawyer",
      email: selectedCase.assigned_lawyer.email,
    };
    attendees.push(lawyer);
  }

  // Add clients/customers (handle both mock and real data structures)
  const clientList = selectedCase.clients || selectedCase.customers || [];
  clientList.forEach((client) => {
    // Try to find in allUsers first, otherwise use case data directly
    const clientUser = allUsers.value.find((u) => u.id === client.id) || {
      id: client.id,
      full_name: client.full_name,
      user_type: "customer",
      email: client.email,
    };
    attendees.push(clientUser);
  });

  return attendees;
});

// Method to handle case selection change
const onCaseChange = () => {
  // Auto-populate attendee_ids based on selected case
  formData.attendee_ids = autoSelectedAttendees.value.map((user) => user.id);
  console.log("Case changed, auto-selected attendees:", formData.attendee_ids);
};

const selectedUsersText = computed(() => {
  return autoSelectedAttendees.value.length > 0
    ? `${autoSelectedAttendees.value.length} attendee(s) from selected case`
    : "No case selected";
});

const formatDate = (date) => {
  return format(date, "PPP");
};

// Watch pinnedCaseId and set it as default if not already set
watch(
  () => props.pinnedCaseId,
  (newPinnedCaseId) => {
    if (newPinnedCaseId && !formData.case_id) {
      formData.case_id = newPinnedCaseId;
    }
  },
  { immediate: true }
);

// Watch for initial attendee ids and apply them
watch(
  () => props.initialAttendeeIds,
  (ids) => {
    if (Array.isArray(ids) && ids.length > 0) {
      formData.attendee_ids = [...new Set([...(formData.attendee_ids || []), ...ids])];
    }
  },
  { immediate: true }
);

onMounted(() => {
  loadData();
});
</script>
