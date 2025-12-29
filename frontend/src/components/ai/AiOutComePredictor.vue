<template>
  <div>
    <!-- Loading -->
    <Card v-if="isPredicting">
      <CardContent class="p-12">
        <div class="text-center">
          <Loader2 class="w-16 h-16 text-indigo-600 mx-auto mb-4 animate-spin" />
          <p class="text-gray-600 font-medium mb-2">Analyzing Case Outcome...</p>
          <p class="text-sm text-gray-500">Processing {{ documents.length }} documents and {{ actionItems.length }} action items</p>
          <div class="mt-4 space-y-2 text-xs text-gray-400">
            <p>• Analyzing case metrics and evidence strength</p>
            <p>• Evaluating document points differential</p>
            <p>• Assessing case progression and timeline</p>
            <p>• Calculating win probability</p>
            <p>• Estimating settlement range</p>
            <p>• Identifying risks and opportunities</p>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Error -->
    <Card v-else-if="error">
      <CardContent class="p-8 text-center">
        <AlertTriangle class="w-12 h-12 text-red-400 mx-auto mb-4" />
        <p class="text-red-800 mb-4">{{ error }}</p>
        <Button @click="generatePrediction">
          <RefreshCw class="w-4 h-4 mr-2" />
          Try Again
        </Button>
      </CardContent>
    </Card>

    <!-- No prediction -->
    <Card v-else-if="!prediction">
      <CardContent class="p-8 text-center">
        <Target class="w-12 h-12 text-indigo-400 mx-auto mb-4" />
        <p class="text-gray-600 mb-4">No outcome prediction available</p>
        <Button @click="generatePrediction" class="bg-indigo-600 hover:bg-indigo-700">
          <Sparkles class="w-4 h-4 mr-2" />
          Generate Outcome Prediction
        </Button>
      </CardContent>
    </Card>

    <!-- Prediction result -->
    <div v-else class="space-y-4">
      <Card class="bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200">
        <CardHeader>
          <div class="flex items-start justify-between">
            <div>
              <CardTitle class="flex items-center space-x-2 text-lg">
                <Sparkles class="w-5 h-5 text-indigo-600" />
                <span>AI Case Outcome Prediction</span>
              </CardTitle>
              <p v-if="prediction.predicted_at" class="text-xs text-gray-500 mt-1">Generated {{ formattedPredictedAt }}</p>
              <Badge :class="['mt-2', getConfidenceColor(prediction.confidence_level)]">{{ (prediction.confidence_level || '').replace('_',' ').toUpperCase() }} Confidence</Badge>
            </div>
            <Button variant="outline" size="sm" @click="generatePrediction" title="Refresh Prediction">
              <RefreshCw class="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardHeader>
      </Card>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader class="pb-3">
            <CardTitle class="text-sm flex items-center space-x-2">
              <Award class="w-4 h-4 text-indigo-600" />
              <span>Win Probability</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div :class="['text-3xl font-bold', getWinProbabilityColor(prediction.win_probability)]">{{ prediction.win_probability }}%</div>
            <Progress :value="prediction.win_probability" class="mt-2 h-2" />
            <p class="text-xs text-gray-500 mt-2">Likelihood of favorable outcome</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader class="pb-3">
            <CardTitle class="text-sm flex items-center space-x-2">
              <DollarSign class="w-4 h-4 text-green-600" />
              <span>Settlement Range</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div class="text-lg font-bold text-gray-900">${{ prediction.settlement_range_min?.toLocaleString() || 0 }} - ${{ prediction.settlement_range_max?.toLocaleString() || 0 }}</div>
            <p class="text-xs text-gray-500 mt-2">Estimated settlement amount</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader class="pb-3">
            <CardTitle class="text-sm flex items-center space-x-2">
              <Clock class="w-4 h-4 text-blue-600" />
              <span>Est. Duration</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div class="text-3xl font-bold text-gray-900">{{ prediction.estimated_duration_days || 0 }}</div>
            <p class="text-xs text-gray-500 mt-2">Days until expected resolution</p>
          </CardContent>
        </Card>
      </div>

      <Card v-if="prediction.key_factors && prediction.key_factors.length > 0">
        <CardHeader>
          <CardTitle class="text-lg flex items-center space-x-2">
            <TrendingUp class="w-5 h-5 text-blue-600" />
            <span>Key Factors Influencing Outcome</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul class="space-y-2">
            <li v-for="(factor, index) in prediction.key_factors" :key="index" class="text-sm text-gray-700 flex items-start">
              <span class="mr-2 text-blue-600">•</span>
              <span>{{ factor }}</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card v-if="prediction.risks && prediction.risks.length > 0" class="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle class="text-lg flex items-center space-x-2 text-red-900">
              <AlertTriangle class="w-5 h-5" />
              <span>Identified Risks</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul class="space-y-2">
              <li v-for="(risk, index) in prediction.risks" :key="index" class="text-sm text-red-900 flex items-start">
                <AlertTriangle class="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                <span>{{ risk }}</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card v-if="prediction.opportunities && prediction.opportunities.length > 0" class="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle class="text-lg flex items-center space-x-2 text-green-900">
              <Lightbulb class="w-5 h-5" />
              <span>Opportunities</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul class="space-y-2">
              <li v-for="(opportunity, index) in prediction.opportunities" :key="index" class="text-sm text-green-900 flex items-start">
                <Lightbulb class="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                <span>{{ opportunity }}</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card v-if="prediction.recommendations && prediction.recommendations.length > 0" class="border-indigo-200 bg-indigo-50">
        <CardHeader>
          <CardTitle class="text-lg flex items-center space-x-2 text-indigo-900">
            <Shield class="w-5 h-5" />
            <span>Strategic Recommendations</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul class="space-y-2">
            <li v-for="(rec, index) in prediction.recommendations" :key="index" class="text-sm text-indigo-900 flex items-start">
              <span class="mr-2 font-bold">{{ index + 1 }}.</span>
              <span>{{ rec }}</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card class="bg-yellow-50 border-yellow-200">
        <CardContent class="p-4">
          <p class="text-xs text-yellow-900"><strong>Disclaimer:</strong> These predictions are generated by AI based on case metrics and historical patterns. They should be used as guidance only and not as definitive legal advice. Actual outcomes may vary based on numerous factors including legal strategy, court decisions, and unforeseen developments.</p>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Sparkles, Loader2, TrendingUp, DollarSign, Clock, Target, AlertTriangle, Lightbulb, RefreshCw, Award, Shield } from 'lucide-vue-next';
