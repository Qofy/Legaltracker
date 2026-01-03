<template>
  <div class=" bg-gray-50 min-h-screen flex">
  <!-- ///////////////////Aside/////////////////////////// -->
    <aside class="w-64 flex flex-col gap-6 bg-white border-r-2 border-r-gray-400">
      <header class="flex flex-col bg-white py-4 px-4 text-gray-800 border-b border-b-gray-400">
        <h1 class="font-bold text-2xl flex gap-2 items-center text-[#003aca]">
          <Scale size="26" />
          LegalHub
        </h1>
        <p class="mt-2 text-sm text-gray-500">Welcome back, {{ user?.full_name?.split(' ')[0] || 'User' }}</p>
      </header>

      

        <!-- Admin-only navigation -->
        <div v-if="isAdmin" class="my-2 pt-2">
          <p class="text-xs text-gray-500 font-semibold px-3 mb-2 text-center">ADMIN PANEL</p>
          <!-- <div class="w-30 h-30 mx-auto my-1 flex flex-col items-center justify-center">

        <div class="w-14 h-14 bg-gray-100 flex items-center justify-center rounded-full">
          <UserIcon class="text-[#003aca]" />
        </div>
        <h2 class="font-semibold text-gray-700 mt-2">Profile</h2>
      </div> -->

      <nav class="px-3 py-4 space-y-2">
        <button type="button" @click="selectedView = 'Dashboard'" :class="['nav-link', {active: selectedView === 'Dashboard'}]">
          <span class="icon-wrap bg-white rounded-md p-2 flex items-center justify-center">
            <House class="nav-icon" size="20" />
          </span>
          <span class="nav-text">Dashboard</span>
        </button>

        <button type="button" @click="selectedView = 'Cases'" :class="['nav-link', {active: selectedView === 'Cases'}]">
          <span class="icon-wrap bg-white rounded-md p-2 flex items-center justify-center">
            <FileText class="nav-icon" size="20" />
          </span>
          <span class="nav-text">Cases</span>
        </button>
        
        <button type="button" @click="selectedView = 'CustomerNewCase'" :class="['nav-link', {active: selectedView === 'CustomerNewCase'}]">
          <span class="icon-wrap bg-white rounded-md p-2 flex items-center justify-center">
            <FileText class="nav-icon" size="20" />
          </span>
          <span class="nav-text">New Case</span>
        </button>

       

        <button type="button" @click="selectedView = 'Documents'" :class="['nav-link', {active: selectedView === 'Documents'}]">
          <span class="icon-wrap bg-white rounded-md p-2 flex items-center justify-center">
            <File class="nav-icon" size="20" />
          </span>
          <span class="nav-text">Documents</span>
        </button>

        <button type="button" @click="selectedView = 'Schedule'" :class="['nav-link', {active: selectedView === 'Schedule'}]">
          <span class="icon-wrap bg-white rounded-md p-2 flex items-center justify-center">
            <Calendar class="nav-icon" size="20" />
          </span>
          <span class="nav-text">Schedule</span>
        </button>

        <button type="button" @click="selectedView = 'LegalResearch'" :class="['nav-link', {active: selectedView === 'LegalResearch'}]">
          <span class="icon-wrap bg-white rounded-md p-2 flex items-center justify-center">
            <Search class="nav-icon" size="20" />
          </span>
          <span class="nav-text">Legal Research</span>
        </button>

        <button type="button" @click="selectedView = 'Users'" :class="['nav-link', {active: selectedView === 'Users'}]">
          <span class="icon-wrap bg-white rounded-md p-2 flex items-center justify-center">
            <UsersIcon class="nav-icon" size="20" />
          </span>
          <span class="nav-text">Users</span>
        </button>

        <button type="button" @click="selectedView = 'Settings'" :class="['nav-link', {active: selectedView === 'Settings'}]">
          <span class="icon-wrap bg-white rounded-md p-2 flex items-center justify-center">
            <SettingsIcon class="nav-icon" size="20" />
          </span>
          <span class="nav-text">Settings</span>
        </button>

        <button type="button" @click="selectedView = 'Help'" :class="['nav-link', {active: selectedView === 'Help'}]">
          <span class="icon-wrap bg-white rounded-md p-2 flex items-center justify-center">
            <HelpCircle class="nav-icon" size="20" />
          </span>
          <span class="nav-text">Help</span>
        </button>
          <button type="button" @click="selectedView = 'AdminOverview'" :class="['nav-link', {active: selectedView === 'AdminOverview'}]">
            <span class="icon-wrap bg-white rounded-md p-2 flex items-center justify-center">
              <svg class="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="3" width="7" height="7"/>
                <rect x="14" y="3" width="7" height="7"/>
                <rect x="14" y="14" width="7" height="7"/>
                <rect x="3" y="14" width="7" height="7"/>
              </svg>
            </span>
            <span class="nav-text">Overview</span>
          </button>

          <button type="button" @click="selectedView = 'FinancialManagement'" :class="['nav-link', {active: selectedView === 'FinancialManagement'}]">
            <span class="icon-wrap bg-white rounded-md p-2 flex items-center justify-center">
              <svg class="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="12" y1="1" x2="12" y2="23"/>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
              </svg>
            </span>
            <span class="nav-text">Financial</span>
          </button>

          <button type="button" @click="selectedView = 'SystemLogs'" :class="['nav-link', {active: selectedView === 'SystemLogs'}]">
            <span class="icon-wrap bg-white rounded-md p-2 flex items-center justify-center">
              <svg class="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
                <polyline points="10 9 9 9 8 9"/>
              </svg>
            </span>
            <span class="nav-text">System Logs</span>
          </button>
           <button type="button" @click="selectedView = 'GuestAccess'" :class="['nav-link', {active: selectedView === 'GuestAccess'}]">
          <span class="icon-wrap bg-white rounded-md p-2 flex items-center justify-center">
            <House class="nav-icon" size="20" />
          </span>
          <span class="nav-text">Guest Access</span>
        </button>
      </nav>
        </div>

        <!-- Lawyer-only navigation -->
        <div v-if="isLawyer" class="border-t border-gray-200 my-2 pt-2">
          <p class="text-xs text-gray-500 font-semibold px-3 mb-2">LAWYER PANEL</p>

          <button type="button" @click="selectedView = 'LawyerOverview'" :class="['nav-link', {active: selectedView === 'LawyerOverview'}]">
            <span class="icon-wrap bg-white rounded-md p-2 flex items-center justify-center">
              <svg class="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
            </span>
            <span class="nav-text">My Dashboard</span>
          </button>

          <button type="button" @click="selectedView = 'LawyerCalendar'" :class="['nav-link', {active: selectedView === 'LawyerCalendar'}]">
            <span class="icon-wrap bg-white rounded-md p-2 flex items-center justify-center">
              <svg class="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
            </span>
            <span class="nav-text">Calendar</span>
          </button>

          <button type="button" @click="selectedView = 'LawyerTasks'" :class="['nav-link', {active: selectedView === 'LawyerTasks'}]">
            <span class="icon-wrap bg-white rounded-md p-2 flex items-center justify-center">
              <svg class="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
              </svg>
            </span>
            <span class="nav-text">My Tasks</span>
          </button>

          <button type="button" @click="selectedView = 'LawyerMessages'" :class="['nav-link', {active: selectedView === 'LawyerMessages'}]">
            <span class="icon-wrap bg-white rounded-md p-2 flex items-center justify-center">
              <svg class="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/>
              </svg>
            </span>
            <span class="nav-text">Messages</span>
          </button>

          <button type="button" @click="selectedView = 'LawyerReports'" :class="['nav-link', {active: selectedView === 'LawyerReports'}]">
            <span class="icon-wrap bg-white rounded-md p-2 flex items-center justify-center">
              <svg class="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
            </span>
            <span class="nav-text">Reports</span>
          </button>
        </div>

        <!-- Customer-only navigation -->
        <div v-if="isCustomer" class="my-2 pt-2 text-center">
          <p class="text-xs text-gray-500 font-semibold px-3 mb-2">CLIENT PANEL</p>
          
             <button type="button" @click="selectedView = 'CustomerOverview'" :class="['nav-link', {active: selectedView === 'CustomerOverview'}]">
            <span class="icon-wrap bg-white rounded-md p-2 flex items-center justify-center">
              <svg class="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
              </svg>
            </span>
            <span class="nav-text">My Dashboard</span>
          </button>

           <button type="button" @click="selectedView = 'MyCases'" :class="['nav-link', {active: selectedView === 'MyCases'}]">
          <span class="icon-wrap bg-white rounded-md p-2 flex items-center justify-center">
            <FileText class="nav-icon" size="20" />
          </span>
          <span class="nav-text">My Cases</span>
        </button>
         
         <button type="button" @click="selectedView = 'CustomerNewCase'" :class="['nav-link', {active: selectedView === 'CustomerNewCase'}]">
          <span class="icon-wrap bg-white rounded-md p-2 flex items-center justify-center">
            <FileText class="nav-icon" size="20" />
          </span>
          <span class="nav-text">Cases</span>
        </button>

         <button type="button" @click="selectedView = 'CustomerMessages'" :class="['nav-link', {active: selectedView === 'CustomerMessages'}]">
            <span class="icon-wrap bg-white rounded-md p-2 flex items-center justify-center">
              <svg class="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/>
              </svg>
            </span>
            <span class="nav-text">Messages</span>
          </button>

          <button type="button" @click="selectedView = 'CustomerDocuments'" :class="['nav-link', {active: selectedView === 'CustomerDocuments'}]">
            <span class="icon-wrap bg-white rounded-md p-2 flex items-center justify-center">
              <svg class="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
            </span>
            <span class="nav-text">Documents</span>
          </button>

          <button type="button" @click="selectedView = 'CustomerInvoices'" :class="['nav-link', {active: selectedView === 'CustomerInvoices'}]">
            <span class="icon-wrap bg-white rounded-md p-2 flex items-center justify-center">
              <svg class="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z"/>
              </svg>
            </span>
            <span class="nav-text">Invoices</span>
          </button>
        </div>
      
    </aside>

     <!----------------Ai Assistant------------------------------->
