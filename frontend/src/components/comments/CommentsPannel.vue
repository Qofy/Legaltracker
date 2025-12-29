<template>
  <div class="h-full flex flex-col">
    <!-- Header -->
    <div class="p-3 border-b border-gray-200 bg-white">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-2">
          <MessageCircle class="w-4 h-4 text-blue-600" />
          <h3 class="font-medium text-gray-900 text-sm">Comments</h3>
        </div>
        <Button variant="ghost" size="icon" @click="showAddForm = !showAddForm" class="h-6 w-6">
          <Plus class="w-3 h-3" />
        </Button>
      </div>
    </div>

    <!-- Add Comment Form -->
    <div v-if="showAddForm" class="p-3 border-b border-gray-200 bg-gray-50">
      <form @submit.prevent="handleAddComment" class="space-y-2">
        <Textarea
          v-model="newComment"
          placeholder="Add a comment..."
          class="text-xs resize-none"
          rows="3"
        />

        <div class="space-y-2">
          <Select v-model="commentType">
            <SelectTrigger class="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="note">Note</SelectItem>
              <SelectItem value="question">Question</SelectItem>
              <SelectItem value="update">Update</SelectItem>
              <SelectItem value="reminder">Reminder</SelectItem>
            </SelectContent>
          </Select>

          <div class="flex items-center justify-between">
            <button
              type="button"
              @click="isShared = !isShared"
              class="flex items-center space-x-1 text-xs text-gray-600 hover:text-gray-800"
            >
              <component :is="isShared ? Globe : Lock" class="w-3 h-3" />
              <span>{{ isShared ? 'Shared' : 'Private' }}</span>
            </button>

            <button
              v-if="userIsLawyerOrAdmin"
              type="button"
              @click="isInternal = !isInternal"
              class="flex items-center space-x-1 text-xs text-gray-600 hover:text-gray-800"
            >
              <component :is="isInternal ? EyeOff : Eye" class="w-3 h-3" />
              <span>{{ isInternal ? 'Internal' : 'Public' }}</span>
            </button>
          </div>
        </div>

        <div class="flex space-x-1">
          <Button type="submit" size="sm" :disabled="!newComment.trim() || isSubmitting" class="h-6 text-xs bg-blue-600 hover:bg-blue-700">
            <Send class="w-3 h-3 mr-1" />
            Post
          </Button>
          <Button type="button" variant="ghost" size="sm" @click="showAddForm = false" class="h-6 text-xs">
            Cancel
          </Button>
        </div>
      </form>
    </div>

    <!-- Loading / No case -->
    <div v-if="isLoading" class="flex-1 flex items-center justify-center">
      <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
    </div>

    <div v-else-if="!caseId" class="flex-1 flex items-center justify-center p-3">
      <div class="text-center">
        <MessageCircle class="w-8 h-8 text-gray-400 mx-auto mb-2" />
        <p class="text-xs text-gray-500">Select a case</p>
      </div>
    </div>

    <!-- Comments List -->
    <ScrollArea v-else class="flex-1">
      <div class="p-2 space-y-3">
        <div v-if="comments.length === 0" class="text-center py-8">
          <MessageCircle class="w-6 h-6 text-gray-400 mx-auto mb-2" />
          <p class="text-xs text-gray-500">No comments yet</p>
        </div>

        <div v-for="comment in comments" :key="comment.id">
          <Card :class="['p-3 material-elevation-1', !comment.is_shared && isOwner(comment) ? 'bg-yellow-50 border-yellow-300' : '']">
            <div class="space-y-2">
              <div class="flex items-start justify-between">
                <div class="flex items-center space-x-2">
                  <Avatar class="h-6 w-6">
                    <AvatarFallback class="text-xs bg-gray-100">{{ (comment.created_by && comment.created_by[0]) ? comment.created_by[0].toUpperCase() : 'U' }}</AvatarFallback>
                  </Avatar>
                  <div class="flex items-center space-x-1 flex-wrap">
                    <Badge variant="secondary" :class="['text-xs px-1 py-0', getCommentTypeColor(comment.comment_type)]">
                      <component :is="getCommentIcon(comment.comment_type)" class="w-2 h-2 mr-1" />
                      {{ comment.comment_type }}
                    </Badge>
                    <Badge v-if="comment.is_internal" variant="secondary" class="text-xs px-1 py-0 bg-red-100 text-red-800">
                      <EyeOff class="w-2 h-2 mr-1" />
                      Internal
                    </Badge>
                    <Badge v-if="!comment.is_shared" variant="secondary" class="text-xs px-1 py-0 bg-yellow-100 text-yellow-800">
                      <Lock class="w-2 h-2 mr-1" />
                      Private
                    </Badge>
                    <Badge v-if="comment.is_shared" variant="secondary" class="text-xs px-1 py-0 bg-green-100 text-green-800">
                      <Globe class="w-2 h-2 mr-1" />
                      Shared
                    </Badge>
                  </div>
                </div>

                <div v-if="isOwner(comment)">
                  <Button variant="ghost" size="icon" @click="handleToggleShare(comment.id, comment.is_shared)" class="h-5 w-5"
                    :title="comment.is_shared ? 'Make private' : 'Share with others'">
                    <component :is="comment.is_shared ? Lock : Globe" :class="comment.is_shared ? 'w-3 h-3 text-gray-500' : 'w-3 h-3 text-green-600'" />
                  </Button>
                </div>
              </div>

              <p class="text-xs text-gray-800 leading-relaxed">{{ comment.content }}</p>

              <div class="flex items-center justify-between">
                <p class="text-xs text-gray-500">{{ formatDate(comment.created_date) }}</p>
                <p v-if="isOwner(comment)" class="text-xs text-gray-400 italic">You</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </ScrollArea>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { Comment } from '@/services/entities';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format } from 'date-fns';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import {
  MessageCircle,
  Plus,
  Send,
  Eye,
  EyeOff,
  AlertCircle,
  Clock,
  HelpCircle,
  Lock,
  Globe,
} from 'lucide-vue-next';