import { InvokeLLM } from '@/integrations/Core';
import { Case } from '@/services/entities';
import { format } from 'date-fns';
import { useToast } from '@/components/ui/use-toast';

const props = defineProps({
  caseData: { type: Object, required: true },
  documents: { type: Array, default: () => [] },
  actionItems: { type: Array, default: () => [] },
  onPredictionComplete: { type: Function }
});

const prediction = ref(props.caseData.ai_outcome_prediction || null);
const isPredicting = ref(false);
const error = ref(null);
const { toast } = useToast ? useToast() : { toast: () => {} };

const formattedPredictedAt = computed(() => prediction.value && prediction.value.predicted_at ? format(new Date(prediction.value.predicted_at), 'PPP') : '');

const generatePrediction = async () => {
  isPredicting.value = true;
  error.value = null;
  try {
    const completedActions = props.actionItems.filter(a => a.status === 'completed').length;
    const totalActions = props.actionItems.length;
    const documentsByParty = {
      us: props.documents.filter(d => d.submitted_by_party === 'us').length,
      counterpart: props.documents.filter(d => d.submitted_by_party === 'counterpart').length,
      court: props.documents.filter(d => d.submitted_by_party === 'court').length
    };
    const totalPoints = {
      us: props.documents.filter(d => d.submitted_by_party === 'us').reduce((sum,d) => sum + (d.points_awarded || 0), 0),
      counterpart: props.documents.filter(d => d.submitted_by_party === 'counterpart').reduce((sum,d) => sum + (d.points_awarded || 0), 0)
    };

    const caseDuration = Math.floor((new Date() - new Date(props.caseData.created_date)) / (1000*60*60*24));

    const prompt = `You are an expert legal case analyst AI with extensive experience in predicting case outcomes based on historical data and case metrics.\n\n` +
      `CASE INFORMATION:\n- Case Number: ${props.caseData.case_number}\n- Title: ${props.caseData.title}\n- Type: ${props.caseData.case_type}\n- Status: ${props.caseData.status}\n- Priority: ${props.caseData.priority}\n- Case Value: ${props.caseData.case_value ? '$' + props.caseData.case_value.toLocaleString() : 'Not specified'}\n- Current Duration: ${caseDuration} days\n` +
      (props.caseData.court_name ? `- Court: ${props.caseData.court_name}\n` : '') +
      (props.caseData.judge_name ? `- Judge: ${props.caseData.judge_name}\n` : '') +
      (props.caseData.opposing_counsel ? `- Opposing Counsel: ${props.caseData.opposing_counsel}\n` : '') +
      `\nCASE DESCRIPTION:\n${props.caseData.description || 'No description available'}\n\n` +
      `CASE METRICS:\n- Total Documents: ${props.documents.length}\n  - Our Team: ${documentsByParty.us}\n  - Counterpart: ${documentsByParty.counterpart}\n  - Court: ${documentsByParty.court}\n- Evidence Points:\n  - Our Team: ${totalPoints.us} points\n  - Counterpart: ${totalPoints.counterpart} points\n  - Point Differential: ${totalPoints.us - totalPoints.counterpart} (${totalPoints.us > totalPoints.counterpart ? 'in our favor' : 'against us'})\n- Action Items:\n  - Total: ${totalActions}\n  - Completed: ${completedActions}\n  - Completion Rate: ${totalActions > 0 ? Math.round((completedActions/totalActions)*100) : 0}%\n` +
      (props.caseData.court_date ? `- Scheduled Court Date: ${format(new Date(props.caseData.court_date),'PPP')}\n` : '') +
      (props.caseData.due_date ? `- Case Due Date: ${format(new Date(props.caseData.due_date),'PPP')}\n` : '') +
      `\nTIMELINE EVENTS:\n${props.caseData.timeline_events?.length > 0 ? props.caseData.timeline_events.slice(0,10).map(e => `- ${format(new Date(e.date),'MMM d, yyyy')}: ${e.event}`).join('\n') : 'No timeline events recorded'}\n\n` +
      `ANALYSIS REQUIREMENTS:\n\nBased on the case information, metrics, and historical patterns, provide:\n\n1. Win Probability (0-100)\n2. Settlement Range (min and max in dollars)\n3. Estimated Duration (remaining days)\n4. Confidence Level (low/medium/high/very_high)\n5. Key Factors\n6. Risks\n7. Opportunities\n8. Strategic Recommendations\n\nProvide realistic, data-driven predictions with clear reasoning. Return as JSON matching the schema.`;

    const result = await InvokeLLM({
      prompt, add_context_from_internet: false,
      response_json_schema: {
        type: 'object',
        properties: {
          win_probability: { type: 'number' },
          settlement_range_min: { type: 'number' },
          settlement_range_max: { type: 'number' },
          estimated_duration_days: { type: 'number' },
          confidence_level: { type: 'string' },
          key_factors: { type: 'array', items: { type: 'string' } },
          risks: { type: 'array', items: { type: 'string' } },
          opportunities: { type: 'array', items: { type: 'string' } },
          recommendations: { type: 'array', items: { type: 'string' } }
        }
      }
    });

    const predictionData = { ...result, predicted_at: new Date().toISOString() };

    await Case.update(props.caseData.id, { ai_outcome_prediction: predictionData });

    prediction.value = predictionData;

    if (props.onPredictionComplete) props.onPredictionComplete(predictionData);

    if (toast) {
      toast({ title: 'Prediction Complete', description: `Win probability: ${result.win_probability}%` });
    }
  } catch (err) {
    console.error('Failed to generate prediction:', err);
    error.value = 'Failed to generate prediction. Please try again.';
    if (toast) {
      toast({ variant: 'destructive', title: 'Prediction Failed', description: err.message || 'Failed to generate outcome prediction' });
    }
  } finally {
    isPredicting.value = false;
  }
};

const getConfidenceColor = (level) => {
  switch ((level || '').toLowerCase()) {
    case 'very_high': return 'bg-green-100 text-green-800';
    case 'high': return 'bg-blue-100 text-blue-800';
    case 'medium': return 'bg-yellow-100 text-yellow-800';
    case 'low': return 'bg-orange-100 text-orange-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getWinProbabilityColor = (prob) => {
  if (prob >= 70) return 'text-green-600';
  if (prob >= 50) return 'text-blue-600';
  if (prob >= 30) return 'text-yellow-600';
  return 'text-red-600';
};
</script>

<style scoped>
/* no custom styles */
</style>
