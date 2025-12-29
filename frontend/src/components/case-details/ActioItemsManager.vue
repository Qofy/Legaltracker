<template>
  <Card class="material-elevation-1 clean-border">
    <CardContent class="p-6">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold">Action Items</h3>
        <Button variant="outline" @click="showAddForm = !showAddForm">
          <Plus class="w-4 h-4 mr-2" />
          Add Item
        </Button>
      </div>

      <div v-if="showAddForm" class="space-y-4 p-4 border rounded-md mb-4 bg-gray-50">
        <Input placeholder="Title" v-model="newItem.title" />
        <Textarea placeholder="Description" v-model="newItem.description" />
        <Select v-model:value="newItem.assigned_to">
          <SelectTrigger><SelectValue placeholder="Assign to..." /></SelectTrigger>
          <SelectContent>
            <SelectItem v-for="u in users" :key="u.id" :value="u.id">{{ u.full_name }}</SelectItem>
          </SelectContent>
        </Select>
        <div class="flex justify-end">
          <Button @click="handleCreateItem"><Check class="w-4 h-4 mr-2" />Create</Button>
        </div>
      </div>

      <div v-if="isLoading">Loading action items...</div>

      <Table v-else>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Assigned To</TableHead>
            <TableHead>Status</TableHead>
            <TableHead class="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-if="actionItems.length === 0">
            <TableCell colSpan="4" class="text-center">No action items found.</TableCell>
          </TableRow>
          <TableRow v-for="item in actionItems" :key="item.id">
            <TableCell class="font-medium">{{ item.title }}</TableCell>
            <TableCell>{{ userName(item.assigned_to) }}</TableCell>
            <TableCell>
              <Select v-model:value="item.status" @value-change="(val) => handleStatusChange(item, val)">
                <SelectTrigger class="w-32"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </TableCell>
            <TableCell class="text-right">
              <Button variant="ghost" size="icon" @click="handleDelete(item.id)">
                <Trash2 class="w-4 h-4" />
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </CardContent>
  </Card>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ActionItem } from '@/entities/ActionItem';
import { User } from '@/entities/User';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Check, Plus, Trash2 } from 'lucide-vue-next';

const props = defineProps({ caseId: { type: [String, Number], required: true } });

const actionItems = ref([]);
const users = ref([]);
const isLoading = ref(true);
const showAddForm = ref(false);
const newItem = ref({ title: '', description: '', assigned_to: '', status: 'pending', priority: 'medium' });

const loadActionItems = async () => {
  isLoading.value = true;
  const items = await ActionItem.filter({ case_id: props.caseId });
  actionItems.value = items;
  isLoading.value = false;
};

const loadUsers = async () => {
  const list = await User.list();
  users.value = list.filter(u => u.user_type === 'lawyer' || u.user_type === 'admin');
};

onMounted(() => { loadActionItems(); loadUsers(); });

const handleCreateItem = async () => {
  if (!newItem.value.title || !newItem.value.assigned_to) return;
  await ActionItem.create({ ...newItem.value, case_id: props.caseId });
  newItem.value = { title: '', description: '', assigned_to: '', status: 'pending', priority: 'medium' };
  showAddForm.value = false;
  await loadActionItems();
};

const handleDelete = async (itemId) => {
  if (confirm('Are you sure you want to delete this action item?')) {
    await ActionItem.delete(itemId);
    await loadActionItems();
  }
};

const handleStatusChange = async (item, status) => {
  await ActionItem.update(item.id, { status });
  await loadActionItems();
};

const userName = (id) => {
  const u = users.value.find(x => x.id === id);
  return u ? u.full_name : 'Unassigned';
};
</script>

<style scoped>
/* no custom styles */
</style>
