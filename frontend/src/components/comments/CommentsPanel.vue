<template>
  <div class="h-full flex flex-col">
    <!-- Header -->
    <div class="p-3 border-b border-gray-200 bg-white">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-2">
          <MessageCircle class="w-4 h-4 text-blue-600" />
          <h3 class="font-medium text-gray-900 text-sm">Comments</h3>
        </div>
        <button
          @click="showAddForm = !showAddForm"
          class="h-6 w-6 flex items-center justify-center hover:bg-gray-100 rounded"
        >
          <Plus class="w-3 h-3" />
        </button>
      </div>
    </div>

    <!-- Add Comment Form -->
    <div v-if="showAddForm" class="p-3 border-b border-gray-200 bg-gray-50">
      <form @submit.prevent="handleAddComment" class="space-y-2">
        <textarea
          v-model="newComment"
          placeholder="Add a comment..."
          class="w-full text-xs resize-none border rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows="3"
        />
        <div class="space-y-2">
          <select
            v-model="commentType"
            class="w-full h-8 text-xs border rounded-md px-2 focus:ring-2 focus:ring-blue-500"
          >
            <option value="note">Note</option>
            <option value="question">Question</option>
            <option value="update">Update</option>
            <option value="reminder">Reminder</option>
          </select>

          <div class="flex items-center justify-between">
            <button
              type="button"
              @click="isShared = !isShared"
              class="flex items-center space-x-1 text-xs text-gray-600 hover:text-gray-800"
            >
              <Globe v-if="isShared" class="w-3 h-3" />
              <Lock v-else class="w-3 h-3" />
              <span>{{ isShared ? 'Shared' : 'Private' }}</span>
            </button>

            <button
              v-if="user?.userType === 'lawyer' || user?.userType === 'admin'"
              type="button"
              @click="isInternal = !isInternal"
              class="flex items-center space-x-1 text-xs text-gray-600 hover:text-gray-800"
            >
              <EyeOff v-if="isInternal" class="w-3 h-3" />
              <Eye v-else class="w-3 h-3" />
              <span>{{ isInternal ? 'Internal' : 'Public' }}</span>
            </button>
          </div>
        </div>
        <div class="flex space-x-1">
          <button
            type="submit"
            :disabled="!newComment.trim() || isSubmitting"
            class="h-6 px-2 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded disabled:opacity-50 flex items-center"
          >
            <Send class="w-3 h-3 mr-1" />
            Post
          </button>
          <button
            type="button"
            @click="showAddForm = false"
            class="h-6 px-2 text-xs hover:bg-gray-200 rounded"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex-1 flex items-center justify-center">
      <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
    </div>

    <!-- No Case Selected -->
    <div v-else-if="!caseId" class="flex-1 flex items-center justify-center p-3">
      <div class="text-center">
        <MessageCircle class="w-8 h-8 text-gray-400 mx-auto mb-2" />
        <p class="text-xs text-gray-500">Select a case</p>
      </div>
    </div>

    <!-- Comments List -->
    <div v-else class="flex-1 overflow-y-auto">
      <div class="p-2 space-y-3">
        <div v-if="comments.length === 0" class="text-center py-8">
          <MessageCircle class="w-6 h-6 text-gray-400 mx-auto mb-2" />
          <p class="text-xs text-gray-500">No comments yet</p>
        </div>

        <div
          v-for="comment in comments"
          :key="comment.id"
          :class="[
            'p-3 rounded-lg border material-elevation-1',
            !comment.isShared && comment.createdBy === user?.email ? 'bg-yellow-50 border-yellow-300' : 'bg-white'
          ]"
        >
          <div class="space-y-2">
            <div class="flex items-start justify-between">
              <div class="flex items-center space-x-2">
                <div class="h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center text-xs">
                  {{ comment.createdBy?.[0]?.toUpperCase() || 'U' }}
                </div>
                <div class="flex items-center space-x-1 flex-wrap">
                  <span :class="['text-xs px-1 py-0 rounded', getCommentTypeColor(comment.commentType)]">
                    {{ comment.commentType }}
                  </span>
                  <span v-if="comment.isInternal" class="text-xs px-1 py-0 rounded bg-red-100 text-red-800">
                    Internal
                  </span>
                  <span v-if="!comment.isShared" class="text-xs px-1 py-0 rounded bg-yellow-100 text-yellow-800">
                    Private
                  </span>
                  <span v-if="comment.isShared" class="text-xs px-1 py-0 rounded bg-green-100 text-green-800">
                    Shared
                  </span>
                </div>
              </div>

              <button
                v-if="comment.createdBy === user?.email"
                @click="handleToggleShare(comment.id, comment.isShared)"
                class="h-5 w-5 flex items-center justify-center hover:bg-gray-100 rounded"
                :title="comment.isShared ? 'Make private' : 'Share with others'"
              >
                <Lock v-if="comment.isShared" class="w-3 h-3 text-gray-500" />
                <Globe v-else class="w-3 h-3 text-green-600" />
              </button>
            </div>
            <p class="text-xs text-gray-800 leading-relaxed">
              {{ comment.content }}
            </p>
            <div class="flex items-center justify-between">
              <p class="text-xs text-gray-500">
                {{ formatDate(comment.createdDate) }}
              </p>
              <p v-if="comment.createdBy === user?.email" class="text-xs text-gray-400 italic">You</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import {
  MessageCircle,
  Plus,
  Send,
  Eye,
  EyeOff,
  Clock,
  HelpCircle,
  Lock,
  Globe
} from 'lucide-vue-next'
import { format } from 'date-fns'

