<template>
  <div class="relative">
    <!-- Timeline Line -->
    <div class="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500"></div>

    <div class="space-y-6">
      <div v-for="(doc, index) in sortedDocs" :key="doc.id" class="relative flex items-start">
        <!-- Timeline Dot -->
        <div class="absolute left-8 transform -translate-x-1/2 flex items-center justify-center">
          <div
            :class="[
              'w-4 h-4 rounded-full ring-4 ring-white',
              getTimelineDotClass(doc.submitted_by_party)
            ]"
          ></div>
        </div>

        <!-- Content Card -->
        <div :class="['ml-20 flex-1', isLeftAligned(doc) ? '' : 'mr-20']">
          <Card
            :class="[
              'border-l-4 hover:shadow-md transition-shadow',
              getBorderClass(doc.submitted_by_party)
            ]"
          >
            <CardContent class="p-4">
              <div class="flex items-start justify-between mb-2">
                <div class="flex items-center space-x-2">
                  <FileText class="w-4 h-4 text-gray-500" />
                  <h4 class="font-semibold text-gray-900">{{ doc.file_name }}</h4>
                </div>
                <Badge :class="getPartyColor(doc.submitted_by_party)">
                  {{ getPartyLabel(doc.submitted_by_party) }}
                </Badge>
              </div>

              <div class="flex items-center space-x-4 text-xs text-gray-500 mb-2">
                <div class="flex items-center space-x-1">
                  <Clock class="w-3 h-3" />
                  <span>{{ formatDate(doc.created_date) }}</span>
                </div>
                <div class="flex items-center space-x-1">
                  <User class="w-3 h-3" />
                  <span>{{ doc.created_by }}</span>
                </div>
                <div v-if="doc.points_awarded !== 0" class="flex items-center space-x-1">
                  <Award class="w-3 h-3" />
                  <span
                    :class="doc.points_awarded > 0 ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'"
                  >
                    {{ doc.points_awarded > 0 ? '+' : '' }}{{ doc.points_awarded }} pts
                  </span>
                </div>
              </div>

              <div class="flex items-center space-x-2 flex-wrap gap-1">
                <Badge variant="outline" class="text-xs">
                  {{ doc.document_type }}
                </Badge>
                <Badge variant="outline" class="text-xs">
                  {{ doc.file_type.toUpperCase() }}
                </Badge>
                <Badge v-if="doc.is_confidential" class="text-xs bg-red-100 text-red-800">
                  Confidential
                </Badge>
              </div>

              <div v-if="doc.inline_notes" class="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm">
                <p class="text-gray-700">{{ doc.inline_notes }}</p>
              </div>

              <div v-if="doc.points_notes" class="mt-2 p-2 bg-green-50 border border-green-200 rounded text-sm">
                <p class="text-gray-700"><strong>Points Reasoning:</strong> {{ doc.points_notes }}</p>
              </div>

              <p class="text-xs text-gray-500 mt-2">
                Case: {{ getCaseInfo(doc.case_id) }}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { FileText, Clock, User, Award } from 'lucide-vue-next';

const props = defineProps({
  documents: { type: Array, default: () => [] },
  cases: { type: Array, default: () => [] }
});

const sortedDocs = computed(() =>
  [...props.documents].sort((a, b) =>
    new Date(a.created_date) - new Date(b.created_date)
  )
);

const getPartyColor = (party) => {
  switch (party) {
    case 'us':
      return 'bg-blue-100 text-blue-800 border-blue-300';
    case 'counterpart':
      return 'bg-red-100 text-red-800 border-red-300';
    case 'court':
      return 'bg-purple-100 text-purple-800 border-purple-300';
    case 'third_party':
      return 'bg-gray-100 text-gray-800 border-gray-300';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-300';
  }
};

const getPartyLabel = (party) => {
  switch (party) {
    case 'us':
      return 'Our Team';
    case 'counterpart':
      return 'Counterpart';
    case 'court':
      return 'Court';
    case 'third_party':
      return 'Third Party';
    default:
      return 'Unknown';
  }
};

const getTimelineDotClass = (party) => {
  switch (party) {
    case 'us':
      return 'bg-blue-500';
    case 'counterpart':
      return 'bg-red-500';
    case 'court':
      return 'bg-purple-500';
    default:
      return 'bg-gray-500';
  }
};

const getBorderClass = (party) => {
  switch (party) {
    case 'us':
      return 'border-l-blue-500';
    case 'counterpart':
      return 'border-l-red-500';
    case 'court':
      return 'border-l-purple-500';
    default:
      return 'border-l-gray-500';
  }
};

const isLeftAligned = (doc) => {
  return doc.submitted_by_party === 'us';
};

const formatDate = (date) => {
  if (!date) return '';
  return format(new Date(date), 'MMM d, yyyy HH:mm');
};

const getCaseInfo = (caseId) => {
  const associatedCase = props.cases.find(c => c.id === caseId);
  if (!associatedCase) return 'Unknown';
  return `${associatedCase.case_number || 'Unknown'} - ${associatedCase.title}`;
};
</script>

<style scoped>
/* no custom styles */
</style>
