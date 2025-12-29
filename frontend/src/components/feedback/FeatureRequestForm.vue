<template>
  <div v-if="isSuccess" class="text-center py-8">
    <Check class="w-12 h-12 text-green-600 mx-auto mb-4" />
    <h3 class="text-lg font-semibold text-gray-900 mb-2">Feature Request Submitted</h3>
    <p class="text-gray-600">We'll review your suggestion and consider it for future updates!</p>
  </div>

  <form v-else @submit.prevent="handleSubmit" class="space-y-4">
    <div>
      <label for="title" class="block text-sm font-medium text-gray-700">Feature Title *</label>
      <input
        id="title"
        v-model="formData.title"
        type="text"
        placeholder="What feature would you like to see?"
        required
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
      />
    </div>

    <div>
      <label for="description" class="block text-sm font-medium text-gray-700">Description *</label>
      <textarea
        id="description"
        v-model="formData.description"
        placeholder="Describe the feature in detail..."
        rows="4"
        required
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
      />
    </div>

    <div>
      <label for="use_case" class="block text-sm font-medium text-gray-700">Use Case</label>
      <textarea
        id="use_case"
        v-model="formData.use_case"
        placeholder="How would this feature help you? What problem does it solve?"
        rows="3"
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
      />
    </div>

    <div class="grid grid-cols-2 gap-4">
      <div>
        <label for="priority" class="block text-sm font-medium text-gray-700">Priority</label>
        <select
          id="priority"
          v-model="formData.priority"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <div>
        <label for="category" class="block text-sm font-medium text-gray-700">Category</label>
        <select
          id="category"
          v-model="formData.category"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
        >
          <option value="ui">User Interface</option>
          <option value="feature">New Feature</option>
          <option value="integration">Integration</option>
          <option value="performance">Performance</option>
          <option value="other">Other</option>
        </select>
      </div>
    </div>

    <div>
      <label for="screenshot-upload-feature" class="block text-sm font-medium text-gray-700">Screenshot or Mockup</label>
      <p class="text-xs text-gray-500 mb-2">
        {{ initialScreenshot
          ? "Automatic screenshot captured. You can upload a mockup or different screenshot if needed."
          : "Upload a screenshot or mockup to illustrate your idea."
        }}
      </p>

      <div v-if="screenshotPreview" class="mt-2 mb-3 relative">
        <div class="border-2 border-gray-200 rounded-lg overflow-hidden bg-gray-50">
          <img
            :src="screenshotPreview"
            alt="Screenshot preview"
            class="w-full h-auto max-h-64 object-contain"
          />
        </div>
        <button
          type="button"
          @click="removeScreenshot"
          class="absolute top-2 right-2 inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          <X class="w-4 h-4 mr-1" />
          Remove
        </button>
      </div>

      <div class="flex items-center space-x-2">
        <label
          for="screenshot-upload-feature"
          class="flex-1 inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer"
        >
          <Upload class="w-4 h-4 mr-2" />
          {{ screenshotPreview ? "Replace Image" : "Upload Image" }}
        </label>
        <input
          id="screenshot-upload-feature"
          type="file"
          class="hidden"
          accept="image/*"
          @change="handleScreenshotUpload"
        />
      </div>
    </div>

    <div class="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-gray-700 space-y-1">
      <p class="flex items-start">
        <Info class="w-3 h-3 mr-1 mt-0.5 flex-shrink-0 text-blue-600" />
        <span>Your current page and role will be attached to this request for context.</span>
      </p>
    </div>

    <div class="flex justify-end space-x-2 pt-2">
      <button
        type="button"
        @click="emit('close')"
        class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Cancel
      </button>
      <button
        type="submit"
        :disabled="isSubmitting || isUploadingScreenshot"
        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {{ isSubmitting ? "Submitting..." : isUploadingScreenshot ? "Uploading..." : "Submit Request" }}
      </button>
    </div>
  </form>
</template>

<script setup>
import { ref, reactive, watch, onUnmounted } from 'vue';
import { Check, Info, Upload, X } from 'lucide-vue-next';
// import { FeatureRequest } from '@/entities/FeatureRequest';
// import { UploadFile } from '@/integrations/Core';

const props = defineProps({
  initialScreenshot: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['close']);

const formData = reactive({
  title: '',
  description: '',
  priority: 'medium',
  category: 'feature',
  use_case: '',
  screenshot_url: ''
});

const isSubmitting = ref(false);
const isSuccess = ref(false);
const screenshotPreview = ref(null);
const screenshotFile = ref(null);
const isUploadingScreenshot = ref(false);

// Watch for initial screenshot changes
watch(() => props.initialScreenshot, (newScreenshot) => {
  if (newScreenshot) {
    screenshotPreview.value = newScreenshot.url;
    screenshotFile.value = newScreenshot.file;
  }
}, { immediate: true });

const handleSubmit = async () => {
  isSubmitting.value = true;

  try {
    let screenshot_url = formData.screenshot_url;

    // Upload screenshot if we have one and haven't uploaded it yet
    if (screenshotFile.value && !screenshot_url) {
      isUploadingScreenshot.value = true;
      // TODO: Uncomment when API is ready
      // const { file_url } = await UploadFile({ file: screenshotFile.value });
      // screenshot_url = file_url;
      console.log('Screenshot upload would happen here');
      isUploadingScreenshot.value = false;
    }

    // TODO: Uncomment when API is ready
    // await FeatureRequest.create({
    //   ...formData,
    //   screenshot_url
    // });
    console.log('Feature request would be created with:', { ...formData, screenshot_url });

    isSuccess.value = true;
    setTimeout(() => {
      emit('close');
    }, 2000);
  } catch (error) {
    console.error('Failed to submit feature request:', error);
    isUploadingScreenshot.value = false;
  }
  isSubmitting.value = false;
};

const handleScreenshotUpload = (event) => {
  const file = event.target.files?.[0];
  if (!file) return;

  screenshotFile.value = file;
  screenshotPreview.value = URL.createObjectURL(file);
};

const removeScreenshot = () => {
  if (screenshotPreview.value) {
    URL.revokeObjectURL(screenshotPreview.value);
  }
  screenshotPreview.value = null;
  screenshotFile.value = null;
  formData.screenshot_url = '';
};

// Cleanup on unmount
onUnmounted(() => {
  if (screenshotPreview.value) {
    URL.revokeObjectURL(screenshotPreview.value);
  }
});
</script>
