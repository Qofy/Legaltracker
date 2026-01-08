<template>
  <div v-if="isLoading" class="space-y-6">
    <div class="animate-pulse space-y-4">
      <div class="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
      <div class="grid grid-cols-4 gap-3">
        <div v-for="i in 4" :key="i" class="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
      <div class="h-60 bg-gray-200 dark:bg-gray-700 rounded"></div>
    </div>
  </div>

  <div v-else class="space-y-6">
    <!-- Header -->
    <div class="mb-6">
      <h2 class="text-3xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-3">
        <FolderOpen class="w-7 h-7 text-[#003aca] dark:text-blue-400" />
        Documents Management
      </h2>
      <p class="text-gray-600 dark:text-gray-300 mt-1">
        Upload, organize, and manage all case documents with OCR capabilities
      </p>
    </div>

    <!-- Case Selection for Analysis -->
    <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <div class="mb-4">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
          <svg class="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
          Case Analysis & Insights
        </h3>
        <p class="text-sm text-gray-600 dark:text-gray-300 mt-1">Select a case to view document points and AI-powered insights</p>
      </div>

      <div class="mb-6">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Case</label>
        <div class="relative">
          <select
            v-model="selectedCaseForInsights"
            class="appearance-none w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8 bg-white dark:bg-gray-700 dark:text-gray-100"
          >
            <option value="">Choose a case to analyze...</option>
            <option v-for="caseItem in cases" :key="caseItem.id" :value="caseItem.id">
              {{ caseItem.case_number }} - {{ caseItem.title }}
            </option>
          </select>
          <ChevronDown class="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500 pointer-events-none" />
        </div>
      </div>

      <!-- Point Tracker for selected case -->
      <div v-if="selectedCaseForInsights && selectedCaseData" class="space-y-6">
        <DocumentPointsPanel
          :documents="caseDocuments"
          :case-data="selectedCaseData"
        />

        <AIDocumentAssistant
          :case-id="selectedCaseForInsights"
          :documents="caseDocuments"
        />
      </div>

      <div v-else class="p-8 text-center border-2 border-dashed border-gray-300 rounded-lg">
        <svg class="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
        <p class="text-gray-600 font-medium mb-1">No Case Selected</p>
        <p class="text-sm text-gray-500">Select a case from the dropdown above to view point tracking and AI insights</p>
      </div>
    </div>

    <!-- Enhanced Upload Section -->
    <div class="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100">Upload Document</h3>
          <p class="text-sm text-gray-600 dark:text-gray-300 mt-1">Upload new documents to your cases</p>
        </div>
        <Button 
          @click="showUploadDialog = true" 
          class="bg-[#003aca] hover:bg-[#002a8a] dark:bg-blue-600 dark:hover:bg-blue-700 text-white px-4 py-2"
        >
          <Upload class="w-4 h-4 mr-2" />
          Upload Documents
        </Button>
      </div>

      <!-- Drag and Drop Upload Zone -->
      <div 
        @drop="handleDrop"
        @dragover="handleDragOver"
        @dragenter="handleDragEnter"
        @dragleave="handleDragLeave"
        :class="[
          'border-2 border-dashed rounded-lg p-8 text-center transition-colors',
          isDragOver ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-600',
          'hover:border-blue-400 dark:hover:border-blue-500'
        ]"
      >
        <Upload class="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
          {{ isDragOver ? 'Drop files here' : 'Drag and drop files here' }}
        </h3>
        <p class="text-gray-500 dark:text-gray-400 mb-4">
          or click to browse and select files
        </p>
        <input 
          ref="fileInput"
          type="file" 
          multiple 
          @change="handleFileSelect" 
          class="hidden"
          accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif"
        />
        <Button 
          @click="$refs.fileInput.click()" 
          variant="outline"
          class="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          Browse Files
        </Button>
      </div>

      <!-- Selected Files Display -->
      <div v-if="selectedFiles.length > 0" class="mt-6">
        <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Selected Files ({{ selectedFiles.length }})
        </h4>
        <div class="space-y-2">
          <div 
            v-for="(file, index) in selectedFiles" 
            :key="index"
            class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-md"
          >
            <div class="flex items-center space-x-3">
              <FileText class="w-5 h-5 text-gray-400 dark:text-gray-500" />
              <div>
                <p class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ file.name }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">{{ formatFileSize(file.size) }}</p>
              </div>
            </div>
            <Button 
              @click="removeFile(index)" 
              variant="ghost" 
              size="sm"
              class="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
            >
              Remove
            </Button>
          </div>
        </div>
        
        <!-- Upload Controls -->
        <div class="mt-4 flex items-center justify-between">
          <div class="flex-1 mr-4">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Case</label>
            <select
              v-model="uploadCaseId"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 dark:text-gray-100"
            >
              <option value="">Choose a case...</option>
              <option v-for="caseItem in cases" :key="caseItem.id" :value="caseItem.id">
                {{ caseItem.case_number }} - {{ caseItem.title }}
              </option>
            </select>
          </div>
          <div class="flex space-x-2">
            <Button 
              @click="clearFiles" 
              variant="outline"
              class="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Clear
            </Button>
            <Button 
              @click="handleUpload" 
              :disabled="!uploadCaseId || isUploading"
              class="bg-[#003aca] hover:bg-[#002a8a] dark:bg-blue-600 dark:hover:bg-blue-700 text-white disabled:opacity-50"
            >
              <span v-if="isUploading" class="flex items-center">
                <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Uploading...
              </span>
              <span v-else>Upload Files</span>
            </Button>
          </div>
        </div>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
      <div class="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <p class="text-xs text-gray-600 dark:text-gray-400 font-medium">Total Documents</p>
          <FileText class="w-4 h-4 text-blue-600 dark:text-blue-400" />
        </div>
        <p class="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-2">{{ documents.length }}</p>
      </div>

      <div class="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <p class="text-xs text-gray-600 dark:text-gray-400 font-medium">With OCR Text</p>
          <Eye class="w-4 h-4 text-green-600 dark:text-green-400" />
        </div>
        <p class="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-2">
          {{ documents.filter(d => d.ocr_text).length }}
        </p>
      </div>

      <div class="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <p class="text-xs text-gray-600 dark:text-gray-400 font-medium">Confidential</p>
          <Lock class="w-4 h-4 text-red-600 dark:text-red-400" />
        </div>
        <p class="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-2">
          {{ documents.filter(d => d.is_confidential).length }}
        </p>
      </div>

      <div class="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <p class="text-xs text-gray-600 dark:text-gray-400 font-medium">Total Size</p>
          <HardDrive class="w-4 h-4 text-purple-600 dark:text-purple-400" />
        </div>
        <p class="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-2">
          {{ formatFileSize(documents.reduce((sum, d) => sum + (d.file_size || 0), 0)) }}
        </p>
      </div>
    </div>

    <!-- Filters and Search -->
    <div class="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <div class="flex flex-col lg:flex-row gap-4">
        <!-- Search -->
        <div class="flex-1">
          <div class="relative">
            <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
            <Input
              v-model="searchQuery"
              placeholder="Search by filename, content, or tags..."
              class="pl-10 bg-gray-50 placeholder-gray-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
            />
          </div>
        </div>

        <!-- Filters -->
        <div class="flex gap-2">
          <div class="relative">
            <select
              v-model="filters.case_id"
              class="appearance-none px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8 bg-white dark:bg-gray-700 dark:text-gray-100 w-40"
            >
              <option value="all">All Cases</option>
              <option v-for="caseItem in cases" :key="caseItem.id" :value="caseItem.id">
                {{ caseItem.case_number }}
              </option>
            </select>
            <ChevronDown class="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500 pointer-events-none" />
          </div>

          <div class="relative">
            <select
              v-model="filters.document_type"
              class="appearance-none px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8 bg-white dark:bg-gray-700 dark:text-gray-100 w-40"
            >
              <option value="all">All Types</option>
              <option value="contract">Contract</option>
              <option value="evidence">Evidence</option>
              <option value="correspondence">Correspondence</option>
              <option value="court_filing">Court Filing</option>
              <option value="research">Research</option>
              <option value="other">Other</option>
            </select>
            <ChevronDown class="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500 pointer-events-none" />
          </div>
        </div>
      </div>
    </div>

    <!-- Documents Table -->
    <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <div class="p-6 border-b border-gray-200 dark:border-gray-700">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100">
          Documents ({{ filteredDocuments.length }})
        </h3>
      </div>

      <div v-if="filteredDocuments.length === 0" class="p-12 text-center">
        <FolderOpen class="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
        <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">No documents found</h3>
        <p class="text-gray-500 dark:text-gray-400 mb-4">
          {{ searchQuery || Object.values(filters).some(f => f !== "all")
            ? "Try adjusting your search or filters"
            : "Upload your first document to get started"
          }}
        </p>
        <Button
          v-if="!searchQuery && Object.values(filters).every(f => f === 'all')"
          @click="showUploadDialog = true"
          class="bg-[#003aca] hover:bg-[#002a8a] dark:bg-blue-600 dark:hover:bg-blue-700 text-white px-2.5 h-10"
        >
          <Upload class="w-4 h-4 mr-2" />
          Upload Document
        </Button>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                Document
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                Case
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                Type
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                Size
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                Uploaded
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="doc in filteredDocuments" :key="doc.id" class="hover:bg-blue-50 dark:hover:bg-gray-700 hover:shadow-sm cursor-pointer transition duration-150 ease-in-out">
              <td class="px-6 py-4">
                <div class="flex items-center">
                  <FileText class="w-5 h-5 text-gray-400 dark:text-gray-500 mr-3" />
                  <div>
                    <div class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ doc.filename }}</div>
                    <div class="text-xs text-gray-500 dark:text-gray-400" v-if="doc.description">
                      {{ doc.description }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900 dark:text-gray-100">{{ getCaseNumber(doc.case_id) }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <Badge variant="outline" class="text-xs dark:border-gray-600 dark:text-gray-300">
                  {{ doc.document_type?.replace('_', ' ') || 'other' }}
                </Badge>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {{ formatFileSize(doc.file_size || 0) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {{ formatDate(doc.created_date) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <Button
                  variant="ghost"
                  size="sm"
                  @click="viewDocument(doc)"
                  class="text-[#003aca] hover:text-[#002a8a] dark:text-blue-400 dark:hover:text-blue-300"
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
  ChevronDown,
} from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import DocumentPointsPanel from '@/components/documents/DocumentPointsPanel.vue'
import AIDocumentAssistant from '@/components/documents/AIDocumentAssistant.vue'

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
const selectedCaseForInsights = ref('')
const isUploading = ref(false)
const isDragOver = ref(false)
const fileInput = ref(null)

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

const selectedCaseData = computed(() => {
  if (!selectedCaseForInsights.value) return null
  return cases.value.find(c => c.id === selectedCaseForInsights.value)
})

const caseDocuments = computed(() => {
  if (!selectedCaseForInsights.value) return []
  return documents.value.filter(d => d.case_id === selectedCaseForInsights.value)
})

// Methods
const loadData = async () => {
  isLoading.value = true
  try {
    // TODO: Replace with actual API calls
    // documents.value = await Document.list()
    // cases.value = await Case.list()
    // TODO: Load documents and cases from API (debug removed)

    // Mock data for testing
    cases.value = [
      {
        id: '1',
        case_number: 'CASE-2024-001',
        title: 'Smith v. Johnson Construction',
        status: 'in_progress',
        case_type: 'civil'
      },
      {
        id: '2',
        case_number: 'CASE-2024-002',
        title: 'Estate of Williams',
        status: 'open',
        case_type: 'estate'
      }
    ]

    documents.value = [
      {
        id: '1',
        case_id: '1',
        filename: 'contract_agreement.pdf',
        description: 'Initial contract agreement',
        document_type: 'contract',
        file_size: 245000,
        ocr_text: 'Sample OCR text',
        is_confidential: true,
        submitted_by_party: 'us',
        points_awarded: 8,
        created_date: '2024-01-15'
      },
      {
        id: '2',
        case_id: '1',
        filename: 'evidence_photo.jpg',
        description: 'Site inspection photos',
        document_type: 'evidence',
        file_size: 512000,
        submitted_by_party: 'them',
        points_awarded: 5,
        created_date: '2024-01-20'
      },
      {
        id: '3',
        case_id: '2',
        filename: 'will_document.pdf',
        description: 'Last will and testament',
        document_type: 'court_filing',
        file_size: 180000,
        ocr_text: 'Will content',
        created_date: '2024-02-01'
      }
    ]
  } catch (error) {
    console.error('Failed to load data:', error)
  }
  isLoading.value = false
}

const handleFileSelect = (event) => {
  const files = Array.from(event.target.files)
  selectedFiles.value = [...selectedFiles.value, ...files]
}

const handleDrop = (event) => {
  event.preventDefault()
  isDragOver.value = false
  const files = Array.from(event.dataTransfer.files)
  selectedFiles.value = [...selectedFiles.value, ...files]
}

const handleDragOver = (event) => {
  event.preventDefault()
}

const handleDragEnter = (event) => {
  event.preventDefault()
  isDragOver.value = true
}

const handleDragLeave = (event) => {
  event.preventDefault()
  if (!event.currentTarget.contains(event.relatedTarget)) {
    isDragOver.value = false
  }
}

const removeFile = (index) => {
  selectedFiles.value.splice(index, 1)
}

const clearFiles = () => {
  selectedFiles.value = []
  uploadCaseId.value = ''
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const handleUpload = async () => {
  if (!uploadCaseId.value || selectedFiles.value.length === 0) {
    alert('Please select a case and at least one file')
    return
  }

  isUploading.value = true
  try {
    // Simulate upload process
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Create mock documents for uploaded files
    const newDocuments = selectedFiles.value.map((file, index) => ({
      id: Date.now() + index,
      case_id: uploadCaseId.value,
      filename: file.name,
      description: `Uploaded document: ${file.name}`,
      document_type: getDocumentType(file.name),
      file_size: file.size,
      is_confidential: false,
      submitted_by_party: 'us',
      points_awarded: Math.floor(Math.random() * 10) + 1,
      created_date: new Date().toISOString().split('T')[0]
    }))
    
    documents.value = [...documents.value, ...newDocuments]
    
    // Success notification
    alert(`Successfully uploaded ${selectedFiles.value.length} file(s)!`)
    
    clearFiles()
  } catch (error) {
    console.error('Upload failed:', error)
    alert('Upload failed. Please try again.')
  } finally {
    isUploading.value = false
  }
}

const getDocumentType = (filename) => {
  const extension = filename.split('.').pop()?.toLowerCase()
  const typeMap = {
    'pdf': 'contract',
    'doc': 'correspondence',
    'docx': 'correspondence',
    'txt': 'other',
    'jpg': 'evidence',
    'jpeg': 'evidence',
    'png': 'evidence',
    'gif': 'evidence'
  }
  return typeMap[extension] || 'other'
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
