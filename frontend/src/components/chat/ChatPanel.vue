<template>
  <div class="h-full flex flex-col clean-border">
    <!-- Chat Header / Loading states handled inside template -->
    <div v-if="isInitialLoading" class="h-full flex flex-col clean-border">
      <div class="p-4 border-b border-gray-200 bg-white">
        <div class="flex items-center space-x-2">
          <MessageSquare class="w-5 h-5 text-blue-600" />
          <h3 class="font-semibold text-gray-900">AI Assistant</h3>
        </div>
      </div>
      <div class="flex-1 flex items-center justify-center">
        <Loader2 class="w-6 h-6 animate-spin text-blue-600" />
      </div>
    </div>

    <div v-else-if="!caseId" class="h-full flex flex-col clean-border">
      <div class="p-4 border-b border-gray-200 bg-white">
        <div class="flex items-center space-x-2">
          <MessageSquare class="w-5 h-5 text-blue-600" />
          <h3 class="font-semibold text-gray-900">AI Assistant</h3>
        </div>
      </div>
      <div class="flex-1 flex items-center justify-center p-4">
        <div class="text-center">
          <Bot class="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p class="text-sm text-gray-500 mb-4">Select a case to start chatting</p>
          <div class="text-xs text-gray-400 space-y-1">
            <p>• Ask questions about your cases</p>
            <p>• Get legal insights</p>
            <p>• Document analysis</p>
            <p>• Case strategy suggestions</p>
          </div>
        </div>
      </div>
    </div>

    <div v-else>
      <!-- Header -->
      <div class="p-4 border-b border-gray-200 bg-white">
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center space-x-2">
            <MessageSquare class="w-5 h-5 text-blue-600" />
            <h3 class="font-semibold text-gray-900">AI Assistant</h3>
          </div>
          <div class="flex items-center space-x-1">
            <Button variant="ghost" size="icon" @click="clearChat" class="h-6 w-6">
              <Trash2 class="w-3 h-3" />
            </Button>
            <Button variant="ghost" size="icon" @click="loadMessages" class="h-6 w-6">
              <RefreshCw class="w-3 h-3" />
            </Button>
          </div>
        </div>

        <div class="space-y-2">
          <Badge variant="secondary" class="text-xs clean-border">{{ currentCase?.case_number }} • {{ (currentCase?.case_type || '').replace('_', ' ') }}</Badge>

          <Select v-model:value="chatMode">
            <SelectTrigger class="h-8 text-xs clean-border"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="general">General Questions</SelectItem>
              <SelectItem value="document_analysis">Document Analysis</SelectItem>
              <SelectItem value="case_strategy">Case Strategy</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <!-- Case Info -->
      <div v-if="currentCase" class="p-3 bg-blue-50 border-b border-gray-200">
        <div class="text-xs space-y-1">
          <div class="flex items-center space-x-2">
            <FileText class="w-3 h-3 text-blue-600" />
            <span class="font-medium">{{ currentCase.title }}</span>
          </div>
          <p class="text-gray-600 truncate">{{ currentCase.description }}</p>
          <div class="flex items-center space-x-2">
            <Badge class="text-xs px-1 py-0 clean-border">{{ caseDocuments.length }} docs</Badge>
            <Badge class="text-xs px-1 py-0 clean-border">{{ currentCase.status }}</Badge>
          </div>
        </div>
      </div>

      <!-- Messages -->
      <ScrollArea class="flex-1 p-4">
        <div class="space-y-4">
          <div v-if="messages.length === 0" class="text-center py-8">
            <Bot class="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p class="text-sm text-gray-500 mb-3">Start a conversation about this case</p>
            <div class="text-xs text-gray-400 space-y-1">
              <p>"What are the key issues in this case?"</p>
              <p>"Summarize the uploaded documents"</p>
              <p>"What should be our next steps?"</p>
            </div>
          </div>

          <div v-for="message in messages" :key="message.id" :class="['flex', 'space-x-3', message.message_type === 'user' ? 'flex-row-reverse space-x-reverse' : '']">
            <Avatar class="h-8 w-8 flex-shrink-0">
              <AvatarFallback :class="message.message_type === 'ai' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100'">
                <component :is="message.message_type === 'ai' ? Bot : User" class="w-4 h-4" />
              </AvatarFallback>
            </Avatar>

            <Card :class="['max-w-[85%] p-3 clean-border', message.message_type === 'user' ? 'bg-blue-600 text-white' : 'bg-white material-elevation-1']">
              <div class="space-y-2">
                <p class="text-sm leading-relaxed whitespace-pre-wrap">{{ message.message }}</p>
                <Badge v-if="message.ai_context && message.message_type === 'ai'" variant="secondary" class="text-xs clean-border">{{ message.ai_context.replace('_',' ') }}</Badge>
                <p v-if="message.created_date" :class="['text-xs', message.message_type === 'user' ? 'text-blue-100' : 'text-gray-500']">{{ formatTime(message.created_date) }}</p>
              </div>
            </Card>
          </div>

          <div v-if="isLoading" class="flex space-x-3">
            <Avatar class="h-8 w-8">
              <AvatarFallback class="bg-blue-100 text-blue-600"><Bot class="w-4 h-4" /></AvatarFallback>
            </Avatar>
            <Card class="bg-white material-elevation-1 p-3 clean-border">
              <div class="flex items-center space-x-2">
                <Loader2 class="w-4 h-4 animate-spin" />
                <span class="text-sm text-gray-500">AI is thinking...</span>
              </div>
            </Card>
          </div>

          <div ref="scrollRef" />
        </div>
      </ScrollArea>

      <!-- Input -->
      <div class="p-4 border-t border-gray-200 bg-white">
        <form @submit.prevent="handleSendMessage" class="flex space-x-2">
          <Input v-model="newMessage" :disabled="isLoading" placeholder="Ask about this case..." class="flex-1 clean-border" />
          <Button type="submit" size="icon" :disabled="!newMessage.trim() || isLoading" class="bg-blue-600 hover:bg-blue-700">
            <Send class="w-4 h-4" />
          </Button>
        </form>
        <p class="text-xs text-gray-400 mt-2">💡 Try asking: "What are the key points?" or "Analyze the documents"</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue';
