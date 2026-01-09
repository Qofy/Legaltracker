<template>
  <div>
    <div class="fixed top-3 right-3 z-50 flex flex-col items-end gap-2">
      <button
        @click="toggleTheme"
        class="p-2 rounded-md bg-white border shadow-sm hover:bg-gray-50"
        title="Toggle theme"
      >
        <component :is="iconComponent" class="w-5 h-5 text-gray-700" />
      </button>

      <!-- persistent overlay icons (always visible) -->
      <div class="fixed top-35 right-4 flex flex-col items-end space-y-2 z-50">
        <button
          @click="navigateTo('/cases')"
          class="flex items-center justify-center w-10 h-10 rounded-md bg-sky-500 dark:bg-sky-500 shadow-sm hover:shadow-md transition text-white"
          title="Cases"
        >
          <Briefcase class="w-5 h-5 text-white" />
        </button>
        <button
          @click="navigateTo('/schedule')"
          class="flex items-center justify-center w-10 h-10 rounded-md bg-purple-500 dark:bg-purple-500 shadow-sm hover:shadow-md transition text-white"
          title="Schedule"
        >
          <MapPin class="w-5 h-5 text-white" />
        </button>
        <div class="relative group">
          <button
            @click="showAllPinnedTasks"
            class="flex items-center justify-center w-10 h-10 rounded-md bg-blue-500 dark:bg-blue-500 shadow-sm hover:shadow-md transition text-white"
            title="Current Working Job - View All Pinned Tasks"
          >
            <Pin class="w-5 h-5 text-white" />
          </button>

          <!-- Smart Tooltip for Pinned Jobs -->
          <div
            class="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-xs rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-50 w-72 shadow-xl pointer-events-none group-hover:pointer-events-auto"
          >
            <div v-if="pinnedJobsInfo.length > 0">
              <div class="font-semibold text-blue-300 mb-2 flex items-center gap-2">
                <Pin class="w-3 h-3" />
                Current Pinned Tasks ({{ pinnedJobsInfo.length }})
              </div>
              <div class="space-y-2 max-h-32 overflow-y-auto">
                <div
                  v-for="job in pinnedJobsInfo.slice(0, 3)"
                  :key="job.id"
                  @click="navigateToCaseDetail(job.id)"
                  class="border-l-2 border-blue-400 pl-2 cursor-pointer hover:bg-gray-800 rounded p-1 transition-colors duration-200"
                >
                  <div class="font-medium text-white hover:text-blue-300">
                    {{ job.title }}
                  </div>
                  <div class="text-gray-300 text-xs">{{ job.description }}</div>
                  <div class="text-blue-300 text-xs mt-1 flex items-center gap-1">
                    {{ job.status }} • {{ job.priority }}
                    <svg
                      class="w-3 h-3 ml-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-1M14 6L8 12l6 6"
                      ></path>
                    </svg>
                  </div>
                </div>
                <div
                  v-if="pinnedJobsInfo.length > 3"
                  class="text-gray-400 text-xs text-center pt-1"
                >
                  <button
                    @click="showAllPinnedTasks"
                    class="hover:text-white cursor-pointer underline"
                  >
                    +{{ pinnedJobsInfo.length - 3 }} more tasks... (click to view all)
                  </button>
                </div>
              </div>
            </div>
            <div v-else class="text-center text-gray-400">
              <Pin class="w-4 h-4 mx-auto mb-1 opacity-50" />
              <div class="text-xs">No active pinned tasks</div>
              <div class="text-xs text-gray-500">Pin cases from your dashboard</div>
            </div>

            <!-- Tooltip arrow -->
            <div
              class="absolute left-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-l-4 border-transparent border-l-gray-900"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <router-view />

    <!-- Bug Report Modal -->
    <div
      v-if="showBugReport"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white dark:bg-slate-800 rounded-lg p-6 w-96 max-w-full mx-4">
        <h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          Report a Bug
        </h3>
        <form @submit.prevent="submitBugReport">
          <div class="mb-4">
            <label class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"
              >Bug Title</label
            >
            <input
              v-model="bugReport.title"
              type="text"
              class="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white"
              required
            />
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"
              >Description</label
            >
            <textarea
              v-model="bugReport.description"
              rows="4"
              class="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white"
              required
            ></textarea>
          </div>
          <div class="flex justify-end space-x-3">
            <button
              type="button"
              @click="showBugReport = false"
              class="px-4 py-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Submit Bug Report
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Developer Tools Modal -->
    <div
      v-if="showDevTools"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white dark:bg-slate-800 rounded-lg p-6 w-96 max-w-full mx-4">
        <h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          Developer Tools
        </h3>
        <div class="space-y-3">
          <button
            @click="clearLocalStorage"
            class="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Clear Local Storage
          </button>
          <button
            @click="refreshCache"
            class="w-full p-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
          >
            Refresh Cache
          </button>
          <button
            @click="exportLogs"
            class="w-full p-2 bg-purple-500 text-white rounded hover:bg-purple-600"
          >
            Export Logs
          </button>
          <button
            @click="toggleDebugMode"
            class="w-full p-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            {{ debugMode ? "Disable" : "Enable" }} Debug Mode
          </button>
        </div>
        <div class="flex justify-end mt-4">
          <button
            @click="showDevTools = false"
            class="px-4 py-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>

    <!-- Bottom-right tools (Bug report & Hammer tools) -->
    <div class="fixed bottom-4 right-4 flex flex-col items-end space-y-2 z-50">
      <button
        @click="showBugReport = true"
        class="flex items-center justify-center w-10 h-10 rounded-md bg-red-500 dark:bg-red-500 shadow-sm hover:shadow-md transition"
        title="Report a bug"
        aria-label="Report a bug"
      >
        <Bug class="w-5 h-5 text-white" />
      </button>
      <button
        @click="showDevTools = true"
        class="flex items-center justify-center w-10 h-10 rounded-md bg-green-500 dark:bg-green-500 shadow-sm hover:shadow-md transition"
        title="Developer tools"
        aria-label="Developer tools"
      >
        <Hammer class="w-5 h-5 text-white" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed, ref } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "./composables/useAuth";
