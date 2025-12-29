<template>
  <div class="space-y-6">
    <!-- Auto-detected case info -->
    <Card v-if="caseData" class="bg-blue-50 border-blue-200">
      <CardContent class="p-4">
        <div class="flex items-start space-x-3">
          <Sparkles class="w-5 h-5 text-blue-600 mt-0.5" />
          <div class="flex-1">
            <p class="text-sm font-semibold text-blue-900">Case Context Detected</p>
            <p class="text-xs text-blue-800 mt-1">Research settings auto-configured for: {{ caseData.case_number }} - {{ caseData.title }}<span v-if="caseData.case_type"> ({{ caseData.case_type }})</span></p>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Research Input Card -->
    <Card class="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
      <CardHeader>
        <div>
          <CardTitle class="flex items-center space-x-2">
            <Scale class="w-5 h-5 text-blue-600" />
            <span>Legal Research Assistant</span>
          </CardTitle>
          <p class="text-sm text-gray-600 mt-1">AI-powered legal research with access to case law, statutes, and legal analysis</p>
        </div>
      </CardHeader>
      <CardContent class="space-y-4">
        <div>
          <Label for="query" class="text-sm font-medium text-gray-700 mb-2 block">Research Question</Label>
          <Textarea id="query" v-model="query" placeholder="E.g., 'What are the elements of negligence in California personal injury cases?'" rows="4" class="resize-none" />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label for="researchType" class="text-sm font-medium text-gray-700 mb-2 block">Research Type</Label>
            <Select v-model:value="researchType">
              <SelectTrigger id="researchType"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem v-for="(label, key) in researchTypes" :key="key" :value="key">{{ label }}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label for="jurisdiction" class="text-sm font-medium text-gray-700 mb-2 block">Jurisdiction</Label>
            <Select v-model:value="jurisdiction">
              <SelectTrigger id="jurisdiction"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem v-for="(label, key) in jurisdictions" :key="key" :value="key">{{ label }}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button :disabled="isResearching || !query.trim()" class="w-full bg-blue-600 hover:bg-blue-700" size="lg" @click="performResearch">
          <template v-if="isResearching">
            <Loader2 class="w-5 h-5 mr-2 animate-spin" />
            Researching Legal Databases...
          </template>
          <template v-else>
            <Search class="w-5 h-5 mr-2" />
            Conduct Legal Research
          </template>
        </Button>

        <div v-if="error" class="p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm flex items-start">
          <AlertCircle class="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
          <span>{{ error }}</span>
        </div>
      </CardContent>
    </Card>

    <!-- Research Loading -->
    <Card v-if="isResearching">
      <CardContent class="p-12">
        <div class="text-center">
          <Loader2 class="w-16 h-16 text-blue-600 mx-auto mb-4 animate-spin" />
          <p class="text-gray-600 font-medium mb-2">Conducting Legal Research...</p>
          <p class="text-sm text-gray-500">Searching case law, statutes, and legal databases</p>
        </div>
      </CardContent>
    </Card>

    <!-- Research Results -->
    <Card v-if="result && !isResearching">
      <CardHeader>
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <CardTitle class="flex items-center space-x-2">
              <BookOpen class="w-5 h-5 text-green-600" />
              <span>Research Results</span>
            </CardTitle>
            <div class="mt-2 space-y-1">
              <p class="text-sm text-gray-600"><strong>Query:</strong> {{ result.query }}</p>
              <div class="flex flex-wrap gap-2 mt-2">
                <Badge variant="secondary"><Gavel class="w-3 h-3 mr-1" />{{ researchTypes[result.type] }}</Badge>
                <Badge variant="secondary"><LinkIcon class="w-3 h-3 mr-1" />{{ jurisdictions[result.jurisdiction] }}</Badge>
                <Badge variant="secondary">{{ new Date(result.timestamp).toLocaleDateString() }}</Badge>
              </div>
            </div>
          </div>
          <div class="flex space-x-2">
            <Button variant="outline" size="sm" @click="handleCopy" title="Copy to clipboard">
              <template v-if="copied"><CheckCircle2 class="w-4 h-4 text-green-600" /></template>
              <template v-else><Copy class="w-4 h-4" /></template>
            </Button>
            <Button variant="outline" size="sm" @click="handleDownload" title="Download as Markdown"><Download class="w-4 h-4" /></Button>
            <Button v-if="onSaveToCase && caseId" variant="outline" size="sm" @click="handleSaveToCase" title="Save to case"><Save class="w-4 h-4" /></Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea class="h-[600px]">
          <div class="prose prose-sm max-w-none p-4 bg-white rounded-lg border">
            <div v-html="renderedResult"></div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>

    <!-- Research History -->
    <Card v-if="history.length > 0">
      <CardHeader>
        <CardTitle class="flex items-center space-x-2"><BookMarked class="w-5 h-5 text-purple-600" /><span>Recent Research</span></CardTitle>
      </CardHeader>
      <CardContent>
        <div class="space-y-2">
          <div v-for="(item, index) in history" :key="index" class="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors" @click="loadHistoryItem(item)">
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <p class="text-sm font-medium text-gray-900 line-clamp-1">{{ item.query }}</p>
                <div class="flex flex-wrap gap-2 mt-1">
                  <Badge variant="secondary" class="text-xs">{{ researchTypes[item.type] }}</Badge>
                  <Badge variant="secondary" class="text-xs">{{ jurisdictions[item.jurisdiction] }}</Badge>
                </div>
              </div>
              <span class="text-xs text-gray-500 ml-2">{{ new Date(item.timestamp).toLocaleDateString() }}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BookOpen, Search, Loader2, Scale, FileText, Link as LinkIcon, Download, Save, Copy, CheckCircle2, Sparkles, AlertCircle, BookMarked, Gavel } from 'lucide-vue-next';
