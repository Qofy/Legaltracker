<template>
  <Card class="bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200">
    <CardHeader>
      <div class="flex items-start justify-between">
        <div>
          <CardTitle class="flex items-center space-x-2">
            <Sparkles class="w-5 h-5 text-indigo-600" />
            <span>AI Portfolio Analysis</span>
          </CardTitle>
          <p class="text-sm text-gray-600 mt-1">Comprehensive analysis of all active cases</p>
        </div>
        <Button :disabled="isGenerating" size="sm" class="bg-indigo-600 hover:bg-indigo-700" @click="generateSummary">
          <template v-if="isGenerating">
            <Loader2 class="w-4 h-4 mr-2 animate-spin" />
            Analyzing...
          </template>
          <template v-else>
            <Sparkles class="w-4 h-4 mr-2" />
            Analyze Portfolio
          </template>
        </Button>
      </div>
    </CardHeader>

    <CardContent>
      <!-- Quick Stats -->
      <div class="grid grid-cols-4 gap-3 mb-4">
        <div class="p-3 bg-white rounded-lg border">
          <div class="flex items-center space-x-2 mb-1">
            <TrendingUp class="w-4 h-4 text-blue-600" />
            <span class="text-xs text-gray-600">Active</span>
          </div>
          <p class="text-2xl font-bold">{{ activeCases.length }}</p>
        </div>
        <div class="p-3 bg-white rounded-lg border">
          <div class="flex items-center space-x-2 mb-1">
            <AlertTriangle class="w-4 h-4 text-red-600" />
            <span class="text-xs text-gray-600">Urgent</span>
          </div>
          <p class="text-2xl font-bold">{{ urgentCases.length }}</p>
        </div>
        <div class="p-3 bg-white rounded-lg border">
          <div class="flex items-center space-x-2 mb-1">
            <Clock class="w-4 h-4 text-yellow-600" />
            <span class="text-xs text-gray-600">In Progress</span>
          </div>
          <p class="text-2xl font-bold">{{ activeCases.filter(c => c.status === 'in_progress').length }}</p>
        </div>
        <div class="p-3 bg-white rounded-lg border">
          <div class="flex items-center space-x-2 mb-1">
            <CheckCircle class="w-4 h-4 text-green-600" />
            <span class="text-xs text-gray-600">Closed</span>
          </div>
          <p class="text-2xl font-bold">{{ cases.filter(c => c.status === 'closed').length }}</p>
        </div>
      </div>

      <!-- Alerts -->
      <div v-if="urgentCases.length > 0" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
        <h4 class="text-sm font-semibold text-red-900 mb-2 flex items-center">
          <AlertTriangle class="w-4 h-4 mr-2" />
          {{ urgentCases.length }} High Priority Case{{ urgentCases.length !== 1 ? 's' : '' }}
        </h4>
        <div class="space-y-1">
          <p v-for="c in urgentCases.slice(0,3)" :key="c.id" class="text-xs text-red-800">• {{ c.title }} - {{ c.priority }} priority</p>
        </div>
      </div>

      <!-- AI Summary -->
      <div v-if="error" class="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">{{ error }}</div>

      <div v-if="!summary && !isGenerating && !error" class="text-center py-8">
        <Sparkles class="w-12 h-12 text-indigo-400 mx-auto mb-3" />
        <p class="text-gray-600 mb-4">Click "Analyze Portfolio" to get AI-powered insights about all your active cases</p>
        <p class="text-xs text-gray-500">The AI will analyze workload, identify priorities, and provide strategic recommendations</p>
      </div>

      <div v-if="isGenerating" class="text-center py-12">
        <Loader2 class="w-12 h-12 text-indigo-600 mx-auto mb-4 animate-spin" />
        <p class="text-gray-600 font-medium">Analyzing case portfolio...</p>
        <p class="text-sm text-gray-500 mt-2">Processing {{ activeCases.length }} active cases</p>
      </div>

      <ScrollArea v-if="summary && !isGenerating" class="h-[500px]">
        <div class="prose prose-sm max-w-none p-4 bg-white rounded-lg border" v-html="compiledMarkdown"></div>
      </ScrollArea>
    </CardContent>
  </Card>
