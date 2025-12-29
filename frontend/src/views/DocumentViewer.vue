<template>
  <div v-if="isLoading" class="flex items-center justify-center min-h-screen">
    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
  </div>

  <div v-else-if="!document" class="flex items-center justify-center min-h-screen">
    <div class="text-center">
      <FileText class="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <h2 class="text-xl font-semibold text-gray-900 mb-2">Document not found</h2>
      <p class="text-gray-500">The requested document could not be loaded.</p>
    </div>
  </div>

  <div v-else class="h-screen flex bg-gray-50">
    <!-- AI Chat Panel - Left (Toggleable) -->
    <div v-if="showAiPanel" class="w-1/4 bg-white border-r border-gray-200 relative flex flex-col">
      <div class="absolute top-2 right-2 z-10">
        <Button
          variant="ghost"
          size="icon"
          @click="showAiPanel = false"
          class="h-6 w-6"
        >
          <ChevronLeft class="w-4 h-4" />
        </Button>
      </div>
      <ChatPanel :case-id="document.case_id" :user="user" class="flex-1" />
    </div>

    <!-- Document Viewer - Center -->
    <div class="flex-1 flex flex-col relative">
      <!-- Toggle Buttons - Left side -->
      <Button
        v-if="!showAiPanel"
        variant="outline"
        size="icon"
        @click="showAiPanel = true"
        class="absolute top-4 left-4 z-20 h-8 w-8"
      >
        <Bot class="w-4 h-4" />
      </Button>

      <!-- Toggle Button - Right side -->
      <Button
        v-if="!showCommentsPanel"
        variant="outline"
        size="icon"
        @click="showCommentsPanel = true"
        class="absolute top-4 right-4 z-20 h-8 w-8"
      >
        <MessageSquare class="w-4 h-4" />
      </Button>

      <!-- Main Menu Toggle -->
      <Button
        variant="outline"
        size="icon"
        @click="showMainMenu = !showMainMenu"
        class="absolute top-4 left-1/2 transform -translate-x-1/2 z-20 h-8 w-8"
      >
        <X v-if="showMainMenu" class="w-4 h-4" />
        <Menu v-else class="w-4 h-4" />
      </Button>

      <!-- Toolbar (Collapsible Main Menu) -->
      <div v-if="showMainMenu" class="bg-white border-b border-gray-200 p-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <div>
              <h1 class="text-lg font-semibold text-gray-900">{{ document.file_name }}</h1>
              <div class="flex items-center space-x-2 mt-1">
                <component :is="getVisibilityBadge(document)" />
                <Badge variant="outline">{{ document.file_type?.toUpperCase() }}</Badge>
                <Badge v-if="case_" variant="secondary">Case #{{ case_.case_number }}</Badge>
              </div>
            </div>
          </div>

          <div class="flex items-center space-x-2">
            <Button variant="outline" size="sm" @click="handleZoomOut">
              <ZoomOut class="w-4 h-4" />
            </Button>
            <span class="text-sm font-medium px-2">{{ Math.round(zoom * 100) }}%</span>
            <Button variant="outline" size="sm" @click="handleZoomIn">
              <ZoomIn class="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" @click="handleRotate">
              <RotateCw class="w-4 h-4" />
            </Button>

            <!-- Annotation Mode Toggle (Future feature) -->
            <Button
              :variant="annotationMode ? 'default' : 'outline'"
              size="sm"
              @click="annotationMode = !annotationMode"
              title="Link comment to document location (Coming Soon)"
              :disabled="true"
            >
              <Plus class="w-4 h-4 mr-2" />
              Annotate
            </Button>

            <Dialog v-model:open="showPermissions">
              <DialogTrigger as-child>
                <Button variant="outline" size="sm">
                  <Settings class="w-4 h-4 mr-2" />
                  Permissions
                </Button>
              </DialogTrigger>
              <DialogContent class="max-w-md">
                <DialogHeader>
                  <DialogTitle>Document Permissions</DialogTitle>
                </DialogHeader>
                <DocumentPermissionsForm
                  :document="document"
                  :users="users"
                  :case_="case_"
                  @save="updateDocumentPermissions"
                />
              </DialogContent>
            </Dialog>

            <Button variant="outline" size="sm" as="a" :href="document.file_url" :download="document.file_name">
              <Download class="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>
        </div>
      </div>

      <!-- Add Tabs -->
      <Tabs v-model="activeTab" class="flex-1 flex flex-col">
        <TabsList class="mx-6 mt-2">
          <TabsTrigger value="viewer">
            <Eye class="w-4 h-4 mr-2" />
            Document Viewer
          </TabsTrigger>
          <TabsTrigger value="analysis">
            <Sparkles class="w-4 h-4 mr-2" />
            AI Analysis
          </TabsTrigger>
        </TabsList>

        <TabsContent value="viewer" class="flex-1 flex flex-col">
          <!-- Document Content -->
          <div class="flex-1 p-4 overflow-auto bg-gray-100">
            <div class="flex justify-center">
              <div
                ref="viewerRef"
                class="bg-white shadow-lg relative"
                :style="{
                  transform: `scale(${zoom}) rotate(${rotation}deg)`,
                  transformOrigin: 'center',
                  transition: 'transform 0.2s ease'
                }"
                @click="handleDocumentClick"
              >
                <!-- Annotation Mode Overlay -->
                <div v-if="annotationMode" class="absolute inset-0 z-10 cursor-crosshair bg-blue-100 bg-opacity-20 flex items-start justify-start">
                  <div class="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 rounded text-xs">
                    Click to add comment location (Feature coming soon)
                  </div>
                </div>

                <div v-if="document.file_type === 'pdf' || isOfficeDocument" class="w-full h-[800px] border border-gray-300">
                  <iframe
                    :src="`https://docs.google.com/gview?url=${encodeURIComponent(document.file_url)}&embedded=true`"
                    class="w-full h-full"
                    :title="document.file_name"
                    frameBorder="0"
                  />
                </div>
                <img
                  v-else-if="document.file_type === 'image'"
                  :src="document.file_url"
                  :alt="document.file_name"
                  class="max-w-full h-auto border border-gray-300"
                />
                <div v-else class="w-96 h-96 border border-gray-300 flex items-center justify-center bg-gray-50">
                  <div class="text-center">
                    <FileText class="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p class="text-gray-500">Preview not available for {{ document.file_type }} files</p>
                    <Button class="mt-4" as="a" :href="document.file_url" target="_blank" rel="noopener noreferrer">
                      Open in New Tab
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="analysis" class="flex-1 overflow-auto">
          <div class="p-6">
            <AIDocumentAnalyzer
              :document="document"
              @analysis-complete="(analysis) => {
                if (document) {
                  loadDocumentDetails(document.id)
                }
              }"
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>

    <!-- Comments Panel - Right (Toggleable) -->
    <div v-if="showCommentsPanel" class="w-1/4 bg-white border-l border-gray-200 flex flex-col relative">
      <div class="absolute top-2 right-2 z-10">
        <Button
          variant="ghost"
          size="icon"
          @click="showCommentsPanel = false"
          class="h-6 w-6"
        >
          <ChevronRight class="w-4 h-4" />
        </Button>
      </div>

      <div class="p-4 border-b border-gray-200">
        <h3 class="font-semibold text-gray-900 flex items-center">
          <MessageSquare class="w-4 h-4 mr-2" />
          Document Comments ({{ comments.length }})
        </h3>
      </div>

      <!-- Add Comment -->
      <div class="p-4 border-b border-gray-200">
        <div v-if="pendingComment" class="mb-2 p-2 bg-blue-50 border border-blue-200 rounded text-sm">
          📍 Comment will be linked to document location
        </div>
        <Textarea
          v-model="newComment"
          placeholder="Add a comment about this document..."
          class="mb-2"
          :rows="3"
        />
        <div class="flex space-x-2">
          <Button @click="addComment" size="sm" :disabled="!newComment.trim()">
            <Plus class="w-4 h-4 mr-2" />
            Add Comment
          </Button>
          <Button
            v-if="pendingComment"
            @click="() => {
              pendingComment = null
              annotationMode = false
            }"
            variant="outline"
            size="sm"
          >
            Cancel Link
          </Button>
        </div>
      </div>

      <!-- Comments List -->
      <ScrollArea class="flex-1 p-4">
        <div class="space-y-4">
          <div v-if="comments.length === 0" class="text-center py-8">
            <MessageSquare class="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p class="text-sm text-gray-500">No comments yet</p>
          </div>
          <Card v-else v-for="comment in comments" :key="comment.id" class="border border-gray-200">
            <CardContent class="p-3">
              <div class="flex items-start justify-between mb-2">
                <div class="flex items-center space-x-2">
                  <Avatar class="h-6 w-6">
                    <AvatarFallback class="text-xs">
                      {{ comment.created_by?.[0]?.toUpperCase() || 'U' }}
                    </AvatarFallback>
                  </Avatar>
                  <span class="text-sm font-medium">{{ comment.created_by }}</span>
                </div>
                <div class="flex items-center space-x-1">
                  <Badge v-if="comment.page_coordinates" variant="outline" class="text-xs">
                    📍 Linked
                  </Badge>
                  <component :is="getVisibilityBadge(comment)" />
                </div>
              </div>
              <p class="text-sm text-gray-800 mb-2">{{ comment.content }}</p>
              <p class="text-xs text-gray-500">
                {{ format(new Date(comment.created_date), "MMM d, yyyy 'at' HH:mm") }}
              </p>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { Document as DocumentEntity, Comment, User, Case } from '@/services/entities'
