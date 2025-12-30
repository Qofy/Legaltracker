<template>
 <div v-if="isLoading" class="p-6 space-y-6">
    <div class="animate-pulse space-y-4">
      <div class="h-8 bg-gray-200 rounded w-1/3"></div>
      <div class="h-60 bg-gray-200 rounded"></div>
    </div>
  </div>

  <div v-else class="space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <FolderOpen class="w-7 h-7 text-[#003aca]" />
            Documents Management
          </h2>
          <p class="text-gray-500 mt-1">
            Upload, organize, and manage all case documents with OCR capabilities
          </p>
        </div>
        <div>
          <Dialog v-model:open="showUploadDialog">
            <DialogTrigger as-child>
              <button class="px-4 py-2 bg-[#003aca] text-white rounded-md hover:bg-[#0031a0] text-sm font-medium flex items-center gap-2">
                <Upload class="w-4 h-4" />
                Upload Documents
              </button>
            </DialogTrigger>

            <DialogContent class="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Upload New Documents</DialogTitle>
              </DialogHeader>

              <div class="space-y-6">
                <div>
                  <Label for="case_id">Select Case</Label>
                  <div class="relative">
                    <Select v-model="uploadData.case_id" :disabled="!!pinnedCaseId">
                      <SelectTrigger class="clean-border">
                        <SelectValue placeholder="Choose a case" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Choose a case</SelectItem>
                        <SelectItem v-for="caseItem in cases" :key="caseItem.id" :value="caseItem.id">
                          {{ caseItem.case_number }} - {{ caseItem.title }} ({{ documents.filter(d => d.case_id === caseItem.id).length }})
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <ChevronDown class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <Label for="submitted_by_party">Submitted By</Label>
                  <Select v-model="uploadData.submitted_by_party">
                    <SelectTrigger class="clean-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="us">Our Team</SelectItem>
                      <SelectItem value="counterpart">Counterpart</SelectItem>
                      <SelectItem value="court">Court</SelectItem>
                      <SelectItem value="third_party">Third Party</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label for="document_type">Document Type</Label>
                  <Select v-model="uploadData.document_type">
                    <SelectTrigger class="clean-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="contract">Contract</SelectItem>
                      <SelectItem value="evidence">Evidence</SelectItem>
                      <SelectItem value="correspondence">Correspondence</SelectItem>
                      <SelectItem value="court_filing">Court Filing</SelectItem>
                      <SelectItem value="research">Research</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label for="points_awarded">Initial Points</Label>
                  <Input
                    id="points_awarded"
                    type="number"
                    v-model.number="uploadData.points_awarded"
                    placeholder="0"
                    class="clean-border"
                  />
                </div>

                <div>
                  <Label for="tags">Tags (comma-separated)</Label>
                  <Input
                    id="tags"
                    v-model="uploadData.tags"
                    placeholder="contract, important, review"
                    class="clean-border"
                  />
                </div>

                <div class="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="is_confidential"
                    v-model="uploadData.is_confidential"
                    class="rounded border-gray-300"
                  />
                  <Label for="is_confidential">Mark as confidential</Label>
                </div>

                <div class="border-t pt-4 space-y-3">
                  <Label>Upload File</Label>
                  <Input
                    id="file_upload"
                    type="file"
                    multiple
                    @change="handleFileUpload"
                    :disabled="isUploading || !uploadData.case_id"
                    class="clean-border"
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,.gif,.txt"
                  />

                  <div class="flex items-center space-x-2">
                    <span class="text-sm text-gray-600">or</span>
                  </div>

                  <div>
                    <Label for="email_import" class="flex items-center space-x-2">
                      <Mail class="w-4 h-4" />
                      <span>Import Email (.eml file)</span>
                    </Label>
                    <Input
                      id="email_import"
                      type="file"
                      @change="handleEmailImport"
                      :disabled="isUploading || !uploadData.case_id"
                      class="clean-border mt-2"
                      accept=".eml"
                    />
                  </div>
                </div>

                <div v-if="isUploading" class="space-y-2">
                  <div class="flex justify-between text-sm">
                    <span>Uploading and processing...</span>
                    <span>{{ Math.round(uploadProgress) }}%</span>
                  </div>
                  <Progress :model-value="uploadProgress" class="w-full" />
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <!-- Main Content - 3 columns -->
        <div class="lg:col-span-3 space-y-6">
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
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="w-4 h-4 text-red-600"
                >
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              <p class="text-2xl font-bold text-gray-900 mt-2">
                {{ documents.filter(d => d.is_confidential).length }}
              </p>
            </div>

            <div class="p-4 bg-white rounded-lg border border-gray-200">
              <div class="flex items-center justify-between">
                <p class="text-xs text-gray-600 font-medium">Total Size</p>
                <Upload class="w-4 h-4 text-purple-600" />
              </div>
              <p class="text-2xl font-bold text-gray-900 mt-2">
                {{ formatFileSize(documents.reduce((sum, d) => sum + (d.file_size || 0), 0)) }}
              </p>
            </div>
          </div>

          <!-- Filters and Search -->
          <div class="bg-white rounded-lg border border-gray-200 p-4">
            <div class="flex flex-col lg:flex-row gap-3">
              <div class="flex-1">
                <div class="relative">
                  <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    v-model="searchQuery"
                    placeholder="Search by filename, content, or tags..."
                    class="pl-10 border-gray-300 h-10"
                  />
                </div>
              </div>

              <div class="flex flex-col sm:flex-row gap-2">
                <Select v-model="filters.case_id">
                  <SelectTrigger class="w-full sm:w-40 border-gray-300 h-10">
                    <SelectValue placeholder="All Cases" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Cases ({{ documents.length }})</SelectItem>
                    <SelectItem v-for="caseItem in cases" :key="caseItem.id" :value="caseItem.id">
                      {{ caseItem.case_number }} ({{ documents.filter(d => d.case_id === caseItem.id).length }})
                    </SelectItem>
                  </SelectContent>
                </Select>

                <Select v-model="filters.file_type">
                  <SelectTrigger class="w-full sm:w-32 border-gray-300 h-10">
                    <SelectValue placeholder="File Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="docx">Word</SelectItem>
                    <SelectItem value="xlsx">Excel</SelectItem>
                    <SelectItem value="image">Image</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>

                <Select v-model="filters.document_type">
                  <SelectTrigger class="w-full sm:w-36 border-gray-300 h-10">
                    <SelectValue placeholder="Doc Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="evidence">Evidence</SelectItem>
                    <SelectItem value="correspondence">Correspondence</SelectItem>
                    <SelectItem value="court_filing">Court Filing</SelectItem>
                    <SelectItem value="research">Research</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <!-- View Tabs -->
          <Tabs v-model="viewMode">
            <TabsList>
              <TabsTrigger value="table">
                <FileText class="w-4 h-4 mr-2" />
                Table View
              </TabsTrigger>
              <TabsTrigger value="timeline">
                <Calendar class="w-4 h-4 mr-2" />
                Timeline View
              </TabsTrigger>
            </TabsList>

            <TabsContent value="table" class="mt-4">
              <div class="bg-white rounded-lg border border-gray-200">
                <div class="p-4 border-b border-gray-200">
                  <h3 class="text-base font-semibold text-gray-800">Documents ({{ filteredDocuments.length }})</h3>
                </div>
                <div class="p-4">
                  <div v-if="filteredDocuments.length === 0" class="text-center py-12">
                    <FolderOpen class="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <h3 class="text-base font-semibold text-gray-900 mb-1">No documents found</h3>
                    <p class="text-sm text-gray-500">
                      {{ searchQuery || Object.values(filters).some(f => f !== "all")
                        ? "Try adjusting your search or filters"
                        : "Upload your first document to get started"
                      }}
                    </p>
                  </div>
                  <Table v-else>
                    <TableHeader>
                      <TableRow>
                        <TableHead>File</TableHead>
                        <TableHead>Party</TableHead>
                        <TableHead>Case</TableHead>
                        <TableHead>Points</TableHead>
                        <TableHead>Uploaded</TableHead>
                        <TableHead class="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <template v-for="document in filteredDocuments" :key="document.id">
                        <TableRow>
                          <TableCell>
                            <div class="flex items-center space-x-3">
                              <component :is="getFileIcon(document.file_type)" class="w-5 h-5" :class="getFileIconColor(document.file_type)" />
                              <div>
                                <p class="font-medium text-gray-900">{{ document.file_name }}</p>
                                <div class="flex items-center space-x-2">
                                  <Badge variant="outline" class="text-xs clean-border">
                                    {{ document.document_type }}
                                  </Badge>
                                  <Badge v-if="document.is_confidential" class="text-xs bg-red-100 text-red-800 clean-border">
                                    Confidential
                                  </Badge>
                                </div>
                                <div v-if="document.tags && document.tags.length > 0" class="flex flex-wrap gap-1 mt-1">
                                  <span v-for="(tag, idx) in document.tags.slice(0, 3)" :key="idx" class="text-xs bg-gray-100 text-gray-600 px-1 py-0.5 rounded">
                                    {{ tag }}
                                  </span>
                                  <span v-if="document.tags.length > 3" class="text-xs text-gray-500">+{{ document.tags.length - 3 }}</span>
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div v-if="editingParty[document.id]" class="flex flex-col space-y-1">
                              <Select :model-value="document.submitted_by_party" @update:model-value="(value) => handleUpdateParty(document.id, value)">
                                <SelectTrigger class="w-32 h-7">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="us">Our Team</SelectItem>
                                  <SelectItem value="counterpart">Counterpart</SelectItem>
                                  <SelectItem value="court">Court</SelectItem>
                                  <SelectItem value="third_party">Third Party</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div v-else class="flex items-center space-x-2">
                              <Badge :class="`cursor-pointer ${getPartyBadgeClass(document.submitted_by_party)}`" @click="editingParty[document.id] = true">
                                {{ getPartyLabel(document.submitted_by_party) }}
                              </Badge>
                              <Button
                                variant="ghost"
                                size="icon"
                                class="h-6 w-6"
                                @click="editingParty[document.id] = true"
                              >
                                <Edit3 class="w-3 h-3" />
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p class="text-sm font-medium">{{ getCaseById(document.case_id)?.case_number || 'Unknown' }}</p>
                              <p class="text-xs text-gray-500 truncate max-w-[150px]">{{ getCaseById(document.case_id)?.title }}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div class="flex items-center space-x-2">
                              <Badge :class="`cursor-pointer ${getPointsBadgeClass(document.points_awarded)}`">
                                {{ document.points_awarded > 0 ? '+' : '' }}{{ document.points_awarded || 0 }} pts
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell class="text-sm">
                            {{ format(new Date(document.created_date), 'MMM d, yyyy') }}
                          </TableCell>
                          <TableCell class="text-right">
                            <div class="flex justify-end space-x-1">
                              <Button variant="ghost" size="icon" @click="() => router.push(`/document-viewer?documentId=${document.id}`)">
                                <Eye class="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="icon" as="a" :href="document.file_url" :download="document.file_name">
                                <Download class="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="icon" @click="handleDelete(document.id)">
                                <Trash2 class="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>

                        <TableRow class="bg-yellow-50 border-t-0">
                          <TableCell colspan="6" class="py-2">
                            <div class="flex items-center justify-between cursor-pointer p-2 hover:bg-yellow-100 rounded transition-colors">
                              <div class="flex-1">
                                <p v-if="document.inline_notes" class="text-sm text-gray-700">{{ document.inline_notes }}</p>
                                <p v-else class="text-sm text-gray-400 italic">Click to add notes...</p>
                              </div>
                              <Edit3 class="w-4 h-4 text-gray-400" />
                            </div>
                          </TableCell>
                        </TableRow>
                      </template>
                    </TableBody>
                  </Table>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="timeline" class="mt-4">
              <DocumentTimelineView :documents="filteredDocuments" :cases="cases" />
            </TabsContent>
          </Tabs>
        </div>

        <div class="space-y-6">
          <AIDocumentAssistant
            :case-data="pinnedCase || (cases.length > 0 ? cases.find(c => c.id === filters.case_id) || cases[0] : null)"
            :documents="documents"
            :user="user"
          />
          <DocumentPointsPanel :documents="filteredDocuments" />
        </div>
      </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Document, Case, User } from '@/services/entities'