</template>

<script setup>
import { ref, computed } from 'vue';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sparkles, Loader2, TrendingUp, AlertTriangle, Clock, CheckCircle, Calendar } from 'lucide-vue-next';
import { InvokeLLM } from '@/integrations/Core';
import { format } from 'date-fns';
import { marked } from 'marked';

const props = defineProps({
  cases: { type: Array, required: true },
  users: { type: Array, default: () => [] }
});

const summary = ref(null);
const isGenerating = ref(false);
const error = ref(null);

const activeCases = computed(() => props.cases.filter(c => c.status !== 'archived' && c.status !== 'closed'));
const urgentCases = computed(() => activeCases.value.filter(c => c.priority === 'urgent' || c.priority === 'high'));

const compiledMarkdown = computed(() => {
  if (!summary.value) return '';
  try { return marked.parse(summary.value); } catch (e) { return summary.value; }
});

const generateSummary = async () => {
  isGenerating.value = true;
  error.value = null;
  try {
    const active = activeCases.value;
    const urgent = urgentCases.value;
    const upcomingCourtDates = active.filter(c => c.court_date && new Date(c.court_date) < new Date(Date.now() + 14 * 24 * 60 * 60 * 1000));

    const casesByType = {};
    active.forEach(c => { const type = c.case_type || 'other'; casesByType[type] = (casesByType[type] || 0) + 1; });

    const caseSummaries = active.slice(0,10).map(c => {
      const lawyer = props.users.find(u => u.id === c.lawyer_id);
      return `\n**${c.title}** (${c.case_number})\n- Status: ${c.status} | Priority: ${c.priority} | Type: ${c.case_type}\n- Lawyer: ${lawyer?.full_name || 'Unassigned'}\n${c.court_date ? `- Court Date: ${format(new Date(c.court_date),'MMM d, yyyy')}\n` : ''}${c.due_date ? `- Due: ${format(new Date(c.due_date),'MMM d, yyyy')}\n` : ''}${c.description ? `- ${c.description.substring(0,150)}...\n` : ''}`;
    }).join('\n');

    const prompt = `You are a legal practice management AI assistant. Analyze the following case portfolio and provide strategic insights.\n\n` +
      `PORTFOLIO OVERVIEW:\n- Total Active Cases: ${active.length}\n- Closed Cases: ${props.cases.filter(c => c.status === 'closed').length}\n- Archived Cases: ${props.cases.filter(c => c.status === 'archived').length}\n- High Priority Cases: ${urgent.length}\n- Upcoming Court Dates (next 2 weeks): ${upcomingCourtDates.length}\n\n` +
      `CASE DISTRIBUTION BY TYPE:\n${Object.entries(casesByType).map(([type,count]) => `- ${type.replace('_',' ')}: ${count}`).join('\n')}\n\n` +
      `STATUS BREAKDOWN:\n- Open: ${active.filter(c => c.status === 'open').length}\n- In Progress: ${active.filter(c => c.status === 'in_progress').length}\n- On Hold: ${active.filter(c => c.status === 'on_hold').length}\n- Closed: ${props.cases.filter(c => c.status === 'closed').length}\n\n` +
      `TOP ACTIVE CASES:${caseSummaries}\n\n` +
      `UPCOMING COURT DATES:\n${upcomingCourtDates.map(c => `- ${c.title}: ${format(new Date(c.court_date),'MMM d, yyyy')} (${c.priority} priority)`).join('\n')}\n\n` +
      `Please provide:\n1. Portfolio Health Assessment\n2. Workload Analysis\n3. Priority Cases Requiring Attention\n4. Risk Alerts\n5. Resource Allocation Recommendations\n6. Strategic Insights\n7. Next Week's Focus\n\nFormat as a professional executive summary for legal practice management.`;

    const result = await InvokeLLM({ prompt, add_context_from_internet: false });
    summary.value = result;
  } catch (err) {
    console.error('Failed to generate summary:', err);
    error.value = 'Failed to generate AI summary. Please try again.';
  } finally {
    isGenerating.value = false;
  }
};
</script>

<style scoped>
/* no custom styles */
</style>
