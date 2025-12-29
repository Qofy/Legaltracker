<template>
	<Card class="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
		<CardHeader>
			<div class="flex items-start justify-between">
				<div>
					<CardTitle class="flex items-center space-x-2">
						<Sparkles class="w-5 h-5 text-purple-600" />
						<span>AI Case Summary</span>
					</CardTitle>
					<p class="text-sm text-gray-600 mt-1">AI-powered analysis and insights for this case</p>
				</div>

				<Button :disabled="isGenerating" size="sm" class="bg-purple-600 hover:bg-purple-700" @click="generateSummary">
					<template v-if="isGenerating">
						<Loader2 class="w-4 h-4 mr-2 animate-spin" />
						Analyzing...
					</template>
					<template v-else>
						<Sparkles class="w-4 h-4 mr-2" />
						Generate Summary
					</template>
				</Button>
			</div>
		</CardHeader>

		<CardContent>
			<div v-if="urgencyIndicators.length > 0" class="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
				<h4 class="text-sm font-semibold text-yellow-900 mb-2 flex items-center">
					<AlertCircle class="w-4 h-4 mr-2" />
					Attention Required
				</h4>
				<div class="flex flex-wrap gap-2">
					<Badge v-for="(indicator, idx) in urgencyIndicators" :key="idx" variant="secondary" class="bg-white">
						<component :is="indicator.icon" :class="['w-3 h-3 mr-1', indicator.color]" />
						{{ indicator.label }}
					</Badge>
				</div>
			</div>

			<div class="grid grid-cols-3 gap-3 mb-4">
				<div class="p-3 bg-white rounded-lg border">
					<div class="flex items-center space-x-2 mb-1">
						<Users class="w-4 h-4 text-blue-600" />
						<span class="text-xs text-gray-600">Team</span>
					</div>
					<p class="text-lg font-bold">{{ 1 + (caseData.customer_ids?.length || 0) }}</p>
				</div>

				<div class="p-3 bg-white rounded-lg border">
					<div class="flex items-center space-x-2 mb-1">
						<Calendar class="w-4 h-4 text-orange-600" />
						<span class="text-xs text-gray-600">Actions</span>
					</div>
					<p class="text-lg font-bold">{{ pendingActionCount }}</p>
				</div>

				<div class="p-3 bg-white rounded-lg border">
					<div class="flex items-center space-x-2 mb-1">
						<TrendingUp class="w-4 h-4 text-green-600" />
						<span class="text-xs text-gray-600">Docs</span>
					</div>
					<p class="text-lg font-bold">{{ documents.length }}</p>
				</div>
			</div>

			<div v-if="error" class="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">{{ error }}</div>

			<div v-if="!summary && !isGenerating && !error" class="text-center py-8">
				<Sparkles class="w-12 h-12 text-purple-400 mx-auto mb-3" />
				<p class="text-gray-600 mb-4">Click "Generate Summary" to get AI-powered insights about this case</p>
				<p class="text-xs text-gray-500">The AI will analyze case details, documents, action items, and provide strategic recommendations</p>
			</div>

			<div v-if="isGenerating" class="text-center py-12">
				<Loader2 class="w-12 h-12 text-purple-600 mx-auto mb-4 animate-spin" />
				<p class="text-gray-600 font-medium">Analyzing case details...</p>
				<p class="text-sm text-gray-500 mt-2">Processing documents, action items, and case data</p>
			</div>

			<ScrollArea v-if="summary && !isGenerating" class="h-[500px]">
				<div class="prose prose-sm max-w-none p-4 bg-white rounded-lg border">
					<div v-html="compiledMarkdown"></div>
				</div>
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
import { Sparkles, Loader2, Calendar, Users, AlertCircle, Clock, TrendingUp } from 'lucide-vue-next';
import { InvokeLLM } from '@/integrations/Core';
import { format } from 'date-fns';
import { marked } from 'marked';

const props = defineProps({
	caseData: { type: Object, required: true },
	documents: { type: Array, default: () => [] },
	actionItems: { type: Array, default: () => [] },
	users: { type: Array, default: () => [] }
});

const summary = ref(null);
const isGenerating = ref(false);
const error = ref(null);

const pendingActionCount = computed(() => props.actionItems.filter(a => a.status !== 'completed').length);

const getUrgencyIndicators = () => {
	const indicators = [];

	if (props.caseData.priority === 'urgent' || props.caseData.priority === 'high') {
		indicators.push({ icon: AlertCircle, label: 'High Priority', color: 'text-red-600' });
	}

	if (props.caseData.court_date && new Date(props.caseData.court_date) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)) {
		indicators.push({ icon: Calendar, label: 'Court Date Soon', color: 'text-orange-600' });
	}

	const pendingActions = props.actionItems.filter(a => a.status !== 'completed');
	const overdueActions = pendingActions.filter(a => a.due_date && new Date(a.due_date) < new Date());

	if (overdueActions.length > 0) {
		indicators.push({ icon: Clock, label: `${overdueActions.length} Overdue Items`, color: 'text-red-600' });
	}

	return indicators;
};

