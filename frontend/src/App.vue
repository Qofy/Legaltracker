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
      <div class="fixed top-29 right-4 flex flex-col items-end space-y-2 z-50">
        <button
          class="flex items-center justify-center w-10 h-10 rounded-md bg-sky-500 dark:bg-sky-400 shadow-sm hover:shadow-md transition text-white"
          title="Cases"
        >
          <Briefcase class="w-5 h-5 text-white" />
        </button>
        <button
          class="flex items-center justify-center w-10 h-10 rounded-md bg-purple-500 dark:bg-purple-400 shadow-sm hover:shadow-md transition text-white"
          title="Locations"
        >
          <MapPin class="w-5 h-5 text-white" />
        </button>
      </div>
    </div>

    <router-view />

    <!-- Bottom-right tools (Bug report & Hammer tools) -->
    <div class="fixed bottom-4 right-4 flex flex-col items-end space-y-2 z-50">
      <button
        class="flex items-center justify-center w-10 h-10 rounded-md bg-white/90 dark:bg-[#e7000b] shadow-sm hover:shadow-md transition"
        title="Report a bug"
        aria-label="Report a bug"
      >
        <Bug class="w-5 h-5 text-white" />
      </button>
      <button
        class="flex items-center justify-center w-10 h-10 rounded-md bg-white/90 dark:bg-[#00a63e] shadow-sm hover:shadow-md transition"
        title="Developer tools"
        aria-label="Developer tools"
      >
        <Hammer class="w-5 h-5 text-slate-700 dark:text-slate-200" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed } from "vue";
import { useAuth } from "./composables/useAuth";
import { useTheme } from "@/stores/useTheme";
import { Sun, Moon, Briefcase, MapPin, Bug, Hammer } from "lucide-vue-next";

const { loadUser, isAuthenticated } = useAuth();
const themeStore = useTheme();

const iconComponent = computed(() => (themeStore.theme === "dark" ? Sun : Moon));
const toggleTheme = () => themeStore.toggleTheme();

onMounted(async () => {
  if (isAuthenticated.value) {
    await loadUser();
  }
});
</script>
