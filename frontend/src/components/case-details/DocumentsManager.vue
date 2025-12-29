<template>
  <Card class="material-elevation-1 clean-border">
    <CardContent class="p-6">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold">Case Documents</h3>
        <div>
          <Button variant="outline">
            <label class="cursor-pointer flex items-center">
              <Upload class="w-4 h-4 mr-2" />
              <span>{{ isUploading ? 'Uploading...' : 'Upload Document' }}</span>
              <input ref="fileInput" type="file" class="hidden" @change="handleFileUpload" :disabled="isUploading" />
            </label>
          </Button>
        </div>
      </div>

      <div v-if="isLoading">Loading documents...</div>

      <Table v-else>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Size</TableHead>
            <TableHead class="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-if="documents.length === 0">
            <TableCell colSpan="4" class="text-center">No documents found.</TableCell>
          </TableRow>
          <TableRow v-for="doc in documents" :key="doc.id">
            <TableCell class="font-medium">{{ doc.file_name }}</TableCell>
            <TableCell>{{ doc.file_type }}</TableCell>
            <TableCell>{{ formatSize(doc.file_size) }}</TableCell>
            <TableCell class="text-right space-x-2">
              <Button variant="ghost" size="icon">
                <a :href="doc.file_url" target="_blank" rel="noopener noreferrer"><Eye class="w-4 h-4" /></a>
              </Button>
              <Button variant="ghost" size="icon" @click="handleDelete(doc.id)">
                <Trash2 class="w-4 h-4" />
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </CardContent>
  </Card>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { Document } from '@/services/entities';
import { UploadFile } from '@/integrations/Core';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Upload, Trash2, Eye } from 'lucide-vue-next';

const props = defineProps({ caseId: { type: [String, Number], required: true } });

const documents = ref([]);
const isLoading = ref(true);
const isUploading = ref(false);
const fileInput = ref(null);

const loadDocuments = async () => {
  isLoading.value = true;
  const docs = await Document.filter({ case_id: props.caseId });
  documents.value = docs || [];
  isLoading.value = false;
};

onMounted(loadDocuments);
watch(() => props.caseId, () => { loadDocuments(); });

const handleFileUpload = async (e) => {
  const file = e.target.files ? e.target.files[0] : null;
  if (!file) return;

  isUploading.value = true;
  try {
    const { file_url } = await UploadFile({ file });
    const newDoc = {
      case_id: props.caseId,
      file_name: file.name,
      file_url: file_url,
      file_type: (file.type && file.type.split('/')[1]) || 'other',
      file_size: file.size,
      document_type: 'other'
    };
    await Document.create(newDoc);
    await loadDocuments();
  } catch (err) {
    // keep simple console logging to match prior behavior
    // consumers may have toast; keep logging for now
    // eslint-disable-next-line no-console
    console.error('Upload failed:', err);
  }
  isUploading.value = false;
  // reset input so same file can be uploaded again if needed
  if (fileInput.value) fileInput.value.value = null;
};

const handleDelete = async (docId) => {
  if (confirm('Are you sure you want to delete this document?')) {
    await Document.delete(docId);
    await loadDocuments();
  }
};

const formatSize = (size) => {
  if (!size) return '0 KB';
  return `${(size / 1024).toFixed(2)} KB`;
};
</script>

<style scoped>
/* no additional styles */
</style>
