<template>
  <div class="space-y-4">
    <Card v-if="caseData" class="material-elevation-2 border-l-4 border-l-purple-500">
      <CardHeader>
        <div class="flex items-center justify-between">
          <CardTitle class="flex items-center space-x-2">
            <Bot class="w-5 h-5 text-purple-600" />
            <span>AI Case Assistant</span>
          </CardTitle>
          <Button
            :disabled="isLoading"
            size="sm"
            variant="outline"
            @click="generateInsights"
          >
            <RefreshCw :class="['w-4 h-4 mr-2', isLoading ? 'animate-spin' : '']" />
            {{ isLoading ? 'Analyzing...' : 'Refresh Insights' }}
          </Button>
        </div>
      </CardHeader>

      <CardContent class="space-y-4">
        <!-- Quick Stats -->
        <div class="grid grid-cols-2 gap-3">
          <div class="bg-blue-50 p-3 rounded-lg">
            <div class="flex items-center space-x-2 mb-1">
              <FileText class="w-4 h-4 text-blue-600" />
              <span class="text-xs font-medium text-gray-600">Documents</span>
            </div>
            <div class="text-2xl font-bold text-blue-600">{{ documents.length }}</div>
            <div class="text-xs text-gray-500">
              Started {{ formatDate(caseData.created_date, 'MMM d, yyyy') }}
            </div>
          </div>

          <div class="bg-green-50 p-3 rounded-lg">
            <div class="flex items-center space-x-2 mb-1">
              <CheckSquare class="w-4 h-4 text-green-600" />
              <span class="text-xs font-medium text-gray-600">Pending Actions</span>
            </div>
            <div class="text-2xl font-bold text-green-600">{{ pendingActions.length }}</div>
            <div class="text-xs text-gray-500">
              {{ pendingComments.length }} recent comments
            </div>
          </div>
        </div>

        <div v-if="caseData.court_date" class="bg-orange-50 border border-orange-200 p-3 rounded-lg">
          <div class="flex items-center space-x-2">
            <Calendar class="w-4 h-4 text-orange-600" />
            <div>
              <p class="text-sm font-medium text-gray-900">Next Court Session</p>
              <p class="text-sm text-orange-700">{{ formatDate(caseData.court_date, 'PPP') }}</p>
            </div>
          </div>
        </div>

        <!-- AI Insights -->
        <div v-if="isLoading" class="text-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-3"></div>
          <p class="text-sm text-gray-500">Analyzing case documents and status...</p>
        </div>

        <div v-else-if="insights" class="space-y-4">
          <div class="bg-purple-50 p-4 rounded-lg">
            <h4 class="font-semibold text-gray-900 mb-2 flex items-center">
              <TrendingUp class="w-4 h-4 mr-2 text-purple-600" />
              Case Summary
            </h4>
            <p class="text-sm text-gray-700">{{ insights.summary }}</p>
          </div>

          <div>
            <h4 class="font-semibold text-gray-900 mb-2 flex items-center">
              <Lightbulb class="w-4 h-4 mr-2 text-yellow-600" />
              Recommended Next Steps
            </h4>
            <ul class="space-y-2">
              <li v-for="(step, index) in insights.next_steps" :key="index" class="flex items-start space-x-2 text-sm">
                <Badge class="mt-0.5 bg-yellow-100 text-yellow-800">
                  {{ index + 1 }}
                </Badge>
                <span class="text-gray-700">{{ step }}</span>
              </li>
            </ul>
          </div>

          <div v-if="insights.timeline_concerns" class="bg-red-50 border border-red-200 p-3 rounded-lg">
            <h4 class="font-semibold text-gray-900 mb-1 flex items-center">
              <AlertCircle class="w-4 h-4 mr-2 text-red-600" />
              Timeline Concerns
            </h4>
            <p class="text-sm text-gray-700">{{ insights.timeline_concerns }}</p>
          </div>

          <div v-if="insights.document_suggestions" class="bg-blue-50 border border-blue-200 p-3 rounded-lg">
            <h4 class="font-semibold text-gray-900 mb-1 flex items-center">
              <FileText class="w-4 h-4 mr-2 text-blue-600" />
              Document Organization Tips
            </h4>
            <p class="text-sm text-gray-700">{{ insights.document_suggestions }}</p>
          </div>
        </div>

        <div v-else class="text-center py-8">
          <Lightbulb class="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p class="text-sm text-gray-500 mb-3">
            Get AI-powered insights and recommendations for this case
          </p>
          <Button size="sm" @click="generateInsights">
            Generate Insights
          </Button>
        </div>
      </CardContent>
    </Card>
    <div v-else class="p-4 text-sm text-gray-500">No case selected.</div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Bot,
  Lightbulb,
  AlertCircle,
  Calendar,
  FileText,
  CheckSquare,
  TrendingUp,
  RefreshCw
} from 'lucide-vue-next';
// TODO: Uncomment when backend is ready
// import { InvokeLLM } from '@/integrations/Core';
// import { Comment } from '@/entities/Comment';
// import { ActionItem } from '@/entities/ActionItem';
import { format } from 'date-fns';

