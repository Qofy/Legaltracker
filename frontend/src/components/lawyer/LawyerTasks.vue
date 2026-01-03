<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h2 class="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <svg class="w-7 h-7 text-[#003aca]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
          My Tasks
        </h2>
        <p class="text-gray-500 mt-1">Manage tasks and action items for your cases</p>
      </div>
      <button @click="showCreateTask = true" class="px-4 py-2 bg-[#003aca] text-white rounded-md hover:bg-[#0031a0] text-sm font-medium">
        Create Task
      </button>
    </div>

    <!-- Assigned Cases for Lawyer -->
    <div class="bg-white rounded-lg border border-gray-200 p-6 mb-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-gray-800">Assigned Cases</h3>
        <router-link to="/my-cases" class="text-sm text-blue-600 hover:underline">See all</router-link>
      </div>

      <div v-if="cases.length === 0" class="text-sm text-gray-500">You have no assigned cases.</div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div v-for="c in cases" :key="c.id" class="p-4 border rounded-md flex items-start justify-between">
          <div>
            <div class="font-semibold text-gray-900">{{ c.title }}</div>
            <div class="text-xs text-gray-500 mt-1">Case #: {{ c.case_number || '—' }}</div>
            <div class="text-xs text-gray-500 mt-1">Status: <span class="font-medium">{{ c.status }}</span></div>
          </div>
          <div class="flex items-center gap-2">
            <router-link :to="{ name: 'CaseDetails', params: { id: c.id } }" class="px-3 py-1 bg-[#003aca] text-white rounded text-sm">View</router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Task Stats -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="bg-white rounded-lg border border-gray-200 p-5">
        <div class="flex items-center justify-between mb-2">
          <p class="text-sm text-gray-600 font-medium">Total Tasks</p>
          <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <p class="text-3xl font-bold text-gray-900">{{ taskStats.total }}</p>
      </div>

      <div class="bg-white rounded-lg border border-gray-200 p-5">
        <div class="flex items-center justify-between mb-2">
          <p class="text-sm text-gray-600 font-medium">Pending</p>
          <svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p class="text-3xl font-bold text-gray-900">{{ taskStats.pending }}</p>
      </div>

      <div class="bg-white rounded-lg border border-gray-200 p-5">
        <div class="flex items-center justify-between mb-2">
          <p class="text-sm text-gray-600 font-medium">In Progress</p>
          <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <p class="text-3xl font-bold text-gray-900">{{ taskStats.in_progress }}</p>
      </div>

      <div class="bg-white rounded-lg border border-gray-200 p-5">
        <div class="flex items-center justify-between mb-2">
          <p class="text-sm text-gray-600 font-medium">Completed</p>
          <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p class="text-3xl font-bold text-gray-900">{{ taskStats.completed }}</p>
      </div>
    </div>

    <!-- Filters and Tabs -->
    <div class="bg-white rounded-lg border border-gray-200 p-6">
      <div class="flex items-center justify-between mb-6 border-b border-gray-200 pb-4">
        <div class="flex items-center gap-4">
          <button
            @click="activeTab = 'all'"
            :class="['px-4 py-2 text-sm font-medium rounded-md', activeTab === 'all' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100']"
          >
            All Tasks
          </button>
          <button
            @click="activeTab = 'pending'"
            :class="['px-4 py-2 text-sm font-medium rounded-md', activeTab === 'pending' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100']"
          >
            Pending
          </button>
          <button
            @click="activeTab = 'in_progress'"
            :class="['px-4 py-2 text-sm font-medium rounded-md', activeTab === 'in_progress' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100']"
          >
            In Progress
          </button>
          <button
            @click="activeTab = 'completed'"
            :class="['px-4 py-2 text-sm font-medium rounded-md', activeTab === 'completed' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100']"
          >
            Completed
          </button>
        </div>

        <div class="flex items-center gap-3">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search tasks..."
            class="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select v-model="priorityFilter" class="px-3 py-2 border border-gray-300 rounded-md text-sm">
            <option value="">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      <!-- Tasks List -->
      <div class="space-y-3">
        <div v-if="filteredTasks.length === 0" class="text-center py-12 text-gray-500">
          <svg class="w-16 h-16 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p class="text-sm">No tasks found</p>
        </div>

        <div v-else v-for="task in filteredTasks" :key="task.id" class="p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
          <div class="flex items-start gap-4">
            <!-- Checkbox -->
            <button
              @click="toggleTaskStatus(task)"
              :class="[
                'mt-1 w-5 h-5 rounded border-2 flex items-center justify-center',
                task.status === 'completed' ? 'bg-green-600 border-green-600' : 'border-gray-300 hover:border-blue-600'
              ]"
            >
              <svg v-if="task.status === 'completed'" class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
              </svg>
            </button>

            <!-- Task Details -->
            <div class="flex-1">
              <div class="flex items-start justify-between">
                <div>
                  <h4 :class="['font-semibold text-gray-900', task.status === 'completed' ? 'line-through text-gray-500' : '']">
                    {{ task.title }}
                  </h4>
                  <p class="text-sm text-gray-600 mt-1">{{ task.case_title }}</p>
                  <p v-if="task.description" class="text-sm text-gray-600 mt-2">{{ task.description }}</p>
                </div>
                <button class="text-gray-400 hover:text-gray-600">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                </button>
              </div>

              <div class="flex items-center gap-3 mt-3">
                <span :class="['px-2 py-1 rounded text-xs font-medium', getPriorityBadge(task.priority)]">
                  {{ task.priority }} priority
                </span>
                <span :class="['px-2 py-1 rounded text-xs font-medium', getStatusBadge(task.status)]">
                  {{ task.status }}
                </span>
                <div v-if="task.due_date" class="flex items-center gap-1 text-xs">
                  <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span :class="isOverdue(task.due_date) && task.status !== 'completed' ? 'text-red-600 font-semibold' : 'text-gray-600'">
                    Due {{ formatDate(task.due_date) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create Task Modal (simplified placeholder) -->
    <div v-if="showCreateTask" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click.self="showCreateTask = false">
      <div class="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">Create New Task</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Task Title</label>
            <input v-model="newTask.title" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-md" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea v-model="newTask.description" rows="3" class="w-full px-3 py-2 border border-gray-300 rounded-md"></textarea>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Case</label>
            <select v-model="newTask.case_id" class="w-full px-3 py-2 border border-gray-300 rounded-md">
              <option value="">Select a case</option>
              <option v-for="c in cases" :key="c.id" :value="c.id">{{ c.title }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Priority</label>
            <select v-model="newTask.priority" class="w-full px-3 py-2 border border-gray-300 rounded-md">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
            <input v-model="newTask.due_date" type="date" class="w-full px-3 py-2 border border-gray-300 rounded-md" />
          </div>
        </div>
        <div class="flex justify-end gap-3 mt-6">
          <button @click="showCreateTask = false" class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
            Cancel
          </button>
          <button @click="createTask" class="px-4 py-2 bg-[#003aca] text-white rounded-md hover:bg-[#0031a0]">
            Create Task
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { ActionItem, Case } from '@/services/entities';
import { useAuthStore } from '@/stores/auth';
import { format } from 'date-fns';

const authStore = useAuthStore();

const activeTab = ref('all');
const searchQuery = ref('');
const priorityFilter = ref('');
const showCreateTask = ref(false);

const tasks = ref([]);
const cases = ref([]);

const newTask = ref({
  title: '',
  description: '',
  case_id: '',
  priority: 'medium',
  due_date: '',
  status: 'pending',
});

const taskStats = computed(() => ({
  total: tasks.value.length,
  pending: tasks.value.filter(t => t.status === 'pending').length,
  in_progress: tasks.value.filter(t => t.status === 'in_progress').length,
  completed: tasks.value.filter(t => t.status === 'completed').length,
}));

const filteredTasks = computed(() => {
  let filtered = tasks.value;

  // Filter by tab
  if (activeTab.value !== 'all') {
    filtered = filtered.filter(t => t.status === activeTab.value);
  }

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(t =>
      t.title?.toLowerCase().includes(query) ||
      t.description?.toLowerCase().includes(query) ||
      t.case_title?.toLowerCase().includes(query)
    );
  }

  // Filter by priority
  if (priorityFilter.value) {
    filtered = filtered.filter(t => t.priority === priorityFilter.value);
  }

  return filtered.sort((a, b) => {
    // Sort by due date, then by priority
    if (a.due_date && b.due_date) {
      return new Date(a.due_date) - new Date(b.due_date);
    }
    return 0;
  });
});

const loadTasks = async () => {
  try {
    const userId = authStore.user?.id;
    console.log('Loading tasks for user ID:', userId);
    if (!userId) {
      console.log('No user ID found, exiting');
      return;
    }

    // Fetch lawyer's assigned cases - use Case.list() to get properly filtered cases from backend
    cases.value = await Case.list();
    const caseIds = cases.value.map(c => c.id);

    console.log('Lawyer assigned cases:', cases.value.length);
    console.log('Case IDs:', caseIds);
    console.log('Assigned cases details:', cases.value);

    // Fetch all tasks first to see what's available
    const allTasks = await ActionItem.list();
    console.log('Total tasks in system:', allTasks.length);
    console.log('All tasks:', allTasks);

    if (caseIds.length > 0) {
      // Fetch all tasks for lawyer's cases
      tasks.value = allTasks
        .filter(t => {
          console.log(`Checking task ${t.id} with case_id ${t.case_id} against case IDs:`, caseIds);
          return caseIds.includes(t.case_id);
        })
        .map(t => ({
          ...t,
          case_title: cases.value.find(c => c.id === t.case_id)?.title || 'Unknown Case',
        }));
        
      console.log('Tasks found for assigned cases:', tasks.value.length);
      console.log('Filtered tasks:', tasks.value);
    } else {
      console.log('No assigned cases found for lawyer');
      tasks.value = [];
    }
    // Merge any locally stored pending tasks (safety fallback)
    try {
      const pendingKey = `action_items_pending_${authStore.user?.id}`;
      const raw = localStorage.getItem(pendingKey);
      const pending = raw ? JSON.parse(raw) : [];
      if (pending.length > 0) {
        console.debug('[LawyerTasks] merging pending local tasks', pending.length);
        // Add any pending tasks that are not already present
        const serverIds = tasks.value.map(t => t.id);
        const toAdd = pending.filter(p => !serverIds.includes(p.id));
        if (toAdd.length > 0) tasks.value = tasks.value.concat(toAdd.map(p => ({ ...p, case_title: cases.value.find(c => c.id === p.case_id)?.title || 'Unknown Case' })));

        // Remove pending entries that now exist on server
        const remainingPending = pending.filter(p => !serverIds.includes(p.id));
        if (remainingPending.length !== pending.length) {
          localStorage.setItem(pendingKey, JSON.stringify(remainingPending));
        }
      }
    } catch (e) {
      console.debug('[LawyerTasks] failed to merge pending local tasks', e);
    }
  } catch (error) {
    console.error('Failed to load tasks:', error);
  }
};

const createTask = async () => {
  try {
    if (!newTask.value.title || !newTask.value.case_id) {
      alert('Please fill in required fields');
      return;
    }

    const created = await ActionItem.create(newTask.value);
    const caseTitle = cases.value.find(c => c.id === newTask.value.case_id)?.title || 'Unknown Case';
    tasks.value.push({ ...created, case_title: caseTitle });

    // Save created task to localStorage as a fallback so it survives refreshes
    try {
      const pendingKey = `action_items_pending_${authStore.user?.id}`;
      const raw = localStorage.getItem(pendingKey);
      const pending = raw ? JSON.parse(raw) : [];
      // Avoid duplicates
      if (!pending.find(p => p.id === created.id)) {
        pending.push({ ...created, case_title: caseTitle });
        localStorage.setItem(pendingKey, JSON.stringify(pending));
      }
    } catch (e) {
      console.debug('[LawyerTasks] failed to save pending task to localStorage', e);
    }

    // Reset form
    newTask.value = {
      title: '',
      description: '',
      case_id: '',
      priority: 'medium',
      due_date: '',
      status: 'pending',
    };
    showCreateTask.value = false;
  } catch (error) {
    console.error('Failed to create task:', error);
    alert('Failed to create task');
  }
};

const toggleTaskStatus = async (task) => {
  try {
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    await ActionItem.update(task.id, { status: newStatus });
    task.status = newStatus;
  } catch (error) {
    console.error('Failed to update task status:', error);
  }
};

const formatDate = (date) => {
  try {
    return format(new Date(date), 'MMM d, yyyy');
  } catch (e) {
    return '';
  }
};

const isOverdue = (date) => {
  return new Date(date) < new Date();
};

const getPriorityBadge = (priority) => {
  switch (priority) {
    case 'urgent': return 'bg-red-100 text-red-700 border border-red-200';
    case 'high': return 'bg-orange-100 text-orange-700 border border-orange-200';
    case 'medium': return 'bg-yellow-100 text-yellow-700 border border-yellow-200';
    case 'low': return 'bg-green-100 text-green-700 border border-green-200';
    default: return 'bg-gray-100 text-gray-700 border border-gray-200';
  }
};

const getStatusBadge = (status) => {
  switch (status) {
    case 'completed': return 'bg-green-100 text-green-700 border border-green-200';
    case 'in_progress': return 'bg-blue-100 text-blue-700 border border-blue-200';
    case 'pending': return 'bg-yellow-100 text-yellow-700 border border-yellow-200';
    default: return 'bg-gray-100 text-gray-700 border border-gray-200';
  }
};

onMounted(() => {
  loadTasks();
});
</script>
