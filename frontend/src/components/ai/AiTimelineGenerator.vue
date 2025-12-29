<template>
	<div>
		<!-- Generating state -->
		<Card v-if="isGenerating">
			<CardContent class="p-12">
				<div class="text-center">
					<Loader2 class="w-16 h-16 text-purple-600 mx-auto mb-4 animate-spin" />
					<p class="text-gray-600 font-medium mb-2">Generating AI Timeline...</p>
					<p class="text-sm text-gray-500">Analyzing {{ documents.length }} documents and {{ actionItems.length }} action items</p>
					<div class="mt-4 space-y-2 text-xs text-gray-400">
						<p>• Parsing dates from case data</p>
						<p>• Extracting document submission dates</p>
						<p>• Analyzing action item deadlines</p>
						<p>• Identifying critical milestones</p>
						<p>• Generating chronological overview</p>
					</div>
				</div>
			</CardContent>
		</Card>

		<!-- Error state -->
		<Card v-else-if="error">
			<CardContent class="p-8 text-center">
				<AlertTriangle class="w-12 h-12 text-red-400 mx-auto mb-4" />
				<p class="text-red-800 mb-4">{{ error }}</p>
				<Button @click="generateTimeline">
					<RefreshCw class="w-4 h-4 mr-2" />
					Try Again
				</Button>
			</CardContent>
		</Card>

		<!-- No timeline -->
		<Card v-else-if="!timeline">
			<CardContent class="p-8 text-center">
				<Calendar class="w-12 h-12 text-gray-400 mx-auto mb-4" />
				<p class="text-gray-600 mb-4">No timeline generated yet</p>
				<Button @click="generateTimeline" class="bg-purple-600 hover:bg-purple-700">
					<Sparkles class="w-4 h-4 mr-2" />
					Generate Timeline
				</Button>
			</CardContent>
		</Card>

		<!-- Timeline display -->
		<div v-else class="space-y-6">
			<Card class="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
				<CardHeader>
					<div class="flex items-start justify-between">
						<div>
							<CardTitle class="flex items-center space-x-2">
								<Sparkles class="w-5 h-5 text-purple-600" />
								<span>AI-Generated Case Timeline</span>
							</CardTitle>
							<p class="text-sm text-gray-600 mt-1">{{ timeline.summary }}</p>
							<p v-if="caseData.ai_timeline?.generated_at" class="text-xs text-gray-500 mt-1">Generated {{ formatDate(caseData.ai_timeline.generated_at) }}</p>
							<div class="flex flex-wrap gap-2 mt-3">
								<Badge variant="secondary">{{ timeline.total_events }} Events</Badge>
								<Badge variant="secondary">{{ timeline.date_range }}</Badge>
								<Badge variant="secondary" class="bg-purple-100 text-purple-800">AI-Analyzed</Badge>
							</div>
						</div>
						<div class="flex space-x-2">
							<Button variant="outline" size="sm" @click="toggleView">
								<Eye class="w-4 h-4 mr-2" />
								{{ viewMode === 'visual' ? 'View Analysis' : 'View Timeline' }}
							</Button>
							<Button variant="outline" size="sm" @click="handleDownload">
								<Download class="w-4 h-4" />
							</Button>
							<Button variant="outline" size="sm" @click="generateTimeline" title="Refresh Timeline">
								<RefreshCw class="w-4 h-4 mr-2" />
								Refresh
							</Button>
						</div>
					</div>
				</CardHeader>
			</Card>

			<!-- Critical Upcoming Events -->
			<Card v-if="timeline.critical_upcoming && timeline.critical_upcoming.length > 0" class="border-red-200 bg-red-50">
				<CardHeader>
					<CardTitle class="flex items-center space-x-2 text-red-900"><AlertTriangle class="w-5 h-5" /><span>Critical Upcoming Deadlines</span></CardTitle>
				</CardHeader>
				<CardContent>
					<div class="space-y-3">
						<div v-for="(item, index) in timeline.critical_upcoming" :key="index" :class="[`p-3 rounded-lg border`, getUrgencyColor(item.urgency)]">
							<div class="flex items-start justify-between">
								<div class="flex-1">
									<p class="font-semibold">{{ item.event }}</p>
									<div class="flex items-center space-x-2 mt-1 text-sm">
										<Calendar class="w-3 h-3" />
										<span>{{ formatDate(item.date) }}</span>
										<Badge variant="secondary" class="text-xs">{{ daysLabel(item.days_until) }}</Badge>
									</div>
								</div>
								<Badge :class="getCategoryColor(item.category)">{{ item.category }}</Badge>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>

			<!-- Visual or Analysis view -->
			<Card v-if="viewMode === 'visual'">
				<CardHeader><CardTitle>Case Timeline</CardTitle></CardHeader>
				<CardContent>
					<ScrollArea class="h-[600px]">
						<div class="relative pl-8">
							<div class="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500 via-indigo-500 to-blue-500"></div>
							<div class="space-y-6">
								<div v-for="(event, index) in timeline.timeline" :key="index" class="relative">
									<div :class="['absolute -left-[1.85rem] top-2 w-6 h-6 rounded-full flex items-center justify-center ring-4 ring-white', eventDotClass(event)]">
										<component :is="getCategoryIcon(event.category)" class="w-3 h-3 text-white" />
									</div>

									<Card :class="['ml-4', eventCardClass(event)]">
										<CardContent class="p-4">
											<div class="flex items-start justify-between mb-2">
												<div class="flex-1">
													<div class="flex items-center space-x-2 mb-1">
														<p class="font-semibold text-gray-900">{{ event.event }}</p>
														<component :is="getStatusIconComponent(event.status)" :class="getStatusIconClass(event.status)" />
													</div>
													<div class="flex items-center space-x-2 text-xs text-gray-500">
														<Calendar class="w-3 h-3" />
														<span>{{ formatDate(event.date) }}</span>
														<template v-if="event.time">
															<Clock class="w-3 h-3 ml-2" />
															<span>{{ event.time }}</span>
														</template>
														<Badge v-if="isFutureDate(event.date)" variant="secondary" class="ml-2">{{ relativeToNow(event.date) }}</Badge>
													</div>
												</div>
												<div class="flex flex-col items-end space-y-1">
													<Badge :class="getCategoryColor(event.category)">{{ (event.category || '').replace('_',' ') }}</Badge>
													<Badge v-if="event.importance" variant="outline" class="text-xs">{{ event.importance }}</Badge>
												</div>
											</div>
											<p v-if="event.details" class="text-sm text-gray-700 mt-2">{{ event.details }}</p>
											<div v-if="event.party_involved" class="mt-2"><Badge variant="secondary" class="text-xs">Party: {{ event.party_involved }}</Badge></div>
										</CardContent>
									</Card>
								</div>
							</div>
						</div>
					</ScrollArea>
				</CardContent>
			</Card>
			<Card v-else>
				<CardHeader><CardTitle>Timeline Analysis & Insights</CardTitle></CardHeader>
				<CardContent>
					<div class="space-y-6">
						<div>
							<h3 class="font-semibold text-gray-900 mb-2 flex items-center"><TrendingUp class="w-4 h-4 mr-2 text-blue-600"/>Case Progression</h3>
							<p class="text-sm text-gray-700">{{ timeline.insights.case_progression }}</p>
						</div>
						<div v-if="timeline.insights.timeline_gaps && timeline.insights.timeline_gaps.length > 0">
							<h3 class="font-semibold text-gray-900 mb-2 flex items-center"><AlertTriangle class="w-4 h-4 mr-2 text-orange-600"/>Timeline Gaps & Concerns</h3>
							<ul class="space-y-1"><li v-for="(gap, i) in timeline.insights.timeline_gaps" :key="i" class="text-sm text-gray-700">• {{ gap }}</li></ul>
						</div>
						<div>
							<h3 class="font-semibold text-gray-900 mb-2 flex items-center"><Calendar class="w-4 h-4 mr-2 text-purple-600"/>Upcoming Critical Dates</h3>
							<p class="text-sm text-gray-700">{{ timeline.insights.upcoming_critical_dates }}</p>
						</div>
						<div v-if="timeline.insights.recommendations && timeline.insights.recommendations.length > 0">
							<h3 class="font-semibold text-gray-900 mb-2 flex items-center"><Sparkles class="w-4 h-4 mr-2 text-green-600"/>AI Recommendations</h3>
							<ul class="space-y-2">
								<li v-for="(rec, i) in timeline.insights.recommendations" :key="i" class="text-sm text-gray-700 p-2 bg-green-50 border border-green-200 rounded flex items-start"><CheckCircle2 class="w-4 h-4 mr-2 text-green-600 mt-0.5"/>{{ rec }}</li>
							</ul>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sparkles, Loader2, Calendar, Clock, AlertTriangle, CheckCircle2, TrendingUp, FileText, ListTodo, Scale, RefreshCw, Download, Eye, Circle } from 'lucide-vue-next';
