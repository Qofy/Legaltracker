<template>
  <Card
    v-if="pinnedCaseId && !isLoading && caseData"
    class="bg-orange-50 border-orange-300 border-2 material-elevation-1 mx-4 mb-4"
  >
    <CardContent class="p-3">
      <div class="flex items-start justify-between mb-2">
        <div class="flex items-center space-x-2">
          <Pin class="w-4 h-4 text-orange-600 fill-orange-600" />
          <span class="text-xs font-semibold text-orange-800">Pinned Case</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          @click="handleUnpin"
          class="h-5 w-5 hover:bg-orange-100"
        >
          <X class="w-3 h-3" />
        </Button>
      </div>
      <router-link :to="caseDetailsUrl">
        <div class="space-y-2">
          <h4 class="font-semibold text-sm text-gray-900 hover:text-blue-600 transition-colors truncate">
            {{ caseData.title }}
          </h4>
          <p class="text-xs text-gray-600">#{{ caseData.case_number }}</p>
          <Badge :class="`text-xs ${getStatusColor(caseData.status)}`">
            {{ caseData.status.replace('_', ' ') }}
          </Badge>
        </div>
      </router-link>
    </CardContent>
  </Card>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
// import { Case } from '@/entities/Case'; // Commented out - API call
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Briefcase, Pin, X } from 'lucide-vue-next';
import { createPageUrl } from '@/utils';

const props = defineProps({
  pinnedCaseId: {
    type: [String, Number],
    default: null
  }
});

const emit = defineEmits(['unpin']);

const caseData = ref(null);
const isLoading = ref(true);

const loadCase = async () => {
  isLoading.value = true;
  try {
    // API call commented out
    // const data = await Case.get(props.pinnedCaseId);
    // caseData.value = data;

    // Mock data for demonstration
    caseData.value = {
      id: props.pinnedCaseId,
      title: 'Sample Pinned Case',
      case_number: 'CASE-2025-001',
      status: 'in_progress'
    };
  } catch (error) {
    console.error('Failed to load pinned case:', error);
    emit('unpin');
  }
  isLoading.value = false;
};

const getStatusColor = (status) => {
  switch(status) {
    case 'open': return 'bg-blue-100 text-blue-800';
    case 'in_progress': return 'bg-yellow-100 text-yellow-800';
    case 'closed': return 'bg-green-100 text-green-800';
    case 'on_hold': return 'bg-gray-100 text-gray-800';
    case 'archived': return 'bg-neutral-200 text-neutral-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const caseDetailsUrl = computed(() => {
  return `${createPageUrl('CaseDetails')}?caseId=${caseData.value?.id || ''}`;
});

const handleUnpin = () => {
  emit('unpin');
};

watch(() => props.pinnedCaseId, (newPinnedCaseId) => {
  if (newPinnedCaseId) {
    loadCase();
  }
}, { immediate: true });
</script>
