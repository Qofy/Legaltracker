<template>
  <div class="material-elevation-1 clean-border bg-white rounded-lg">
    <div class="p-6">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold">Case Documents</h3>
        <label class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="17 8 12 3 7 8"></polyline>
            <line x1="12" y1="3" x2="12" y2="15"></line>
          </svg>
          {{ isUploading ? 'Uploading...' : 'Upload Document' }}
          <input
            type="file"
            class="hidden"
            @change="handleFileUpload"
            :disabled="isUploading"
          />
        </label>
      </div>

      <div v-if="isLoading">
        <p>Loading documents...</p>
      </div>
      <div v-else>
        <table class="w-full">
          <thead>
            <tr class="border-b">
              <th class="text-left py-3 px-4 font-medium">Name</th>
              <th class="text-left py-3 px-4 font-medium">Type</th>
              <th class="text-left py-3 px-4 font-medium">Size</th>
              <th class="text-right py-3 px-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="documents.length === 0">
              <td colspan="4" class="text-center py-4">No documents found.</td>
            </tr>
            <tr v-for="doc in documents" :key="doc.id" class="border-b hover:bg-gray-50">
              <td class="py-3 px-4 font-medium">{{ doc.file_name }}</td>
              <td class="py-3 px-4">{{ doc.file_type }}</td>
              <td class="py-3 px-4">{{ formatFileSize(doc.file_size) }}</td>
              <td class="py-3 px-4 text-right space-x-2">
                <a
                  :href="doc.file_url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-block p-2 hover:bg-gray-100 rounded-md"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                </a>
                <button
                  @click="handleDelete(doc.id)"
                  class="inline-block p-2 hover:bg-gray-100 rounded-md"
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
import { ref, onMounted } from 'vue';
// TODO: Import entities and integrations when backend is ready
// import { Document } from '@/entities/Document';
// import { UploadFile, ExtractDataFromUploadedFile } from '@/integrations/Core';

const props = defineProps({
  caseId: {
    type: [String, Number],
    required: true
  }
});

const documents = ref([]);
const isLoading = ref(true);
const isUploading = ref(false);

onMounted(() => {
  loadDocuments();
});

const loadDocuments = async () => {
  isLoading.value = true;
  // TODO: Uncomment when backend API is ready
  /*
  try {
    const docs = await Document.filter({ case_id: props.caseId });
    documents.value = docs;
  } catch (error) {
    console.error("Failed to load documents:", error);
  }
  */

  // Mock data for development
  documents.value = [
    {
      id: 1,
      file_name: 'contract.pdf',
      file_type: 'pdf',
      file_size: 1024000,
      file_url: '#',
      document_type: 'contract'
    },
    {
      id: 2,
      file_name: 'evidence.jpg',
      file_type: 'jpg',
      file_size: 512000,
      file_url: '#',
      document_type: 'evidence'
    }
  ];
  isLoading.value = false;
};

const handleFileUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  isUploading.value = true;
  // TODO: Uncomment when backend API is ready
  /*
  try {
    const { file_url } = await UploadFile({ file });
    const newDoc = {
      case_id: props.caseId,
      file_name: file.name,
      file_url: file_url,
      file_type: file.type.split('/')[1] || 'other',
      file_size: file.size,
      document_type: 'other' // default
    };
    await Document.create(newDoc);
    loadDocuments();
  } catch (error) {
    console.error("Upload failed:", error);
  }
  */

  // Mock upload for development
  console.log('Uploading file:', {
    case_id: props.caseId,
    file_name: file.name,
    file_type: file.type.split('/')[1] || 'other',
    file_size: file.size
  });
  setTimeout(() => {
    loadDocuments();
  }, 1000);

  isUploading.value = false;
  event.target.value = ''; // Reset input
};

const handleDelete = async (docId) => {
  if (window.confirm("Are you sure you want to delete this document?")) {
    // TODO: Uncomment when backend API is ready
    /*
    try {
      await Document.delete(docId);
      loadDocuments();
    } catch (error) {
      console.error("Failed to delete document:", error);
    }
    */

    // Mock deletion for development
    console.log('Deleting document:', docId);
    loadDocuments();
  }
};

const formatFileSize = (bytes) => {
  return (bytes / 1024).toFixed(2) + ' KB';
};
</script>
