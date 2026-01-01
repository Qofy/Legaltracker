<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h2 class="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <svg class="w-7 h-7 text-[#003aca]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Documents
        </h2>
        <p class="text-gray-500 mt-1">View and upload case documents</p>
      </div>
      <button @click="showUploadModal = true" class="px-4 py-2 bg-[#003aca] text-white rounded-md hover:bg-[#0031a0] text-sm font-medium">
        Upload Document
      </button>
    </div>

    <!-- Case Selection -->
    <div v-if="myCases.length > 1" class="bg-white rounded-lg border border-gray-200 p-4">
      <label class="block text-sm font-medium text-gray-700 mb-2">Select Case</label>
      <select v-model="selectedCaseId" @change="loadDocuments" class="w-full md:w-96 px-3 py-2 border border-gray-300 rounded-md">
        <option v-for="c in myCases" :key="c.id" :value="c.id">
          {{ c.title }} - #{{ c.case_number }}
        </option>
      </select>
    </div>

    <!-- Document Stats -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="bg-white rounded-lg border border-gray-200 p-5">
        <div class="flex items-center justify-between mb-2">
          <p class="text-sm text-gray-600 font-medium">Total Documents</p>
          <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <p class="text-3xl font-bold text-gray-900">{{ documents.length }}</p>
      </div>

      <div class="bg-white rounded-lg border border-gray-200 p-5">
        <div class="flex items-center justify-between mb-2">
          <p class="text-sm text-gray-600 font-medium">My Uploads</p>
          <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div>
        <p class="text-3xl font-bold text-gray-900">{{ myUploads }}</p>
      </div>

      <div class="bg-white rounded-lg border border-gray-200 p-5">
        <div class="flex items-center justify-between mb-2">
          <p class="text-sm text-gray-600 font-medium">Recent (7 days)</p>
          <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p class="text-3xl font-bold text-gray-900">{{ recentDocuments }}</p>
      </div>
    </div>

    <!-- Documents List -->
    <div class="bg-white rounded-lg border border-gray-200 p-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-gray-800">All Documents</h3>
        <div class="flex items-center gap-3">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search documents..."
            class="px-3 py-2 border border-gray-300 rounded-md text-sm"
          />
          <select v-model="filterType" class="px-3 py-2 border border-gray-300 rounded-md text-sm">
            <option value="">All Types</option>
            <option value="legal">Legal</option>
            <option value="evidence">Evidence</option>
            <option value="correspondence">Correspondence</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      <div v-if="filteredDocuments.length === 0" class="text-center py-12 text-gray-500">
        <svg class="w-16 h-16 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p class="text-sm">No documents found</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600">Document Name</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600">Type</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600">Uploaded By</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600">Upload Date</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="doc in filteredDocuments" :key="doc.id" class="hover:bg-gray-50">
              <td class="px-4 py-3">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-blue-100 rounded flex items-center justify-center">
                    <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-900">{{ doc.file_name }}</p>
                    <p class="text-xs text-gray-500">{{ doc.file_size || 'Unknown size' }}</p>
                  </div>
                </div>
              </td>
              <td class="px-4 py-3">
                <span class="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs capitalize">
                  {{ doc.document_type || 'other' }}
                </span>
              </td>
              <td class="px-4 py-3 text-sm text-gray-600">
                {{ doc.is_uploaded_by_customer ? 'You' : 'Your Lawyer' }}
              </td>
              <td class="px-4 py-3 text-sm text-gray-600">{{ formatDate(doc.upload_date) }}</td>
              <td class="px-4 py-3">
                <button class="text-blue-600 hover:text-blue-700 mr-3">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
                <button class="text-gray-600 hover:text-gray-700">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Upload Modal -->
    <div v-if="showUploadModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click.self="showUploadModal = false">
      <div class="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">Upload Document</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Document Type</label>
            <select v-model="uploadForm.type" class="w-full px-3 py-2 border border-gray-300 rounded-md">
              <option value="evidence">Evidence</option>
              <option value="correspondence">Correspondence</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Select File</label>
            <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input type="file" @change="handleFileSelect" class="hidden" ref="fileInput" />
              <button @click="$refs.fileInput.click()" class="text-blue-600 hover:text-blue-700">
                <svg class="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <span class="text-sm">{{ uploadForm.fileName || 'Click to select a file' }}</span>
              </button>
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Description (Optional)</label>
            <textarea v-model="uploadForm.description" rows="3" class="w-full px-3 py-2 border border-gray-300 rounded-md"></textarea>
          </div>
        </div>
        <div class="flex justify-end gap-3 mt-6">
          <button @click="showUploadModal = false" class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
            Cancel
          </button>
          <button @click="uploadDocument" class="px-4 py-2 bg-[#003aca] text-white rounded-md hover:bg-[#0031a0]">
            Upload
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { Case, Document } from '@/services/entities';
import { useAuthStore } from '@/stores/auth';
import { format } from 'date-fns';

const authStore = useAuthStore();

const myCases = ref([]);
const selectedCaseId = ref('');
const documents = ref([]);
const searchQuery = ref('');
const filterType = ref('');
const showUploadModal = ref(false);
const fileInput = ref(null);

const uploadForm = ref({
  type: 'evidence',
  fileName: '',
  file: null,
  description: '',
});

const myUploads = computed(() => {
  return documents.value.filter(d => d.is_uploaded_by_customer).length;
});

const recentDocuments = computed(() => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  return documents.value.filter(d => new Date(d.upload_date) >= sevenDaysAgo).length;
});