<div class="w-50 border-gray-400 border-r flex flex-col bg-gray-50">
  <div class="bg-white px-4 py-3 border-b border-gray-400 h-23">
    <h2 class="text-lg font-semibold text-gray-800 flex items-center gap-2">
      <svg class="w-5 h-5 text-[#003aca]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
      AI Assistant
    </h2>
  </div>

  <div>
    <!-----------------------------------Content---------------------------->
    <div class="p-4">
      <LegalResearchAssistant />
    </div>
  </div>
</div>
<!------------- MAin---------------->
    <main class="flex-1 p-6 overflow-x-hidden ">
      <div class="max-w-7xl mx-auto">
        <div v-if="selectedView === 'Dashboard'">
          <div class="flex items-center justify-between mb-6">
          <div>
            <h2 class="text-3xl font-bold text-gray-800 flex items-center gap-3">
              <FileText class="w-7 h-7 text-[#003aca]" />
              Cases Management
            </h2>
            <p class="text-gray-500 mt-1">Manage and track all your legal cases</p>
          </div>
          <div class="flex items-center gap-3">
            <button class="px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 text-sm">AI Analysis</button>
            <button 
              @click="isCustomer ? selectedView = 'CustomerNewCase' : selectedView = 'Cases'" 
              class="px-4 py-2 bg-[#003aca] text-white rounded-md hover:bg-[#0031a0] text-sm font-medium"
            >
              New Case
            </button>
          </div>
        </div>

        <!-- Stats row -->
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
          <div class="p-4 bg-white rounded-lg border border-gray-200">
            <div class="flex items-center justify-between">
              <p class="text-xs text-gray-600 font-medium">Total Cases</p>
              <FileText class="w-4 h-4 text-blue-600" />
            </div>
            <p class="text-2xl font-bold text-gray-900 mt-2">{{ stats.totalCases }}</p>
          </div>
          <div class="p-4 bg-white rounded-lg border border-gray-200">
            <div class="flex items-center justify-between">
              <p class="text-xs text-gray-600 font-medium">Open</p>
              <Clock class="w-4 h-4 text-orange-600" />
            </div>
            <p class="text-2xl font-bold text-gray-900 mt-2">{{ casesStats.open }}</p>
          </div>
          <div class="p-4 bg-white rounded-lg border border-gray-200">
            <div class="flex items-center justify-between">
              <p class="text-xs text-gray-600 font-medium">In Progress</p>
              <AlertTriangle class="w-4 h-4 text-yellow-600" />
            </div>
            <p class="text-2xl font-bold text-gray-900 mt-2">{{ casesStats.in_progress }}</p>
          </div>
          <div class="p-4 bg-white rounded-lg border border-gray-200">
            <div class="flex items-center justify-between">
              <p class="text-xs text-gray-600 font-medium">Closed</p>
              <CheckSquare class="w-4 h-4 text-green-600" />
            </div>
            <p class="text-2xl font-bold text-gray-900 mt-2">{{ casesStats.closed }}</p>
          </div>
          <div class="p-4 bg-white rounded-lg border border-gray-200">
            <div class="flex items-center justify-between">
              <p class="text-xs text-gray-600 font-medium">Archived</p>
              <File class="w-4 h-4 text-purple-600" />
            </div>
            <p class="text-2xl font-bold text-gray-900 mt-2">{{ casesStats.archived }}</p>
          </div>
          <div class="p-4 bg-white rounded-lg border border-gray-200">
            <div class="flex items-center justify-between">
              <p class="text-xs text-gray-600 font-medium">On Hold</p>
              <Clock class="w-4 h-4 text-gray-600" />
            </div>
            <p class="text-2xl font-bold text-gray-900 mt-2">{{ casesStats.on_hold }}</p>
          </div>
        </div>

        <!-- Tabs and Filters -->
        <div class="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div class="flex items-center justify-between mb-4 border-b border-gray-200 pb-3">
            <div class="flex items-center gap-6">
              <button
                @click="activeTab = 'active'"
                :class="['text-sm font-medium pb-2 border-b-2 transition', activeTab === 'active' ? 'text-blue-600 border-blue-600' : 'text-gray-500 border-transparent hover:text-gray-700']"
              >
                Active Cases
                <span class="ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs">{{ activeCasesCount }}</span>
              </button>
              <button
                @click="activeTab = 'archived'"
                :class="['text-sm font-medium pb-2 border-b-2 transition', activeTab === 'archived' ? 'text-blue-600 border-blue-600' : 'text-gray-500 border-transparent hover:text-gray-700']"
              >
                Archived
                <span class="ml-2 px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs">{{ casesStats.archived }}</span>
              </button>
            </div>
          </div>

          <!-- Search and Filters -->
          <div class="flex items-center gap-3 mb-6">
            <div class="flex-1 relative">
              <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search cases by title, number, or description..."
                class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div class="relative">
              <select v-model="filterStatus" class="appearance-none px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8 bg-white">
                <option value="">All Status</option>
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="closed">Closed</option>
                <option value="on_hold">On Hold</option>
              </select>
              <ChevronDown class="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            <div class="relative">
              <select v-model="filterPriority" class="appearance-none px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8 bg-white">
                <option value="">All Priority</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
              <ChevronDown class="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            <div class="relative">
              <select v-model="filterType" class="appearance-none px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8 bg-white">
                <option value="">All Types</option>
                <option value="civil">Civil</option>
                <option value="criminal">Criminal</option>
                <option value="family">Family</option>
                <option value="corporate">Corporate</option>
                <option value="immigration">Immigration</option>
                <option value="personal_injury">Personal Injury</option>
                <option value="other">Other</option>
              </select>
              <ChevronDown class="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <!-- Case Cards Grid -->
          <div v-if="isLoading" class="text-center py-12">
            <div class="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p class="text-gray-500 mt-3">Loading cases...</p>
          </div>
          <div v-else-if="filteredCases.length === 0" class="text-center py-12">
            <FileText class="w-16 h-16 text-gray-300 mx-auto mb-3" />
            <p class="text-gray-500">No cases found</p>
          </div>
          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div
              v-for="caseItem in filteredCases"
              :key="caseItem.id"
              class="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
            >
              <div class="flex items-start justify-between mb-2">
                <h3 class="font-semibold text-gray-900 text-base">{{ caseItem.title }}</h3>
                <button class="text-gray-400 hover:text-gray-600">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                </button>
              </div>
              <p class="text-xs text-gray-500 mb-2">Case #{{ caseItem.case_number }}</p>
              <p class="text-sm text-gray-600 mb-3 line-clamp-2">{{ caseItem.description || 'No description available' }}</p>

              <div class="flex items-center gap-2 mb-3">
                <span :class="['px-2 py-1 rounded text-xs font-medium', getStatusBadgeColor(caseItem.status)]">
                  {{ caseItem.status }}
                </span>
                <span :class="['px-2 py-1 rounded text-xs font-medium', getPriorityBadgeColor(caseItem.priority)]">
                  {{ caseItem.priority }} priority
                </span>
                <span class="px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700">
                  {{ caseItem.case_type || 'civil' }}
                </span>
              </div>

              <div class="flex items-center justify-between text-xs text-gray-500 mb-3">
                <span class="flex items-center gap-1">
                  <Clock class="w-3 h-3" />
                  Updated: {{ formatDate(caseItem.updated_date || caseItem.created_date) }}
                </span>
              </div>

              <button class="w-full py-2 border border-blue-600 text-blue-600 rounded-md text-sm font-medium hover:bg-blue-50 transition">
                View Case
              </button>
            </div>
          </div>
        </div>
      </div>

      <Cases v-else-if="selectedView === 'Cases'" />

      <MyCases v-else-if="selectedView === 'MyCases' && !isCustomer" />

      <CustomerMyCases 
        v-else-if="selectedView === 'MyCases' && isCustomer"
        :current-user="user"
        @newCase="selectedView = 'CustomerNewCase'"
        @viewCase="handleViewCustomerCase"
        @contactLawyer="handleContactLawyer"
      />

      <Documents v-else-if="selectedView === 'Documents'" />

      <Schedule v-else-if="selectedView === 'Schedule'" />

      <LegalResearch v-else-if="selectedView === 'LegalResearch'" />

      <Users v-else-if="selectedView === 'Users'" />

      <Settings v-else-if="selectedView === 'Settings'" />

      <Help v-else-if="selectedView === 'Help'" />

      <GuestAccess v-else-if="selectedView === 'GuestAccess'"  />

      <!-- Admin Views -->
      <AdminOverview v-else-if="selectedView === 'AdminOverview' && isAdmin" />

      <FinancialManagement v-else-if="selectedView === 'FinancialManagement' && isAdmin" />

      <SystemActivityLogs v-else-if="selectedView === 'SystemLogs' && isAdmin" />

      <!-- Lawyer Views -->
      <LawyerOverview v-else-if="selectedView === 'LawyerOverview' && isLawyer" />

      <LawyerCalendar v-else-if="selectedView === 'LawyerCalendar' && isLawyer" />

      <LawyerTasks v-else-if="selectedView === 'LawyerTasks' && isLawyer" />

      <LawyerMessages v-else-if="selectedView === 'LawyerMessages' && isLawyer" />

      <LawyerReports v-else-if="selectedView === 'LawyerReports' && isLawyer" />

      <!-- Customer Views -->
      <CustomerOverview v-else-if="selectedView === 'CustomerOverview' && isCustomer" />

      <CustomerCaseDetails 
        v-else-if="selectedView === 'CustomerCaseDetails' && isCustomer" 
        :selected-case="selectedCase"
        :current-user="user"
        @back="selectedView = 'MyCases'"
      />

      <CustomerMessages v-else-if="selectedView === 'CustomerMessages' && isCustomer" />

      <CustomerDocuments v-else-if="selectedView === 'CustomerDocuments' && isCustomer" />

      <CustomerInvoices v-else-if="selectedView === 'CustomerInvoices' && isCustomer" />

      <!-- Customer New Case Form -->
      <CustomerNewCaseForm v-else-if="selectedView === 'CustomerNewCase' && isCustomer" :current-user="user" :onSubmit="handleCustomerNewCase" :onCancel="() => { selectedView = 'Dashboard' }" />
      </div>
    </main>

 <!---------------------------------------Comment------------------------------------------>
 <div class="w-50 border-gray-400 border-l flex flex-col">
  <div class="bg-white h-23 text-gray-600 border-b border-gray-400 px-4 py-3 flex justify-center items-center gap-2.5">
  <MessageCircle class="w-4 h-4 text-blue-600" />
    <h2 class="font-semibold">Comments</h2>
  </div>

  <div class="flex-1 min-h-0">
    <CommentsPannel :user="user" />
  </div>
 </div>
   

  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { Case, Comment, ActionItem } from '@/services/entities';
