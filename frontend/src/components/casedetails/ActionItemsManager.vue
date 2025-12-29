<template>
  <div class="material-elevation-1 clean-border bg-white rounded-lg">
    <div class="p-6">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold">Action Items</h3>
        <button
          @click="showAddForm = !showAddForm"
          class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Add Item
        </button>
      </div>

      <div v-if="showAddForm" class="space-y-4 p-4 border rounded-md mb-4 bg-gray-50">
        <input
          v-model="newItem.title"
          placeholder="Title"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <textarea
          v-model="newItem.description"
          placeholder="Description"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        ></textarea>
        <select
          v-model="newItem.assigned_to"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Assign to...</option>
          <option v-for="user in users" :key="user.id" :value="user.id">
            {{ user.full_name }}
          </option>
        </select>
        <div class="flex justify-end">
          <button
            @click="handleCreateItem"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            Create
          </button>
        </div>
      </div>

      <div v-if="isLoading">
        <p>Loading action items...</p>
      </div>
      <div v-else>
        <table class="w-full">
          <thead>
            <tr class="border-b">
              <th class="text-left py-3 px-4 font-medium">Title</th>
              <th class="text-left py-3 px-4 font-medium">Assigned To</th>
              <th class="text-left py-3 px-4 font-medium">Status</th>
              <th class="text-right py-3 px-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="actionItems.length === 0">
              <td colspan="4" class="text-center py-4">No action items found.</td>
            </tr>
            <tr v-for="item in actionItems" :key="item.id" class="border-b hover:bg-gray-50">
              <td class="py-3 px-4 font-medium">{{ item.title }}</td>
              <td class="py-3 px-4">{{ getUserName(item.assigned_to) }}</td>
              <td class="py-3 px-4">
                <select
                  :value="item.status"
                  @change="handleStatusChange(item, $event.target.value)"
                  class="w-32 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </td>
              <td class="py-3 px-4 text-right">
                <button
                  @click="handleDelete(item.id)"
                  class="p-2 hover:bg-gray-100 rounded-md"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
// TODO: Import entities when backend is ready
// import { ActionItem } from '@/entities/ActionItem';
// import { User } from '@/entities/User';

const props = defineProps({
  caseId: {
    type: [String, Number],
    required: true
  }
});

const actionItems = ref([]);
const users = ref([]);
const isLoading = ref(true);
const showAddForm = ref(false);
const newItem = reactive({
  title: '',
  description: '',
  assigned_to: '',
  status: 'pending',
  priority: 'medium'
});

onMounted(() => {
  loadActionItems();
  loadUsers();
});

const loadActionItems = async () => {
  isLoading.value = true;
  // TODO: Uncomment when backend API is ready
  /*
  try {
    const items = await ActionItem.filter({ case_id: props.caseId });
    actionItems.value = items;
  } catch (error) {
    console.error("Failed to load action items:", error);
  }
  */

  // Mock data for development
  actionItems.value = [
    {
      id: 1,
      title: 'Review contract',
      description: 'Review the contract terms',
      assigned_to: 1,
      status: 'pending',
      priority: 'high'
    },
    {
      id: 2,
      title: 'Prepare documents',
      description: 'Prepare court documents',
      assigned_to: 2,
      status: 'in_progress',
      priority: 'medium'
    }
  ];
  isLoading.value = false;
};

const loadUsers = async () => {
  // TODO: Uncomment when backend API is ready
  /*
  try {
    const userList = await User.list();
    users.value = userList.filter(u => u.user_type === 'lawyer' || u.user_type === 'admin');
  } catch (error) {
    console.error("Failed to load users:", error);
  }
  */

  // Mock data for development
  users.value = [
    { id: 1, full_name: 'John Doe', user_type: 'lawyer' },
    { id: 2, full_name: 'Jane Smith', user_type: 'admin' }
  ];
};

const handleCreateItem = async () => {
  if (!newItem.title || !newItem.assigned_to) return;

  // TODO: Uncomment when backend API is ready
  /*
  try {
    await ActionItem.create({ ...newItem, case_id: props.caseId });
    newItem.title = '';
    newItem.description = '';
    newItem.assigned_to = '';
    newItem.status = 'pending';
    newItem.priority = 'medium';
    showAddForm.value = false;
    loadActionItems();
  } catch (error) {
    console.error("Failed to create action item:", error);
  }
  */

  // Mock creation for development
  console.log('Creating action item:', { ...newItem, case_id: props.caseId });
  newItem.title = '';
  newItem.description = '';
  newItem.assigned_to = '';
  newItem.status = 'pending';
  newItem.priority = 'medium';
  showAddForm.value = false;
  loadActionItems();
};

const handleDelete = async (itemId) => {
  if (window.confirm("Are you sure you want to delete this action item?")) {
    // TODO: Uncomment when backend API is ready
    /*
    try {
      await ActionItem.delete(itemId);
      loadActionItems();
    } catch (error) {
      console.error("Failed to delete action item:", error);
    }
    */

    // Mock deletion for development
    console.log('Deleting action item:', itemId);
    loadActionItems();
  }
};

const handleStatusChange = async (item, status) => {
  // TODO: Uncomment when backend API is ready
  /*
  try {
    await ActionItem.update(item.id, { status });
    loadActionItems();
  } catch (error) {
    console.error("Failed to update action item status:", error);
  }
  */

  // Mock update for development
  console.log('Updating action item status:', item.id, status);
  loadActionItems();
};

const getUserName = (userId) => {
  const user = users.value.find(u => u.id === userId);
  return user ? user.full_name : 'Unassigned';
};
</script>