import { InvokeLLM } from '@/integrations/Core';
import { Case } from '@/services/entities';
import { format, formatDistanceToNow, isFuture, addDays } from 'date-fns';
import { useToast } from '@/components/ui/use-toast';

const props = defineProps({
	caseData: { type: Object, required: true },
	documents: { type: Array, default: () => [] },
	actionItems: { type: Array, default: () => [] }
});

const timeline = ref(props.caseData.ai_timeline?.timeline_data || null);
const isGenerating = ref(false);
const error = ref(null);
const viewMode = ref('visual');
const { toast } = useToast ? useToast() : { toast: () => {} };

onMounted(() => {
	if (props.caseData && !timeline.value) generateTimeline();
});

const generateTimeline = async () => {
	isGenerating.value = true;
	error.value = null;
	try {
		const dateSources = {
			case_dates: {
				created: props.caseData.created_date,
				updated: props.caseData.updated_date,
				due_date: props.caseData.due_date,
				court_date: props.caseData.court_date,
				next_deadline: props.caseData.next_deadline
			},
			timeline_events: props.caseData.timeline_events || [],
			documents: props.documents.map(d => ({ name: d.file_name, type: d.document_type, uploaded: d.created_date, by: d.created_by, party: d.submitted_by_party })),
			action_items: props.actionItems.map(a => ({ title: a.title, status: a.status, priority: a.priority, due_date: a.due_date, completed_date: a.completed_date, created: a.created_date, assigned_to: a.assigned_to }))
		};

		const prompt = `You are a legal case management AI assistant. Analyze the following case information and generate a comprehensive, chronological timeline of events.\n\n` +
			`CASE INFORMATION:\n- Case: ${props.caseData.title} (${props.caseData.case_number})\n- Type: ${props.caseData.case_type}\n- Status: ${props.caseData.status}\n- Created: ${format(new Date(props.caseData.created_date),'PPP')}\n\n` +
			`IMPORTANT DATES:\n${props.caseData.court_date ? `- Court Date: ${format(new Date(props.caseData.court_date),'PPP')}\n` : ''}${props.caseData.due_date ? `- Due Date: ${format(new Date(props.caseData.due_date),'PPP')}\n` : ''}${props.caseData.next_deadline ? `- Next Deadline: ${format(new Date(props.caseData.next_deadline),'PPP')}\n` : ''}\n\n` +
			`RECORDED TIMELINE EVENTS:\n${(dateSources.timeline_events.length > 0) ? dateSources.timeline_events.map(e => `- ${format(new Date(e.date),'PPP')}: ${e.event}${e.description ? ' - ' + e.description : ''}`).join('\n') : 'No timeline events recorded'}\n\n` +
			`DOCUMENTS SUBMITTED (${props.documents.length} total):\n${props.documents.slice(0,20).map(d => `- ${format(new Date(d.created_date),'MMM d, yyyy')}: "${d.file_name}" (${d.document_type}) - Submitted by ${d.submitted_by_party}`).join('\n')}\n\n` +
			`ACTION ITEMS (${props.actionItems.length} total):\n${props.actionItems.slice(0,20).map(a => `- Created ${format(new Date(a.created_date),'MMM d, yyyy')}: "${a.title}" - Status: ${a.status}${a.due_date ? `, Due: ${format(new Date(a.due_date),'MMM d, yyyy')}` : ''}`).join('\n')}\n\n` +
			`ANALYSIS REQUIREMENTS:\n\nPlease produce a JSON response with summary, timeline array, critical_upcoming and insights. Ensure dates are YYYY-MM-DD and events are chronological.`;

		const result = await InvokeLLM({
			prompt, add_context_from_internet: false,
			response_json_schema: {
				type: 'object',
				properties: {
					summary: { type: 'string' },
					total_events: { type: 'number' },
					date_range: { type: 'string' },
					critical_upcoming: { type: 'array', items: { type: 'object', properties: { date: { type: 'string' }, event: { type: 'string' }, category: { type: 'string' }, urgency: { type: 'string' }, days_until: { type: 'number' } } } },
					timeline: { type: 'array', items: { type: 'object', properties: { date: { type: 'string' }, time: { type: 'string' }, event: { type: 'string' }, category: { type: 'string' }, details: { type: 'string' }, party_involved: { type: 'string' }, status: { type: 'string' }, importance: { type: 'string' } } } },
					insights: { type: 'object', properties: { case_progression: { type: 'string' }, timeline_gaps: { type: 'array', items: { type: 'string' } }, upcoming_critical_dates: { type: 'string' }, recommendations: { type: 'array', items: { type: 'string' } } } }
				}
			}
		});

		await Case.update(props.caseData.id, { ai_timeline: { summary: result.summary, total_events: result.total_events, date_range: result.date_range, generated_at: new Date().toISOString(), timeline_data: result } });

		timeline.value = result;

		if (toast) toast({ title: 'Timeline Generated', description: `Generated timeline with ${result.total_events} events` });
	} catch (err) {
		console.error('Failed to generate timeline:', err);
		error.value = 'Failed to generate timeline. Please try again.';
		if (toast) toast({ variant: 'destructive', title: 'Generation Failed', description: err.message || 'Failed to generate timeline' });
	} finally {
		isGenerating.value = false;
	}
};