import {
  FileText,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Download,
  Settings,
  Lock,
  Users,
  Eye,
  EyeOff,
  MessageSquare,
  Plus,
  ChevronLeft,
  ChevronRight,
  Bot,
  Menu,
  X,
  Sparkles
} from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { format } from 'date-fns'
import ChatPanel from '../components/chat/ChatPanel.vue'
import AIDocumentAnalyzer from '../components/documents/AIDocumentAnalyzer.vue'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const route = useRoute()

const document = ref(null)
const case_ = ref(null)
const comments = ref([])
const users = ref([])
const user = ref(null)
const isLoading = ref(true)
const zoom = ref(1.0)
const rotation = ref(0)
const showPermissions = ref(false)
const newComment = ref('')
const selectedAnnotation = ref(null)

// Panel visibility states
const showAiPanel = ref(true)
const showCommentsPanel = ref(true)
const showMainMenu = ref(true)

// Comment linking states
const annotationMode = ref(false)
const pendingComment = ref(null)

// Active tab state
const activeTab = ref('viewer')

const viewerRef = ref(null)

const isOfficeDocument = computed(() => ['docx', 'xlsx'].includes(document.value?.file_type))

onMounted(() => {
  const documentId = route.query.documentId
  if (documentId) {
    loadDocumentDetails(documentId)
  }
})

