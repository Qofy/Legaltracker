<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h2 class="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <svg class="w-7 h-7 text-[#003aca]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Calendar & Deadlines
        </h2>
        <p class="text-gray-500 mt-1">Manage your schedule and upcoming deadlines</p>
      </div>
      <button class="px-4 py-2 bg-[#003aca] text-white rounded-md hover:bg-[#0031a0] text-sm font-medium">
        Schedule Meeting
      </button>
    </div>

    <!-- Quick Stats -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="bg-white rounded-lg border border-gray-200 p-4">
        <div class="flex items-center justify-between">
          <p class="text-sm text-gray-600 font-medium">Today</p>
          <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p class="text-2xl font-bold text-gray-900 mt-2">{{ stats.today }}</p>
        <p class="text-xs text-gray-500 mt-1">events</p>
      </div>

      <div class="bg-white rounded-lg border border-gray-200 p-4">
        <div class="flex items-center justify-between">
          <p class="text-sm text-gray-600 font-medium">This Week</p>
          <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <p class="text-2xl font-bold text-gray-900 mt-2">{{ stats.thisWeek }}</p>
        <p class="text-xs text-gray-500 mt-1">events</p>
      </div>

      <div class="bg-white rounded-lg border border-gray-200 p-4">
        <div class="flex items-center justify-between">
          <p class="text-sm text-gray-600 font-medium">Overdue</p>
          <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <p class="text-2xl font-bold text-gray-900 mt-2">{{ stats.overdue }}</p>
        <p class="text-xs text-gray-500 mt-1">deadlines</p>
      </div>

      <div class="bg-white rounded-lg border border-gray-200 p-4">
        <div class="flex items-center justify-between">
          <p class="text-sm text-gray-600 font-medium">Meetings</p>
          <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <p class="text-2xl font-bold text-gray-900 mt-2">{{ stats.totalMeetings }}</p>
        <p class="text-xs text-gray-500 mt-1">scheduled</p>
      </div>
    </div>

    <!-- Calendar View and Upcoming Events -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Calendar -->
      <div class="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-800">{{ currentMonthYear }}</h3>
          <div class="flex items-center gap-2">
            <button @click="previousMonth" class="p-2 hover:bg-gray-100 rounded-md">
              <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button @click="nextMonth" class="p-2 hover:bg-gray-100 rounded-md">
              <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Calendar Grid -->
        <div class="grid grid-cols-7 gap-2">
          <!-- Day headers -->
          <div v-for="day in ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']" :key="day" class="text-center text-xs font-semibold text-gray-600 py-2">
            {{ day }}
          </div>

          <!-- Calendar days -->
          <div v-for="day in calendarDays" :key="day.date"
               :class="[
                 'text-center p-2 rounded-md cursor-pointer border border-transparent',
                 day.isCurrentMonth ? 'text-gray-900' : 'text-gray-400',
                 day.isToday ? 'bg-blue-100 border-blue-600 font-semibold' : 'hover:bg-gray-100',
                 day.hasEvents ? 'bg-yellow-50' : ''
               ]"
               @click="selectDay(day)">
            <div class="text-sm">{{ day.day }}</div>
            <div v-if="day.eventCount > 0" class="flex justify-center gap-1 mt-1">
              <div v-for="i in Math.min(day.eventCount, 3)" :key="i" class="w-1 h-1 rounded-full bg-blue-600"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Upcoming Events -->
      <div class="bg-white rounded-lg border border-gray-200 p-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">Upcoming Events</h3>
        <div class="space-y-3 max-h-96 overflow-y-auto">
          <div v-if="upcomingEvents.length === 0" class="text-center py-8 text-gray-500">
            <p class="text-sm">No upcoming events</p>
          </div>
          <div v-else v-for="event in upcomingEvents" :key="event.id" class="p-3 rounded-lg border border-gray-200 hover:bg-gray-50">
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <h4 class="font-semibold text-gray-900 text-sm">{{ event.title }}</h4>
                <p class="text-xs text-gray-600 mt-1">{{ event.case_title }}</p>
                <div class="flex items-center gap-2 mt-2">
                  <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span class="text-xs text-gray-600">{{ formatEventDate(event.date) }}</span>
                </div>
              </div>
              <span :class="['px-2 py-1 rounded text-xs font-medium', getEventTypeBadge(event.type)]">
                {{ event.type }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Deadlines List -->
    <div class="bg-white rounded-lg border border-gray-200 p-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <svg class="w-5 h-5 text-[#003aca]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Upcoming Deadlines
        </h3>
        <select v-model="deadlineFilter" class="px-3 py-2 border border-gray-300 rounded-md text-sm">
          <option value="all">All Deadlines</option>
          <option value="overdue">Overdue</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
        </select>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600">Task</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600">Case</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600">Due Date</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600">Priority</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600">Status</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-if="filteredDeadlines.length === 0">
              <td colspan="5" class="px-4 py-8 text-center text-gray-500 text-sm">
                No deadlines found
              </td>
            </tr>
            <tr v-else v-for="deadline in filteredDeadlines" :key="deadline.id" class="hover:bg-gray-50">
              <td class="px-4 py-3 text-sm text-gray-900">{{ deadline.title }}</td>
              <td class="px-4 py-3 text-sm text-gray-600">{{ deadline.case_title }}</td>
              <td class="px-4 py-3 text-sm">
                <span :class="['font-medium', isOverdue(deadline.due_date) ? 'text-red-600' : 'text-gray-700']">
                  {{ formatDate(deadline.due_date) }}
                </span>
              </td>
              <td class="px-4 py-3">
                <span :class="['px-2 py-1 rounded text-xs font-medium', getPriorityBadge(deadline.priority)]">
                  {{ deadline.priority }}
                </span>
              </td>
              <td class="px-4 py-3">
                <span :class="['px-2 py-1 rounded text-xs font-medium', getStatusBadge(deadline.status)]">
                  {{ deadline.status }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { Meeting, ActionItem, Case } from '@/services/entities';
import { useAuthStore } from '@/stores/auth';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, addMonths, subMonths } from 'date-fns';

const authStore = useAuthStore();

const currentDate = ref(new Date());
const selectedDate = ref(new Date());
const deadlineFilter = ref('all');

const stats = ref({
  today: 0,
  thisWeek: 0,
  overdue: 0,
  totalMeetings: 0,
});

const upcomingEvents = ref([]);
const deadlines = ref([]);
const cases = ref([]);

const currentMonthYear = computed(() => format(currentDate.value, 'MMMM yyyy'));

const calendarDays = computed(() => {
  const start = startOfMonth(currentDate.value);
  const end = endOfMonth(currentDate.value);
  const days = eachDayOfInterval({ start, end });

  // Add days from previous month to fill first week
  const firstDayOfWeek = start.getDay();
  const prevMonthDays = [];
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const date = new Date(start);
    date.setDate(date.getDate() - i - 1);
    prevMonthDays.push({
      date: date.toISOString(),
      day: date.getDate(),
      isCurrentMonth: false,
      isToday: false,
      hasEvents: false,
      eventCount: 0,
    });
  }

  // Current month days
  const currentMonthDays = days.map(date => ({
    date: date.toISOString(),
    day: date.getDate(),
    isCurrentMonth: true,
    isToday: isToday(date),
    hasEvents: hasEventsOnDate(date),
    eventCount: getEventCountOnDate(date),
  }));

  // Add days from next month to fill last week
  const lastDay = currentMonthDays[currentMonthDays.length - 1];
  const totalDays = prevMonthDays.length + currentMonthDays.length;
  const remainingDays = 7 - (totalDays % 7);
  const nextMonthDays = [];
  if (remainingDays < 7) {
    for (let i = 1; i <= remainingDays; i++) {
      const date = new Date(end);
      date.setDate(date.getDate() + i);
      nextMonthDays.push({
        date: date.toISOString(),
        day: date.getDate(),
        isCurrentMonth: false,
        isToday: false,
        hasEvents: false,
        eventCount: 0,
      });
    }
  }

  return [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];
});

const filteredDeadlines = computed(() => {
  const now = new Date();
  const weekFromNow = new Date();
  weekFromNow.setDate(weekFromNow.getDate() + 7);
  const monthFromNow = new Date();
  monthFromNow.setMonth(monthFromNow.getMonth() + 1);

  return deadlines.value.filter(deadline => {
    const dueDate = new Date(deadline.due_date);

    switch (deadlineFilter.value) {
      case 'overdue':
        return dueDate < now && deadline.status !== 'completed';
      case 'week':
        return dueDate >= now && dueDate <= weekFromNow;
      case 'month':
        return dueDate >= now && dueDate <= monthFromNow;
      default:
        return true;
    }
  });
});

const loadCalendarData = async () => {
  try {
    const userId = authStore.user?.id;
    if (!userId) return;

    // Fetch lawyer's cases
    cases.value = await Case.filter({ lawyer_id: userId });
    const caseIds = cases.value.map(c => c.id);

    if (caseIds.length > 0) {
      // Fetch meetings
      const allMeetings = await Meeting.list();
      const lawyerMeetings = allMeetings.filter(m => caseIds.includes(m.case_id));
      stats.value.totalMeetings = lawyerMeetings.length;

      // Fetch tasks/deadlines
      const allTasks = await ActionItem.list();
      deadlines.value = allTasks
        .filter(t => caseIds.includes(t.case_id))
        .map(t => ({
          ...t,
          case_title: cases.value.find(c => c.id === t.case_id)?.title || 'Unknown Case',
        }));

      // Calculate stats
      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const todayEnd = new Date(todayStart);
      todayEnd.setDate(todayEnd.getDate() + 1);

      const weekEnd = new Date(todayStart);
      weekEnd.setDate(weekEnd.getDate() + 7);

      stats.value.today = lawyerMeetings.filter(m => {
        const meetingDate = new Date(m.meeting_date);
        return meetingDate >= todayStart && meetingDate < todayEnd;
      }).length;

      stats.value.thisWeek = lawyerMeetings.filter(m => {
        const meetingDate = new Date(m.meeting_date);
        return meetingDate >= todayStart && meetingDate < weekEnd;
      }).length;

      stats.value.overdue = deadlines.value.filter(d => {
        const dueDate = new Date(d.due_date);
        return dueDate < now && d.status !== 'completed';
      }).length;

      // Prepare upcoming events (meetings + deadlines)
      const events = [
        ...lawyerMeetings.map(m => ({
          id: m.id,
          title: m.title,
          case_title: cases.value.find(c => c.id === m.case_id)?.title || 'Unknown Case',
          date: m.meeting_date,
          type: 'meeting',
        })),
        ...deadlines.value.filter(d => d.status !== 'completed').map(d => ({
          id: d.id,
          title: d.title,
          case_title: d.case_title,
          date: d.due_date,
          type: 'deadline',
        })),
      ];

      upcomingEvents.value = events
        .filter(e => new Date(e.date) >= now)
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 10);
    }
  } catch (error) {
    console.error('Failed to load calendar data:', error);
  }
};

