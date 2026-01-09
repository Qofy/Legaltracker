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
        <button
          @click="navigateTo('/schedule')"
          class="flex items-center justify-center w-10 h-10 rounded-md bg-blue-500 dark:bg-blue-500 shadow-sm hover:shadow-md transition text-white"
          title="Current Working Job"
        >
          <Pin class="w-5 h-5 text-white" />
        </button>
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

// Bug report form
const bugReport = ref({
  title: "",
  description: "",
});

const iconComponent = computed(() => (themeStore.theme === "dark" ? Sun : Moon));
const toggleTheme = () => themeStore.toggleTheme();

// Navigation function
const navigateTo = (path) => {
  router.push(path);
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
});
</script>