import { User } from '@/services/entities';
import { createPageUrl } from '@/utils';
import { useAuthStore } from '@/stores/auth';
import { FileText, MessageCircle, CheckSquare, Clock, AlertTriangle, TrendingUp, Calendar, Plus, Scale, House, Users as UsersIcon, Settings as SettingsIcon, HelpCircle, File, Search, UserIcon, ChevronDown } from 'lucide-vue-next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { format } from 'date-fns';
import Cases from './Cases.vue';
import CustomerNewCaseForm from '@/components/customer/CustomerNewCaseForm.vue'
import MyCases from './MyCases.vue';
import Documents from './Documents.vue';
import DocumentViewer from './DocumentViewer.vue';
import Schedule from './Schedule.vue';
import LegalResearch from './LegalResearch.vue';
import Users from './Users.vue';
import Settings from './Settings.vue';
import Help from './Help.vue';
import GuestAccess from './GuestAccess.vue';
import LegalResearchAssistant from '@/components/ai/LegalResearchAssistant.vue';
import CommentsPannel from '@/components/comments/CommentsPannel.vue';
import AdminOverview from '@/components/admin/AdminOverview.vue';
import FinancialManagement from '@/components/admin/FinancialManagement.vue';
import SystemActivityLogs from '@/components/admin/SystemActivityLogs.vue';
import LawyerOverview from '@/components/lawyer/LawyerOverview.vue';
import LawyerCalendar from '@/components/lawyer/LawyerCalendar.vue';
import LawyerTasks from '@/components/lawyer/LawyerTasks.vue';
import LawyerReports from '@/components/lawyer/LawyerReports.vue';
import LawyerMessages from '@/components/lawyer/LawyerMessages.vue';
import CustomerOverview from '@/components/customer/CustomerOverview.vue';
import CustomerMyCases from '@/components/customer/CustomerMyCases.vue';
import CustomerCaseDetails from '@/components/customer/CustomerCaseDetails.vue';
import CustomerMessages from '@/components/customer/CustomerMessages.vue';
import CustomerDocuments from '@/components/customer/CustomerDocuments.vue';
import CustomerInvoices from '@/components/customer/CustomerInvoices.vue';



