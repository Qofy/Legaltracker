<template>
  <>
    <Button
      @click="showChat = true"
      class="h-12 w-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
      size="icon"
    >
      <MessageSquare class="w-5 h-5" />
    </Button>

    <Dialog :open="showChat" @open-change="(v) => showChat = v">
      <DialogContent class="max-w-2xl max-h-[80vh] p-0">
        <DialogHeader class="p-4 border-b">
          <DialogTitle class="flex items-center space-x-2">
            <MessageSquare class="w-5 h-5 text-blue-600" />
            <span>AI Assistant</span>
          </DialogTitle>
        </DialogHeader>
        <div class="h-[60vh]">
          <ChatPanel :caseId="caseId" :user="user" />
        </div>
      </DialogContent>
    </Dialog>
  </>
</template>

<script setup>
import { ref } from 'vue';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import ChatPanel from './ChatPanel.vue';
import { MessageSquare } from 'lucide-vue-next';

const props = defineProps({ caseId: { type: [String, Number], required: true }, user: { type: Object, required: false } });

const showChat = ref(false);
</script>

<style scoped>
/* no custom styles */
</style>
