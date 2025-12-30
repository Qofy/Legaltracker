<template>
  <div class="ai-document-analyzer p-4 bg-white rounded shadow-sm">
    <h3 class="text-lg font-semibold">AI Document Analyzer (shim)</h3>
    <p class="text-sm text-gray-600 mt-2">Placeholder component — replace with real AI analysis UI.</p>
  </div>
</template>

<script setup>
defineProps({
  documentId: { type: [String, Number], default: null },
  content: { type: String, default: '' },
});
</script>

<style scoped>
.ai-document-analyzer { background: #ffffff; }
</style>