const getCategoryIcon = (category) => {
	switch ((category || '').toLowerCase()) {
		case 'court_event': case 'court': return Scale;
		case 'document': return FileText;
		case 'action_item': case 'action': return ListTodo;
		case 'deadline': return Clock;
		case 'milestone': case 'case_milestone': return TrendingUp;
		default: return Calendar;
	}
};

const getCategoryColor = (category) => {
	switch ((category || '').toLowerCase()) {
		case 'court_event': case 'court': return 'bg-purple-100 text-purple-800 border-purple-200';
		case 'document': return 'bg-blue-100 text-blue-800 border-blue-200';
		case 'action_item': case 'action': return 'bg-green-100 text-green-800 border-green-200';
		case 'deadline': return 'bg-orange-100 text-orange-800 border-orange-200';
		case 'milestone': case 'case_milestone': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
		default: return 'bg-gray-100 text-gray-800 border-gray-200';
	}
};

const getUrgencyColor = (urgency) => {
	switch ((urgency || '').toLowerCase()) {
		case 'critical': return 'bg-red-100 text-red-800 border-red-300';
		case 'high': return 'bg-orange-100 text-orange-800 border-orange-300';
		case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
		case 'low': return 'bg-green-100 text-green-800 border-green-300';
		default: return 'bg-gray-100 text-gray-800 border-gray-300';
	}
};