import { InvokeLLM } from '@/integrations/Core';
import { useToast } from '@/components/ui/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { marked } from 'marked';

const props = defineProps({ caseId: { type: [String, Number], default: null }, caseData: { type: Object, default: null }, onSaveToCase: { type: Function, default: null } });

const query = ref('');
const researchType = ref('general');
const jurisdiction = ref('federal');
const isResearching = ref(false);
const result = ref(null);
const error = ref(null);
const history = ref([]);
const copied = ref(false);
const { toast } = useToast ? useToast() : { toast: () => {} };

onMounted(() => { loadHistory(); if (props.caseData) inferResearchType(); });
watch(() => props.caseData, (n) => { if (n) inferResearchType(); });

const researchTypes = {
  general: 'General Legal Research',
  case_law: 'Case Law & Precedents',
  statutes: 'Statutes & Legislation',
  regulations: 'Regulations & Rules',
  constitutional: 'Constitutional Law',
  contract_law: 'Contract Law',
  international: 'International Law'
};

const jurisdictions = {
  federal: 'Federal (US)',
  california: 'California',
  new_york: 'New York',
  texas: 'Texas',
  florida: 'Florida',
  illinois: 'Illinois',
  germany: 'Germany (German Law)',
  international: 'International'
};

const loadHistory = () => {
  const saved = localStorage.getItem('legalResearch');
  if (saved) {
    try { const parsed = JSON.parse(saved); history.value = parsed.slice(0,10); } catch (e) { console.error('Failed to load research history:', e); }
  }
};

const inferResearchType = () => {
  const cd = props.caseData; if (!cd) return;
  const caseType = (cd.case_type || '').toLowerCase();
  const title = (cd.title || '').toLowerCase();
  const description = (cd.description || '').toLowerCase();
  const tags = (cd.tags || []).map(t => t.toLowerCase());

  if (caseType === 'criminal' || tags.some(t => t.includes('criminal'))) researchType.value = 'case_law';
  else if (caseType === 'corporate' || tags.some(t => t.includes('contract'))) researchType.value = 'contract_law';
  else if (title.includes('statute') || description.includes('statute') || tags.some(t => t.includes('statute'))) researchType.value = 'statutes';
  else if (title.includes('regulation') || description.includes('regulation') || tags.some(t => t.includes('regulation'))) researchType.value = 'regulations';
  else if (title.includes('constitutional') || description.includes('constitutional') || tags.some(t => t.includes('constitutional'))) researchType.value = 'constitutional';
  else if (caseType === 'international' || tags.some(t => t.includes('international'))) researchType.value = 'international';

  if (cd.court_name) {
    const courtName = cd.court_name.toLowerCase();
    if (courtName.includes('california') || tags.some(t => t.includes('california'))) jurisdiction.value = 'california';
    else if (courtName.includes('new york') || tags.some(t => t.includes('new york'))) jurisdiction.value = 'new_york';
    else if (courtName.includes('texas') || tags.some(t => t.includes('texas'))) jurisdiction.value = 'texas';
    else if (courtName.includes('florida') || tags.some(t => t.includes('florida'))) jurisdiction.value = 'florida';
    else if (courtName.includes('illinois') || tags.some(t => t.includes('illinois'))) jurisdiction.value = 'illinois';
    else if (courtName.includes('germany') || courtName.includes('german') || tags.some(t => t.includes('germany'))) jurisdiction.value = 'germany';
  }
};

