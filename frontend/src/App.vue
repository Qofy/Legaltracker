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
        <div class="fixed top-4 right-4 flex flex-col items-end space-y-2 z-50">
          <button
            class="flex items-center justify-center w-10 h-10 rounded-md bg-white/90 dark:bg-slate-800/90 shadow-sm hover:shadow-md transition"
            title="Cases"
          >
            <Briefcase class="w-5 h-5 text-slate-700 dark:text-slate-200" />
          </button>
          <button
            class="flex items-center justify-center w-10 h-10 rounded-md bg-white/90 dark:bg-slate-800/90 shadow-sm hover:shadow-md transition"
            title="Locations"
          >
            <MapPin class="w-5 h-5 text-slate-700 dark:text-slate-200" />
          </button>
        </div>
    </div>

    <router-view />
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useAuth } from './composables/useAuth'
import { useTheme } from '@/stores/useTheme'
import { Sun, Moon, Briefcase, MapPin } from 'lucide-vue-next'

const { loadUser, isAuthenticated } = useAuth()
const themeStore = useTheme()

const iconComponent = computed(() => (themeStore.theme === 'dark' ? Sun : Moon))
const toggleTheme = () => themeStore.toggleTheme()

onMounted(async () => {
  if (isAuthenticated.value) {
    await loadUser()
  }
})
</script>