const loadDocumentDetails = async (documentId) => {
  isLoading.value = true
  try {
    const [docData, userData, allUsers] = await Promise.all([
      DocumentEntity.get(documentId),
      User.me(),
      User.list()
    ])

    document.value = docData
    user.value = userData
    users.value = allUsers

    if (docData.case_id) {
      try {
        const caseData = await Case.get(docData.case_id)
        case_.value = caseData
      } catch (error) {
        console.warn('Could not load case data:', error)
      }
    }

    const docComments = await Comment.filter({ document_id: documentId }, '-created_date')
    comments.value = docComments
  } catch (error) {
    console.error('Failed to load document:', error)
  }
  isLoading.value = false
}

const handleZoomIn = () => zoom.value = Math.min(zoom.value + 0.25, 3.0)
const handleZoomOut = () => zoom.value = Math.max(zoom.value - 0.25, 0.25)
const handleRotate = () => rotation.value = (rotation.value + 90) % 360

const addComment = async () => {
  if (!newComment.value.trim()) return

  try {
    const commentData = {
      case_id: document.value.case_id,
      document_id: document.value.id,
      content: newComment.value,
      comment_type: 'note',
      visibility_type: 'case_members',
      visible_to_users: [],
      visible_to_roles: ['lawyer', 'admin'],
      page_coordinates: pendingComment.value?.coordinates || null,
      annotation_data: pendingComment.value?.annotation || null
    }

    const savedComment = await Comment.create(commentData)
    comments.value = [savedComment, ...comments.value]
    newComment.value = ''
    pendingComment.value = null
    annotationMode.value = false
  } catch (error) {
    console.error('Failed to add comment:', error)
  }
}

const handleDocumentClick = (event) => {
  if (!annotationMode.value || !viewerRef.value) return

  const clickedElement = event.target
  if (clickedElement.tagName === 'IFRAME' || clickedElement.tagName === 'IMG') {
    event.preventDefault()
    event.stopPropagation()

    const rect = clickedElement.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    pendingComment.value = {
      coordinates: { x, y },
      annotation: {
        type: 'point',
        x: x / rect.width,
        y: y / rect.height
      }
    }
  }
}