const urgencyIndicators = computed(() => getUrgencyIndicators());

const compiledMarkdown = computed(() => {
	if (!summary.value) return '';
	try {
		return marked.parse(summary.value);
	} catch (e) {
		return summary.value;
	}
});

const generateSummary = async () => {
	isGenerating.value = true;
	error.value = null;

	try {
		const lawyer = props.users.find(u => u.id === props.caseData.lawyer_id);
		const customers = props.users.filter(u => props.caseData.customer_ids?.includes(u.id));

		const pendingActions = props.actionItems.filter(a => a.status !== 'completed');
		const overdueActions = pendingActions.filter(a => a.due_date && new Date(a.due_date) < new Date());

		const recentDocs = props.documents.slice(0, 5).map(d => `${d.file_name} (${d.document_type})`).join(', ');

		const timeline = props.caseData.timeline_events && props.caseData.timeline_events.length > 0
			? props.caseData.timeline_events.slice(-5).map(e => `- ${format(new Date(e.date), 'MMM d, yyyy')}: ${e.event}`).join('\n')
			: '- No timeline events recorded';

		const prompt = `You are a legal assistant AI. Generate a comprehensive, professional summary of the following case:\n\n` +
			`CASE INFORMATION:\n- Title: ${props.caseData.title || ''}\n- Case Number: ${props.caseData.case_number || ''}\n- Type: ${(props.caseData.case_type || '').replace('_', ' ')}\n- Status: ${props.caseData.status || ''}\n- Priority: ${props.caseData.priority || ''}\n- Description: ${props.caseData.description || 'No description provided'}\n\n` +
			`PARTIES INVOLVED:\n- Assigned Lawyer: ${lawyer?.full_name || 'Not assigned'} (${lawyer?.email || 'N/A'})\n- Customer(s): ${customers.length > 0 ? customers.map(c => c.full_name).join(', ') : 'None assigned'}\n` +
			(props.caseData.opposing_counsel ? `- Opposing Counsel: ${props.caseData.opposing_counsel}\n` : '') +
			`\nIMPORTANT DATES:\n` +
			(props.caseData.court_date ? `- Court Date: ${format(new Date(props.caseData.court_date), 'PPP')}\n` : '') +
			(props.caseData.due_date ? `- Due Date: ${format(new Date(props.caseData.due_date), 'PPP')}\n` : '') +
			(props.caseData.next_deadline ? `- Next Deadline: ${format(new Date(props.caseData.next_deadline), 'PPP')}\n` : '') +
			`\nCOURT INFORMATION:\n` +
			(props.caseData.court_name ? `- Court: ${props.caseData.court_name}\n` : '') +
			(props.caseData.judge_name ? `- Judge: ${props.caseData.judge_name}\n` : '') +
			`\nCASE METRICS:\n` +
			(props.caseData.case_value ? `- Case Value: $${Number(props.caseData.case_value).toLocaleString()}\n` : '') +
			(props.caseData.billing_rate ? `- Billing Rate: $${props.caseData.billing_rate}/hr\n` : '') +
			(props.caseData.estimated_hours ? `- Estimated Hours: ${props.caseData.estimated_hours}\n` : '') +
			(props.caseData.actual_hours ? `- Actual Hours: ${props.caseData.actual_hours}\n` : '') +
			`\nDOCUMENTS:\n- Total Documents: ${props.documents.length}\n- Recent Documents: ${recentDocs}\n\n` +
			`ACTION ITEMS:\n- Total Pending: ${pendingActions.length}\n- Overdue: ${overdueActions.length}\n` +
			pendingActions.slice(0, 3).map(a => `  - ${a.title} (Due: ${a.due_date ? format(new Date(a.due_date), 'MMM d') : 'No date'})`).join('\n') +
			`\n\nCASE TIMELINE:\n${timeline}\n\n` +
			`Please provide:\n1. Executive Summary - A brief 2-3 sentence overview\n2. Current Status Analysis - What's the current state and recent developments\n3. Key Concerns & Priorities - What needs immediate attention\n4. Upcoming Milestones - Important dates and deadlines\n5. Recommendations - Suggested next steps or actions\n6. Risk Assessment - Any potential issues or concerns to monitor\n\nFormat the response in a clear, professional manner suitable for legal professionals.`;

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

