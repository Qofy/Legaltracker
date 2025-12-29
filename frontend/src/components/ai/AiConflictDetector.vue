<template>
	<div>
		<!-- Loading state -->
		<Card v-if="isDetecting">
			<CardContent class="p-12">
				<div class="text-center">
					<Loader2 class="w-16 h-16 text-orange-600 mx-auto mb-4 animate-spin" />
					<p class="text-gray-600 font-medium mb-2">Detecting Conflicts of Interest...</p>
					<p class="text-sm text-gray-500">Analyzing against {{ allCases.length }} cases</p>
					<div class="mt-4 space-y-2 text-xs text-gray-400">
						<p>• Checking party overlaps</p>
						<p>• Analyzing opposing counsel conflicts</p>
						<p>• Reviewing subject matter conflicts</p>
						<p>• Examining lawyer conflicts</p>
						<p>• Assessing jurisdictional issues</p>
					</div>
				</div>
			</CardContent>
		</Card>

		<!-- Error state -->
		<Card v-else-if="error">
			<CardContent class="p-8 text-center">
				<AlertTriangle class="w-12 h-12 text-red-400 mx-auto mb-4" />
				<p class="text-red-800 mb-4">{{ error }}</p>
				<Button @click="detectConflicts">
					<RefreshCw class="w-4 h-4 mr-2" />
					Try Again
				</Button>
			</CardContent>
		</Card>

		<!-- No assessment yet -->
		<Card v-else-if="!assessment">
			<CardContent class="p-8 text-center">
				<Shield class="w-12 h-12 text-orange-400 mx-auto mb-4" />
				<p class="text-gray-600 mb-4">No conflict assessment available</p>
				<Button @click="detectConflicts" class="bg-orange-600 hover:bg-orange-700">
					<Sparkles class="w-4 h-4 mr-2" />
					Check for Conflicts
				</Button>
			</CardContent>
		</Card>

		<!-- Assessment results -->
		<div v-else class="space-y-4">
			<Card :class="headerCardClasses">
				<CardHeader>
					<div class="flex items-start justify-between">
						<div>
							<CardTitle class="flex items-center space-x-2 text-lg">
								<component :is="assessment.has_conflicts ? AlertTriangle : CheckCircle2" class="w-5 h-5" :class="assessment.has_conflicts ? 'text-red-600' : 'text-green-600'" />
								<span>Conflict of Interest Assessment</span>
							</CardTitle>
							<p v-if="assessment.assessed_at" class="text-xs text-gray-500 mt-1">Assessed {{ formattedAssessedAt }}</p>
							<div class="flex items-center space-x-2 mt-2">
								<Badge :class="assessment.has_conflicts ? 'bg-red-600' : 'bg-green-600'">
									{{ assessment.has_conflicts ? 'CONFLICTS DETECTED' : 'NO CONFLICTS' }}
								</Badge>
								<Badge v-if="assessment.conflict_level" :class="getSeverityColor(assessment.conflict_level)">
									{{ assessment.conflict_level.toUpperCase() }} Level
								</Badge>
							</div>
						</div>

						<Button variant="outline" size="sm" @click="detectConflicts" title="Refresh Assessment">
							<RefreshCw class="w-4 h-4 mr-2" />
							Refresh
						</Button>
					</div>
				</CardHeader>
			</Card>

			<!-- No conflicts card -->
			<Card v-if="!assessment.has_conflicts" class="border-green-200 bg-green-50">
				<CardContent class="p-6">
					<div class="flex items-center space-x-3">
						<CheckCircle2 class="w-8 h-8 text-green-600 flex-shrink-0" />
						<div>
							<p class="font-semibold text-green-900">No Conflicts Detected</p>
							<p class="text-sm text-green-800 mt-1">This case has been analyzed against {{ allCases.length }} other cases and no conflicts of interest were identified. You may proceed with this case.</p>
						</div>
					</div>
				</CardContent>
			</Card>

			<!-- Conflicts found -->
			<div v-else>
				<Card v-if="assessment.conflicts_found && assessment.conflicts_found.length > 0" class="border-red-200">
					<CardHeader>
						<CardTitle class="text-lg flex items-center space-x-2 text-red-900">
							<AlertTriangle class="w-5 h-5" />
							<span>Identified Conflicts ({{ assessment.conflicts_found.length }})</span>
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div class="space-y-4">
							<div v-for="(conflict, index) in assessment.conflicts_found" :key="index">
								<Card :class="['border', getSeverityColor(conflict.severity)]">
									<CardContent class="p-4">
										<div class="flex items-start justify-between mb-2">
											<div class="flex items-center space-x-2">
												<component :is="getConflictIcon(conflict.type)" class="w-5 h-5" />
												<span class="font-semibold capitalize">{{ conflict.type?.replace('_', ' ') }} Conflict</span>
											</div>
											<Badge :class="getSeverityColor(conflict.severity)">{{ conflict.severity }}</Badge>
										</div>
										<p class="text-sm text-gray-700 mb-2">{{ conflict.description }}</p>
										<div v-if="relatedCaseFor(conflict)" class="mt-2 flex items-center space-x-2 text-xs">
											<FileText class="w-3 h-3" />
											<span class="text-gray-600">Related to:</span>
											<router-link :to="createCaseLink(relatedCaseFor(conflict))" class="text-blue-600 hover:underline font-medium">
												Case {{ relatedCaseFor(conflict).case_number }}: {{ relatedCaseFor(conflict).title }}
											</router-link>
										</div>
									</CardContent>
								</Card>
							</div>
						</div>
					</CardContent>
				</Card>

				<!-- Party overlaps -->
				<Card v-if="assessment.party_overlaps && assessment.party_overlaps.length > 0">
					<CardHeader>
						<CardTitle class="text-lg flex items-center space-x-2">
							<Users class="w-5 h-5 text-blue-600" />
							<span>Party Overlaps Detected</span>
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div class="flex flex-wrap gap-2">
							<Badge v-for="(party, index) in assessment.party_overlaps" :key="index" variant="secondary" class="text-sm">{{ party }}</Badge>
						</div>
					</CardContent>
				</Card>
			</div>

			<!-- Recommendations -->
			<Card v-if="assessment.recommendations && assessment.recommendations.length > 0" class="border-blue-200 bg-blue-50">
				<CardHeader>
					<CardTitle class="text-lg flex items-center space-x-2 text-blue-900">
						<Shield class="w-5 h-5" />
						<span>Recommendations</span>
					</CardTitle>
				</CardHeader>
				<CardContent>
					<ul class="space-y-2">
						<li v-for="(rec, index) in assessment.recommendations" :key="index" class="text-sm text-blue-900 flex items-start">
							<span class="mr-2 font-bold">{{ index + 1 }}.</span>
							<span>{{ rec }}</span>
						</li>
					</ul>
				</CardContent>
			</Card>

			<!-- Legal Notice -->
			<Card class="bg-amber-50 border-amber-200">
				<CardContent class="p-4">
					<p class="text-xs text-amber-900"><strong>Legal Notice:</strong> This conflict assessment is generated by AI and should not be considered exhaustive. It is the responsibility of the legal team to conduct thorough due diligence and review all potential conflicts according to applicable rules of professional conduct. If conflicts are identified, consult with your firm's conflicts committee and obtain necessary waivers before proceeding.</p>
				</CardContent>
			</Card>
		</div>
	</div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Loader2, Shield, AlertTriangle, CheckCircle2, RefreshCw, FileText, Users, Scale } from 'lucide-vue-next';