const getStatusIconComponent = (status) => {
	switch ((status || '').toLowerCase()) {
		case 'completed': return CheckCircle2;
		case 'pending': return Clock;
		case 'upcoming': return Calendar;
		default: return Circle;
	}
};

const getStatusIconClass = (status) => {
	switch ((status || '').toLowerCase()) {
		case 'completed': return 'w-4 h-4 text-green-600';
		case 'pending': return 'w-4 h-4 text-yellow-600';
		case 'upcoming': return 'w-4 h-4 text-blue-600';
		default: return 'w-4 h-4 text-gray-400';
	}
};

const eventDotClass = (event) => {
	if (event.status === 'completed') return 'bg-green-500';
	if (isFuture(new Date(event.date))) return 'bg-blue-500';
	return 'bg-gray-400';
};

const eventCardClass = (event) => {
	if (event.importance === 'critical') return 'border-red-300 bg-red-50';
	if (event.importance === 'high') return 'border-orange-300 bg-orange-50';
	return '';
};

const handleDownload = () => {
	if (!timeline.value) return;
	const content = `# Case Timeline Report\n\n**Case:** ${props.caseData.title} (${props.caseData.case_number})\n**Generated:** ${new Date().toLocaleString()}\n\n## Summary\n${timeline.value.summary}\n\n**Total Events:** ${timeline.value.total_events}\n**Date Range:** ${timeline.value.date_range}\n\n## Timeline\n\n` + timeline.value.timeline.map(event => `### ${format(new Date(event.date),'PPP')}${event.time ? ` at ${event.time}` : ''}\n**${event.event}**\n- Category: ${event.category}\n- Status: ${event.status}\n- Importance: ${event.importance}\n${event.details ? `- Details: ${event.details}\n` : ''}${event.party_involved ? `- Party: ${event.party_involved}\n` : ''}\n`).join('\n');

	const blob = new Blob([content], { type: 'text/markdown' });
	const url = URL.createObjectURL(blob);
	const a = document.createElement('a');
	a.href = url;
	a.download = `case-timeline-${props.caseData.case_number}-${Date.now()}.md`;
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
	URL.revokeObjectURL(url);

	if (toast) toast({ title: 'Downloaded', description: 'Timeline report has been downloaded.' });
};

const toggleView = () => { viewMode.value = viewMode.value === 'visual' ? 'analysis' : 'visual'; };

const formatDate = (d) => { try { return format(new Date(d),'PPP'); } catch (e) { return d; } };
const relativeToNow = (d) => { try { return formatDistanceToNow(new Date(d), { addSuffix: true }); } catch (e) { return ''; } };
const isFutureDate = (d) => { try { return isFuture(new Date(d)); } catch (e) { return false; } };
const daysLabel = (n) => { if (n === 0) return 'Today'; if (n === 1) return 'Tomorrow'; return `${n} days`; };

</script>

<style scoped>
/* no custom styles */
</style>

