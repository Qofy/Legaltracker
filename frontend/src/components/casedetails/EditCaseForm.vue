<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <div>
      <label for="title" class="block text-sm font-medium mb-1">Case Title</label>
      <input
        id="title"
        v-model="formData.title"
        type="text"
        required
        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    <div>
      <label for="description" class="block text-sm font-medium mb-1">Description</label>
      <textarea
        id="description"
        v-model="formData.description"
        rows="3"
        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      ></textarea>
    </div>

    <div v-if="currentUser?.user_type === 'admin'">
      <label for="lawyer" class="block text-sm font-medium mb-1">Assign Lawyer</label>
      <select
        id="lawyer"
        v-model="formData.lawyer_id"
        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Select a lawyer...</option>
        <option v-for="lawyer in allLawyers" :key="lawyer.id" :value="lawyer.id">
          {{ lawyer.full_name }}
        </option>
        <option :value="null">Unassigned</option>
      </select>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label for="status" class="block text-sm font-medium mb-1">Status</label>
        <select
          id="status"
          v-model="formData.status"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="on_hold">On Hold</option>
          <option value="closed">Closed</option>
        </select>
      </div>
      <div>
        <label for="priority" class="block text-sm font-medium mb-1">Priority</label>
        <select
          id="priority"
          v-model="formData.priority"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>
      </div>
    </div>

    <div class="flex justify-end space-x-2">
      <button
        type="button"
        @click="$emit('cancel')"
        class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
        Cancel
      </button>
      <button
        type="submit"
        :disabled="isSubmitting"
        class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2">
          <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
          <polyline points="17 21 17 13 7 13 7 21"></polyline>
          <polyline points="7 3 7 8 15 8"></polyline>
        </svg>
        {{ isSubmitting ? "Saving..." : "Save Changes" }}
      </button>
    </div>
  </form>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
// TODO: Import User entity when backend is ready
// import { User } from '@/entities/User';

const props = defineProps({
  caseData: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['submit', 'cancel']);

const formData = reactive({
  title: props.caseData.title || "",
  description: props.caseData.description || "",
  status: props.caseData.status || "open",
  priority: props.caseData.priority || "medium",
  case_type: props.caseData.case_type || "civil",
  lawyer_id: props.caseData.lawyer_id || ""
});

const isSubmitting = ref(false);
const currentUser = ref(null);
const allLawyers = ref([]);

onMounted(async () => {
  // TODO: Uncomment when backend API is ready
  /*
  try {
    const [user, lawyers] = await Promise.all([
      User.me(),
      User.filter({ user_type: 'lawyer' })
    ]);
    currentUser.value = user;
    allLawyers.value = lawyers;
  } catch (error) {
    console.error("Failed to fetch user or lawyers:", error);
  }
  */

  // Mock data for development
  currentUser.value = { user_type: 'admin' };
  allLawyers.value = [
    { id: 1, full_name: 'John Doe' },
    { id: 2, full_name: 'Jane Smith' }
  ];
});

const handleSubmit = async () => {
  isSubmitting.value = true;
  await emit('submit', formData);
  isSubmitting.value = false;
};
</script>