import { UploadFile, ExtractDataFromUploadedFile } from '@/integrations/Core'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import {
  Upload,
  FileText,
  Image,
  File,
  Download,
  Eye,
  Trash2,
  Search,
  Plus,
  FolderOpen,
  Calendar,
  Save,
  Edit3,
  Mail
  , ChevronDown
} from 'lucide-vue-next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { format } from 'date-fns'
import DocumentTimelineView from '../components/documents/DocumentTimelineView.vue'
import DocumentPointsPanel from '../components/documents/DocumentPointsPanel.vue'
import AIDocumentAssistant from '../components/documents/AIDocumentAssistant.vue'

const props = defineProps({
  pinnedCaseId: String,
  pinnedCase: Object
})

const router = useRouter()

const documents = ref([])
const filteredDocuments = ref([])
const cases = ref([])
const user = ref(null)
const isLoading = ref(true)
const isUploading = ref(false)
const uploadProgress = ref(0)
const showUploadDialog = ref(false)
const searchQuery = ref('')
const viewMode = ref('table')
const editingNotes = ref({})
const editingPoints = ref({})
const editingParty = ref({})
const filters = ref({
  case_id: 'all',
  file_type: 'all',
  document_type: 'all'
})
const uploadData = ref({
  case_id: '',
  document_type: 'other',
  tags: '',
  is_confidential: false,
  submitted_by_party: 'us',
  points_awarded: 0
})
const impersonatedRole = ref(null)

