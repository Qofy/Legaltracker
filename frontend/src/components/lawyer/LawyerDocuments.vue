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
        <p class="text-gray-500 mt-1">View case documents (shows uploader name)</p>
      </div>
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
                {{ doc.uploadedByName || (doc.uploaded_by?.full_name || doc.uploaded_by || 'Unknown') }}
              </td>
              <td class="px-4 py-3 text-sm text-gray-600">{{ formatDate(doc.upload_date) }}</td>
              <td class="px-4 py-3">
                <button @click.prevent="viewDocument(doc)" class="text-blue-600 hover:text-blue-700 mr-3">View</button>
                <button @click.prevent="downloadDocument(doc)" class="text-gray-600 hover:text-gray-700">Download</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { Case, Document, User } from '@/services/entities';
import { useAuthStore } from '@/stores/auth';
import { format } from 'date-fns';

const authStore = useAuthStore();

const myCases = ref([]);
const selectedCaseId = ref('');
const documents = ref([]);
const searchQuery = ref('');
const filterType = ref('');

const showViewerModal = ref(false);
const viewedDocument = ref(null);

const userCache = ref({});

const filteredDocuments = computed(() => {
  let filtered = documents.value;
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    filtered = filtered.filter(d => (d.file_name || '').toLowerCase().includes(q) || (d.description || '').toLowerCase().includes(q));
  }
  if (filterType.value) filtered = filtered.filter(d => d.document_type === filterType.value);
  return filtered;
});

const loadMyCases = async () => {
  try {
    const list = await Case.list();
    myCases.value = (list || []).filter(c => c.assigned_lawyer_id === authStore.user?.id || (c.assigned_lawyer && c.assigned_lawyer.id === authStore.user?.id));
    if (myCases.value.length > 0) {
      selectedCaseId.value = myCases.value[0].id;
      await loadDocuments();
    }
  } catch (e) {
    console.error('Failed to load cases for lawyer', e);
  }
};

const loadDocuments = async () => {
  try {
    if (!selectedCaseId.value) return;
    const all = await Document.list();
    // map and resolve uploader names
    await Promise.all((all || []).map(async (d) => {
      const doc = { ...d };
      // normalize upload date
      doc.upload_date = d.upload_date || d.created_date || d.updated_date || new Date().toISOString();
      // resolve uploaded_by to name
      if (d.uploaded_by && typeof d.uploaded_by === 'object') {
        doc.uploadedByName = d.uploaded_by.full_name || d.uploaded_by.name || d.uploaded_by.email;
      } else if (d.uploaded_by) {
        try {
          if (!userCache.value[d.uploaded_by]) userCache.value[d.uploaded_by] = await User.get(d.uploaded_by);
          const u = userCache.value[d.uploaded_by];
          doc.uploadedByName = u?.full_name || u?.name || u?.email || d.uploaded_by;
        } catch (e) {
          doc.uploadedByName = d.uploaded_by;
        }
      } else {
        doc.uploadedByName = 'Unknown';
      }
      return doc;
    })).then(res => {
      documents.value = (res || []).filter(d => d.case_id === selectedCaseId.value);
    });
  } catch (e) {
    console.error('Failed to load documents for lawyer view', e);
  }
};

const viewDocument = (doc) => { viewedDocument.value = doc; showViewerModal.value = true; };
const closeViewer = () => { showViewerModal.value = false; viewedDocument.value = null; };

const isPreviewPdf = (doc) => doc && (doc.file_type === 'pdf' || (doc.file_name && doc.file_name.toLowerCase().endsWith('.pdf')));
const isPreviewImage = (doc) => doc && (doc.file_type === 'image' || /\.(png|jpe?g|gif|bmp|webp)$/i.test(doc.file_name || ''));

const downloadDocument = (doc) => {
  if (!doc || !doc.file_url) {
    const downloadHref = `/api/documents/${doc?.id}/download`;
    const a = document.createElement('a'); a.href = downloadHref; a.download = doc?.file_name || 'document'; a.target = '_blank'; document.body.appendChild(a); a.click(); document.body.removeChild(a); return;
  }
  const a = document.createElement('a'); a.href = doc.file_url; a.download = doc.file_name || 'document'; a.target = '_blank'; document.body.appendChild(a); a.click(); document.body.removeChild(a);
};

const formatDate = (date) => { try { return format(new Date(date), 'MMM d, yyyy'); } catch (e) { return ''; } };

onMounted(() => { loadMyCases(); });
</script>
