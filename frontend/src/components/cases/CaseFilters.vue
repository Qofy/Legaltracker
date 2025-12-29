<template>
  <div class="flex flex-col sm:flex-row gap-3">
    <Select v-model:value="status">
      <SelectTrigger class="w-full sm:w-32 clean-border">
        <SelectValue placeholder="Status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Status</SelectItem>
        <SelectItem value="open">Open</SelectItem>
        <SelectItem value="in_progress">In Progress</SelectItem>
        <SelectItem value="closed">Closed</SelectItem>
        <SelectItem value="on_hold">On Hold</SelectItem>
      </SelectContent>
    </Select>

    <Select v-model:value="priority">
      <SelectTrigger class="w-full sm:w-32 clean-border">
        <SelectValue placeholder="Priority" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Priority</SelectItem>
        <SelectItem value="urgent">Urgent</SelectItem>
        <SelectItem value="high">High</SelectItem>
        <SelectItem value="medium">Medium</SelectItem>
        <SelectItem value="low">Low</SelectItem>
      </SelectContent>
    </Select>

    <Select v-model:value="type">
      <SelectTrigger class="w-full sm:w-40 clean-border">
        <SelectValue placeholder="Case Type" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Types</SelectItem>
        <SelectItem value="civil">Civil</SelectItem>
        <SelectItem value="criminal">Criminal</SelectItem>
        <SelectItem value="family">Family</SelectItem>
        <SelectItem value="corporate">Corporate</SelectItem>
        <SelectItem value="immigration">Immigration</SelectItem>
        <SelectItem value="personal_injury">Personal Injury</SelectItem>
        <SelectItem value="other">Other</SelectItem>
      </SelectContent>
    </Select>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const props = defineProps({
  filters: { type: Object, required: true },
  onFilterChange: { type: Function, required: true }
});

const status = ref(props.filters.status ?? 'all');
const priority = ref(props.filters.priority ?? 'all');
const type = ref(props.filters.type ?? 'all');

watch(() => props.filters, (f) => {
  status.value = f.status ?? 'all';
  priority.value = f.priority ?? 'all';
  type.value = f.type ?? 'all';
}, { deep: true });

watch(status, (val) => { if (props.onFilterChange) props.onFilterChange('status', val); });
watch(priority, (val) => { if (props.onFilterChange) props.onFilterChange('priority', val); });
watch(type, (val) => { if (props.onFilterChange) props.onFilterChange('type', val); });
</script>

<style scoped>
/* no custom styles */
</style>