const props = defineProps({
  caseId: {
    type: String,
    default: null
  },
  user: {
    type: Object,
    default: null
  }
})

const comments = ref([])
const newComment = ref('')
const commentType = ref('note')
const isShared = ref(true)
const isInternal = ref(false)
const isLoading = ref(true)
const isSubmitting = ref(false)
const showAddForm = ref(false)

const loadComments = async () => {
  isLoading.value = true
  try {
    // TODO: Replace with actual API call
    // const response = await axios.get(`/api/comments?caseId=${props.caseId}`)
    // comments.value = response.data
    comments.value = []
  } catch (error) {
    console.error('Failed to load comments:', error)
  }
  isLoading.value = false
}

const handleAddComment = async () => {
  if (!newComment.value.trim() || !props.caseId) return

  isSubmitting.value = true
  try {
    const commentData = {
      caseId: props.caseId,
      content: newComment.value,
      commentType: commentType.value,
      isShared: isShared.value,
      isInternal: isInternal.value && (props.user?.userType === 'lawyer' || props.user?.userType === 'admin')
    }

    // TODO: Replace with actual API call
    // const response = await axios.post('/api/comments', commentData)
    // comments.value.unshift(response.data)

    newComment.value = ''
    isShared.value = true
    showAddForm.value = false
  } catch (error) {
    console.error('Failed to add comment:', error)
  }
  isSubmitting.value = false
}

const handleToggleShare = async (commentId, currentSharedState) => {
  try {
    // TODO: Replace with actual API call
    // await axios.patch(`/api/comments/${commentId}`, { isShared: !currentSharedState })
    await loadComments()
  } catch (error) {
    console.error('Failed to update comment:', error)
  }
}

const getCommentTypeColor = (type) => {
  switch(type) {
    case 'question': return 'bg-blue-100 text-blue-800'
    case 'update': return 'bg-green-100 text-green-800'
    case 'reminder': return 'bg-orange-100 text-orange-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const formatDate = (date) => {
  return format(new Date(date), 'MMM d, HH:mm')
}

watch(() => props.caseId, (newVal) => {
  if (newVal) {
    loadComments()
  } else {
    isLoading.value = false
  }
}, { immediate: true })

onMounted(() => {
  if (props.caseId) {
    loadComments()
  } else {
    isLoading.value = false
  }
})
</script>
