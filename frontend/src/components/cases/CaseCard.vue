<template>
  <Card :class="cardClasses">
    <CardHeader class="pb-3">
      <div class="flex items-start justify-between">
        <div class="flex-1 min-w-0">
          <div class="flex items-center space-x-2 mb-1">
            <CardTitle class="text-lg font-semibold text-gray-900 truncate">
              <RouterLink :to="detailsUrl" class="hover:underline">{{ case_.title }}</RouterLink>
            </CardTitle>
            <component v-if="StatusIcon" :is="StatusIcon" class="w-4 h-4" />
            <Pin v-if="isPinned" class="w-4 h-4 text-orange-600 fill-orange-600 flex-shrink-0" />
            <Badge v-if="isArchived" variant="secondary" class="bg-purple-100 text-purple-800">
              <Archive class="w-3 h-3 mr-1" />
              Archived
            </Badge>
          </div>
          <p class="text-sm text-gray-600">Case #{{ case_.case_number }}</p>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant="ghost" size="icon" class="h-8 w-8 flex-shrink-0">
              <MoreVertical class="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <RouterLink :to="detailsUrl">
                <Eye class="w-4 h-4 mr-2" />
                View Details
              </RouterLink>
            </DropdownMenuItem>
            <DropdownMenuItem v-if="!isArchived" @click="onPin">
              <template v-if="isPinned">
                <PinOff class="w-4 h-4 mr-2" /> Unpin Case
              </template>
              <template v-else>
                <Pin class="w-4 h-4 mr-2" /> Pin Case
              </template>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <RouterLink :to="detailsUrl + '&tab=overview'">
                <Edit class="w-4 h-4 mr-2" /> Edit Case
              </RouterLink>
            </DropdownMenuItem>
            <DropdownMenuItem v-if="isArchived" @click="handleUnarchive">
              <ArchiveRestore class="w-4 h-4 mr-2" /> Unarchive
            </DropdownMenuItem>
            <DropdownMenuItem v-else @click="handleArchive">
              <Archive class="w-4 h-4 mr-2" /> Archive
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </CardHeader>

    <CardContent class="space-y-4 flex-grow flex flex-col">
      <p class="text-sm text-gray-700 line-clamp-2 flex-grow">{{ case_.description }}</p>

      <div class="flex flex-wrap gap-2">
        <Badge :class="getStatusColor(case_.status) + ' clean-border'">
          <component v-if="StatusIconSmall" :is="StatusIconSmall" class="w-3 h-3 mr-1" />
          {{ (case_.status || '').replace('_', ' ') }}
        </Badge>
        <template v-if="!isArchived">
          <Badge :class="getPriorityColor(case_.priority) + ' clean-border'">{{ case_.priority }} priority</Badge>
          <Badge variant="outline" class="clean-border">{{ (case_.case_type || '').replace('_', ' ') }}</Badge>
        </template>
      </div>

      <div class="space-y-2 text-xs text-gray-500">
        <div v-if="case_.due_date" class="flex items-center space-x-2">
          <Calendar class="w-3 h-3" />
          <span>Due: {{ formatDate(case_.due_date) }}</span>
        </div>
        <div class="flex items-center space-x-2">
          <Clock class="w-3 h-3" />
          <span>Updated: {{ formatDate(case_.updated_date) }}</span>
        </div>
      </div>

      <RouterLink :to="detailsUrl" class="mt-auto">
        <Button variant="outline" class="w-full mt-4 clean-border">
          <Eye class="w-4 h-4 mr-2" />
          View Case
        </Button>
      </RouterLink>
    </CardContent>
  </Card>
</template>

<script setup>
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import { createPageUrl } from '@/utils';
import { Case } from '@/services/entities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreVertical, Eye, Edit, Archive, ArchiveRestore, Calendar, Clock, Pin, PinOff } from 'lucide-vue-next';
import { format } from 'date-fns';
import { useToast } from '@/components/ui/use-toast';

const props = defineProps({
  case_: { type: Object, required: true },
  getStatusColor: { type: Function, required: true },
  getPriorityColor: { type: Function, required: true },
  getStatusIcon: { type: Function, required: true },
  isPinned: { type: Boolean, required: false },
  onPin: { type: Function, required: false },
  onUpdate: { type: Function, required: false }
});

const { toast } = (() => {
  try { return useToast(); } catch (e) { return { toast: (opts) => console.info('toast', opts) }; }
})();

const detailsUrl = computed(() => createPageUrl('CaseDetails') + `?caseId=${props.case_.id}`);
const isArchived = computed(() => props.case_.status === 'archived');
const cardClasses = computed(() => `material-elevation-1 hover:material-elevation-2 transition-all duration-300 clean-border ${props.isPinned ? 'ring-2 ring-orange-400 bg-orange-50' : ''} ${isArchived.value ? 'opacity-75 bg-purple-50/50' : ''} flex flex-col`);

const StatusIcon = computed(() => props.getStatusIcon ? props.getStatusIcon(props.case_.status) : null);
const StatusIconSmall = computed(() => props.getStatusIcon ? props.getStatusIcon(props.case_.status) : null);

const handleArchive = async () => {
  try {
    await Case.update(props.case_.id, { status: 'archived' });
    toast({ title: 'Case archived', description: `${props.case_.title} has been archived` });
    if (props.onUpdate) props.onUpdate();
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Failed to archive case:', err);
    toast({ variant: 'destructive', title: 'Error', description: 'Failed to archive case' });
  }
};

const handleUnarchive = async () => {
  try {
    await Case.update(props.case_.id, { status: 'open' });
    toast({ title: 'Case unarchived', description: `${props.case_.title} has been restored to active cases` });
    if (props.onUpdate) props.onUpdate();
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Failed to unarchive case:', err);
    toast({ variant: 'destructive', title: 'Error', description: 'Failed to unarchive case' });
  }
};

const formatDate = (d) => {
  try { return format(new Date(d), 'MMM d, yyyy'); } catch (e) { return ''; }
};
</script>

<style scoped>
/* no custom styles */
</style>
