<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="mb-6">
      <h2 class="text-3xl font-bold text-gray-800 flex items-center gap-3">
        <CalendarIcon class="w-7 h-7 text-[#003aca]" />
        Schedule & Calendar
      </h2>
      <p class="text-gray-600 mt-1">
        View all important dates for cases, tasks, and meetings.
      </p>
    </div>
    <div class="p-6 bg-white rounded-lg border border-gray-200">
      <div class="flex  justify-between mb-4">
        <div>
          <h3 class="text-lg font-semibold text-gray-800">New Meeting</h3>
          <p class="text-sm text-gray-600 mt-1">Schedule meetings and appointments</p>
        </div>
      </div>
        <Dialog v-model:open="showMeetingForm">
          <DialogTrigger as-child>
            <DialogHeader>
              <DialogTitle>Schedule a New Meeting</DialogTitle>
            </DialogHeader>
            <Button class="bg-[#003aca] hover:bg-[#002a8a] text-white h-10 px-2">
              <Plus class="w-4 h-4 mr-2" />
              New Meeting
            </Button>
          </DialogTrigger>
          <DialogContent>
            <NewMeetingForm @meeting-created="handleMeetingCreated" @cancel="showMeetingForm = false" />
          </DialogContent>
        </Dialog>
    </div>

    <!-- New Meeting Section -->

    <!-- Calendar -->
    <div class="bg-white rounded-lg border border-gray-200">
      <div class="p-6 border-b border-gray-200 flex items-center justify-between">
        <h3 class="text-2xl font-bold text-gray-800">{{ format(currentDate, 'MMMM yyyy') }}</h3>
        <div class="flex space-x-2">
          <Button variant="outline" size="icon" @click="currentDate = subMonths(currentDate, 1)">
            <ChevronLeft class="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" @click="currentDate = new Date()">Today</Button>
          <Button variant="outline" size="icon" @click="currentDate = addMonths(currentDate, 1)">
            <ChevronRight class="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div class="p-6">
          <div class="grid grid-cols-7 gap-px bg-gray-200 border border-gray-200">
            <div v-for="day in weekDays" :key="day" class="text-center font-medium text-sm py-2 bg-gray-50 text-gray-600">
              {{ day }}
            </div>
            <div v-for="i in firstDayOfMonth" :key="`empty-${i}`" class="bg-gray-50"></div>
            <div
              v-for="day in calendarDays"
              :key="day.toString()"
              :class="`p-2 h-40 flex flex-col bg-white ${isToday(day) ? 'bg-blue-50' : ''}`"
            >
              <span :class="`font-medium ${isToday(day) ? 'text-blue-600' : 'text-gray-800'}`">
                {{ format(day, 'd') }}
              </span>
              <div class="mt-1 space-y-1 overflow-y-auto">
                <div
                  v-for="(event, index) in getDayEvents(day)"
                  :key="index"
                  :class="`p-1 rounded-md text-xs border ${getEventTypeStyles(event.type)}`"
                >
                  <div class="flex items-center">
                    <component :is="getEventTypeIcon(event.type)" />
                    <span class="font-semibold truncate">{{ event.title }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { Case, ActionItem, Meeting } from '@/services/entities'
import { Button } from '@/components/ui/button'
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Briefcase,
  ListTodo,
  Users,
  Plus
} from 'lucide-vue-next'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameDay, addMonths, subMonths, isToday } from 'date-fns'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import NewMeetingForm from '../components/schedule/NewMeetingForm.vue'

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const currentDate = ref(new Date())
const events = ref([])
const isLoading = ref(true)
const showMeetingForm = ref(false)

const calendarDays = computed(() => {
  return eachDayOfInterval({
    start: startOfMonth(currentDate.value),
    end: endOfMonth(currentDate.value)
  })
})

const firstDayOfMonth = computed(() => {
  return getDay(startOfMonth(currentDate.value))
})

onMounted(() => {
  loadEvents()
})

const loadEvents = async () => {
  isLoading.value = true
  const start = startOfMonth(currentDate.value)
  const end = endOfMonth(currentDate.value)

  try {
    const [casesData, actionsData, meetingsData] = await Promise.all([
      Case.list(),
      ActionItem.list(),
      Meeting.list()
    ])

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

const handleMeetingCreated = () => {
  showMeetingForm.value = false
  loadEvents()
}

const getDayEvents = (day) => {
  return events.value.filter(e => isSameDay(e.date, day))
}

const getEventTypeStyles = (type) => {
  switch (type) {
    case 'case': return 'bg-blue-100 text-blue-800 border-blue-300'
    case 'action': return 'bg-orange-100 text-orange-800 border-orange-300'
    case 'meeting': return 'bg-purple-100 text-purple-800 border-purple-300'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const getEventTypeIcon = (type) => {
  switch (type) {
    case 'case': return Briefcase
    case 'action': return ListTodo
    case 'meeting': return Users
    default: return null
  }
}
</script>
