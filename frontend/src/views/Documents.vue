<template>
  <div v-if="isLoading" class="space-y-6">
    <div class="animate-pulse space-y-4">
      <div class="h-8 bg-gray-200 rounded w-1/3"></div>
      <div class="grid grid-cols-4 gap-3">
        <div v-for="i in 4" :key="i" class="h-24 bg-gray-200 rounded"></div>
      </div>
      <div class="h-60 bg-gray-200 rounded"></div>
    </div>
  </div>

  <div v-else class="space-y-6">
    <!-- Header -->
    <div class="mb-6">
      <h2 class="text-3xl font-bold text-gray-800 flex items-center gap-3">
        <FolderOpen class="w-7 h-7 text-[#003aca]" />
        Documents Management
      </h2>
      <p class="text-gray-600 mt-1">
        Upload, organize, and manage all case documents with OCR capabilities
      </p>
    </div>

    <!-- Upload Section -->
    <div class="p-6 bg-white rounded-lg border border-gray-200">
      <div class="flex items-center justify-between mb-4">
        <div>
          <h3 class="text-lg font-semibold text-gray-800">Upload Document</h3>
          <p class="text-sm text-gray-600 mt-1">Upload new documents to your cases</p>
        </div>
        <Dialog v-model:open="showUploadDialog">
          <DialogTrigger as-child>
            <Button class="bg-[#003aca] hover:bg-[#002a8a] text-white">
              <Upload class="w-4 h-4 mr-2" />
              Upload Documents
            </Button>
          </DialogTrigger>
          <DialogContent class="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Upload New Documents</DialogTitle>
            </DialogHeader>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Select Case</label>
                <Select v-model="uploadCaseId">
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a case..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem v-for="caseItem in cases" :key="caseItem.id" :value="caseItem.id">
                      {{ caseItem.case_number }} - {{ caseItem.title }}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Files</label>
                <Input type="file" multiple @change="handleFileSelect" />
              </div>
              <div class="flex justify-end gap-2">
                <Button variant="outline" @click="showUploadDialog = false">Cancel</Button>
                <Button class="bg-[#003aca] hover:bg-[#002a8a] text-white" @click="handleUpload">
                  Upload
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
      <div class="p-4 bg-white rounded-lg border border-gray-200">
        <div class="flex items-center justify-between">
          <p class="text-xs text-gray-600 font-medium">Total Documents</p>
          <FileText class="w-4 h-4 text-blue-600" />
        </div>
        <p class="text-2xl font-bold text-gray-900 mt-2">{{ documents.length }}</p>
      </div>

      <div class="p-4 bg-white rounded-lg border border-gray-200">
        <div class="flex items-center justify-between">
          <p class="text-xs text-gray-600 font-medium">With OCR Text</p>
          <Eye class="w-4 h-4 text-green-600" />
        </div>
        <p class="text-2xl font-bold text-gray-900 mt-2">
          {{ documents.filter(d => d.ocr_text).length }}
        </p>
      </div>

      <div class="p-4 bg-white rounded-lg border border-gray-200">
        <div class="flex items-center justify-between">
          <p class="text-xs text-gray-600 font-medium">Confidential</p>
          <Lock class="w-4 h-4 text-red-600" />
        </div>
        <p class="text-2xl font-bold text-gray-900 mt-2">
          {{ documents.filter(d => d.is_confidential).length }}
        </p>
      </div>

      <div class="p-4 bg-white rounded-lg border border-gray-200">
        <div class="flex items-center justify-between">
          <p class="text-xs text-gray-600 font-medium">Total Size</p>
          <HardDrive class="w-4 h-4 text-purple-600" />
        </div>
        <p class="text-2xl font-bold text-gray-900 mt-2">
          {{ formatFileSize(documents.reduce((sum, d) => sum + (d.file_size || 0), 0)) }}
        </p>
      </div>
    </div>

    <!-- Filters and Search -->
    <div class="p-6 bg-white rounded-lg border border-gray-200">
      <div class="flex flex-col lg:flex-row gap-4">
        <!-- Search -->
        <div class="flex-1">
          <div class="relative">
            <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              v-model="searchQuery"
              placeholder="Search by filename, content, or tags..."
              class="pl-10"
            />
          </div>
        </div>

        <!-- Filters -->
        <div class="flex gap-2">
          <Select v-model="filters.case_id">
            <SelectTrigger class="w-40">
              <SelectValue placeholder="All Cases" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Cases</SelectItem>
              <SelectItem v-for="caseItem in cases" :key="caseItem.id" :value="caseItem.id">
                {{ caseItem.case_number }}
              </SelectItem>
            </SelectContent>
          </Select>

          <Select v-model="filters.document_type">
            <SelectTrigger class="w-40">
              <SelectValue placeholder="Document Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="contract">Contract</SelectItem>
              <SelectItem value="evidence">Evidence</SelectItem>
              <SelectItem value="correspondence">Correspondence</SelectItem>
              <SelectItem value="court_filing">Court Filing</SelectItem>
              <SelectItem value="research">Research</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>

    <!-- Documents Table -->
    <div class="bg-white rounded-lg border border-gray-200">
      <div class="p-6 border-b border-gray-200">
        <h3 class="text-lg font-semibold text-gray-800">
          Documents ({{ filteredDocuments.length }})
        </h3>
      </div>

      <div v-if="filteredDocuments.length === 0" class="p-12 text-center">
        <FolderOpen class="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 class="text-lg font-semibold text-gray-900 mb-2">No documents found</h3>
        <p class="text-gray-500 mb-4">
          {{ searchQuery || Object.values(filters).some(f => f !== "all")
            ? "Try adjusting your search or filters"
            : "Upload your first document to get started"
          }}
        </p>
        <Button
          v-if="!searchQuery && Object.values(filters).every(f => f === 'all')"
          @click="showUploadDialog = true"
          class="bg-[#003aca] hover:bg-[#002a8a] text-white"
        >
          <Upload class="w-4 h-4 mr-2" />
          Upload Document
        </Button>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Document
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Case
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Type
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Size
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Uploaded
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="doc in filteredDocuments" :key="doc.id" class="hover:bg-gray-50">
              <td class="px-6 py-4">
                <div class="flex items-center">
                  <FileText class="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <div class="text-sm font-medium text-gray-900">{{ doc.filename }}</div>
                    <div class="text-xs text-gray-500" v-if="doc.description">
                      {{ doc.description }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ getCaseNumber(doc.case_id) }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <Badge variant="outline" class="text-xs">
                  {{ doc.document_type?.replace('_', ' ') || 'other' }}
                </Badge>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatFileSize(doc.file_size || 0) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(doc.created_date) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <Button
                  variant="ghost"
                  size="sm"
                  @click="viewDocument(doc)"
                  class="text-[#003aca] hover:text-[#002a8a]"
                >
                  <Eye class="w-4 h-4 mr-1" />
                  View
                </Button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import {
  FolderOpen,
  Upload,
  FileText,
  Eye,
  Lock,
  HardDrive,
  Search,
} from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { format } from 'date-fns'