import { InvokeLLM } from '@/integrations/Core';
import { Case } from '@/entities/Case';
import { format } from 'date-fns';
import { useToast } from '@/components/ui/use-toast';
import { createPageUrl } from '@/utils';

const props = defineProps({
	caseData: { type: Object, required: true },
	allCases: { type: Array, default: () => [] },
	allUsers: { type: Array, default: () => [] },
	onDetectionComplete: { type: Function }
});

const assessment = ref(props.caseData.ai_conflict_assessment || null);
const isDetecting = ref(false);
const error = ref(null);
const { toast } = useToast ? useToast() : { toast: () => {} };
const router = useRouter();

const formattedAssessedAt = computed(() => assessment.value && assessment.value.assessed_at ? format(new Date(assessment.value.assessed_at), 'PPP') : '');

const headerCardClasses = computed(() => {
	if (!assessment.value) return 'border-2 bg-gray-50 border-gray-200';
	return assessment.value.has_conflicts
		? 'border-2 bg-gradient-to-br from-red-50 to-orange-50 border-red-300'
		: 'border-2 bg-gradient-to-br from-green-50 to-emerald-50 border-green-300';
});

const detectConflicts = async () => {
	isDetecting.value = true;
	error.value = null;

	try {
		const otherCases = props.allCases.filter(c => c.id !== props.caseData.id && c.status !== 'archived');

		const currentParties = [
			...(props.caseData.customer_ids || []),
			props.caseData.lawyer_id,
			...(props.caseData.owner_ids || [])
		].filter(Boolean);

		const currentPartyNames = props.allUsers
			.filter(u => currentParties.includes(u.id))
			.map(u => u.full_name || u.email);

		const prompt = `\nYou are an expert legal ethics AI specializing in conflict of interest detection for law firms.\n\n` +
			`CURRENT CASE:\n- Case Number: ${props.caseData.case_number}\n- Title: ${props.caseData.title}\n- Type: ${props.caseData.case_type}\n- Description: ${props.caseData.description || 'No description'}\n- Parties Involved: ${currentPartyNames.join(', ')}\n` +
			(props.caseData.opposing_counsel ? `- Opposing Counsel: ${props.caseData.opposing_counsel}\n` : '') +
			(props.caseData.court_name ? `- Court: ${props.caseData.court_name}\n` : '') +
			`- Tags: ${props.caseData.tags?.join(', ') || 'None'}\n\n` +
			`OTHER ACTIVE CASES (${otherCases.length} cases):\n` +
			otherCases.slice(0, 20).map(c => {
				const caseParties = props.allUsers
					.filter(u => [...(c.customer_ids || []), c.lawyer_id, ...(c.owner_ids || [])].includes(u.id))
					.map(u => u.full_name || u.email);

				return `\n- Case ${c.case_number}: ${c.title}\n  Type: ${c.case_type}\n  Status: ${c.status}\n  Parties: ${caseParties.join(', ')}\n  ${c.opposing_counsel ? `Opposing Counsel: ${c.opposing_counsel}\n  ` : ''}${c.tags?.length > 0 ? `Tags: ${c.tags.join(', ')}\n` : ''}`;
			}).join('\n') +
			`\n\nCONFLICT OF INTEREST ANALYSIS:\n\nAnalyze the current case against all other active cases to identify potential conflicts of interest.\n\nSEVERITY LEVELS:\n- Critical: Must not proceed without conflict waiver\n- High: Requires careful review and disclosure\n- Medium: Should be monitored and documented\n- Low: Minimal concern, document for record\n\nProvide a comprehensive conflict analysis with specific conflicts identified, severity levels, and recommendations.\n\nReturn as JSON matching the schema.`;

		const result = await InvokeLLM({
			prompt: prompt,
			add_context_from_internet: false,
			response_json_schema: {
				type: 'object',
				properties: {
					has_conflicts: { type: 'boolean' },
					conflict_level: { type: 'string' },
					conflicts_found: {
						type: 'array',
						items: {
							type: 'object',
							properties: {
								type: { type: 'string' },
								description: { type: 'string' },
								related_case_id: { type: 'string' },
								severity: { type: 'string' }
							}
						}
					},
					party_overlaps: { type: 'array', items: { type: 'string' } },
					recommendations: { type: 'array', items: { type: 'string' } }
				}
			}
		});

		const assessmentData = { ...result, assessed_at: new Date().toISOString() };

		await Case.update(props.caseData.id, { ai_conflict_assessment: assessmentData });

		assessment.value = assessmentData;

		if (props.onDetectionComplete) props.onDetectionComplete(assessmentData);

		if (toast) {
			toast({
				title: 'Conflict Detection Complete',
				description: result.has_conflicts ? `${result.conflicts_found?.length || 0} potential conflict(s) found` : 'No conflicts detected',
				variant: result.has_conflicts ? 'destructive' : 'default'
			});
		}
	} catch (err) {
		console.error('Failed to detect conflicts:', err);
		error.value = 'Failed to detect conflicts. Please try again.';
		if (toast) {
			toast({ variant: 'destructive', title: 'Detection Failed', description: err.message || 'Failed to detect conflicts of interest' });
		}
	} finally {
		isDetecting.value = false;
	}
};

const getSeverityColor = (severity) => {
	switch ((severity || '').toLowerCase()) {
		case 'critical': return 'bg-red-100 text-red-800 border-red-300';
		case 'high': return 'bg-orange-100 text-orange-800 border-orange-300';
		case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
		case 'low': return 'bg-green-100 text-green-800 border-green-300';
		default: return 'bg-gray-100 text-gray-800 border-gray-300';
	}
};

const getConflictIcon = (type) => {
	switch ((type || '').toLowerCase()) {
		case 'party': return Users;
		case 'opposing_counsel': return Scale;
		case 'subject_matter': return FileText;
		default: return AlertTriangle;
	}
};

const relatedCaseFor = (conflict) => props.allCases.find(c => c.id === conflict.related_case_id);

const createCaseLink = (c) => createPageUrl('CaseDetails') + `?caseId=${c.id}`;
</script>

<style scoped>
/* no custom styles */
</style>

