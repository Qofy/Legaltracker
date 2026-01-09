<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h2 class="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <svg class="w-7 h-7 text-[#003aca]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          Lawyer Dashboard
        </h2>
        <p class="text-gray-500 mt-1">Your personal caseload and activities</p>
      </div>
    </div>

    <!-- Stats Overview -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-white rounded-lg border border-gray-200 p-5">
        <div class="flex items-center justify-between mb-2">
          <p class="text-sm text-gray-600 font-medium">My Cases</p>
          <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <p class="text-3xl font-bold text-gray-900">{{ stats.totalCases }}</p>
        <p class="text-xs text-gray-500 mt-1">{{ stats.activeCases }} active</p>
      </div>

      <div class="bg-white rounded-lg border border-gray-200 p-5">
        <div class="flex items-center justify-between mb-2">
          <p class="text-sm text-gray-600 font-medium">Pending Tasks</p>
          <svg class="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <p class="text-3xl font-bold text-gray-900">{{ stats.pendingTasks }}</p>
        <p class="text-xs text-gray-500 mt-1">{{ stats.dueSoon }} due soon</p>
      </div>

      <div class="bg-white rounded-lg border border-gray-200 p-5">
        <div class="flex items-center justify-between mb-2">
          <p class="text-sm text-gray-600 font-medium">Active Clients</p>
          <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <p class="text-3xl font-bold text-gray-900">{{ stats.activeClients }}</p>
        <p class="text-xs text-gray-500 mt-1">{{ stats.totalClients }} total</p>
      </div>

      <div class="bg-white rounded-lg border border-gray-200 p-5">
        <div class="flex items-center justify-between mb-2">
          <p class="text-sm text-gray-600 font-medium">Upcoming Deadlines</p>
          <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p class="text-3xl font-bold text-gray-900">{{ stats.upcomingDeadlines }}</p>
        <p class="text-xs text-gray-500 mt-1">Next 7 days</p>
      </div>
    </div>

    <!-- Recent Activities and Case Status -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Assigned Cases Status -->
      <div class="bg-white rounded-lg border border-gray-200 p-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <svg class="w-5 h-5 text-[#003aca]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Case Status Breakdown
        </h3>
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 rounded-full bg-blue-600"></div>
              <span class="text-sm text-gray-700">Open</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-sm font-semibold text-gray-900">{{ casesByStatus.open }}</span>
              <div class="w-24 bg-gray-200 rounded-full h-2">
                <div class="bg-blue-600 h-2 rounded-full" :style="`width: ${getPercentage(casesByStatus.open)}%`"></div>
              </div>
            </div>
          </div>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 rounded-full bg-yellow-600"></div>
              <span class="text-sm text-gray-700">In Progress</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-sm font-semibold text-gray-900">{{ casesByStatus.in_progress }}</span>
              <div class="w-24 bg-gray-200 rounded-full h-2">
                <div class="bg-yellow-600 h-2 rounded-full" :style="`width: ${getPercentage(casesByStatus.in_progress)}%`"></div>
              </div>
            </div>
          </div>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 rounded-full bg-gray-600"></div>
              <span class="text-sm text-gray-700">On Hold</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-sm font-semibold text-gray-900">{{ casesByStatus.on_hold }}</span>
              <div class="w-24 bg-gray-200 rounded-full h-2">
                <div class="bg-gray-600 h-2 rounded-full" :style="`width: ${getPercentage(casesByStatus.on_hold)}%`"></div>
              </div>
            </div>
          </div>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 rounded-full bg-green-600"></div>
              <span class="text-sm text-gray-700">Closed</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-sm font-semibold text-gray-900">{{ casesByStatus.closed }}</span>
              <div class="w-24 bg-gray-200 rounded-full h-2">
                <div class="bg-green-600 h-2 rounded-full" :style="`width: ${getPercentage(casesByStatus.closed)}%`"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Activities -->
      <div class="bg-white rounded-lg border border-gray-200 p-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <svg class="w-5 h-5 text-[#003aca]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Recent Activities
        </h3>
        <div class="space-y-3 max-h-64 overflow-y-auto">
          <div v-if="recentActivities.length === 0" class="text-center py-8 text-gray-500">
            <p class="text-sm">No recent activities</p>
          </div>
          <div v-else v-for="activity in recentActivities" :key="activity.id" class="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0">
            <div class="w-2 h-2 rounded-full bg-blue-600 mt-2"></div>
            <div class="flex-1">
              <p class="text-sm text-gray-700">{{ activity.description }}</p>
              <p class="text-xs text-gray-500 mt-1">{{ formatDate(activity.created_at) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- My Cases Section with Case Cards -->
    <div class="bg-white rounded-lg border border-gray-200 p-6">
      <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <svg class="w-5 h-5 text-[#003aca]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        My Cases
      </h3>
      
      <div v-if="lawyerCases.length === 0" class="text-center py-12 text-gray-500">
        <svg class="w-16 h-16 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p>No cases assigned</p>
      </div>
      
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="caseItem in lawyerCases"
          :key="caseItem.id"
          class="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition cursor-pointer"
        >
          <div class="flex items-start justify-between mb-2">
            <div class="flex items-start gap-2 flex-1">
              <h4 class="font-semibold text-gray-900 text-base">
                {{ caseItem.title }}
              </h4>
              <!-- Case outcome indicator -->
              <div
                v-if="caseItem.case_points && caseItem.case_points.length > 0"
                class="flex items-center gap-1"
                :title="getCaseOutcomeIndicator(caseItem).text"
              >
                <div
                  class="w-2 h-2 rounded-full"
                  :class="getOutcomeIndicatorColor(getCaseOutcomeIndicator(caseItem).status)"
                ></div>
                <span class="text-xs text-gray-500">
                  {{ getCaseOutcomeIndicator(caseItem).text }}
                </span>
              </div>
            </div>
            <div class="flex items-center gap-1">
              <!-- Pin button -->
              <div class="relative group">
                <button
                  @click.stop="togglePin(caseItem)"
                  :class="[
                    'p-1 rounded transition',
                    isPinned(caseItem.id) 
                      ? 'text-orange-600 hover:text-orange-800' 
                      : 'text-gray-400 hover:text-gray-600'
                  ]"
                >
                  <Pin v-if="isPinned(caseItem.id)" class="w-4 h-4 fill-current" />
                  <PinOff v-else class="w-4 h-4" />
                </button>
                <!-- Tooltip -->
                <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                  <div v-if="isPinned(caseItem.id)" class="text-center">
                    <div class="font-medium">Pinned Task</div>
                    <div class="text-gray-300">{{ getPinnedTaskDescription(caseItem.id) }}</div>
                  </div>
                  <div v-else>Pin case for quick access</div>
                  <!-- Tooltip arrow -->
                  <div class="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-gray-800"></div>
                </div>
              </div>
              
              <!-- Add Point button -->
              <button
                @click.stop="openAddPointModal(caseItem)"
                class="text-blue-600 hover:text-blue-800 p-1 rounded"
                title="Add case point"
              >
                <svg
                  class="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </button>
            </div>
          </div>
          
          <p class="text-xs text-gray-500 mb-2">
            Case #{{ caseItem.case_number }}
          </p>
          
          <p class="text-sm text-gray-600 mb-3 line-clamp-2">
            {{ caseItem.description || 'No description available' }}
          </p>

          <div class="flex items-center gap-2 mb-3">
            <span
              :class="[
                'px-2 py-1 rounded text-xs font-medium',
                getStatusBadgeColor(caseItem.status),
              ]"
            >
              {{ caseItem.status }}
            </span>
            <span
              :class="[
                'px-2 py-1 rounded text-xs font-medium',
                getPriorityBadgeColor(caseItem.priority),
              ]"
            >
              {{ caseItem.priority }} priority
            </span>
          </div>

          <!-- Case points display -->
          <div
            v-if="caseItem.case_points && caseItem.case_points.length > 0"
            class="mb-3"
          >
            <div class="text-xs text-gray-600 mb-1">Recent Points:</div>
            <div class="flex flex-wrap gap-1">
              <span
                v-for="point in caseItem.case_points.slice(-3)"
                :key="point.id"
                :class="[
                  'px-2 py-1 rounded text-xs border',
                  getPointTypeColor(point.type)
                ]"
                :title="`${point.title} - ${point.impact} impact`"
              >
                {{ point.type === 'winning' ? '↗️' : point.type === 'losing' ? '↘️' : '➡️' }}
                {{ point.title.slice(0, 15) }}{{ point.title.length > 15 ? '...' : '' }}
              </span>
              <span
                v-if="caseItem.case_points.length > 3"
                class="px-2 py-1 rounded text-xs bg-gray-100 text-gray-600 border border-gray-200"
              >
                +{{ caseItem.case_points.length - 3 }} more
              </span>
            </div>
          </div>

          <div class="flex items-center justify-between text-xs text-gray-500 mb-3">
            <span class="flex items-center gap-1">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Updated: {{ formatDate(caseItem.updated_date || caseItem.created_date).split(' ').slice(0, 3).join(' ') }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- My Cases Section with Case Cards -->
    <div class="bg-white rounded-lg border border-gray-200 p-6">
      <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <svg class="w-5 h-5 text-[#003aca]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        My Cases
      </h3>
      
      <div v-if="lawyerCases.length === 0" class="text-center py-12 text-gray-500">
        <svg class="w-16 h-16 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p>No cases assigned</p>
      </div>
      
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="caseItem in lawyerCases"
          :key="caseItem.id"
          class="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition cursor-pointer"
        >
          <div class="flex items-start justify-between mb-2">
            <div class="flex items-start gap-2 flex-1">
              <h4 class="font-semibold text-gray-900 text-base">
                {{ caseItem.title }}
              </h4>
              <!-- Case outcome indicator -->
              <div
                v-if="caseItem.case_points && caseItem.case_points.length > 0"
                class="flex items-center gap-1"
                :title="getCaseOutcomeIndicator(caseItem).text"
              >
                <div
                  class="w-2 h-2 rounded-full"
                  :class="getOutcomeIndicatorColor(getCaseOutcomeIndicator(caseItem).status)"
                ></div>
                <span class="text-xs text-gray-500">
                  {{ getCaseOutcomeIndicator(caseItem).text }}
                </span>
              </div>
            </div>
            <div class="flex items-center gap-1">
              <!-- Pin button -->
              <div class="relative group">
                <button
                  @click.stop="togglePin(caseItem)"
                  :class="[
                    'p-1 rounded transition',
                    isPinned(caseItem.id) 
                      ? 'text-orange-600 hover:text-orange-800' 
                      : 'text-gray-400 hover:text-gray-600'
                  ]"
                >
                  <Pin v-if="isPinned(caseItem.id)" class="w-4 h-4 fill-current" />
                  <PinOff v-else class="w-4 h-4" />
                </button>
                <!-- Tooltip -->
                <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                  <div v-if="isPinned(caseItem.id)" class="text-center">
                    <div class="font-medium">Pinned Task</div>
                    <div class="text-gray-300">{{ getPinnedTaskDescription(caseItem.id) }}</div>
                  </div>
                  <div v-else>Pin case for quick access</div>
                  <!-- Tooltip arrow -->
                  <div class="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-gray-800"></div>
                </div>
              </div>
              
              <!-- Add Point button -->
              <button
                @click.stop="openAddPointModal(caseItem)"
                class="text-blue-600 hover:text-blue-800 p-1 rounded"
                title="Add case point"
              >
                <svg
                  class="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </button>
            </div>
          </div>
          
          <p class="text-xs text-gray-500 mb-2">
            Case #{{ caseItem.case_number }}
          </p>
          
          <p class="text-sm text-gray-600 mb-3 line-clamp-2">
            {{ caseItem.description || 'No description available' }}
          </p>

          <div class="flex items-center gap-2 mb-3">
            <span
              :class="[
                'px-2 py-1 rounded text-xs font-medium',
                getStatusBadgeColor(caseItem.status),
              ]"
            >
              {{ caseItem.status }}
            </span>
            <span
              :class="[
                'px-2 py-1 rounded text-xs font-medium',
                getPriorityBadgeColor(caseItem.priority),
              ]"
            >
              {{ caseItem.priority }} priority
            </span>
          </div>

          <!-- Case points display -->
          <div
            v-if="caseItem.case_points && caseItem.case_points.length > 0"
            class="mb-3"
          >
            <div class="text-xs text-gray-600 mb-1">Recent Points:</div>
            <div class="flex flex-wrap gap-1">
              <span
                v-for="point in caseItem.case_points.slice(-3)"
                :key="point.id"
                :class="[
                  'px-2 py-1 rounded text-xs border',
                  getPointTypeColor(point.type)
                ]"
                :title="`${point.title} - ${point.impact} impact`"
              >
                {{ point.type === 'winning' ? '↗️' : point.type === 'losing' ? '↘️' : '➡️' }}
                {{ point.title.slice(0, 15) }}{{ point.title.length > 15 ? '...' : '' }}
              </span>
              <span
                v-if="caseItem.case_points.length > 3"
                class="px-2 py-1 rounded text-xs bg-gray-100 text-gray-600 border border-gray-200"
              >
                +{{ caseItem.case_points.length - 3 }} more
              </span>
            </div>
          </div>

          <div class="flex items-center justify-between text-xs text-gray-500 mb-3">
            <span class="flex items-center gap-1">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Updated: {{ formatDate(caseItem.updated_date || caseItem.created_date).split(' ').slice(0, 3).join(' ') }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Client Communications Summary -->
    <div class="bg-white rounded-lg border border-gray-200 p-6">
      <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <svg class="w-5 h-5 text-[#003aca]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
        Recent Client Communications
      </h3>
      <div class="space-y-3">
        <div v-if="recentCommunications.length === 0" class="text-center py-8 text-gray-500">
          <p class="text-sm">No recent communications</p>
        </div>
        <div v-else v-for="comm in recentCommunications" :key="comm.id" class="flex items-start gap-4 p-4 rounded-lg border border-gray-200 hover:bg-gray-50">
          <div class="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
            <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div class="flex-1">
            <div class="flex items-center justify-between">
              <h4 class="font-semibold text-gray-900">{{ comm.client_name }}</h4>
              <span class="text-xs text-gray-500">{{ formatDate(comm.created_at) }}</span>
            </div>
            <p class="text-sm text-gray-600 mt-1">{{ comm.case_title }}</p>
            <p class="text-sm text-gray-700 mt-2">{{ comm.message }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Point Modal -->
    <div
      v-if="showAddPointModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click="closeAddPointModal"
    >
      <div
        class="bg-white rounded-lg p-6 w-full max-w-md mx-4"
        @click.stop
      >
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900">Add Case Point</h3>
          <button
            @click="closeAddPointModal"
            class="text-gray-400 hover:text-gray-600"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div class="mb-4">
          <p class="text-sm text-gray-600 mb-2">
            Case: <span class="font-medium">{{ selectedCaseForPoints?.title }}</span>
          </p>
          <p class="text-xs text-gray-500">
            #{{ selectedCaseForPoints?.case_number }}
          </p>
        </div>

        <form @submit.prevent="savePoint" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Point Title *
            </label>
            <input
              v-model="newPoint.title"
              type="text"
              required
              placeholder="Enter point title..."
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              v-model="newPoint.description"
              rows="3"
              placeholder="Describe this point in detail..."
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            ></textarea>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Point Type
              </label>
              <select
                v-model="newPoint.type"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="winning">↗️ Winning Point</option>
                <option value="losing">↘️ Losing Point</option>
                <option value="neutral">➡️ Neutral Point</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Impact Level
              </label>
              <select
                v-model="newPoint.impact"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              v-model="newPoint.date"
              type="date"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div class="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              @click="closeAddPointModal"
              class="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="isSavingPoint || !newPoint.title.trim()"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ isSavingPoint ? 'Adding...' : 'Add Point' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Add Point Modal -->
    <div
      v-if="showAddPointModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click="closeAddPointModal"
    >
      <div
        class="bg-white rounded-lg p-6 w-full max-w-md mx-4"
        @click.stop
      >
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900">Add Case Point</h3>
          <button
            @click="closeAddPointModal"
            class="text-gray-400 hover:text-gray-600"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div class="mb-4">
          <p class="text-sm text-gray-600 mb-2">
            Case: <span class="font-medium">{{ selectedCaseForPoints?.title }}</span>
          </p>
          <p class="text-xs text-gray-500">
            #{{ selectedCaseForPoints?.case_number }}
          </p>
        </div>

        <form @submit.prevent="savePoint" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Point Title *
            </label>
            <input
              v-model="newPoint.title"
              type="text"
              required
              placeholder="Enter point title..."
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              v-model="newPoint.description"
              rows="3"
              placeholder="Describe this point in detail..."
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            ></textarea>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Point Type
              </label>
              <select
                v-model="newPoint.type"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="winning">↗️ Winning Point</option>
                <option value="losing">↘️ Losing Point</option>
                <option value="neutral">➡️ Neutral Point</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Impact Level
              </label>
              <select
                v-model="newPoint.impact"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              v-model="newPoint.date"
              type="date"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div class="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              @click="closeAddPointModal"
              class="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="isSavingPoint || !newPoint.title.trim()"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ isSavingPoint ? 'Adding...' : 'Add Point' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { Case, ActionItem, ChatMessage } from '@/services/entities';
import { useAuthStore } from '@/stores/auth';
import { format } from 'date-fns';
import { Pin, PinOff } from 'lucide-vue-next';

const authStore = useAuthStore();

const stats = ref({
  totalCases: 0,
  activeCases: 0,
  pendingTasks: 0,
  dueSoon: 0,
  activeClients: 0,
  totalClients: 0,
  upcomingDeadlines: 0,
});

const casesByStatus = ref({
  open: 0,
  in_progress: 0,
  on_hold: 0,
  closed: 0,
});

const recentActivities = ref([]);
const recentCommunications = ref([]);
const lawyerCases = ref([]);

// Case points management
const showAddPointModal = ref(false);
const selectedCaseForPoints = ref(null);
const newPoint = ref({
  title: '',
  description: '',
  type: 'winning', // winning, losing, neutral
  impact: 'medium', // low, medium, high
  date: new Date().toISOString().split('T')[0]
});
const isSavingPoint = ref(false);

// Pin-related state
const pinnedCases = ref(new Set());
const pinnedTasks = ref(new Map()); // Map of caseId -> task description

const loadLawyerDashboard = async () => {
  try {
    const userId = authStore.user?.id;
    if (!userId) return;

    // Fetch lawyer's assigned cases
    const cases = await Case.filter({ lawyer_id: userId });
    lawyerCases.value = cases;

    stats.value.totalCases = cases.length;
    stats.value.activeCases = cases.filter(c => c.status === 'open' || c.status === 'in_progress').length;

    // Load case points for all cases
    loadCasePoints();

    // Count cases by status
    casesByStatus.value = {
      open: cases.filter(c => c.status === 'open').length,
      in_progress: cases.filter(c => c.status === 'in_progress').length,
      on_hold: cases.filter(c => c.status === 'on_hold').length,
      closed: cases.filter(c => c.status === 'closed').length,
    };

    // Fetch pending tasks for lawyer's cases
    const caseIds = cases.map(c => c.id);
    if (caseIds.length > 0) {
      const allTasks = await ActionItem.list();
      const lawyerTasks = allTasks.filter(t => caseIds.includes(t.case_id) && t.status === 'pending');
      stats.value.pendingTasks = lawyerTasks.length;

      // Count tasks due soon (within 3 days)
      const threeDaysFromNow = new Date();
      threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
      stats.value.dueSoon = lawyerTasks.filter(t => {
        if (!t.due_date) return false;
        const dueDate = new Date(t.due_date);
        return dueDate <= threeDaysFromNow;
      }).length;

      // Count upcoming deadlines
      const sevenDaysFromNow = new Date();
      sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
      stats.value.upcomingDeadlines = lawyerTasks.filter(t => {
        if (!t.due_date) return false;
        const dueDate = new Date(t.due_date);
        return dueDate <= sevenDaysFromNow;
      }).length;

      // Get unique clients
      const clientIds = new Set();
      cases.forEach(c => {
        if (c.customer_ids && Array.isArray(c.customer_ids)) {
          c.customer_ids.forEach(id => clientIds.add(id));
        }
      });
      stats.value.totalClients = clientIds.size;
      stats.value.activeClients = cases.filter(c => c.status === 'open' || c.status === 'in_progress')
        .reduce((acc, c) => {
          if (c.customer_ids && Array.isArray(c.customer_ids)) {
            c.customer_ids.forEach(id => acc.add(id));
          }
          return acc;
        }, new Set()).size;

      // Mock recent activities (in production, fetch from activity log)
      recentActivities.value = [
        { id: 1, description: 'Updated case status for Case #12345', created_at: new Date() },
        { id: 2, description: 'Uploaded new document to Case #12346', created_at: new Date(Date.now() - 3600000) },
        { id: 3, description: 'Added comment to Case #12347', created_at: new Date(Date.now() - 7200000) },
      ];

      // Fetch recent communications
      const messages = await ChatMessage.list('-created_date', 5);
      recentCommunications.value = messages
        .filter(m => caseIds.includes(m.case_id))
        .slice(0, 5)
        .map(m => ({
          id: m.id,
          client_name: 'Client Name', // In production, fetch from user data
          case_title: cases.find(c => c.id === m.case_id)?.title || 'Unknown Case',
          message: m.message,
          created_at: m.created_date,
        }));
    }
  } catch (error) {
    console.error('Failed to load lawyer dashboard:', error);
  }
};

const getPercentage = (count) => {
  if (stats.value.totalCases === 0) return 0;
  return Math.round((count / stats.value.totalCases) * 100);
};

const formatDate = (date) => {
  try {
    return format(new Date(date), 'MMM d, yyyy h:mm a');
  } catch (e) {
    return '';
  }
};

// (Duplicate case-points block removed; single implementation retained earlier)

// Badge color helpers
const getStatusBadgeColor = (status) => {
  switch (status) {
    case 'open':
      return 'bg-blue-100 text-blue-700 border border-blue-200';
    case 'in_progress':
      return 'bg-yellow-100 text-yellow-700 border border-yellow-200';
    case 'closed':
      return 'bg-green-100 text-green-700 border border-green-200';
    case 'on_hold':
      return 'bg-gray-100 text-gray-700 border border-gray-200';
    case 'archived':
      return 'bg-purple-100 text-purple-700 border border-purple-200';
    default:
      return 'bg-gray-100 text-gray-700 border border-gray-200';
  }
};

const getPriorityBadgeColor = (priority) => {
  switch (priority) {
    case 'urgent':
      return 'bg-red-100 text-red-700 border border-red-200';
    case 'high':
      return 'bg-orange-100 text-orange-700 border border-orange-200';
    case 'medium':
      return 'bg-yellow-100 text-yellow-700 border border-yellow-200';
    case 'low':
      return 'bg-green-100 text-green-700 border border-green-200';
    default:
      return 'bg-gray-100 text-gray-700 border border-gray-200';
  }
};

// Case points management functions
const openAddPointModal = (caseItem) => {
  selectedCaseForPoints.value = caseItem;
  showAddPointModal.value = true;
  // Reset form
  newPoint.value = {
    title: '',
    description: '',
    type: 'winning',
    impact: 'medium',
    date: new Date().toISOString().split('T')[0]
  };
};

const closeAddPointModal = () => {
  showAddPointModal.value = false;
  selectedCaseForPoints.value = null;
};

const savePoint = async () => {
  if (!selectedCaseForPoints.value || !newPoint.value.title.trim()) {
    alert('Please fill in the point title');
    return;
  }

  isSavingPoint.value = true;
  try {
    // Initialize case points array if it doesn't exist
    if (!selectedCaseForPoints.value.case_points) {
      selectedCaseForPoints.value.case_points = [];
    }

    const point = {
      id: Date.now(), // temporary ID
      ...newPoint.value,
      added_by: authStore.user.id,
      added_by_name: authStore.user.full_name || authStore.user.name,
      created_date: new Date().toISOString()
    };

    // Add to case points array
    selectedCaseForPoints.value.case_points.push(point);

    // Save to localStorage
    const casePoints = JSON.parse(localStorage.getItem('legaltracker_case_points') || '{}');
    casePoints[selectedCaseForPoints.value.id] = selectedCaseForPoints.value.case_points;
    localStorage.setItem('legaltracker_case_points', JSON.stringify(casePoints));

    closeAddPointModal();
    console.log('Point added successfully');
  } catch (error) {
    console.error('Failed to save point:', error);
    alert('Failed to save point. Please try again.');
  }
  isSavingPoint.value = false;
};

// Load case points from storage
const loadCasePoints = () => {
  try {
    const casePoints = JSON.parse(localStorage.getItem('legaltracker_case_points') || '{}');
    lawyerCases.value.forEach(caseItem => {
      if (casePoints[caseItem.id]) {
        caseItem.case_points = casePoints[caseItem.id];
      }
    });
  } catch (error) {
    console.error('Failed to load case points:', error);
  }
};

// Pin management functions
const loadPinnedCases = () => {
  try {
    const storedPins = localStorage.getItem('lawyer_pinned_cases');
    const storedTasks = localStorage.getItem('lawyer_pinned_tasks');
    
    if (storedPins) {
      pinnedCases.value = new Set(JSON.parse(storedPins));
    }
    
    if (storedTasks) {
      pinnedTasks.value = new Map(JSON.parse(storedTasks));
    }
  } catch (error) {
    console.error('Error loading pinned cases:', error);
  }
};

const savePinnedCases = () => {
  try {
    localStorage.setItem('lawyer_pinned_cases', JSON.stringify(Array.from(pinnedCases.value)));
    localStorage.setItem('lawyer_pinned_tasks', JSON.stringify(Array.from(pinnedTasks.value.entries())));
  } catch (error) {
    console.error('Error saving pinned cases:', error);
  }
};

const togglePin = (caseItem) => {
  const caseId = caseItem.id;
  
  if (pinnedCases.value.has(caseId)) {
    // Unpin
    pinnedCases.value.delete(caseId);
    pinnedTasks.value.delete(caseId);
  } else {
    // Pin with current task description
    pinnedCases.value.add(caseId);
    const taskDescription = getActiveTaskForCase(caseItem);
    pinnedTasks.value.set(caseId, taskDescription);
  }
  
  savePinnedCases();
};

const isPinned = (caseId) => {
  return pinnedCases.value.has(caseId);
};

const getPinnedTaskDescription = (caseId) => {
  return pinnedTasks.value.get(caseId) || 'Working on this case';
};

const getActiveTaskForCase = (caseItem) => {
  // Generate a meaningful task description based on case status and recent activity
  const status = caseItem.status;
  const hasPoints = caseItem.case_points && caseItem.case_points.length > 0;
  
  if (hasPoints) {
    const latestPoint = caseItem.case_points[caseItem.case_points.length - 1];
    return `Working on: ${latestPoint.description.substring(0, 50)}${latestPoint.description.length > 50 ? '...' : ''}`;
  }
  
  switch (status) {
    case 'open':
      return 'Initial case review and evidence gathering';
    case 'in_progress':
      return 'Actively working on case proceedings';
    case 'on_hold':
      return 'Monitoring case status and next steps';
    default:
      return 'Case management and client coordination';
  }
};

// Calculate case outcome indicator
const getCaseOutcomeIndicator = (caseItem) => {
  if (!caseItem.case_points || caseItem.case_points.length === 0) {
    return { status: 'neutral', score: 0, text: 'No points added' };
  }

  let score = 0;
  caseItem.case_points.forEach(point => {
    let pointValue = 0;
    
    // Base value by type
    if (point.type === 'winning') pointValue = 1;
    else if (point.type === 'losing') pointValue = -1;
    else pointValue = 0; // neutral

    // Multiply by impact
    if (point.impact === 'high') pointValue *= 3;
    else if (point.impact === 'medium') pointValue *= 2;
    else pointValue *= 1; // low

    score += pointValue;
  });

  let status = 'neutral';
  let text = 'Balanced case';
  
  if (score > 2) {
    status = 'winning';
    text = 'Looking favorable';
  } else if (score < -2) {
    status = 'losing';
    text = 'Facing challenges';
  }

  return { status, score, text };
};

// Get point type color
const getPointTypeColor = (type) => {
  switch (type) {
    case 'winning':
      return 'bg-green-100 text-green-700 border-green-200';
    case 'losing':
      return 'bg-red-100 text-red-700 border-red-200';
    case 'neutral':
      return 'bg-gray-100 text-gray-700 border-gray-200';
    default:
      return 'bg-gray-100 text-gray-700 border-gray-200';
  }
};

// Get outcome indicator color
const getOutcomeIndicatorColor = (status) => {
  switch (status) {
    case 'winning':
      return 'bg-green-500';
    case 'losing':
      return 'bg-red-500';
    case 'neutral':
      return 'bg-gray-400';
    default:
      return 'bg-gray-400';
  }
};

onMounted(() => {
  loadLawyerDashboard();
  loadPinnedCases();
});
</script>