// State
const router = useRouter()
const documents = ref([])
const cases = ref([])
const isLoading = ref(true)
const searchQuery = ref('')
const filters = ref({
  case_id: 'all',
  document_type: 'all',
})
const showUploadDialog = ref(false)
const uploadCaseId = ref('')
const selectedFiles = ref([])

// Computed
const filteredDocuments = computed(() => {
  let filtered = [...documents.value]

  if (searchQuery.value) {
    filtered = filtered.filter(doc =>
      doc.filename?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      doc.description?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      doc.ocr_text?.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  if (filters.value.case_id !== 'all') {
    filtered = filtered.filter(doc => doc.case_id === filters.value.case_id)
  }

  if (filters.value.document_type !== 'all') {
    filtered = filtered.filter(doc => doc.document_type === filters.value.document_type)
  }

  return filtered
})

// Methods
const loadData = async () => {
  isLoading.value = true
  try {
    // TODO: Replace with actual API calls
    // documents.value = await Document.list()
    // cases.value = await Case.list()
    console.log('TODO: Load documents and cases from API')
    documents.value = []
    cases.value = []
  } catch (error) {
    console.error('Failed to load data:', error)
  }
  isLoading.value = false
}

const handleFileSelect = (event) => {
  selectedFiles.value = Array.from(event.target.files)
}

const handleUpload = async () => {
  if (!uploadCaseId.value || selectedFiles.value.length === 0) {
    return
  }

  try {
    // TODO: Implement file upload
    console.log('TODO: Upload files:', selectedFiles.value)
    showUploadDialog.value = false
    selectedFiles.value = []
    uploadCaseId.value = ''
    await loadData()
  } catch (error) {
    console.error('Upload failed:', error)
  }
}

const viewDocument = (doc) => {
  router.push(`/documents/${doc.id}`)
}

const getCaseNumber = (caseId) => {
  const caseItem = cases.value.find(c => c.id === caseId)
  return caseItem?.case_number || 'N/A'
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const formatDate = (date) => {
  if (!date) return 'N/A'
  return format(new Date(date), 'MMM d, yyyy')
}

// Lifecycle
onMounted(() => {
  loadData()
})

// Watchers
watch([searchQuery, filters], () => {
  // Filters are reactive
}, { deep: true })
</script>
