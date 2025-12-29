<template>
  <div>
    <!-- Floating Page Navigator Button -->
    <button
      @click="showNavigator = true"
      class="fixed top-4 right-4 h-12 w-12 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg z-50 flex items-center justify-center transition-colors"
      title="Page Navigator"
    >
      <Map class="w-5 h-5" />
    </button>

    <!-- Page Navigator Dialog -->
    <Teleport to="body">
      <div
        v-if="showNavigator"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
        @click.self="showNavigator = false"
      >
        <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto m-4">
          <div class="border-b border-gray-200 p-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-2">
                <Map class="w-5 h-5 text-indigo-600" />
                <h2 class="text-lg font-semibold">Page Navigator</h2>
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  {{ currentUserType }} view
                </span>
              </div>
              <button
                @click="showNavigator = false"
                class="text-gray-400 hover:text-gray-500"
              >
                <X class="w-5 h-5" />
              </button>
            </div>
          </div>

          <div class="p-6 space-y-6">
            <!-- Accessible Pages -->
            <div>
              <h3 class="font-semibold text-lg mb-3 text-gray-900">Available Pages</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <a
                  v-for="page in accessiblePages"
                  :key="page.title"
                  :href="page.url"
                  @click="showNavigator = false"
                  class="block border border-gray-200 rounded-lg hover:shadow-md transition-shadow duration-200 cursor-pointer"
                >
                  <div class="p-4">
                    <div class="flex items-start space-x-3">
                      <div class="bg-indigo-100 p-2 rounded-lg">
                        <component :is="page.icon" class="w-5 h-5 text-indigo-600" />
                      </div>
                      <div class="flex-1">
                        <h4 class="font-medium text-gray-900 mb-1">{{ page.title }}</h4>
                        <p class="text-sm text-gray-600">{{ page.description }}</p>
                      </div>
                    </div>
                  </div>
                </a>
              </div>
            </div>

            <!-- Restricted Pages -->
            <div v-if="restrictedPages.length > 0">
              <h3 class="font-semibold text-lg mb-3 text-gray-900">Special Pages</h3>
              <div class="space-y-2">
                <div
                  v-for="page in restrictedPages"
                  :key="page.title"
                  class="border border-gray-200 bg-gray-50 rounded-lg"
                >
                  <div class="p-4">
                    <div class="flex items-start space-x-3">
                      <div class="bg-gray-200 p-2 rounded-lg">
                        <component :is="page.icon" class="w-5 h-5 text-gray-500" />
                      </div>
                      <div class="flex-1">
                        <h4 class="font-medium text-gray-700 mb-1">{{ page.title }}</h4>
                        <p class="text-sm text-gray-500 mb-1">{{ page.description }}</p>
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border border-orange-200 text-orange-600">
                          {{ page.note }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Current Role Info -->
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div class="flex items-center space-x-2">
                <User class="w-4 h-4 text-blue-600" />
                <span class="text-sm font-medium text-blue-900">
                  Currently viewing as: <strong>{{ currentUserType }}</strong>
                </span>
                <span
                  v-if="impersonatedRole && user?.user_type === 'admin'"
                  class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800"
                >
                  Impersonating
                </span>
              </div>
              <p class="text-xs text-blue-700 mt-1">
                Pages shown are filtered based on your current role permissions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import {
  Map,
  X,
  Home,
  FileText,
  Users,
  Upload,
  Settings,
  HelpCircle,
  User
} from 'lucide-vue-next';
// import { createPageUrl } from '@/utils';

const props = defineProps({
  user: {
    type: Object,
    default: null
  },
  impersonatedRole: {
    type: String,
    default: null
  }
});

const showNavigator = ref(false);

// Temporary utility function until we can import from @/utils
const createPageUrl = (pageName) => {
  // TODO: Replace with actual implementation from @/utils
  return `/${pageName.toLowerCase().replace(/\s+/g, '-')}`;
};

const currentUserType = computed(() => {
  return props.impersonatedRole || props.user?.user_type || 'guest';
});

const getAllPages = () => {
  const allPages = [
    {
      title: "Dashboard",
      url: createPageUrl("Dashboard"),
      icon: Home,
      description: "Main dashboard overview",
      roles: ["lawyer", "customer", "admin"]
    },
    {
      title: "Cases",
      url: createPageUrl("Cases"),
      icon: FileText,
      description: "Manage all legal cases",
      roles: ["lawyer", "admin"]
    },
    {
      title: "My Cases",
      url: createPageUrl("MyCases"),
      icon: FileText,
      description: "View your assigned cases",
      roles: ["customer"]
    },
    {
      title: "Documents",
      url: createPageUrl("Documents"),
      icon: Upload,
      description: "Document management with OCR",
      roles: ["lawyer", "customer", "admin"]
    },
    {
      title: "Case Details",
      url: createPageUrl("CaseDetails"),
      icon: FileText,
      description: "Detailed case information",
      roles: ["lawyer", "customer", "admin"],
      note: "Requires case ID parameter"
    },
    {
      title: "Users",
      url: createPageUrl("Users"),
      icon: Users,
      description: "User management",
      roles: ["admin"]
    },
    {
      title: "Settings",
      url: createPageUrl("Settings"),
      icon: Settings,
      description: "User preferences and AI config",
      roles: ["lawyer", "customer", "admin"]
    },
    {
      title: "Help",
      url: createPageUrl("Help"),
      icon: HelpCircle,
      description: "User guide and documentation",
      roles: ["lawyer", "customer", "admin", "guest"]
    }
  ];

  return allPages.filter(page =>
    page.roles.includes(currentUserType.value)
  );
};

const accessiblePages = computed(() => {
  return getAllPages().filter(page => !page.note);
});

const restrictedPages = computed(() => {
  return getAllPages().filter(page => page.note);
});
</script>