// Auth store for development login
const authStore = useAuthStore();

// Check if user is admin, lawyer, or customer
const isAdmin = computed(() => user.value?.user_type === 'admin');
const isLawyer = computed(() => user.value?.user_type === 'lawyer');
const isCustomer = computed(() => user.value?.user_type === 'customer');

const user = ref(null);
const cases = ref([]);
const recentComments = ref([]);
const pendingActions = ref([]);
const conflictAlerts = ref([]);
const stats = ref({ totalCases: 0, activeCases: 0, completedActions: 0, pendingActions: 0 });
const isLoading = ref(true);

// Dashboard filters and state
const activeTab = ref('active');
const searchQuery = ref('');
const filterStatus = ref('');
const filterPriority = ref('');
const filterType = ref('');

const loadDashboardData = async () => {
  isLoading.value = true;
  try {
    const userData = await User.me();
    user.value = userData;

    // Default the selected view based on the authenticated user's role.
    // This ensures customers land on the customer dashboard after a browser refresh.
    if (!selectedView.value || selectedView.value === 'Dashboard') {
      if (userData.user_type === 'customer') selectedView.value = 'CustomerOverview';
      else if (userData.user_type === 'lawyer') selectedView.value = 'LawyerOverview';
      else if (userData.user_type === 'admin') selectedView.value = 'AdminOverview';
    }

    let userCases = [];
    if (userData.user_type === 'lawyer' || userData.user_type === 'admin') {
      userCases = await Case.filter(userData.user_type === 'admin' ? {} : { lawyer_id: userData.id }, '-updated_date', 10);
    } else if (userData.user_type === 'customer') {
      userCases = await Case.list('-updated_date', 10);
      userCases = userCases.filter(c => c.customer_ids?.includes(userData.id));
    }

    cases.value = userCases;

    const casesWithConflicts = userCases.filter(c => c.ai_conflict_assessment?.has_conflicts && c.ai_conflict_assessment?.conflict_level && c.ai_conflict_assessment.conflict_level !== 'low');
    conflictAlerts.value = casesWithConflicts;

    if (userCases.length > 0) {
      const caseIds = userCases.map(c => c.id);
      const commentsList = await Comment.list('-created_date', 5);
      recentComments.value = commentsList.filter(c => caseIds.includes(c.case_id));

      const actions = await ActionItem.filter({ status: 'pending' }, '-due_date', 10);
      pendingActions.value = actions.filter(a => caseIds.includes(a.case_id));

      const activeCases = userCases.filter(c => c.status === 'open' || c.status === 'in_progress').length;
      const totalActions = await ActionItem.list();
      const userActions = totalActions.filter(a => caseIds.includes(a.case_id));
      const completedActions = userActions.filter(a => a.status === 'completed').length;

      stats.value = {
        totalCases: userCases.length,
        activeCases,
        completedActions,
        pendingActions: pendingActions.value.length,
      };
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Failed to load dashboard data:', err);
  }
  isLoading.value = false;
};

onMounted(() => {
  // Auto-login for development if not authenticated
  if (!authStore.isAuthenticated) {
    console.log('Auto-logging in for development...');
    authStore.fakeLogin('admin');
  }
  loadDashboardData();
});

const getStatusColor = (status) => {
  switch (status) {
    case 'open': return 'bg-blue-100 text-blue-800';
    case 'in_progress': return 'bg-yellow-100 text-yellow-800';
    case 'closed': return 'bg-green-100 text-green-800';
    case 'on_hold': return 'bg-gray-100 text-gray-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getPriorityColor = (priority) => {
  switch (priority) {
    case 'urgent': return 'bg-red-100 text-red-800';
    case 'high': return 'bg-orange-100 text-orange-800';
    case 'medium': return 'bg-yellow-100 text-yellow-800';
    case 'low': return 'bg-green-100 text-green-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const formatDate = (d) => {
  try { return format(new Date(d), 'MMM d, yyyy'); } catch (e) { return ''; }
};

const productivityPercent = computed(() => {
  const completed = stats.value.completedActions || 0;
  const pending = stats.value.pendingActions || 0;
  const total = completed + pending;
  return total > 0 ? Math.round((completed / total) * 100) : 0;
});

// Cases stats breakdown
const casesStats = computed(() => {
  const allCases = cases.value || [];
  return {
    open: allCases.filter(c => c.status === 'open').length,
    in_progress: allCases.filter(c => c.status === 'in_progress').length,
    closed: allCases.filter(c => c.status === 'closed').length,
    on_hold: allCases.filter(c => c.status === 'on_hold').length,
    archived: allCases.filter(c => c.status === 'archived').length,
  };
});

// Filtered cases based on tab, search, and filters
const filteredCases = computed(() => {
  let filtered = cases.value || [];

  // Filter by tab
  if (activeTab.value === 'active') {
    filtered = filtered.filter(c => c.status !== 'archived');
  } else if (activeTab.value === 'archived') {
    filtered = filtered.filter(c => c.status === 'archived');
  }

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(c =>
      c.title?.toLowerCase().includes(query) ||
      c.case_number?.toLowerCase().includes(query) ||
      c.description?.toLowerCase().includes(query)
    );
  }

  // Status filter
  if (filterStatus.value) {
    filtered = filtered.filter(c => c.status === filterStatus.value);
  }

  // Priority filter
  if (filterPriority.value) {
    filtered = filtered.filter(c => c.priority === filterPriority.value);
  }

  // Type filter
  if (filterType.value) {
    filtered = filtered.filter(c => c.case_type === filterType.value);
  }

  return filtered;
});

// Active cases count
const activeCasesCount = computed(() => {
  return (cases.value || []).filter(c => c.status !== 'archived').length;
});

// Badge color helpers
const getStatusBadgeColor = (status) => {
  switch (status) {
    case 'open': return 'bg-blue-100 text-blue-700 border border-blue-200';
    case 'in_progress': return 'bg-yellow-100 text-yellow-700 border border-yellow-200';
    case 'closed': return 'bg-green-100 text-green-700 border border-green-200';
    case 'on_hold': return 'bg-gray-100 text-gray-700 border border-gray-200';
    case 'archived': return 'bg-purple-100 text-purple-700 border border-purple-200';
    default: return 'bg-gray-100 text-gray-700 border border-gray-200';
  }
};

const getPriorityBadgeColor = (priority) => {
  switch (priority) {
    case 'urgent': return 'bg-red-100 text-red-700 border border-red-200';
    case 'high': return 'bg-orange-100 text-orange-700 border border-orange-200';
    case 'medium': return 'bg-yellow-100 text-yellow-700 border border-yellow-200';
    case 'low': return 'bg-green-100 text-green-700 border border-green-200';
    default: return 'bg-gray-100 text-gray-700 border border-gray-200';
  }
};

// Local view selection for aside -> main content behavior
const selectedView = ref('Dashboard');
const selectedCase = ref(null);

// Handler for viewing customer case details
const handleViewCustomerCase = (caseItem) => {
  selectedCase.value = caseItem;
  selectedView.value = 'CustomerCaseDetails';
};

// Handler for contacting lawyer
const handleContactLawyer = (caseItem) => {
  if (caseItem.lawyerInfo?.email) {
    // Open email client or messaging system
    const subject = encodeURIComponent(`Regarding Case: ${caseItem.title} (#${caseItem.case_number})`);
    const body = encodeURIComponent(`Dear ${caseItem.lawyerInfo.name},\n\nI would like to discuss my case.\n\nCase Details:\nTitle: ${caseItem.title}\nCase Number: ${caseItem.case_number}\n\nThank you.`);
    window.location.href = `mailto:${caseItem.lawyerInfo.email}?subject=${subject}&body=${body}`;
  } else {
    alert('Lawyer contact information not available');
  }
};

// Handler for customer new-case submissions
const handleCustomerNewCase = async (caseData) => {
  try {
    await Case.create(caseData);
    // Reload dashboard data to include the newly created case
    await loadDashboardData();
    selectedView.value = 'Dashboard'; // Show dashboard so customer can see their new case
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Failed to create customer case:', err);
    alert('Failed to create case. Please try again.');
  }
};

// `createPageUrl` is imported above and available to the template

</script>

<style scoped>
.nav-link{
  display:flex;
  align-items:center;
  gap:0.75rem;
  padding:0.45rem 1.6rem;
  border-radius:0.5rem;
  color: #374151; /* gray-700 */
  text-decoration:none;
}
.nav-link .nav-icon{ width:20px; height:20px; color:#4b5563; }
.icon-wrap{ width:36px; height:36px; display:inline-flex; align-items:center; justify-content:center; }
.nav-link:hover{ background-color:#f8fafc; color:#0ea5e9; width:100%;}
.nav-link:active{ background-color:#f8fafc; color:#0ea5e9; width:100%;}
.nav-link.active{ background-color:#eef2ff; width:100%;}
.nav-link.active .nav-icon{ color:#003aca; width:100%;}
.router-link-active{ background-color:#eef2ff; color:#075985; }
.nav-text{ font-size:0.95rem; }
main{ background-color: #f8fafc; min-height:100vh; }

/* Line clamp utility for truncating text */
.line-clamp-2 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
}
</style>