const props = defineProps({
  caseId: { type: [String, Number], required: false },
  user: { type: Object, required: false },
});

const comments = ref([]);
const newComment = ref('');
const commentType = ref('note');
const isShared = ref(true);
const isInternal = ref(false);
const isLoading = ref(true);
const isSubmitting = ref(false);
const showAddForm = ref(false);

let toast = () => {};
try {
  const t = useToast();
  toast = t?.toast ?? (() => {});
} catch (e) {
  // noop if toast not available
}

const userIsLawyerOrAdmin = computed(() => {
  return props.user && (props.user.user_type === 'lawyer' || props.user.user_type === 'admin');
});

const loadComments = async () => {
  isLoading.value = true;
  if (!props.caseId) {
    isLoading.value = false;
    return;
  }

  try {
    const allComments = await Comment.filter({ case_id: props.caseId }, '-created_date', 50);

    const visibleComments = allComments.filter((comment) => {
      if (comment.created_by === props.user?.email) return true;
      if (props.user?.user_type === 'admin') return true;
      if (comment.is_shared) {
        if (comment.is_internal) {
          return props.user?.user_type === 'lawyer' || props.user?.user_type === 'admin';
        }
        return true;
      }
      return false;
    });

    comments.value = visibleComments;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Failed to load comments:', err);
  }
  isLoading.value = false;
};

onMounted(() => {
  if (props.caseId) loadComments();
  else isLoading.value = false;
});

watch(() => props.caseId, (nv) => {
  if (nv) loadComments();
  else comments.value = [];
});

const handleAddComment = async () => {
  if (!newComment.value.trim() || !props.caseId) return;
  isSubmitting.value = true;
  try {
    const commentData = {
      case_id: props.caseId,
      content: newComment.value,
      comment_type: commentType.value,
      is_shared: isShared.value,
      is_internal: isInternal.value && userIsLawyerOrAdmin.value,
    };

    const saved = await Comment.create(commentData);
    comments.value = [saved, ...comments.value];
    newComment.value = '';
    isShared.value = true;
    showAddForm.value = false;

    toast({
      title: 'Comment posted',
      description: commentData.is_shared ? 'Comment is visible to others' : 'Comment is private to you',
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Failed to add comment:', err);
    toast({ variant: 'destructive', title: 'Error', description: 'Failed to post comment' });
  }
  isSubmitting.value = false;
};

const handleToggleShare = async (commentId, currentSharedState) => {
  try {
    await Comment.update(commentId, { is_shared: !currentSharedState });
    await loadComments();
    toast({
      title: !currentSharedState ? 'Comment shared' : 'Comment made private',
      description: !currentSharedState ? 'Others can now see this comment' : 'Only you can see this comment',
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Failed to update comment:', err);
    toast({ variant: 'destructive', title: 'Error', description: 'Failed to update comment visibility' });
  }
};

const getCommentIcon = (type) => {
  switch (type) {
    case 'question':
      return HelpCircle;
    case 'update':
      return AlertCircle;
    case 'reminder':
      return Clock;
    default:
      return MessageCircle;
  }
};

const getCommentTypeColor = (type) => {
  switch (type) {
    case 'question':
      return 'bg-blue-100 text-blue-800';
    case 'update':
      return 'bg-green-100 text-green-800';
    case 'reminder':
      return 'bg-orange-100 text-orange-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const isOwner = (comment) => comment.created_by === props.user?.email;

const formatDate = (d) => {
  try {
    return format(new Date(d), 'MMM d, HH:mm');
  } catch (e) {
    return '';
  }
};
</script>

<style scoped></style>