const filteredDocuments = computed(() => {
  let filtered = documents.value;

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(d =>
      d.file_name?.toLowerCase().includes(query) ||
      d.description?.toLowerCase().includes(query)
    );
  }

  if (filterType.value) {
    filtered = filtered.filter(d => d.document_type === filterType.value);
  }

  return filtered;
});

const loadMyCases = async () => {
  try {
    const userId = authStore.user?.id;
    if (!userId) return;

    const allCases = await Case.list();
    myCases.value = allCases.filter(c =>
      c.customer_ids && Array.isArray(c.customer_ids) && c.customer_ids.includes(userId)
    );

    if (myCases.value.length > 0) {
      selectedCaseId.value = myCases.value[0].id;
      await loadDocuments();
    }
  } catch (error) {
    console.error('Failed to load cases:', error);
  }
};

const loadDocuments = async () => {
  try {
    if (!selectedCaseId.value) return;

    const userId = authStore.user?.id;
    const allDocuments = await Document.list();
    documents.value = allDocuments
      .filter(d =>
        d.case_id === selectedCaseId.value &&
        (d.visibility_type === 'public' || d.visibility_type === 'client')
      )
      .map(d => ({
        ...d,
        is_uploaded_by_customer: d.uploaded_by === userId,
      }));
  } catch (error) {
    console.error('Failed to load documents:', error);
  }
};

const handleFileSelect = (event) => {
  const file = event.target.files[0];
  if (file) {
    uploadForm.value.file = file;
    uploadForm.value.fileName = file.name;
  }
};

const uploadDocument = async () => {
  try {
    if (!uploadForm.value.file || !selectedCaseId.value) {
      alert('Please select a file');
      return;
    }

    // In production, upload file to server
    const docData = {
      case_id: selectedCaseId.value,
      file_name: uploadForm.value.fileName,
      document_type: uploadForm.value.type,
      description: uploadForm.value.description,
      uploaded_by: authStore.user?.id,
      visibility_type: 'client',
    };

    const uploaded = await Document.create(docData);
    documents.value.unshift({
      ...uploaded,
      is_uploaded_by_customer: true,
    });

    // Reset form
    uploadForm.value = {
      type: 'evidence',
      fileName: '',
      file: null,
      description: '',
    };
    showUploadModal.value = false;

    alert('Document uploaded successfully');
  } catch (error) {
    console.error('Failed to upload document:', error);
    alert('Failed to upload document');
  }
};

const formatDate = (date) => {
  try {
    return format(new Date(date), 'MMM d, yyyy');
  } catch (e) {
    return '';
  }
};

onMounted(() => {
  loadMyCases();
});
</script>