onMounted(() => {
  loadData()
  const savedRole = localStorage.getItem('impersonatedRole')
  if (savedRole) {
    impersonatedRole.value = savedRole
  }
})

watch(showUploadDialog, (newVal) => {
  if (newVal && props.pinnedCaseId && !uploadData.value.case_id) {
    uploadData.value.case_id = props.pinnedCaseId
  }
})

watch([documents, searchQuery, filters], () => {
  applyFilters()
}, { deep: true })

const applyFilters = () => {
  let filtered = documents.value

  if (searchQuery.value) {
    filtered = filtered.filter(doc =>
      doc.file_name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      (doc.ocr_text && doc.ocr_text.toLowerCase().includes(searchQuery.value.toLowerCase())) ||
      (doc.tags && doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.value.toLowerCase()))) ||
      (doc.inline_notes && doc.inline_notes.toLowerCase().includes(searchQuery.value.toLowerCase()))
    )
  }

  if (filters.value.case_id !== 'all') {
    filtered = filtered.filter(doc => doc.case_id === filters.value.case_id)
  }

  if (filters.value.file_type !== 'all') {
    filtered = filtered.filter(doc => doc.file_type === filters.value.file_type)
  }

  if (filters.value.document_type !== 'all') {
    filtered = filtered.filter(doc => doc.document_type === filters.value.document_type)
  }

  filteredDocuments.value = filtered
}