const hasEventsOnDate = (date) => {
  const dateStr = format(date, 'yyyy-MM-dd');
  return upcomingEvents.value.some(e => format(new Date(e.date), 'yyyy-MM-dd') === dateStr);
};

const getEventCountOnDate = (date) => {
  const dateStr = format(date, 'yyyy-MM-dd');
  return upcomingEvents.value.filter(e => format(new Date(e.date), 'yyyy-MM-dd') === dateStr).length;
};

const previousMonth = () => {
  currentDate.value = subMonths(currentDate.value, 1);
};

const nextMonth = () => {
  currentDate.value = addMonths(currentDate.value, 1);
};

const selectDay = (day) => {
  selectedDate.value = new Date(day.date);
};

const formatDate = (date) => {
  try {
    return format(new Date(date), 'MMM d, yyyy');
  } catch (e) {
    return '';
  }
};

const formatEventDate = (date) => {
  try {
    return format(new Date(date), 'MMM d, yyyy h:mm a');
  } catch (e) {
    return '';
  }
};

const isOverdue = (date) => {
  return new Date(date) < new Date();
};

const getEventTypeBadge = (type) => {
  return type === 'meeting' ? 'bg-purple-100 text-purple-700' : 'bg-orange-100 text-orange-700';
};

const getPriorityBadge = (priority) => {
  switch (priority) {
    case 'urgent': return 'bg-red-100 text-red-700';
    case 'high': return 'bg-orange-100 text-orange-700';
    case 'medium': return 'bg-yellow-100 text-yellow-700';
    case 'low': return 'bg-green-100 text-green-700';
    default: return 'bg-gray-100 text-gray-700';
  }
};

const getStatusBadge = (status) => {
  switch (status) {
    case 'completed': return 'bg-green-100 text-green-700';
    case 'in_progress': return 'bg-blue-100 text-blue-700';
    case 'pending': return 'bg-yellow-100 text-yellow-700';
    default: return 'bg-gray-100 text-gray-700';
  }
};

onMounted(() => {
  loadCalendarData();
});
</script>