const updateDocumentPermissions = async (permissions) => {
  try {
    await DocumentEntity.update(document.value.id, permissions)
    document.value = { ...document.value, ...permissions }
    showPermissions.value = false
  } catch (error) {
    console.error('Failed to update permissions:', error)
  }
}

const getVisibilityBadge = (item) => {
  switch(item.visibility_type) {
    case 'public':
      return () => h(Badge, { class: 'bg-green-100 text-green-800' }, () => [
        h(Eye, { class: 'w-3 h-3 mr-1' }),
        'Public'
      ])
    case 'case_members':
      return () => h(Badge, { class: 'bg-blue-100 text-blue-800' }, () => [
        h(Users, { class: 'w-3 h-3 mr-1' }),
        'Case Members'
      ])
    case 'lawyers_only':
      return () => h(Badge, { class: 'bg-purple-100 text-purple-800' }, () => [
        h(Lock, { class: 'w-3 h-3 mr-1' }),
        'Lawyers Only'
      ])
    case 'specific_users':
      return () => h(Badge, { class: 'bg-orange-100 text-orange-800' }, () => [
        h(EyeOff, { class: 'w-3 h-3 mr-1' }),
        'Selected Users'
      ])
    default:
      return () => h(Badge, { variant: 'secondary' }, () => 'Default')
  }
}
</script>

<script>
import { h } from 'vue'

export default {
  components: {
    DocumentPermissionsForm: {
      props: {
        document: Object,
        users: Array,
        case_: Object
      },
      emits: ['save'],
      setup(props, { emit }) {
        const permissions = ref({
          visibility_type: props.document.visibility_type || 'case_members',
          visible_to_users: props.document.visible_to_users || [],
          visible_to_roles: props.document.visible_to_roles || ['lawyer', 'admin'],
          is_confidential: props.document.is_confidential || false
        })

        const handleSave = () => {
          emit('save', permissions.value)
        }

        return {
          permissions,
          handleSave
        }
      },
      template: `
        <div class="space-y-4">
          <div>
            <Label for="visibility_type">Visibility Level</Label>
            <Select v-model="permissions.visibility_type">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">
                  <div class="flex items-center">
                    <Eye class="w-4 h-4 mr-2" />
                    Public - Everyone can see
                  </div>
                </SelectItem>
                <SelectItem value="case_members">
                  <div class="flex items-center">
                    <Users class="w-4 h-4 mr-2" />
                    Case Members - Only case participants
                  </div>
                </SelectItem>
                <SelectItem value="lawyers_only">
                  <div class="flex items-center">
                    <Lock class="w-4 h-4 mr-2" />
                    Lawyers Only - Legal team only
                  </div>
                </SelectItem>
                <SelectItem value="specific_users">
                  <div class="flex items-center">
                    <EyeOff class="w-4 h-4 mr-2" />
                    Specific Users - Custom selection
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div v-if="permissions.visibility_type === 'specific_users'">
            <Label>Select Users</Label>
            <div class="mt-2 max-h-32 overflow-y-auto border border-gray-200 rounded p-2">
              <div v-for="user in users" :key="user.id" class="flex items-center space-x-2 py-1">
                <Checkbox
                  :checked="permissions.visible_to_users.includes(user.id)"
                  @update:checked="(checked) => {
                    if (checked) {
                      permissions.visible_to_users.push(user.id)
                    } else {
                      permissions.visible_to_users = permissions.visible_to_users.filter(id => id !== user.id)
                    }
                  }"
                />
                <span class="text-sm">{{ user.full_name }}</span>
                <Badge variant="secondary" class="text-xs">
                  {{ user.user_type }}
                </Badge>
              </div>
            </div>
          </div>

          <div class="flex items-center space-x-2">
            <Checkbox
              v-model:checked="permissions.is_confidential"
            />
            <Label class="text-sm">Mark as confidential</Label>
          </div>

          <div class="flex justify-end space-x-2">
            <Button variant="outline">Cancel</Button>
            <Button @click="handleSave">Save Permissions</Button>
          </div>
        </div>
      `
    }
  }
}
</script>
