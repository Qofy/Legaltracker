<template>
  <Card
    v-if="caseId && !isLoading"
    class="bg-white material-elevation-1 mx-4 mb-4"
  >
    <CardHeader class="pb-3">
      <CardTitle class="text-sm flex items-center space-x-2">
        <Award class="w-4 h-4 text-yellow-600" />
        <span>Points</span>
      </CardTitle>
    </CardHeader>
    <CardContent class="space-y-3">
      <div class="flex items-center justify-between text-xs">
        <div class="text-center">
          <div class="text-lg font-bold text-blue-600">{{ ourPoints }}</div>
          <div class="text-gray-500">Us</div>
        </div>
        <div class="text-gray-400 font-bold">VS</div>
        <div class="text-center">
          <div class="text-lg font-bold text-red-600">{{ counterpartPoints }}</div>
          <div class="text-gray-500">Them</div>
        </div>
      </div>

      <div class="relative h-2 bg-red-200 rounded-full overflow-hidden">
        <div
          class="absolute left-0 top-0 h-full bg-blue-500 transition-all duration-500"
          :style="{ width: `${ourPercentage}%` }"
        ></div>
      </div>

      <div class="text-center">
        <Badge
          v-if="ourPoints > counterpartPoints"
          class="bg-green-100 text-green-800 text-xs"
        >
          <TrendingUp class="w-3 h-3 mr-1" />
          +{{ ourPoints - counterpartPoints }}
        </Badge>
        <Badge
          v-else-if="ourPoints < counterpartPoints"
          class="bg-orange-100 text-orange-800 text-xs"
        >
          <TrendingDown class="w-3 h-3 mr-1" />
          -{{ counterpartPoints - ourPoints }}
        </Badge>
        <Badge
          v-else
          class="bg-gray-100 text-gray-800 text-xs"
        >
          Tied
        </Badge>
      </div>
    </CardContent>
  </Card>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
// import { Document } from '@/entities/Document'; // Commented out - API call
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Award, TrendingUp, TrendingDown } from 'lucide-vue-next';

const props = defineProps({
  caseId: {
    type: [String, Number],
    default: null
  }
});

const documents = ref([]);
const isLoading = ref(true);

const loadDocuments = async () => {
  isLoading.value = true;
  try {
    // API call commented out
    // const docs = await Document.filter({ case_id: props.caseId });
    // documents.value = docs;

    // Mock data for demonstration
    documents.value = [
      { id: 1, submitted_by_party: 'us', points_awarded: 15 },
      { id: 2, submitted_by_party: 'us', points_awarded: 10 },
      { id: 3, submitted_by_party: 'counterpart', points_awarded: 8 },
      { id: 4, submitted_by_party: 'counterpart', points_awarded: 12 }
    ];
  } catch (error) {
    console.error('Failed to load documents:', error);
  }
  isLoading.value = false;
};

const ourPoints = computed(() => {
  return documents.value
    .filter(d => d.submitted_by_party === 'us')
    .reduce((sum, d) => sum + (d.points_awarded || 0), 0);
});

const counterpartPoints = computed(() => {
  return documents.value
    .filter(d => d.submitted_by_party === 'counterpart')
    .reduce((sum, d) => sum + (d.points_awarded || 0), 0);
});

const totalPoints = computed(() => ourPoints.value + counterpartPoints.value);

const ourPercentage = computed(() => {
  return totalPoints.value > 0 ? (ourPoints.value / totalPoints.value) * 100 : 50;
});

watch(() => props.caseId, (newCaseId) => {
  if (newCaseId) {
    loadDocuments();
  }
}, { immediate: true });
</script>