const props = defineProps({
  caseData: { type: Object, required: true },
  documents: { type: Array, default: () => [] },
  user: { type: Object, default: null }
});

const insights = ref(null);
const isLoading = ref(false);
const pendingComments = ref([]);
const pendingActions = ref([]);

const formatDate = (date, formatStr) => {
  if (!date) return '';
  return format(new Date(date), formatStr);
};

const loadPendingItems = async () => {
  if (!props.caseData) return;

  try {
    // TODO: Uncomment when backend is ready
    // const [comments, actions] = await Promise.all([
    //   Comment.filter({ case_id: props.caseData.id }, '-created_date', 5),
    //   ActionItem.filter({ case_id: props.caseData.id, status: 'pending' }, '-due_date', 10)
    // ]);
    // pendingComments.value = comments;
    // pendingActions.value = actions;

    // Mock data for development
    pendingComments.value = [];
    pendingActions.value = [];
  } catch (error) {
    console.error('Failed to load pending items:', error);
  }
};

const generateInsights = async () => {
  if (!props.caseData) return;

  isLoading.value = true;
  try {
    const prompt = `You are a legal assistant AI. Analyze this case and provide strategic insights.

Case Information:
- Title: ${props.caseData.title}
- Case Number: ${props.caseData.case_number}
- Status: ${props.caseData.status}
- Priority: ${props.caseData.priority}
- Type: ${props.caseData.case_type}
- Started: ${formatDate(props.caseData.created_date, 'PPP')}
- Next Court Date: ${props.caseData.court_date ? formatDate(props.caseData.court_date, 'PPP') : 'Not set'}

Documents:
- Total Documents: ${props.documents.length}
- Our Documents: ${props.documents.filter(d => d.submitted_by_party === 'us').length}
- Counterpart Documents: ${props.documents.filter(d => d.submitted_by_party === 'counterpart').length}
- Recent Uploads: ${props.documents.slice(0, 3).map(d => d.file_name).join(', ')}

Pending Items:
- Pending Actions: ${pendingActions.value.length}
- Recent Comments: ${pendingComments.value.length}

Based on this information, provide:
1. A brief case status summary
2. 3-5 actionable next steps or recommendations
3. Any timeline concerns or upcoming deadlines
4. Document organization suggestions`;

    // TODO: Uncomment when backend is ready
    // const response = await InvokeLLM({
    //   prompt,
    //   response_json_schema: {
    //     type: 'object',
    //     properties: {
    //       summary: { type: 'string' },
    //       next_steps: {
    //         type: 'array',
    //         items: { type: 'string' }
    //       },
    //       timeline_concerns: { type: 'string' },
    //       document_suggestions: { type: 'string' }
    //     }
    //   }
    // });
    // insights.value = response;

    // Mock response for development
    await new Promise(resolve => setTimeout(resolve, 2000));
    insights.value = {
      summary: 'This case is progressing well with all documentation in order. The case is currently in the discovery phase with an upcoming court date.',
      next_steps: [
        'Review recent document submissions from counterpart',
        'Prepare witness statements for upcoming hearing',
        'Schedule meeting with client to discuss strategy',
        'Complete pending action items before court date',
        'Organize documents by relevance and submission date'
      ],
      timeline_concerns: 'Court date is approaching in 2 weeks. Ensure all evidence is submitted at least 5 days prior.',
      document_suggestions: 'Consider grouping documents by type (evidence, correspondence, filings) and ensure all confidential materials are properly marked.'
    };
  } catch (error) {
    console.error('Failed to generate insights:', error);
  }
  isLoading.value = false;
};

onMounted(() => {
  if (props.caseData) {
    loadPendingItems();
  }
});

watch(() => props.caseData, (newVal) => {
  if (newVal) {
    loadPendingItems();
  }
});
</script>

<style scoped>
/* no custom styles */
</style>