const loadData = async () => {
  isLoading.value = true
  try {
    const userData = await User.me()
    user.value = userData

    const [allDocuments, casesData] = await Promise.all([
      Document.list('-created_date'),
      Case.list()
    ])

    const savedRole = localStorage.getItem('impersonatedRole')
    const currentRole = savedRole || userData.user_type

    let filteredDocs = allDocuments

    if (currentRole === 'lawyer') {
      const lawyerCaseIds = casesData.filter(c => c.lawyer_id === userData.id).map(c => c.id)
      filteredDocs = allDocuments.filter(d =>
        lawyerCaseIds.includes(d.case_id) || d.created_by === userData.email
      )
    } else if (currentRole === 'customer') {
      const customerCaseIds = casesData.filter(c =>
        c.customer_ids && c.customer_ids.includes(userData.id)
      ).map(c => c.id)
      filteredDocs = allDocuments.filter(d =>
        customerCaseIds.includes(d.case_id) || d.created_by === userData.email
      )
    } else if (currentRole === 'guest') {
      filteredDocs = allDocuments.filter(d => d.created_by === userData.email)
    }

    documents.value = filteredDocs

    let filteredCases = casesData
    if (currentRole === 'lawyer') {
      filteredCases = casesData.filter(c => c.lawyer_id === userData.id)
    } else if (currentRole === 'customer') {
      filteredCases = casesData.filter(c =>
        c.customer_ids && c.customer_ids.includes(userData.id)
      )
    } else if (currentRole === 'guest') {
      filteredCases = []
    }

    cases.value = filteredCases
  } catch (error) {
    console.error('Failed to load data:', error)
  }
  isLoading.value = false
}

const handleFileUpload = async (e) => {
  const files = Array.from(e.target.files)
  if (files.length === 0 || !uploadData.value.case_id) return

  isUploading.value = true
  uploadProgress.value = 0

  try {
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      uploadProgress.value = (i / files.length) * 50

      const { file_url } = await UploadFile({ file })
      const fileType = getFileType(file.type)

      uploadProgress.value = ((i / files.length) * 50) + 25

      const documentData = {
        case_id: uploadData.value.case_id,
        file_name: file.name,
        file_url: file_url,
        file_type: fileType,
        file_size: file.size,
        document_type: uploadData.value.document_type,
        tags: uploadData.value.tags ? uploadData.value.tags.split(',').map(t => t.trim()) : [],
        is_confidential: uploadData.value.is_confidential,
        submitted_by_party: uploadData.value.submitted_by_party,
        points_awarded: uploadData.value.points_awarded
      }

      if (fileType === 'pdf' || fileType === 'image') {
        try {
          const ocrResult = await ExtractDataFromUploadedFile({
            file_url: file_url,
            json_schema: {
              type: 'object',
              properties: {
                text_content: { type: 'string' },
                detected_language: { type: 'string' }
              }
            }
          })

          if (ocrResult.status === 'success' && ocrResult.output) {
            documentData.ocr_text = ocrResult.output.text_content || ''
            documentData.detected_language = ocrResult.output.detected_language || 'unknown'
          }
        } catch (ocrError) {
          console.warn('OCR failed for file:', file.name, ocrError)
        }
      }

      await Document.create(documentData)
      uploadProgress.value = ((i + 1) / files.length) * 100
    }

    showUploadDialog.value = false
    resetUploadForm()
    loadData()
  } catch (error) {
    console.error('Failed to upload files:', error)
  }
  isUploading.value = false
  uploadProgress.value = 0
}

