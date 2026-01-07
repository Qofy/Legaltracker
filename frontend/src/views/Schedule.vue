<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
    <!-- Success/Error Notification Toast -->
    <div 
      v-if="notification.show"
      :class="[
        'fixed top-4 right-4 z-50 px-6 py-4 rounded-xl shadow-2xl transform transition-all duration-500 ease-in-out border-l-4',
        notification.type === 'success' ? 'bg-green-50 border-green-500 text-green-800' : 
        notification.type === 'error' ? 'bg-red-50 border-red-500 text-red-800' : 
        'bg-yellow-50 border-yellow-500 text-yellow-800'
      ]"
    >
      <div class="flex items-center gap-3">
        <div class="text-sm font-semibold">{{ notification.message }}</div>
        <button @click="notification.show = false" class="ml-2 opacity-70 hover:opacity-100 transition-opacity">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Header -->
    <div class="max-w-7xl mx-auto mb-8">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-4xl font-bold text-gray-900 flex items-center gap-3">
            <div class="p-3 bg-gradient-to-r from-[#003aca] to-[#0052e8] rounded-2xl shadow-lg">
              <CalendarIcon class="w-8 h-8 text-white" />
            </div>
            Admin Schedule
          </h1>
          <p class="text-lg text-gray-600 mt-2">
            Manage cases, meetings, and important deadlines
          </p>
        </div>
        
        <!-- Quick Actions -->
        <div class="flex items-center gap-4">
          <div class="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm border">
            <div class="w-3 h-3 rounded-full bg-blue-500"></div>
            <span class="text-sm text-gray-600">Cases</span>
            <div class="w-3 h-3 rounded-full bg-purple-500 ml-3"></div>
            <span class="text-sm text-gray-600">Meetings</span>
            <div class="w-3 h-3 rounded-full bg-orange-500 ml-3"></div>
            <span class="text-sm text-gray-600">Actions</span>
          </div>
          
          <Dialog v-model:open="showMeetingForm">
            <DialogTrigger as-child>
              <Button class="bg-gradient-to-r from-[#003aca] to-[#0052e8] hover:from-[#002a8a] hover:to-[#003aca] text-white shadow-lg px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:shadow-xl">
                <Plus class="w-5 h-5 mr-2" />
                Schedule Meeting
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Schedule a New Meeting</DialogTitle>
              </DialogHeader>
              <NewMeetingForm 
                @meeting-created="handleMeetingCreated" 
                @cancel="() => { showMeetingForm = false; formTitle = ''; }" 
                @title-changed="handleTitleChanged"
                :pinnedCaseId="pinnedCaseId" 
                :initialAttendeeIds="initialAttendeeIds" 
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>

    <!-- Case Deadline Management Section (Admin Only) -->
    <div v-if="isAdmin" class="max-w-7xl mx-auto mb-8">
      <div class="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
        <div class="bg-gradient-to-r from-amber-500 to-orange-500 px-8 py-6">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-2xl font-bold text-white flex items-center gap-3">
                <Clock class="w-6 h-6" />
                Case Deadline Management
              </h3>
              <p class="text-white/90 mt-1">Assign due dates to cases and notify assigned lawyers</p>
            </div>
            <div class="bg-white/20 rounded-full px-4 py-2">
              <span class="text-white font-semibold">{{ casesWithoutDueDate.length }} pending</span>
            </div>
          </div>
        </div>

        <div class="p-8">
          <div class="space-y-4 max-h-96 overflow-y-auto">
            <div
              v-for="caseItem in casesWithoutDueDate"
              :key="caseItem.id"
              class="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-200"
            >
              <div class="flex-1">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-gradient-to-r from-[#003aca] to-[#0052e8] rounded-full flex items-center justify-center">
                    <Briefcase class="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 class="font-semibold text-gray-900">{{ caseItem.title }}</h4>
                    <p class="text-sm text-gray-600">#{{ caseItem.case_number }}</p>
                    <p class="text-xs text-gray-500">
                      Lawyer: {{ getAssignedLawyerName(caseItem) || 'Unassigned' }}
                    </p>
                  </div>
                </div>
              </div>

              <div class="flex items-center gap-3">
                <div class="flex flex-col gap-1">
                  <label class="text-xs font-medium text-gray-600">Due Date</label>
                  <input
                    v-model="tempDueDates[caseItem.id]"
                    type="datetime-local"
                    class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <Button
                  @click="assignDueDate(caseItem)"
                  :disabled="!tempDueDates[caseItem.id]"
                  class="bg-gradient-to-r from-[#003aca] to-[#0052e8] hover:from-[#002a8a] hover:to-[#003aca] text-white font-semibold px-6 py-2 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <Send class="w-4 h-4 mr-2" />
                  Send
                </Button>
              </div>
            </div>

            <div v-if="casesWithoutDueDate.length === 0" class="text-center py-8">
              <CheckCircle class="w-16 h-16 text-green-500 mx-auto mb-4" />
              <p class="text-lg font-semibold text-gray-700">All cases have due dates assigned</p>
              <p class="text-gray-500">Great job staying organized!</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Calendar Container -->
    <div class="max-w-7xl mx-auto">
      <div class="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
        <!-- Calendar Header -->
        <div class="bg-gradient-to-r from-[#003aca] to-[#0052e8] px-8 py-6">
          <div class="flex items-center justify-between">
            <div class="flex flex-col">
              <h2 class="text-3xl font-bold text-white">
                {{ format(currentDate, 'MMMM yyyy') }}
              </h2>
              <!-- Dynamic Form Title Label -->
              <div v-if="showMeetingForm && formTitle" class="mt-2">
                <div class="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-2">
                  <div class="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  <span class="text-white/90 text-sm font-medium">Creating: {{ formTitle }}</span>
                </div>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <Button 
                @click="currentDate = subMonths(currentDate, 1)"
                class="bg-white/20 hover:bg-white/30 text-white border-0 rounded-full w-12 h-12 p-0 transition-all duration-200"
              >
                <ChevronLeft class="w-5 h-5" />
              </Button>
              <Button 
                @click="currentDate = new Date()"
                class="bg-white text-[#003aca] hover:bg-gray-50 font-semibold px-6 py-2 rounded-full transition-all duration-200"
              >
                Today
              </Button>
              <Button 
                @click="currentDate = addMonths(currentDate, 1)"
                class="bg-white/20 hover:bg-white/30 text-white border-0 rounded-full w-12 h-12 p-0 transition-all duration-200"
              >
                <ChevronRight class="w-5 h-5" />
              </Button>
              <button
                @click="compactLabels = !compactLabels"
                :title="compactLabels ? 'Compact labels: On' : 'Compact labels: Off'"
                class="ml-2 bg-white/20 hover:bg-white/30 text-white rounded-full px-3 py-2 text-sm font-medium transition"
              >
                {{ compactLabels ? 'Compact' : 'Full' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Calendar Grid -->
        <div class="p-8">
          <!-- Week Days Header -->
          <div class="grid grid-cols-7 gap-4 mb-4">
            <div 
              v-for="day in weekDays" 
              :key="day" 
              class="text-center font-bold text-gray-700 py-4 text-lg"
            >
              {{ day }}
            </div>
          </div>
          
          <!-- Calendar Days -->
          <div class="grid grid-cols-7 gap-4">
            <!-- Calendar days -->
            <div
              v-for="day in calendarDays"
              :key="day.toString()"
              :class="[
                'h-32 rounded-2xl border-2 transition-all duration-200 cursor-pointer hover:shadow-lg relative overflow-hidden',
                isToday(day) 
                  ? 'bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-300 ring-2 ring-blue-200' 
                  : isSameMonth(day, currentDate)
                    ? 'bg-white border-gray-100 hover:border-gray-200 hover:bg-gray-50/50'
                    : 'bg-gray-50/30 border-gray-50 text-gray-400'
              ]"
            >
              <!-- Day Number -->
              <div class="p-3">
                <div 
                  :class="[
                    'w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-200',
                    isToday(day) 
                      ? 'bg-gradient-to-r from-[#003aca] to-[#0052e8] text-white shadow-lg' 
                      : isSameMonth(day, currentDate)
                        ? 'text-gray-700 hover:bg-gray-100'
                        : 'text-gray-400'
                  ]"
                >
                  {{ format(day, 'd') }}
                </div>
              </div>
              
              <!-- Events (only show for current month) -->
              <div v-if="isSameMonth(day, currentDate)" class="px-3 pb-3 space-y-1">
                <div
                  v-for="(event, index) in getDayEvents(day).slice(0, 2)"
                  :key="index"
                  :class="[
                    'px-2 py-1 rounded-lg text-xs font-semibold truncate shadow-sm transition-all duration-200 hover:shadow-md',
                    getEventTypeStyles(event.type)
                  ]"
                  :title="event.title"
                >
                  <div class="flex items-center gap-1">
                    <component :is="getEventTypeIcon(event.type)" class="w-3 h-3 flex-shrink-0" />
                    <span class="truncate">{{ compactLabels ? shortTypeLabel(event.type) : event.title.replace(/^(Case Due:|Court:|Action:|Meeting:|Discussion:)\s*/, '') }}</span>
                  </div>
                </div>
                
                <!-- More events indicator -->
                <div 
                  v-if="getDayEvents(day).length > 2"
                  class="text-xs text-gray-500 font-medium px-2 py-1 bg-gray-100 rounded-lg"
                >
                  +{{ getDayEvents(day).length - 2 }} more
                </div>
              </div>
              
              <!-- Event count badge (only for current month) -->
              <div 
                v-if="isSameMonth(day, currentDate) && getDayEvents(day).length > 0"
                class="absolute top-2 right-2 w-6 h-6 rounded-full bg-gradient-to-r from-[#003aca] to-[#0052e8] text-white text-xs font-bold flex items-center justify-center shadow-lg"
              >
                {{ getDayEvents(day).length }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { Case, ActionItem, Meeting, User } from '@/services/entities'
import { Button } from '@/components/ui/button'
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Briefcase,
  ListTodo,
  Users,
  Plus,
  Clock,
  Send,
  CheckCircle,
  MessageCircle
} from 'lucide-vue-next'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameDay, addMonths, subMonths, isToday, startOfWeek, endOfWeek, isSameMonth } from 'date-fns'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import NewMeetingForm from '../components/schedule/NewMeetingForm.vue'

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const currentDate = ref(new Date())
const events = ref([])
const isLoading = ref(true)
const showMeetingForm = ref(false)
const formTitle = ref('')
const pinnedCaseId = ref(null)
const initialAttendeeIds = ref([])  
const allCases = ref([])
const currentUser = ref(null)
const notification = ref({ show: false, message: '', type: 'success' })
// Hold temporary due date selections per-case so selections persist across recomputes
const tempDueDates = ref({})
// Compact label mode: show short type labels (Discussion/Meeting/etc.) instead of full titles
const compactLabels = ref(false)

