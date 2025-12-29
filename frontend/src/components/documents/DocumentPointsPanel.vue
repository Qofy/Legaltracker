<template>
  <div class="space-y-4">
    <Card class="material-elevation-2">
      <CardHeader>
        <CardTitle class="flex items-center space-x-2">
          <Award class="w-5 h-5 text-yellow-600" />
          <span>Case Points Tracker</span>
        </CardTitle>
      </CardHeader>

      <CardContent class="space-y-6">
        <!-- Score Display -->
        <div class="flex items-center justify-between">
          <div class="text-center flex-1">
            <div class="flex items-center justify-center space-x-2 mb-2">
              <TrendingUp class="w-5 h-5 text-blue-600" />
              <span class="text-sm font-medium text-gray-600">Our Team</span>
            </div>
            <div class="text-4xl font-bold text-blue-600">{{ ourPoints }}</div>
            <div class="text-xs text-gray-500 mt-1">{{ ourDocsCount }} documents</div>
          </div>

          <div class="text-center px-4">
            <div class="text-2xl font-bold text-gray-400">VS</div>
          </div>

          <div class="text-center flex-1">
            <div class="flex items-center justify-center space-x-2 mb-2">
              <TrendingDown class="w-5 h-5 text-red-600" />
              <span class="text-sm font-medium text-gray-600">Counterpart</span>
            </div>
            <div class="text-4xl font-bold text-red-600">{{ counterpartPoints }}</div>
            <div class="text-xs text-gray-500 mt-1">{{ counterpartDocsCount }} documents</div>
          </div>
        </div>

        <!-- Visual Progress Bar -->
        <div class="space-y-2">
          <div class="flex justify-between text-sm">
            <span class="font-medium text-blue-600">{{ ourPercentage.toFixed(1) }}%</span>
            <span class="font-medium text-red-600">{{ (100 - ourPercentage).toFixed(1) }}%</span>
          </div>
          <div class="relative h-4 bg-red-200 rounded-full overflow-hidden">
            <div
              class="absolute left-0 top-0 h-full bg-blue-500 transition-all duration-500"
              :style="{ width: `${ourPercentage}%` }"
            ></div>
          </div>
        </div>

        <!-- Status Badge -->
        <div class="text-center">
          <Badge v-if="ourPoints > counterpartPoints" class="bg-green-100 text-green-800 border-green-300">
            <TrendingUp class="w-3 h-3 mr-1" />
            Leading by {{ ourPoints - counterpartPoints }} points
          </Badge>
          <Badge v-else-if="ourPoints < counterpartPoints" class="bg-orange-100 text-orange-800 border-orange-300">
            <TrendingDown class="w-3 h-3 mr-1" />
            Behind by {{ counterpartPoints - ourPoints }} points
          </Badge>
          <Badge v-else class="bg-gray-100 text-gray-800 border-gray-300">
            <Users class="w-3 h-3 mr-1" />
            Tied Score
          </Badge>
        </div>

        <!-- Top Scoring Documents -->
        <div class="border-t pt-4">
          <h4 class="text-sm font-semibold text-gray-700 mb-3">Top Scoring Documents</h4>
          <div class="space-y-2">
            <div
              v-for="doc in topScoringDocs"
              :key="doc.id"
              class="flex items-center justify-between text-sm"
            >
              <span class="truncate flex-1 text-gray-700">{{ doc.file_name }}</span>
              <Badge
                variant="outline"
                :class="doc.submitted_by_party === 'us' ? 'bg-blue-50 text-blue-700' : 'bg-red-50 text-red-700'"
              >
                +{{ doc.points_awarded }} pts
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Award, TrendingUp, TrendingDown, Users } from 'lucide-vue-next';

const props = defineProps({
  documents: { type: Array, default: () => [] }
});

const ourPoints = computed(() =>
  props.documents
    .filter(d => d.submitted_by_party === 'us')
    .reduce((sum, d) => sum + (d.points_awarded || 0), 0)
);

const counterpartPoints = computed(() =>
  props.documents
    .filter(d => d.submitted_by_party === 'counterpart')
    .reduce((sum, d) => sum + (d.points_awarded || 0), 0)
);

const totalPoints = computed(() => ourPoints.value + counterpartPoints.value);

const ourPercentage = computed(() =>
  totalPoints.value > 0 ? (ourPoints.value / totalPoints.value) * 100 : 50
);

const ourDocsCount = computed(() =>
  props.documents.filter(d => d.submitted_by_party === 'us').length
);

const counterpartDocsCount = computed(() =>
  props.documents.filter(d => d.submitted_by_party === 'counterpart').length
);

const topScoringDocs = computed(() =>
  props.documents
    .filter(d => d.points_awarded > 0)
    .sort((a, b) => (b.points_awarded || 0) - (a.points_awarded || 0))
    .slice(0, 5)
);
</script>

<style scoped>
/* no custom styles */
</style>
