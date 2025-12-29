<template>
  <div class="fixed bottom-4 right-4 z-50 space-y-3">
    <!-- Chat Bubble - Only on mobile/tablet -->
    <div class="lg:hidden">
      <ChatBubble :caseId="caseId" :user="user" />
    </div>

    <!-- Feature Request Button -->
    <button
      @click="handleFeatureRequestClick"
      class="h-12 w-12 rounded-full bg-green-600 hover:bg-green-700 text-white shadow-lg flex items-center justify-center transition-colors"
      title="Request a Feature"
    >
      <Hammer class="w-5 h-5" />
    </button>

    <!-- Bug Report Button -->
    <button
      @click="handleBugReportClick"
      class="h-12 w-12 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-lg flex items-center justify-center transition-colors"
      title="Report a Bug"
    >
      <Bug class="w-5 h-5" />
    </button>

    <!-- Bug Report Dialog -->
    <Teleport to="body">
      <div
        v-if="showBugReport"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
        @click.self="handleCloseBugReport"
      >
        <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto m-4">
          <div class="border-b border-gray-200 p-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-2">
                <Bug class="w-5 h-5 text-red-600" />
                <h2 class="text-lg font-semibold">Report a Bug</h2>
              </div>
              <button
                @click="handleCloseBugReport"
                class="text-gray-400 hover:text-gray-500"
              >
                <X class="w-5 h-5" />
              </button>
            </div>
          </div>
          <div class="p-6">
            <BugReportForm
              :initialScreenshot="screenshot"
              @close="handleCloseBugReport"
            />
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Feature Request Dialog -->
    <Teleport to="body">
      <div
        v-if="showFeatureRequest"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
        @click.self="handleCloseFeatureRequest"
      >
        <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto m-4">
          <div class="border-b border-gray-200 p-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-2">
                <Hammer class="w-5 h-5 text-green-600" />
                <h2 class="text-lg font-semibold">Request a Feature</h2>
              </div>
              <button
                @click="handleCloseFeatureRequest"
                class="text-gray-400 hover:text-gray-500"
              >
                <X class="w-5 h-5" />
              </button>
            </div>
          </div>
          <div class="p-6">
            <FeatureRequestForm
              :initialScreenshot="screenshot"
              @close="handleCloseFeatureRequest"
            />
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { Bug, Hammer, X } from 'lucide-vue-next';
import BugReportForm from './BugReportForm.vue';
import FeatureRequestForm from './FeatureRequestForm.vue';
import ChatBubble from '../chat/ChatBubble.vue';

defineProps({
  caseId: {
    type: [String, Number],
    default: null
  },
  user: {
    type: Object,
    default: null
  }
});

const showBugReport = ref(false);
const showFeatureRequest = ref(false);
const screenshot = ref(null);

const captureScreenshot = async () => {
  try {
    // Use html2canvas-like approach with DOM capturing
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    // Set canvas size to window size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Draw white background
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Try to capture the current page by drawing the body
    try {
      // Draw the entire document body
      const body = document.body;
      const html = document.documentElement;

      // Get the full page dimensions
      const pageHeight = Math.max(
        body.scrollHeight, body.offsetHeight,
        html.clientHeight, html.scrollHeight, html.offsetHeight
      );
      const pageWidth = Math.max(
        body.scrollWidth, body.offsetWidth,
        html.clientWidth, html.scrollWidth, html.offsetWidth
      );

      // Use a more sophisticated approach: convert the page to SVG then to canvas
      const svgString = `
        <svg xmlns="http://www.w3.org/2000/svg" width="${canvas.width}" height="${canvas.height}">
          <foreignObject width="100%" height="100%">
            <div xmlns="http://www.w3.org/1999/xhtml" style="font-size: 14px; font-family: Arial, sans-serif; padding: 20px;">
              <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 10px; color: white; margin-bottom: 20px;">
                <h2 style="margin: 0 0 10px 0;">Screenshot Captured</h2>
                <p style="margin: 0; opacity: 0.9;">Page: ${window.location.pathname}</p>
                <p style="margin: 5px 0 0 0; opacity: 0.9;">Time: ${new Date().toLocaleString()}</p>
              </div>
              <div style="background: white; padding: 15px; border-radius: 8px; border: 2px solid #e0e0e0;">
                <p style="color: #666; margin: 0;"><strong>Note:</strong> Full page screenshot capture requires browser permissions. You can upload your own screenshot using the upload button below.</p>
              </div>
            </div>
          </foreignObject>
        </svg>
      `;

      const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);
      const img = new Image();

      return new Promise((resolve) => {
        img.onload = () => {
          context.drawImage(img, 0, 0);
          URL.revokeObjectURL(url);

          canvas.toBlob((blob) => {
            const screenshotUrl = URL.createObjectURL(blob);
            const file = new File([blob], 'screenshot.png', { type: 'image/png' });
            resolve({ url: screenshotUrl, file });
          }, 'image/png');
        };

        img.onerror = () => {
          // Fallback to simple canvas
          URL.revokeObjectURL(url);
          canvas.toBlob((blob) => {
            const screenshotUrl = URL.createObjectURL(blob);
            const file = new File([blob], 'screenshot.png', { type: 'image/png' });
            resolve({ url: screenshotUrl, file });
          }, 'image/png');
        };

        img.src = url;
      });
    } catch (domError) {
      console.warn('DOM capture failed:', domError);
      // Fallback: create a simple placeholder
      context.fillStyle = '#667eea';
      context.fillRect(0, 0, canvas.width, 100);
      context.fillStyle = '#ffffff';
      context.font = 'bold 20px Arial';
      context.fillText('Screenshot Context: ' + window.location.pathname, 20, 50);
      context.fillStyle = '#333333';
      context.font = '14px Arial';
      context.fillText('Captured at: ' + new Date().toLocaleString(), 20, 80);

      return new Promise((resolve) => {
        canvas.toBlob((blob) => {
          const screenshotUrl = URL.createObjectURL(blob);
          const file = new File([blob], 'screenshot.png', { type: 'image/png' });
          resolve({ url: screenshotUrl, file });
        }, 'image/png');
      });
    }
  } catch (error) {
    console.error('Screenshot capture failed:', error);
    // Return a basic placeholder
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 200;
    const context = canvas.getContext('2d');
    context.fillStyle = '#f0f0f0';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = '#666666';
    context.font = '16px Arial';
    context.fillText('Please use the upload button to attach a screenshot', 20, 100);

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const file = new File([blob], 'screenshot.png', { type: 'image/png' });
        resolve({ url, file });
      }, 'image/png');
    });
  }
};

const handleBugReportClick = async () => {
  screenshot.value = await captureScreenshot();
  showBugReport.value = true;
};

const handleFeatureRequestClick = async () => {
  screenshot.value = await captureScreenshot();
  showFeatureRequest.value = true;
};

const handleCloseBugReport = () => {
  showBugReport.value = false;
  if (screenshot.value?.url) {
    URL.revokeObjectURL(screenshot.value.url);
  }
  screenshot.value = null;
};

const handleCloseFeatureRequest = () => {
  showFeatureRequest.value = false;
  if (screenshot.value?.url) {
    URL.revokeObjectURL(screenshot.value.url);
  }
  screenshot.value = null;
};
</script>