import { ChatMessage } from '@/entities/ChatMessage';
import { Case } from '@/entities/Case';
import { Document } from '@/entities/Document';
import { InvokeLLM } from '@/integrations/Core';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Send, Bot, User, Loader2, MessageSquare, FileText, Trash2, RefreshCw } from 'lucide-vue-next';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { useToast } from '@/components/ui/use-toast';

const props = defineProps({ caseId: { type: [String, Number] }, user: { type: Object } });

const messages = ref([]);
const newMessage = ref('');
const isLoading = ref(false);
const isInitialLoading = ref(true);
const currentCase = ref(null);
const caseDocuments = ref([]);
const chatMode = ref('general');
const scrollRef = ref(null);

let toast;
try { toast = useToast().toast; } catch (e) { toast = (opts) => console.info('toast', opts); }

const loadCaseData = async () => {
  try {
    const c = await Case.get(props.caseId);
    currentCase.value = c;
    const docs = await Document.filter({ case_id: props.caseId }, '-created_date');
    caseDocuments.value = docs || [];
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Failed to load case data:', err);
  }
};

const loadMessages = async () => {
  isInitialLoading.value = true;
  try {
    const data = await ChatMessage.filter({ case_id: props.caseId }, '-created_date', 50);
    messages.value = (data || []).reverse();
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Failed to load messages:', err);
  }
  isInitialLoading.value = false;
};

onMounted(() => {
  if (props.caseId) {
    loadCaseData();
    loadMessages();
  } else {
    isInitialLoading.value = false;
  }
});

watch(() => props.caseId, (val) => {
  if (val) {
    loadCaseData();
    loadMessages();
  } else {
    messages.value = [];
  }
});

watch(messages, async () => {
  await nextTick();
  if (scrollRef.value) scrollRef.value.scrollIntoView({ behavior: 'smooth' });
});

const scrollToBottom = async () => {
  await nextTick();
  if (scrollRef.value) scrollRef.value.scrollIntoView({ behavior: 'smooth' });
};

const clearChat = async () => {
  messages.value = [];
};

const handleSendMessage = async () => {
  if (!newMessage.value.trim() || !props.caseId || isLoading.value) return;

  const userMessage = {
    case_id: props.caseId,
    sender_id: props.user?.id,
    message: newMessage.value,
    message_type: 'user'
  };

  messages.value = [...messages.value, { ...userMessage, id: Date.now(), created_date: new Date().toISOString() }];
  const textToSend = newMessage.value;
  newMessage.value = '';
  isLoading.value = true;

  try {
    await ChatMessage.create(userMessage);

    let contextPrompt = `You are a professional legal AI assistant for LegalHub.\n\n`;
    contextPrompt += `Case Information:\n- Case #: ${currentCase.value?.case_number}\n- Title: ${currentCase.value?.title}\n- Description: ${currentCase.value?.description}\n- Status: ${currentCase.value?.status}\n- Priority: ${currentCase.value?.priority}\n- Type: ${currentCase.value?.case_type}\n\n`;
    contextPrompt += `User Message: "${textToSend}"\nChat Mode: ${chatMode.value}\n\n`;
    contextPrompt += `Available Documents: ${caseDocuments.value.length > 0 ? caseDocuments.value.map(d => `${d.file_name} (${d.document_type})`).join(', ') : 'None'}\n\n`;

    if (chatMode.value === 'document_analysis') {
      contextPrompt += 'Focus on document analysis and provide insights about the documents in this case.';
    } else if (chatMode.value === 'case_strategy') {
      contextPrompt += 'Provide strategic legal advice and case management suggestions.';
    } else {
      contextPrompt += 'Provide general legal assistance and answer questions about this case.';
    }

    contextPrompt += '\n\nPlease provide a professional, helpful response. Keep responses concise but informative. If you need more specific information, ask targeted questions.';

    const aiResponse = await InvokeLLM({ prompt: contextPrompt, add_context_from_internet: false });

    const aiMessage = {
      case_id: props.caseId,
      message: aiResponse,
      message_type: 'ai',
      sender_id: 'ai-assistant',
      ai_context: chatMode.value
    };

    const savedAi = await ChatMessage.create(aiMessage);
    messages.value = [...messages.value, { ...savedAi, created_date: new Date().toISOString() }];
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Failed to send message:', err);
    messages.value = [...messages.value, {
      id: Date.now() + 1,
      case_id: props.caseId,
      message: "Sorry, I'm having trouble connecting right now. Please check your AI settings or try again later.",
      message_type: 'ai',
      sender_id: 'ai-assistant',
      created_date: new Date().toISOString()
    }];
  }

  isLoading.value = false;
};

const formatTime = (d) => {
  try { return format(new Date(d), 'HH:mm'); } catch (e) { return ''; }
};
</script>

<style scoped>
/* no custom styles */
</style>
