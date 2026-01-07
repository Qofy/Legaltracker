<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
    <!-- Header Section -->
    <div class="max-w-7xl mx-auto mb-8">
      <div class="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h1 class="text-4xl font-bold text-gray-900 flex items-center gap-3">
              <Calendar class="w-10 h-10 text-[#003aca]" />
              Schedule Management
            </h1>
            <p class="text-gray-600 mt-2">Manage meetings, case deadlines, and appointments</p>
          </div>
          <div class="flex items-center gap-4">
            <button
              @click="showMeetingForm = true"
              class="px-6 py-3 bg-[#003aca] text-white rounded-xl hover:bg-[#0031a0] transition-all duration-200 flex items-center gap-2 font-semibold shadow-lg hover:shadow-xl"
            >
              <Plus class="w-5 h-5" />
              New Meeting
            </button>
          </div>
        </div>

        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 text-white">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-blue-100 text-sm">Total Events</p>
                <p class="text-2xl font-bold">{{ events.length }}</p>
              </div>
              <Calendar class="w-8 h-8 text-blue-200" />
            </div>
          </div>
          <div class="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-4 text-white">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-green-100 text-sm">Meetings</p>
                <p class="text-2xl font-bold">{{ meetingEvents.length }}</p>
              </div>
              <Users class="w-8 h-8 text-green-200" />
            </div>
          </div>
          <div class="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-4 text-white">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-orange-100 text-sm">Case Deadlines</p>
                <p class="text-2xl font-bold">{{ caseEvents.length }}</p>
              </div>
              <Clock class="w-8 h-8 text-orange-200" />
            </div>
          </div>
          <div class="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-4 text-white">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-purple-100 text-sm">Cases w/o Due Date</p>
                <p class="text-2xl font-bold">{{ casesWithoutDueDate.length }}</p>
              </div>
              <AlertTriangle class="w-8 h-8 text-purple-200" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Calendar Section -->
      <div class="lg:col-span-2">
        <div class="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <!-- Calendar Header -->
          <div class="bg-gradient-to-r from-[#003aca] to-[#0052e8] px-6 py-4">
            <div class="flex items-center justify-between">
              <h2 class="text-xl font-semibold text-white">
                {{ format(currentDate, 'MMMM yyyy') }}
              </h2>
              <div class="flex items-center gap-2">
                <button
                  @click="previousMonth"
                  class="p-2 text-white hover:bg-white/20 rounded-lg transition"
                >
                  <ChevronLeft class="w-5 h-5" />
                </button>
                <button
                  @click="currentDate = new Date()"
                  class="px-3 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition text-sm font-medium"
                >
                  Today
                </button>
                <button
                  @click="nextMonth"
                  class="p-2 text-white hover:bg-white/20 rounded-lg transition"
                >
                  <ChevronRight class="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          <!-- Calendar Grid -->
          <div class="p-6">
            <!-- Day Headers -->
            <div class="grid grid-cols-7 gap-1 mb-4">
              <div
                v-for="day in ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']"
                :key="day"
                class="p-2 text-center text-sm font-semibold text-gray-600"
              >
                {{ day }}
              </div>
            </div>

            <!-- Calendar Days -->
            <div class="grid grid-cols-7 gap-1">
              <div
                v-for="(day, index) in calendarDays"
                :key="index"
                :class="[
                  'min-h-[120px] p-2 border border-gray-100 rounded-lg relative',
                  !isSameMonth(day, currentDate) ? 'bg-gray-50' : 'bg-white',
                  isToday(day) ? 'ring-2 ring-[#003aca] bg-blue-50' : ''
                ]"
              >
                <!-- Day Number -->
                <div :class="[
                  'text-sm font-medium mb-1',
                  !isSameMonth(day, currentDate) ? 'text-gray-400' : 'text-gray-900',
                  isToday(day) ? 'text-[#003aca] font-bold' : ''
                ]">
                  {{ format(day, 'd') }}
                </div>

                <!-- Events for this day -->
                <div class="space-y-1">
                  <div
                    v-for="event in getEventsForDay(day)"
                    :key="event.id || `${event.type}-${event.title}`"
                    :class="[
                      'text-xs px-2 py-1 rounded-md cursor-pointer truncate',
                      getEventColor(event.type)
                    ]"
                    :title="event.title"
                    @click="selectEvent(event)"
                  >
                    {{ event.title }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Sidebar -->
      <div class="space-y-6">
        <!-- Cases Without Due Date -->
        <div class="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <AlertTriangle class="w-5 h-5 text-orange-500" />
            Cases Need Due Dates
          </h3>
          
          <div v-if="casesWithoutDueDate.length === 0" class="text-center py-8 text-gray-500">
            <CheckCircle class="w-12 h-12 text-green-400 mx-auto mb-3" />
            <p class="text-sm">All cases have due dates assigned!</p>
          </div>
          
          <div v-else class="space-y-3 max-h-96 overflow-y-auto">
            <div
              v-for="caseItem in casesWithoutDueDate"
              :key="caseItem.id"
              class="p-3 border border-gray-200 rounded-lg hover:shadow-md transition"
            >
              <div class="mb-2">
                <p class="font-medium text-gray-900 text-sm">{{ caseItem.title }}</p>
                <p class="text-xs text-gray-500">{{ caseItem.case_number }}</p>
                <p class="text-xs text-gray-600">Lawyer: {{ getAssignedLawyerName(caseItem) }}</p>
              </div>
              
              <div class="flex items-center gap-2 mt-3">
                <input
                  type="datetime-local"
                  v-model="tempDueDates[caseItem.id]"
                  class="text-xs px-2 py-1 border border-gray-300 rounded flex-1"
                  :min="format(new Date(), 'yyyy-MM-dd\'T\'HH:mm')"
                />
                <button
                  @click="assignDueDate(caseItem)"
                  class="px-2 py-1 bg-[#003aca] text-white rounded text-xs hover:bg-[#0031a0]"
                >
                  Set
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Upcoming Events -->
        <div class="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Clock class="w-5 h-5 text-blue-500" />
            Upcoming Events
          </h3>
          
          <div class="space-y-3 max-h-96 overflow-y-auto">
            <div
              v-for="event in upcomingEvents"
              :key="event.id || `${event.type}-${event.title}`"
              class="p-3 border-l-4 bg-gray-50 rounded-r-lg cursor-pointer hover:shadow-md transition"
              :class="getEventBorderColor(event.type)"
              @click="selectEvent(event)"
            >
              <p class="font-medium text-gray-900 text-sm">{{ event.title }}</p>
              <p class="text-xs text-gray-600">{{ format(event.date, 'PPP p') }}</p>
              <p class="text-xs text-gray-500 capitalize">{{ event.type }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Meeting Form Modal -->
    <div
      v-if="showMeetingForm"
      class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
    >
      <div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <NewMeetingForm
          :show="showMeetingForm"
          :initial-date="selectedDate"
          :pinned-case-id="pinnedCaseId"
          :initial-attendee-ids="initialAttendeeIds"
          @close="closeMeetingForm"
          @meetingCreated="handleMeetingCreated"
          @title-changed="handleTitleChanged"
        />
      </div>
    </div>

    <!-- Event Details Modal -->
    <div
      v-if="selectedEvent"
      class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
    >
      <div class="bg-white rounded-2xl shadow-2xl max-w-lg w-full">
        <div class="p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-xl font-bold text-gray-900">Event Details</h3>
            <button @click="selectedEvent = null" class="p-2 hover:bg-gray-100 rounded-full">
              <X class="w-5 h-5" />
            </button>
          </div>
          
          <div class="space-y-3">
            <div>
              <p class="text-sm font-medium text-gray-700">Title</p>
              <p class="text-gray-900">{{ selectedEvent.title }}</p>
            </div>
            
            <div>
              <p class="text-sm font-medium text-gray-700">Date & Time</p>
              <p class="text-gray-900">{{ format(selectedEvent.date, 'PPP p') }}</p>
            </div>
            
            <div>
              <p class="text-sm font-medium text-gray-700">Type</p>
              <span :class="[
                'inline-block px-2 py-1 rounded text-xs font-medium capitalize',
                getEventColor(selectedEvent.type)
              ]">
                {{ selectedEvent.type }}
              </span>
            </div>
            
            <div v-if="selectedEvent.data">
              <p class="text-sm font-medium text-gray-700">Details</p>
              <div class="bg-gray-50 rounded-lg p-3 text-sm">
                <!-- Meeting Details -->
                <div v-if="selectedEvent.type === 'meeting'">
                  <p v-if="selectedEvent.data.description" class="mb-2">{{ selectedEvent.data.description }}</p>
                  <p v-if="selectedEvent.data.location"><strong>Location:</strong> {{ selectedEvent.data.location }}</p>
                  <p v-if="selectedEvent.data.attendees"><strong>Attendees:</strong> {{ selectedEvent.data.attendees.length }}</p>
                  <p v-if="selectedEvent.data.case_info"><strong>Case:</strong> {{ selectedEvent.data.case_info.title }}</p>
                </div>
                
                <!-- Case Details -->
                <div v-if="selectedEvent.type === 'case'">
                  <p><strong>Case Number:</strong> {{ selectedEvent.data.case_number }}</p>
                  <p v-if="selectedEvent.data.assigned_lawyer"><strong>Lawyer:</strong> {{ selectedEvent.data.assigned_lawyer.full_name }}</p>
                  <p><strong>Status:</strong> {{ selectedEvent.data.status }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Success Notification -->
    <div
      v-if="notification.show"
      :class="[
        'fixed top-4 right-4 px-6 py-4 rounded-lg shadow-lg z-50 transition-all duration-300',
        notification.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
      ]"
    >
      {{ notification.message }}
    </div>

    <!-- Loading Overlay -->
    <div
      v-if="isLoading"
      class="fixed inset-0 bg-black/30 flex items-center justify-center z-40"
    >
      <div class="bg-white rounded-lg p-6 shadow-xl">
        <div class="flex items-center gap-3">
          <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-[#003aca]"></div>
          <p class="text-gray-700">Loading events...</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isToday, addMonths, subMonths, isAfter } from 'date-fns'
import { Case, Meeting, ActionItem, User } from '@/services/entities'
import { 
  Calendar, 
  Plus, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  Users, 
  AlertTriangle, 
  CheckCircle,
  X
} from 'lucide-vue-next'
import NewMeetingForm from '@/components/schedule/NewMeetingForm.vue'

// Reactive state
const currentDate = ref(new Date())
const isLoading = ref(false)
const events = ref([])
const allCases = ref([])
const currentUser = ref(null)
const tempDueDates = ref({})

// Modal states
const showMeetingForm = ref(false)
const selectedEvent = ref(null)
const selectedDate = ref('')
const pinnedCaseId = ref(null)
const initialAttendeeIds = ref([])

// Form states
const formTitle = ref('')
const notification = ref({ show: false, message: '', type: 'success' })

// Computed properties
const casesWithoutDueDate = computed(() => {
  if (!allCases.value) return []
  
  return allCases.value.filter(c => {
    const hasLawyer = c.assigned_lawyer || c.assigned_lawyer_id || 
                     (c.owners && c.owners.some(owner => owner.user_type === 'lawyer'))
    return !c.due_date && hasLawyer
  })
})

const calendarDays = computed(() => {
  const start = startOfWeek(startOfMonth(currentDate.value))
  const end = endOfWeek(endOfMonth(currentDate.value))
  return eachDayOfInterval({ start, end })
})

const meetingEvents = computed(() => 
  events.value.filter(e => e.type === 'meeting')
)

const caseEvents = computed(() => 
  events.value.filter(e => e.type === 'case')
)

const upcomingEvents = computed(() => {
  const now = new Date()
  return events.value
    .filter(event => isAfter(event.date, now))
    .sort((a, b) => a.date - b.date)
    .slice(0, 10)
})

// Methods
const previousMonth = () => {
  currentDate.value = subMonths(currentDate.value, 1)
  loadEvents()
}

const nextMonth = () => {
  currentDate.value = addMonths(currentDate.value, 1)
  loadEvents()
}

const getEventsForDay = (day) => {
  return events.value.filter(event => {
    const eventDate = new Date(event.date)
    return format(eventDate, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
  })
}

const getEventColor = (type) => {
  const colors = {
    meeting: 'bg-blue-100 text-blue-800 border-blue-200',
    case: 'bg-orange-100 text-orange-800 border-orange-200',
    action: 'bg-green-100 text-green-800 border-green-200',
    reminder: 'bg-purple-100 text-purple-800 border-purple-200',
    discussion: 'bg-indigo-100 text-indigo-800 border-indigo-200'
  }
  return colors[type] || 'bg-gray-100 text-gray-800 border-gray-200'
}

const getEventBorderColor = (type) => {
  const colors = {
    meeting: 'border-blue-500',
    case: 'border-orange-500',
    action: 'border-green-500',
    reminder: 'border-purple-500',
    discussion: 'border-indigo-500'
  }
  return colors[type] || 'border-gray-500'
}

const selectEvent = (event) => {
  selectedEvent.value = event
}

const closeMeetingForm = () => {
  showMeetingForm.value = false
  formTitle.value = ''
  pinnedCaseId.value = null
  initialAttendeeIds.value = []
}

const handleTitleChanged = (title) => {
  formTitle.value = title
}

const loadEvents = async () => {
  isLoading.value = true
  try {
    const [casesData, actionsData, meetingsData, userData] = await Promise.all([
      Case.list(),
      ActionItem.list(),
      Meeting.list(),
      User.me()
    ])

    currentUser.value = userData
    allCases.value = casesData

    console.log('Schedule: Loaded data', {
      cases: casesData?.length,
      meetings: meetingsData?.length,
      actions: actionsData?.length
    })

    // Create case events
    const caseEvents = casesData?.flatMap(c => [
      c.due_date && { 
        id: `case-due-${c.id}`,
        date: new Date(c.due_date), 
        title: `Case Due: ${c.title}`, 
        type: 'case', 
        data: c 
      },
      c.court_date && { 
        id: `case-court-${c.id}`,
        date: new Date(c.court_date), 
        title: `Court: ${c.title}`, 
        type: 'case', 
        data: c 
      }
    ]).filter(Boolean) || []

    // Create action events
    const actionEvents = actionsData?.filter(a => a.due_date)
      .map(a => ({ 
        id: `action-${a.id}`,
        date: new Date(a.due_date), 
        title: `Action: ${a.title}`, 
        type: 'action', 
        data: a 
      })) || []

    // Create meeting events
    const meetingEvents = meetingsData?.map(m => ({
      id: `meeting-${m.id}`,
      date: new Date(m.start_time || m.meeting_date),
      title: `Meeting: ${m.title}`,
      type: 'meeting',
      data: m
    })) || []

    const allEvents = [...caseEvents, ...actionEvents, ...meetingEvents]
    events.value = allEvents

    console.log('Schedule: Total events loaded:', allEvents.length)

  } catch (error) {
    console.error('Failed to load schedule events:', error)
    showNotification('Failed to load events', 'error')
  }
  isLoading.value = false
}

const handleMeetingCreated = (meeting) => {
  console.log('Schedule: Meeting created:', meeting)
  closeMeetingForm()

  if (meeting) {
    try {
      const meetingDate = new Date(meeting.meeting_date || meeting.start_time)
      
      // Add meeting event to calendar
      const newEvent = {
        id: `meeting-${meeting.id}`,
        date: meetingDate,
        title: `Meeting: ${meeting.title}`,
        type: 'meeting',
        data: meeting
      }
      
      events.value = [newEvent, ...events.value]
      
      showNotification(
        `✅ Meeting "${meeting.title}" scheduled for ${format(meetingDate, 'PPP')}`,
        'success'
      )

      // Add individual meeting events for attendees
      if (meeting.attendees && meeting.attendees.length > 0) {
        meeting.attendees.forEach(attendee => {
          const attendeeEvent = {
            id: `meeting-attendee-${meeting.id}-${attendee.id}`,
            date: meetingDate,
            title: `Meeting: ${meeting.title}`,
            type: 'meeting',
            data: {
              ...meeting,
              assignedTo: attendee.id,
              assignedToName: attendee.full_name,
              assignedToType: attendee.user_type,
              isPersonalMeeting: true
            }
          }
          events.value = [attendeeEvent, ...events.value]
        })
      }

    } catch (error) {
      console.error('Failed to add meeting to calendar:', error)
    }
  }

  // Refresh from server
  loadEvents()
}

const assignDueDate = async (caseItem) => {
  const selectedDate = tempDueDates.value[caseItem.id]
  if (!selectedDate) {
    showNotification('⚠️ Please select a due date and time', 'error')
    return
  }

  try {
    await Case.update(caseItem.id, { due_date: selectedDate })
    
    // Update local case data
    const caseIndex = allCases.value.findIndex(c => c.id === caseItem.id)
    if (caseIndex >= 0) {
      allCases.value[caseIndex] = {
        ...allCases.value[caseIndex],
        due_date: selectedDate
      }
    }

    // Add event to calendar
    const newEvent = {
      id: `case-due-${caseItem.id}`,
      date: new Date(selectedDate),
      title: `Case Due: ${caseItem.title}`,
      type: 'case',
      data: { ...caseItem, due_date: selectedDate }
    }
    events.value = [newEvent, ...events.value]

    // Clear temp date
    delete tempDueDates.value[caseItem.id]
    
    showNotification(
      `✅ Due date set for "${caseItem.title}": ${format(new Date(selectedDate), 'PPP p')}`,
      'success'
    )

  } catch (error) {
    console.error('Failed to assign due date:', error)
    showNotification('❌ Failed to assign due date', 'error')
  }
}

const getAssignedLawyerName = (caseItem) => {
  if (caseItem.assigned_lawyer?.full_name) {
    return caseItem.assigned_lawyer.full_name
  }
  
  if (caseItem.owners?.length > 0) {
    const lawyer = caseItem.owners.find(owner => owner.user_type === 'lawyer')
    return lawyer ? lawyer.full_name : caseItem.owners[0].full_name
  }
  
  return 'Unassigned'
}

const showNotification = (message, type = 'success') => {
  notification.value = { show: true, message, type }
  setTimeout(() => {
    notification.value.show = false
  }, 4000)
}

// Handle external schedule requests
onMounted(() => {
  try {
    const pre = window.__schedulePreselect
    if (pre && pre.caseId) {
      pinnedCaseId.value = pre.caseId
      if (Array.isArray(pre.attendeeIds)) {
        initialAttendeeIds.value = pre.attendeeIds
      }
      showMeetingForm.value = true
      window.__schedulePreselect = null
    }
  } catch (e) {
    // Ignore errors
  }

  loadEvents()
})
</script>