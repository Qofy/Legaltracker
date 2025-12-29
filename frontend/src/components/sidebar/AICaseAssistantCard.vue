<template>
  <Card
    v-if="caseId"
    class="bg-gradient-to-br from-purple-50 to-blue-50 material-elevation-1 mx-4 mb-4 border-purple-200"
  >
    <CardHeader class="pb-3">
      <CardTitle class="text-sm flex items-center space-x-2">
        <Bot class="w-4 h-4 text-purple-600" />
        <span>AI Assistant</span>
      </CardTitle>
    </CardHeader>
    <CardContent>
      <p class="text-xs text-gray-700 mb-3">
        Get AI-powered insights and recommendations for your case
      </p>
      <router-link :to="documentsUrl">
        <Button size="sm" class="w-full bg-purple-600 hover:bg-purple-700 text-xs">
          <Sparkles class="w-3 h-3 mr-2" />
          View Insights
        </Button>
      </router-link>
    </CardContent>
  </Card>
</template>

<script setup>
import { computed } from 'vue';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bot, Sparkles } from 'lucide-vue-next';
import { createPageUrl } from '@/utils';

const props = defineProps({
  caseId: {
    type: [String, Number],
    default: null
  }
});

const documentsUrl = computed(() => createPageUrl('Documents'));
</script>