import { useTheme } from "@/stores/useTheme";
import { Sun, Moon, Briefcase, MapPin, Bug, Hammer, Pin } from "lucide-vue-next";

const { loadUser, isAuthenticated } = useAuth();
const themeStore = useTheme();
const router = useRouter();

// Modal states
const showBugReport = ref(false);
const showDevTools = ref(false);
const debugMode = ref(localStorage.getItem("debugMode") === "true");

// Pinned jobs data
const pinnedJobs = ref(new Set());
const pinnedTasks = ref(new Map());
const cases = ref([]);

// Bug report form
const bugReport = ref({
  title: "",
  description: "",
});

const iconComponent = computed(() => (themeStore.theme === "dark" ? Sun : Moon));
const toggleTheme = () => themeStore.toggleTheme();

// Computed property for pinned jobs information
const pinnedJobsInfo = computed(() => {
  const pinnedCases = [];

  console.log(
    "Computing pinned jobs - Cases:",
    cases.value.length,
    "Pinned IDs:",
    Array.from(pinnedJobs.value)
  );

  // Get pinned cases from the cases array
  cases.value.forEach((caseItem) => {
    const caseIdStr = String(caseItem.id);
    const isPinned =
      pinnedJobs.value.has(caseItem.id) ||
      pinnedJobs.value.has(caseIdStr) ||
      Array.from(pinnedJobs.value).some((pinnedId) => String(pinnedId) === caseIdStr);

    if (isPinned) {
      const taskDescription =
        pinnedTasks.value.get(caseItem.id) ||
        pinnedTasks.value.get(caseIdStr) ||
        getSmartTaskDescription(caseItem);

      pinnedCases.push({
        id: caseItem.id,
        title: `Case #${caseItem.case_number}`,
        description: taskDescription,
        status: getStatusLabel(caseItem.status),
        priority: getPriorityLabel(caseItem.priority || "medium"),
        client: caseItem.client_name,
      });
    }
  });

  // If no matching cases found but we have pinned IDs, create basic entries
  if (pinnedCases.length === 0 && pinnedJobs.value.size > 0) {
    Array.from(pinnedJobs.value).forEach((pinnedId, index) => {
      const taskDescription =
        pinnedTasks.value.get(pinnedId) ||
        pinnedTasks.value.get(String(pinnedId)) ||
        `Pinned task ${pinnedId}`;

      pinnedCases.push({
        id: pinnedId,
        title: `Case #${pinnedId}`,
        description: taskDescription,
        status: "Active",
        priority: "Medium",
        client: `Client ${index + 1}`,
      });
    });
  }

  console.log("Final pinned cases:", pinnedCases);

  return pinnedCases.sort((a, b) => {
    // Sort by priority: high > medium > low
    const priorityOrder = { High: 3, Medium: 2, Low: 1 };
    return (priorityOrder[b.priority] || 2) - (priorityOrder[a.priority] || 2);
  });
});

// Helper functions
const getStatusLabel = (status) => {
  const statusMap = {
    active: "Active",
    pending: "Pending",
    on_hold: "On Hold",
    closed: "Closed",
  };
  return statusMap[status] || status;
};

const getPriorityLabel = (priority) => {
  const priorityMap = {
    high: "High",
    medium: "Medium",
    low: "Low",
  };
  return priorityMap[priority] || "Medium";
};

const getSmartTaskDescription = (caseItem) => {
  const status = caseItem.status;
  const caseType = caseItem.case_type || "Legal Matter";

  if (status === "active") {
    return `Working on ${caseType.toLowerCase()} case for ${caseItem.client_name}`;
  } else if (status === "pending") {
    return `Pending review for ${caseType.toLowerCase()} case`;
  } else if (status === "on_hold") {
    return `${caseType} case on hold - awaiting client response`;
  } else {
    return `Monitoring completed ${caseType.toLowerCase()} case`;
  }
};