// Restore compact label preference from localStorage
onMounted(() => {
  try {
    const stored = localStorage.getItem('schedule.compactLabels')
    if (stored !== null) {
      compactLabels.value = stored === '1' || stored === 'true'
    }
  } catch (e) {
    // ignore localStorage errors (e.g., private mode)
  }
})

// Clear form title when dialog closes
watch(showMeetingForm, (isOpen) => {
  if (!isOpen) {
    formTitle.value = ''
  }
})

// Persist compact label changes to localStorage
watch(compactLabels, (val) => {
  try {
    localStorage.setItem('schedule.compactLabels', val ? '1' : '0')
  } catch (e) {
    // ignore
  }
})

const isAdmin = computed(() => {
  return currentUser.value?.user_type === 'admin'
})

const casesWithoutDueDate = computed(() => {
  return allCases.value
    .filter(c => {
      // Include cases without due_date that have lawyers assigned (either through assigned_lawyer or owners)
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

const firstDayOfMonth = computed(() => {
  return 0 // No longer needed since we're showing full weeks
})

onMounted(() => {
  // If another view requested scheduling for a particular case, pick it up
  try {
    const pre = window.__schedulePreselect
    if (pre && pre.caseId) {
      pinnedCaseId.value = pre.caseId
      if (Array.isArray(pre.attendeeIds)) initialAttendeeIds.value = pre.attendeeIds
      showMeetingForm.value = true
      // clear the global so it does not reapply
      window.__schedulePreselect = null
    }
  } catch (e) {
    // ignore (e.g., SSR or window undefined)
  }

  loadEvents()
})

const loadEvents = async () => {
  isLoading.value = true
  const start = startOfMonth(currentDate.value)
  const end = endOfMonth(currentDate.value)

  try {
    const [casesData, actionsData, meetingsData, userData] = await Promise.all([
      Case.list(),
      ActionItem.list(),
      Meeting.list(),
      User.me()
    ])

    currentUser.value = userData
    allCases.value = casesData

    console.log('Current user:', userData)
    console.log('All cases:', casesData)
    console.log('Cases without due date:', casesWithoutDueDate.value)

    const caseEvents = casesData.flatMap(c => [
      c.due_date && { date: new Date(c.due_date), title: `Case Due: ${c.title}`, type: 'case', data: c },
      c.court_date && { date: new Date(c.court_date), title: `Court: ${c.title}`, type: 'case', data: c }
    ]).filter(Boolean)

    const actionEvents = actionsData
      .filter(a => a.due_date)
      .map(a => ({ date: new Date(a.due_date), title: `Action: ${a.title}`, type: 'action', data: a }))

    const meetingEvents = meetingsData.map(m => ({
      date: new Date(m.start_time),
      title: `Meeting: ${m.title}`,
      type: 'meeting',
      data: m
    }))

    const allEvents = [...caseEvents, ...actionEvents, ...meetingEvents]
    events.value = allEvents

  } catch (error) {
    console.error('Failed to load schedule events:', error)
  }
  isLoading.value = false
}

const handleMeetingCreated = (meeting) => {
  showMeetingForm.value = false
  formTitle.value = '' // Clear form title when meeting is created

  // If a meeting object was provided emit from the form (local-created), add it to events immediately
  if (meeting) {
    try {
      const meetingDate = new Date(meeting.meeting_date)

      // admin-controlled flags from the form
      const addLabel = meeting.add_label !== undefined ? Boolean(meeting.add_label) : true
      const reminderOffsetMinutes = Number(meeting.reminder_offset_minutes || 0)

      // Optionally add the main label/event on the meeting date
      if (addLabel) {
        const isDiscussion = meeting.event_type === 'discussion'
        const newEvent = {
          date: meetingDate,
          title: isDiscussion ? `Discussion: ${meeting.title}` : `Meeting: ${meeting.title}`,
          type: isDiscussion ? 'discussion' : 'meeting',
          data: meeting
        }
        // Add to current events so the calendar updates instantly
        events.value = [newEvent, ...events.value]
      }

      // Optionally add a reminder at meetingDate - offset minutes
      try {
        if (reminderOffsetMinutes > 0) {
          const reminderDate = new Date(meetingDate.getTime() - reminderOffsetMinutes * 60 * 1000)
          // Only add reminder if it's in the future
          if (reminderDate > new Date()) {
            const reminderEvent = {
              date: reminderDate,
              title: `Reminder: ${meeting.title}`,
              type: 'reminder',
              data: { meetingId: meeting.id }
            }
            events.value = [reminderEvent, ...events.value]
          }
        }
      } catch (e) {
        console.warn('Failed to add reminder event', e)
      }
    } catch (e) {
      console.warn('Failed to add local meeting to events', e)
    }
  }

  // Refresh from server to keep data consistent when API is available
  loadEvents()
}

const handleTitleChanged = (title) => {
  formTitle.value = title
}

const showNotification = (message, type = 'success') => {
  notification.value = { show: true, message, type }
  setTimeout(() => {
    notification.value.show = false
  }, 4000)
}

const getAssignedLawyerName = (caseItem) => {
  // First check if there's an assigned_lawyer (the actual lawyer assigned to the case)
  if (caseItem.assigned_lawyer && caseItem.assigned_lawyer.full_name) {
    return caseItem.assigned_lawyer.full_name
  }
  
  // Fallback: check owners for lawyers
  if (caseItem.owners && caseItem.owners.length > 0) {
    const lawyer = caseItem.owners.find(owner => owner.user_type === 'lawyer')
    return lawyer ? lawyer.full_name : caseItem.owners[0].full_name
  }
  
  return 'Unassigned'
}

const assignDueDate = async (caseItem) => {
  const selected = tempDueDates.value[caseItem.id]
  if (!selected) {
    showNotification('⚠️ Please select a due date and time', 'warning')
    return
  }

  console.log('Assigning due date:', {
    caseId: caseItem.id,
    tempDueDate: selected,
    caseTitle: caseItem.title
  })

  try {
    const dueDateISO = new Date(selected).toISOString()
    console.log('Sending update request with due_date:', dueDateISO)

    const updatedCase = await Case.update(caseItem.id, {
      due_date: dueDateISO
    })

    console.log('Case updated successfully:', updatedCase)

    // Clear the temp due date for this case
    tempDueDates.value[caseItem.id] = ''

    // Refresh data to update the calendar and case list
    await loadEvents()

    // Show green success notification
    showNotification(`✅ Due date successfully assigned to case: ${caseItem.title}`, 'success')
  } catch (error) {
    console.error('Failed to assign due date:', error)
    console.error('Error details:', error.response?.data || error.message)
    showNotification('❌ Failed to assign due date. Please try again.', 'error')
  }
}

const getDayEvents = (day) => {
  return events.value.filter(e => isSameDay(e.date, day))
}

const shortTypeLabel = (type) => {
  switch (type) {
    case 'case': return 'Case'
    case 'discussion': return 'Discussion'
    case 'action': return 'Action'
    case 'meeting': return 'Meeting'
    case 'reminder': return 'Reminder'
    default: return 'Event'
  }
}

const getEventTypeStyles = (type) => {
  switch (type) {
    case 'case': return 'bg-gradient-to-r from-blue-500 to-blue-600 text-white border-blue-400'
    case 'reminder': return 'bg-gradient-to-r from-teal-400 to-teal-500 text-white border-teal-400'
    case 'discussion': return 'bg-gradient-to-r from-green-500 to-teal-500 text-white border-green-400'
    case 'action': return 'bg-gradient-to-r from-orange-500 to-amber-500 text-white border-orange-400'
    case 'meeting': return 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white border-purple-400'
    default: return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white border-gray-400'
  }
}

const getEventTypeIcon = (type) => {
  switch (type) {
    case 'case': return Briefcase
    case 'discussion': return MessageCircle
    case 'action': return ListTodo
    case 'meeting': return Users
    default: return null
  }
}
</script>
