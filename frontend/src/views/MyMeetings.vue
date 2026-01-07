<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
    <!-- Header -->
    <div class="max-w-6xl mx-auto mb-8">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-4xl font-bold text-gray-900 flex items-center gap-3">
            <div class="p-3 bg-gradient-to-r from-[#003aca] to-[#0052e8] rounded-2xl shadow-lg">
              <Users class="w-8 h-8 text-white" />
            </div>
            My Meetings
          </h1>
          <p class="text-lg text-gray-600 mt-2">
            View and manage your scheduled meetings
          </p>
        </div>
        
        <!-- Meeting Status Legend -->
        <div class="flex items-center gap-4">
          <div class="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm border">
            <div class="w-3 h-3 rounded-full bg-green-500"></div>
            <span class="text-sm text-gray-600">Upcoming</span>
            <div class="w-3 h-3 rounded-full bg-blue-500 ml-3"></div>
            <span class="text-sm text-gray-600">Today</span>
            <div class="w-3 h-3 rounded-full bg-gray-400 ml-3"></div>
            <span class="text-sm text-gray-600">Past</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Meetings List -->
    <div class="max-w-6xl mx-auto">
      <div class="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
        <!-- Tab Navigation -->
        <div class="bg-gradient-to-r from-[#003aca] to-[#0052e8] px-8 py-4">
          <div class="flex gap-4">
            <button
              @click="activeTab = 'upcoming'"
              :class="[
                'px-6 py-2 rounded-full font-medium transition-all duration-200',
                activeTab === 'upcoming' 
                  ? 'bg-white text-[#003aca]' 
                  : 'bg-white/20 text-white hover:bg-white/30'
              ]"
            >
              Upcoming Meetings ({{ upcomingMeetings.length }})
            </button>
            <button
              @click="activeTab = 'past'"
              :class="[
                'px-6 py-2 rounded-full font-medium transition-all duration-200',
                activeTab === 'past' 
                  ? 'bg-white text-[#003aca]' 
                  : 'bg-white/20 text-white hover:bg-white/30'
              ]"
            >
              Past Meetings ({{ pastMeetings.length }})
            </button>
          </div>
        </div>

        <!-- Meetings Content -->
        <div class="p-8">
          <!-- Upcoming Meetings -->
          <div v-if="activeTab === 'upcoming'">
            <div v-if="upcomingMeetings.length === 0" class="text-center py-12">
              <Calendar class="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 class="text-lg font-semibold text-gray-900 mb-2">No upcoming meetings</h3>
              <p class="text-gray-500">You don't have any scheduled meetings.</p>
            </div>
            
            <div v-else class="space-y-4">
              <div
                v-for="meeting in upcomingMeetings"
                :key="meeting.id"
                :class="[
                  'p-6 rounded-2xl border-2 transition-all duration-200 hover:shadow-lg cursor-pointer',
                  isToday(new Date(meeting.meeting_date)) 
                    ? 'bg-blue-50 border-blue-200' 
                    : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                ]"
                @click="selectMeeting(meeting)"
              >
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <div class="flex items-center gap-3 mb-2">
                      <div :class="[
                        'p-2 rounded-full',
                        isToday(new Date(meeting.meeting_date)) ? 'bg-blue-500' : 'bg-green-500'
                      ]">
                        <Users class="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h3 class="text-lg font-semibold text-gray-900">{{ meeting.title }}</h3>
                        <p class="text-sm text-gray-600">
                          {{ formatMeetingDateTime(meeting.meeting_date) }}
                        </p>
                      </div>
                    </div>
                    
                    <div class="ml-11 space-y-2">
                      <div v-if="meeting.data?.case_id" class="flex items-center gap-2">
                        <Briefcase class="w-4 h-4 text-gray-400" />
                        <span class="text-sm text-gray-600">Case: {{ getCaseTitle(meeting.data.case_id) }}</span>
                      </div>
                      
                      <div v-if="meeting.location || meeting.data?.location" class="flex items-center gap-2">
                        <MapPin class="w-4 h-4 text-gray-400" />
                        <span class="text-sm text-gray-600">{{ meeting.location || meeting.data?.location }}</span>
                      </div>
                      
                      <div class="flex items-center gap-2">
                        <Clock class="w-4 h-4 text-gray-400" />
                        <span class="text-sm text-gray-600">
                          Scheduled by {{ meeting.data?.created_by || 'Admin' }}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div class="text-right">
                    <div :class="[
                      'px-3 py-1 rounded-full text-xs font-medium',
                      isToday(new Date(meeting.meeting_date)) 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-green-100 text-green-800'
                    ]">
                      {{ isToday(new Date(meeting.meeting_date)) ? 'Today' : 'Upcoming' }}
                    </div>
                    <div class="mt-2 text-sm text-gray-500">
                      {{ formatRelativeTime(meeting.meeting_date) }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Past Meetings -->
          <div v-if="activeTab === 'past'">
            <div v-if="pastMeetings.length === 0" class="text-center py-12">
              <Clock class="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 class="text-lg font-semibold text-gray-900 mb-2">No past meetings</h3>
              <p class="text-gray-500">You don't have any past meetings yet.</p>
            </div>
            
            <div v-else class="space-y-4">
              <div
                v-for="meeting in pastMeetings"
                :key="meeting.id"
                class="p-6 rounded-2xl bg-gray-50 border-2 border-gray-200 opacity-75 hover:opacity-100 transition-all duration-200 hover:shadow-lg cursor-pointer"
                @click="selectMeeting(meeting)"
              >
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <div class="flex items-center gap-3 mb-2">
                      <div class="p-2 rounded-full bg-gray-400">
                        <Users class="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h3 class="text-lg font-semibold text-gray-900">{{ meeting.title }}</h3>
                        <p class="text-sm text-gray-600">
                          {{ formatMeetingDateTime(meeting.meeting_date) }}
                        </p>
                      </div>
                    </div>
                    
                    <div class="ml-11 space-y-2">
                      <div v-if="meeting.data?.case_id" class="flex items-center gap-2">
                        <Briefcase class="w-4 h-4 text-gray-400" />
                        <span class="text-sm text-gray-600">Case: {{ getCaseTitle(meeting.data.case_id) }}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div class="text-right">
                    <div class="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                      Completed
                    </div>
                    <div class="mt-2 text-sm text-gray-500">
                      {{ formatRelativeTime(meeting.meeting_date) }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Meeting Details Modal (if needed) -->
    <div v-if="selectedMeeting" class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-bold text-gray-900">Meeting Details</h2>
            <button @click="selectedMeeting = null" class="p-2 hover:bg-gray-100 rounded-full">
              <X class="w-5 h-5" />
            </button>
          </div>
          
          <div class="space-y-4">
            <div>
              <h3 class="font-semibold text-gray-900 mb-2">{{ selectedMeeting.title }}</h3>
              <p class="text-gray-600">{{ formatMeetingDateTime(selectedMeeting.meeting_date) }}</p>
            </div>
            
            <div v-if="selectedMeeting.data?.location">
              <h4 class="font-medium text-gray-900 mb-1">Location</h4>
              <p class="text-gray-600">{{ selectedMeeting.data.location }}</p>
            </div>
            
            <div v-if="selectedMeeting.data?.description">
              <h4 class="font-medium text-gray-900 mb-1">Description</h4>
              <p class="text-gray-600">{{ selectedMeeting.data.description }}</p>
            </div>
            
            <div v-if="selectedMeeting.data?.attendees">
              <h4 class="font-medium text-gray-900 mb-2">Attendees</h4>
              <div class="space-y-1">
                <div v-for="attendee in selectedMeeting.data.attendees" :key="attendee.id" class="flex items-center gap-2">
                  <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span class="text-gray-600">{{ attendee.full_name }} ({{ attendee.user_type === 'customer' ? 'Client' : attendee.user_type }})</span>
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
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { Case, Meeting } from '@/services/entities'
import { 
  Users, 
  Calendar, 
  Clock, 
  Briefcase, 
  MapPin,
  X 
} from 'lucide-vue-next'
import { format, isToday, isPast, formatDistanceToNow } from 'date-fns'

const authStore = useAuthStore()
const activeTab = ref('upcoming')
const selectedMeeting = ref(null)
const meetings = ref([])
const cases = ref([])

// Mock data - in real app this would come from API
const mockMeetings = [
  {
    id: 'meeting-1',
    title: 'Contract Review Meeting',
    meeting_date: '2026-01-08T10:00:00Z',
    type: 'meeting',
    data: {
      case_id: 'case-abc',
      location: 'Conference Room A',
      description: 'Review contract terms and negotiations',
      created_by: 'Admin',
      attendees: [
        { id: 'lawyer-1', full_name: 'Sarah Williams', user_type: 'lawyer' },
        { id: 'client-1', full_name: 'John Anderson', user_type: 'customer' }
      ],
      case_info: {
        title: 'Acme Corp Contract Dispute',
        case_number: 'CASE-001'
      }
    }
  },
  {
    id: 'meeting-2', 
    title: 'Client Strategy Session',
    meeting_date: '2026-01-10T14:30:00Z',
    type: 'meeting',
    data: {
      case_id: 'case-xyz',
      location: 'Zoom Meeting',
      description: 'Discuss case strategy and next steps',
      created_by: 'Admin',
      attendees: [
        { id: 'lawyer-2', full_name: 'Michael Brown', user_type: 'lawyer' },
        { id: 'client-2', full_name: 'Emma Wilson', user_type: 'customer' }
      ],
      case_info: {
        title: 'Employment Termination Case',
        case_number: 'CASE-002'
      }
    }
  },
  {
    id: 'meeting-3', 
    title: 'Property Settlement Discussion',
    meeting_date: '2026-01-12T09:00:00Z',
    type: 'meeting',
    data: {
      case_id: 'case-123',
      location: 'Law Office',
      description: 'Discuss property settlement options',
      created_by: 'Admin',
      attendees: [
        { id: 'lawyer-3', full_name: 'Lisa Davis', user_type: 'lawyer' },
        { id: 'client-3', full_name: 'Robert Taylor', user_type: 'customer' }
      ],
      case_info: {
        title: 'Property Rights Issue',
        case_number: 'CASE-003'
      }
    }
  }
]



const upcomingMeetings = computed(() => {
  return meetings.value.filter(meeting => {
    const meetingDate = new Date(meeting.meeting_date || meeting.start_time)
    return !isPast(meetingDate)
  }).sort((a, b) => new Date(a.meeting_date || a.start_time) - new Date(b.meeting_date || b.start_time))
})

const pastMeetings = computed(() => {
  return meetings.value.filter(meeting => {
    const meetingDate = new Date(meeting.meeting_date || meeting.start_time)
    return isPast(meetingDate) && !isToday(meetingDate)
  }).sort((a, b) => new Date(b.meeting_date || b.start_time) - new Date(a.meeting_date || a.start_time))
})

const loadMeetings = async () => {
  try {
    // Load real cases and meetings from API
    const [casesData, meetingsData] = await Promise.all([
      Case.list('-updated_date'),
      Meeting.list('-created_date')
    ])
    
    cases.value = casesData || []
    console.log('MyMeetings: Loaded cases:', cases.value.length)
    
    // Use real meetings from API, fallback to mock if empty
    const allMeetings = meetingsData && meetingsData.length > 0 ? meetingsData : mockMeetings
    console.log('MyMeetings: All meetings loaded:', allMeetings.length, allMeetings)
    
    // Filter meetings where the current user is an attendee or assigned to the case
    meetings.value = allMeetings.filter(meeting => {
      // Check if user is directly listed as attendees (handle both API and mock structure)
      const isDirectAttendee = meeting.data?.attendees?.some(attendee => 
        attendee.id === authStore.user?.id
      ) || meeting.attendees?.some(attendee => 
        attendee.id === authStore.user?.id
      )
      
      // Check if user is assigned to the case (for lawyers) or is the client of the case
      const meetingCaseId = meeting.data?.case_id || meeting.case_id
      const isRelatedToCase = meetingCaseId && (
        // For lawyers: check if they're assigned to this case
        (authStore.user?.user_type === 'lawyer' && 
         cases.value.find(c => c.id === meetingCaseId)?.assigned_lawyer?.id === authStore.user?.id) ||
        // For clients: check if they're a client of this case (handle both clients and customers arrays)
        (authStore.user?.user_type === 'customer' &&
         cases.value.find(c => c.id === meetingCaseId)?.clients?.some(client => client.id === authStore.user?.id)) ||
        (authStore.user?.user_type === 'customer' &&
         cases.value.find(c => c.id === meetingCaseId)?.customers?.some(client => client.id === authStore.user?.id))
      )
      
      const shouldShow = isDirectAttendee || isRelatedToCase
      if (shouldShow) {
        console.log('MyMeetings: Including meeting:', meeting.title, 'Direct attendee:', isDirectAttendee, 'Related to case:', isRelatedToCase)
      }
      return shouldShow
    })
    
    console.log('Loaded meetings for user:', authStore.user?.id, 'Found:', meetings.value.length)
  } catch (error) {
    console.error('Failed to load meetings:', error)
    // Fallback to mock cases on error
    cases.value = [
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
    ]
  }
}

const getCaseTitle = (caseId) => {
  const caseItem = cases.value.find(c => c.id === caseId)
  return caseItem ? caseItem.title : 'Unknown Case'
}

const getMeetingDate = (meeting) => {
  return meeting.meeting_date || meeting.start_time
}

const formatMeetingDateTime = (dateString) => {
  const date = new Date(dateString)
  return format(date, 'PPP \'at\' p')
}

const formatRelativeTime = (dateString) => {
  const date = new Date(dateString)
  return formatDistanceToNow(date, { addSuffix: true })
}

const selectMeeting = (meeting) => {
  selectedMeeting.value = meeting
}

onMounted(() => {
  loadMeetings()
})
</script>