const performResearch = async () => {
  if (!query.value.trim()) { if (toast) toast({ variant: 'destructive', title: 'Query Required', description: 'Please enter a research question.' }); return; }
  isResearching.value = true; error.value = null; result.value = null;
  try {
    let contextInfo = '';
    if (props.caseData) {
      contextInfo = `\n**CASE CONTEXT:**\n- Case: ${props.caseData.case_number} - ${props.caseData.title}\n- Type: ${props.caseData.case_type}\n- Court: ${props.caseData.court_name || 'Not specified'}\n${props.caseData.description ? `- Description: ${props.caseData.description.substring(0,200)}...\n` : ''}`;
    }

    let jurisdictionContext = '';
    if (jurisdiction.value === 'germany') {
      jurisdictionContext = `\n**GERMAN LAW CONTEXT:**\nThis research is for German law. Please search German legal sources including: - Bundesgesetze ...`;
    }

    const prompt = `You are an expert legal researcher with access to comprehensive legal databases, case law, statutes, and legal literature.\n\n${contextInfo}\n**RESEARCH REQUEST:**\n- Query: ${query.value}\n- Research Type: ${researchTypes[researchType.value]}\n- Jurisdiction: ${jurisdictions[jurisdiction.value]}\n\n${jurisdictionContext}\n\nProvide overview, case law, statutes, analysis, citations and actionable insights.`;

    const researchResult = await InvokeLLM({ prompt, add_context_from_internet: true });

    const researchData = { query: query.value, type: researchType.value, jurisdiction: jurisdiction.value, result: researchResult, timestamp: new Date().toISOString(), caseId: props.caseId || null };

    result.value = researchData;

    const updatedHistory = [researchData, ...history.value].slice(0,10);
    history.value = updatedHistory; localStorage.setItem('legalResearch', JSON.stringify(updatedHistory));

    if (toast) toast({ title: 'Research Complete', description: 'Legal research has been completed successfully.' });
  } catch (err) {
    console.error('Failed to perform research:', err); error.value = 'Failed to complete legal research. Please try again.'; if (toast) toast({ variant: 'destructive', title: 'Research Failed', description: err.message || 'An error occurred during research.' });
  } finally { isResearching.value = false; }
};

const handleCopy = async () => {
  if (result.value && result.value.result) {
    try {
      await navigator.clipboard.writeText(`# Legal Research Results\n\n**Query:** ${result.value.query}\n**Type:** ${researchTypes[result.value.type]}\n**Jurisdiction:** ${jurisdictions[result.value.jurisdiction]}\n**Date:** ${new Date(result.value.timestamp).toLocaleString()}\n\n---\n\n${result.value.result}`);
      copied.value = true; setTimeout(() => copied.value = false, 2000);
      if (toast) toast({ title: 'Copied to Clipboard', description: 'Research results have been copied.' });
    } catch (err) { console.error('Failed to copy:', err); }
  }
};

const handleDownload = () => {
  if (result.value && result.value.result) {
    const content = `# Legal Research Results\n\n**Query:** ${result.value.query}\n**Type:** ${researchTypes[result.value.type]}\n**Jurisdiction:** ${jurisdictions[result.value.jurisdiction]}\n**Date:** ${new Date(result.value.timestamp).toLocaleString()}\n\n---\n\n${result.value.result}`;
    const blob = new Blob([content], { type: 'text/markdown' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `legal-research-${Date.now()}.md`; document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
    if (toast) toast({ title: 'Downloaded', description: 'Research results have been downloaded.' });
  }
};

const handleSaveToCase = () => { if (props.onSaveToCase && result.value) { props.onSaveToCase(result.value); if (toast) toast({ title: 'Saved to Case', description: 'Research has been attached to the case.' }); } };

const loadHistoryItem = (item) => { result.value = item; query.value = item.query; researchType.value = item.type; jurisdiction.value = item.jurisdiction; };

const renderedResult = computed(() => result.value?.result ? marked.parse(result.value.result) : '');

</script>

<style scoped>
/* no custom styles */
</style>