const getFileType = (mimeType) => {
  if (mimeType.includes('pdf')) return 'pdf'
  if (mimeType.includes('word') || mimeType.includes('document')) return 'docx'
  if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) return 'xlsx'
  if (mimeType.includes('image')) return 'image'
  if (mimeType.includes('message/rfc822') || mimeType.includes('application/octet-stream') && (mimeType.includes('eml') || mimeType.includes('msg'))) return 'email'
  return 'other'
}

const getFileIcon = (fileType) => {
  switch(fileType) {
    case 'pdf': return FileText
    case 'docx': return FileText
    case 'xlsx': return File
    case 'image': return Image
    case 'email': return Mail
    default: return File
  }
}

const getFileIconColor = (fileType) => {
  switch(fileType) {
    case 'pdf': return 'text-red-500'
    case 'docx': return 'text-blue-500'
    case 'xlsx': return 'text-green-500'
    case 'image': return 'text-purple-500'
    case 'email': return 'text-orange-500'
    default: return 'text-gray-500'
  }
}

const getPartyBadgeClass = (party) => {
  if (party === 'us') return 'bg-blue-100 text-blue-800'
  if (party === 'counterpart') return 'bg-red-100 text-red-800'
  if (party === 'court') return 'bg-purple-100 text-purple-800'
  return 'bg-gray-100 text-gray-800'
}

const getPartyLabel = (party) => {
  if (party === 'us') return 'Our Team'
  if (party === 'counterpart') return 'Counterpart'
  if (party === 'court') return 'Court'
  return 'Third Party'
}

const getPointsBadgeClass = (points) => {
  if (points > 0) return 'bg-green-100 text-green-800'
  if (points < 0) return 'bg-red-100 text-red-800'
  return 'bg-gray-100 text-gray-800'
}

const handleUpdateParty = async (docId, party) => {
  try {
    await Document.update(docId, { submitted_by_party: party })
    editingParty.value[docId] = false
    loadData()
  } catch (error) {
    console.error('Failed to update party:', error)
  }
}

const handleUpdateInlineNotes = async (docId, notes) => {
  try {
    await Document.update(docId, { inline_notes: notes })
    editingNotes.value[docId] = false
    loadData()
  } catch (error) {
    console.error('Failed to update notes:', error)
  }
}

const handleUpdatePoints = async (docId, points, pointsNotes) => {
  try {
    await Document.update(docId, {
      points_awarded: parseInt(points) || 0,
      points_notes: pointsNotes
    })
    editingPoints.value[docId] = false
    loadData()
  } catch (error) {
    console.error('Failed to update points:', error)
  }
}

const handleEmailImport = async (e) => {
  const file = e.target.files[0]
  if (!file || !uploadData.value.case_id) return

  isUploading.value = true
  uploadProgress.value = 0
  try {
    const { file_url } = await UploadFile({ file })

    const emailData = {
      case_id: uploadData.value.case_id,
      file_name: file.name,
      file_url: file_url,
      file_type: 'email',
      file_size: file.size,
      document_type: 'email',
      tags: ['email', 'correspondence'],
      submitted_by_party: uploadData.value.submitted_by_party,
      points_awarded: uploadData.value.points_awarded,
      email_metadata: {
        subject: 'Imported Email',
        date: new Date().toISOString()
      }
    }

    await Document.create(emailData)
    uploadProgress.value = 100
    showUploadDialog.value = false
    resetUploadForm()
    loadData()
  } catch (error) {
    console.error('Failed to import email:', error)
  }
  isUploading.value = false
  uploadProgress.value = 0
}

const handleDelete = async (documentId) => {
  if (window.confirm('Are you sure you want to delete this document?')) {
    try {
      await Document.delete(documentId)
      loadData()
    } catch (error) {
      console.error('Failed to delete document:', error)
    }
  }
}

const resetUploadForm = () => {
  uploadData.value = {
    case_id: props.pinnedCaseId || '',
    document_type: 'other',
    tags: '',
    is_confidential: false,
    submitted_by_party: 'us',
    points_awarded: 0
  }
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const getCaseById = (caseId) => {
  return cases.value.find(c => c.id === caseId)
}
</script>