// Load pinned jobs from localStorage
const loadPinnedJobs = () => {
  try {
    const savedPinnedCases = localStorage.getItem("lawyer_pinned_cases");
    const savedPinnedTasks = localStorage.getItem("lawyer_pinned_tasks");

    if (savedPinnedCases) {
      const pinnedArray = JSON.parse(savedPinnedCases);
      // Handle both arrays and sets, convert IDs to both string and number format
      const pinnedSet = new Set();
      pinnedArray.forEach((id) => {
        pinnedSet.add(id);
        pinnedSet.add(String(id));
        pinnedSet.add(Number(id));
      });
      pinnedJobs.value = pinnedSet;
    }

    if (savedPinnedTasks) {
      const tasksObject = JSON.parse(savedPinnedTasks);
      const tasksMap = new Map();
      // Handle both string and number keys
      Object.entries(tasksObject).forEach(([key, value]) => {
        tasksMap.set(key, value);
        tasksMap.set(String(key), value);
        tasksMap.set(Number(key), value);
      });
      pinnedTasks.value = tasksMap;
    }

    console.log(
      "Loaded pinned data - Cases:",
      Array.from(pinnedJobs.value),
      "Tasks:",
      Object.fromEntries(pinnedTasks.value)
    );
  } catch (error) {
    console.error("Error loading pinned jobs:", error);
  }
};

// Load sample cases data (you can replace this with actual API call)
const loadCases = () => {
  try {
    // Try multiple possible localStorage keys for cases
    let savedCases =
      localStorage.getItem("legaltracker_cases") ||
      localStorage.getItem("cases") ||
      localStorage.getItem("lawyer_cases");

    if (savedCases) {
      cases.value = JSON.parse(savedCases);
    } else {
      // If no cases found, create sample data for pinned cases
      createSampleCasesFromPinned();
    }

    console.log(
      "Loaded cases:",
      cases.value.length,
      "Pinned jobs:",
      Array.from(pinnedJobs.value)
    );
  } catch (error) {
    console.error("Error loading cases:", error);
  }
};

// Create sample case data for pinned cases if no cases data exists
const createSampleCasesFromPinned = () => {
  const pinnedCaseIds = Array.from(pinnedJobs.value);

  if (pinnedCaseIds.length > 0) {
    cases.value = pinnedCaseIds.map((caseId, index) => ({
      id: caseId,
      case_number: `${caseId}`,
      case_type: "Legal Matter",
      status: "active",
      priority: "medium",
      client_name: `Client ${index + 1}`,
      title: `Case #${caseId}`,
      description: `Legal case ${caseId}`,
    }));
  }
};

// Navigation function
const navigateTo = (path) => {
  router.push(path);
};

// Navigate to case detail page
const navigateToCaseDetail = (caseId) => {
  // Close the tooltip by removing hover state
  document.activeElement?.blur();

  // Navigate to case details page using correct route
  router.push(`/cases/${caseId}`);
};

// Show all pinned tasks (navigate to dashboard or my-cases)
const showAllPinnedTasks = () => {
  // Close the tooltip
  document.activeElement?.blur();

  // Check if there are pinned tasks
  if (pinnedJobs.value.size > 0) {
    // If there's only one pinned task, go directly to it
    if (pinnedJobs.value.size === 1) {
      const singleCaseId = Array.from(pinnedJobs.value)[0];
      router.push(`/cases/${singleCaseId}`);
    } else {
      // Multiple pinned tasks - go to dashboard where lawyers can see their overview
      router.push("/dashboard");
    }
  } else {
    // If no pinned tasks, go to dashboard
    router.push("/dashboard");
  }
};

// Bug report submission
const submitBugReport = () => {
  console.log("Bug Report Submitted:", bugReport.value);
  // Here you would typically send the bug report to your backend
  alert(`Bug report "${bugReport.value.title}" submitted successfully!`);
  bugReport.value = { title: "", description: "" };
  showBugReport.value = false;
};

// Developer tools functions
const clearLocalStorage = () => {
  localStorage.clear();
  alert("Local storage cleared!");
};

const refreshCache = () => {
  if ("caches" in window) {
    caches.keys().then((names) => {
      names.forEach((name) => caches.delete(name));
    });
  }
  alert("Cache refreshed!");
};

const exportLogs = () => {
  const logs = JSON.stringify(
    {
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      localStorage: { ...localStorage },
    },
    null,
    2
  );

  const blob = new Blob([logs], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `app-logs-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

const toggleDebugMode = () => {
  debugMode.value = !debugMode.value;
  localStorage.setItem("debugMode", debugMode.value.toString());
  if (debugMode.value) {
    console.log("Debug mode enabled");
  } else {
    console.log("Debug mode disabled");
  }
};

onMounted(async () => {
  if (isAuthenticated.value) {
    await loadUser();
  }

  // Load pinned jobs and cases data
  loadPinnedJobs();
  loadCases();

  // Refresh data periodically to keep tooltip current
  setInterval(() => {
    loadPinnedJobs();
    loadCases();
  }, 30000); // Refresh every 30 seconds
});
</script>
