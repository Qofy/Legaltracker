<template>
  <div v-if="isLoading" class="p-6 space-y-6">
    <div class="animate-pulse space-y-4">
      <div class="h-8 bg-gray-200 rounded w-1/3"></div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card v-for="i in 3" :key="i" class="h-48">
          <CardContent class="p-4">
            <div class="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
            <div class="h-3 bg-gray-200 rounded w-full mb-4"></div>
            <div class="space-y-2">
              <div class="h-3 bg-gray-200 rounded w-1/2"></div>
              <div class="h-3 bg-gray-200 rounded w-1/3"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>

  <div v-else class="p-6 bg-gray-50 min-h-screen">
    <div class="max-w-7xl mx-auto space-y-6">
      <!-- Header -->
      <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 flex items-center">
            <FileText class="w-8 h-8 text-blue-600 mr-3" />
            My Cases
          </h1>
          <p class="text-gray-600 mt-1">
            Track your legal matters and communicate with your lawyers
          </p>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card class="material-elevation-1 clean-border">
          <CardContent class="p-4">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600">Total Cases</p>
                <p class="text-2xl font-bold text-gray-900">{{ cases.length }}</p>
              </div>
              <FileText class="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card class="material-elevation-1 clean-border">
          <CardContent class="p-4">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600">Active Cases</p>
                <p class="text-2xl font-bold text-gray-900">
                  {{ cases.filter(c => ['open', 'in_progress'].includes(c.status)).length }}
                </p>
              </div>
              <Clock class="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card class="material-elevation-1 clean-border">
          <CardContent class="p-4">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600">High Priority</p>
                <p class="text-2xl font-bold text-gray-900">
                  {{ cases.filter(c => ['urgent', 'high'].includes(c.priority)).length }}
                </p>
              </div>
              <AlertTriangle class="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card class="material-elevation-1 clean-border">
          <CardContent class="p-4">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600">Upcoming Deadlines</p>
                <p class="text-2xl font-bold text-gray-900">
                  {{ cases.filter(c => c.next_deadline && new Date(c.next_deadline) > new Date()).length }}
                </p>
              </div>
              <Calendar class="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Filters and Search -->
      <Card class="material-elevation-1 clean-border">
        <CardContent class="p-6">
          <div class="flex flex-col lg:flex-row gap-4">
            <div class="flex-1">
              <div class="relative">
                <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  v-model="searchQuery"
                  placeholder="Search your cases..."
                  class="pl-10 clean-border"
                />
              </div>
            </div>
            <Select v-model="statusFilter">
              <SelectTrigger class="w-48 clean-border">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
                <SelectItem value="on_hold">On Hold</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <!-- Cases Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-if="filteredCases.length === 0" class="col-span-full">
          <Card class="material-elevation-1 clean-border">
            <CardContent class="text-center py-12">
              <FileText class="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 class="text-lg font-semibold text-gray-900 mb-2">No cases found</h3>
              <p class="text-gray-500">
                {{
                  searchQuery || statusFilter !== "all"
                    ? "Try adjusting your search or filters"
                    : "You don't have any cases yet"
                }}
              </p>
            </CardContent>
          </Card>
        </div>
        <Card
          v-else
          v-for="caseItem in filteredCases"
          :key="caseItem.id"
          class="material-elevation-2 hover:material-elevation-3 transition-shadow duration-300 clean-border"
        >
          <CardHeader class="pb-3">
            <div class="flex items-start justify-between">
              <div class="flex-1 min-w-0">
                <CardTitle class="text-lg font-semibold text-gray-900 mb-1 truncate">
                  <router-link
                    :to="`/case-details?caseId=${caseItem.id}`"
                    class="hover:underline"
                  >
                    {{ caseItem.title }}
                  </router-link>
                </CardTitle>
                <p class="text-sm text-gray-600">Case #{{ caseItem.case_number }}</p>
              </div>
            </div>
          </CardHeader>

          <CardContent class="space-y-4">
            <p class="text-sm text-gray-700 line-clamp-2">
              {{ caseItem.description }}
            </p>

            <div class="flex flex-wrap gap-2">
              <Badge :class="`${getStatusColor(caseItem.status)} clean-border`">
                {{ caseItem.status.replace('_', ' ') }}
              </Badge>
              <Badge :class="`${getPriorityColor(caseItem.priority)} clean-border`">
                {{ caseItem.priority }} priority
              </Badge>
              <Badge variant="outline" class="clean-border">
                {{ caseItem.case_type?.replace('_', ' ') }}
              </Badge>
            </div>

            <div class="space-y-2 text-xs text-gray-500">
              <div v-if="caseItem.due_date" class="flex items-center space-x-2">
                <Calendar class="w-3 h-3" />
                <span>Due: {{ formatDate(caseItem.due_date) }}</span>
              </div>
              <div v-if="caseItem.next_deadline" class="flex items-center space-x-2">
                <AlertTriangle class="w-3 h-3 text-orange-500" />
                <span>Next: {{ formatDate(caseItem.next_deadline) }}</span>
              </div>
              <div class="flex items-center space-x-2">
                <Clock class="w-3 h-3" />
                <span>Updated: {{ formatDate(caseItem.updated_date) }}</span>
              </div>
            </div>

            <router-link :to="`/case-details?caseId=${caseItem.id}`" class="block">
              <Button variant="outline" class="w-full clean-border">
                <Eye class="w-4 h-4 mr-2" />
                View Case Details
              </Button>
            </router-link>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { format } from 'date-fns';
// TODO: Import Case and User entities when API is ready
// import { Case } from '@/entities/Case';
// import { User } from '@/entities/User';
import {
  FileText,
  Calendar,
  Clock,
  AlertTriangle,
  Search,
  Eye,
} from 'lucide-vue-next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// State
const cases = ref([]);
const filteredCases = ref([]);
const user = ref(null);
const isLoading = ref(true);
const searchQuery = ref('');
const statusFilter = ref('all');

// Computed

// Methods
const loadUserAndCases = async () => {
  isLoading.value = true;
  try {
    // TODO: Replace with actual API calls when ready
    // const userData = await User.me();
    // user.value = userData;

    // const allCases = await Case.list('-updated_date');
    // const userCases = allCases.filter(caseItem =>
    //   caseItem.customer_ids && caseItem.customer_ids.includes(userData.id)
    // );
    // cases.value = userCases;
    console.log('TODO: Load user and cases from API');
  } catch (error) {
    console.error('Failed to load cases:', error);
  }
  isLoading.value = false;
};

const applyFilters = () => {
  let filtered = cases.value;

  if (searchQuery.value) {
    filtered = filtered.filter(caseItem =>
      caseItem.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      caseItem.case_number.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      caseItem.description?.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  }

  if (statusFilter.value !== 'all') {
    filtered = filtered.filter(caseItem => caseItem.status === statusFilter.value);
  }

  filteredCases.value = filtered;
};

const getStatusColor = (status) => {
  switch (status) {
    case 'open':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'in_progress':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'closed':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'on_hold':
      return 'bg-gray-100 text-gray-800 border-gray-200';
    case 'archived':
      return 'bg-neutral-200 text-neutral-800 border-neutral-300';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getPriorityColor = (priority) => {
  switch (priority) {
    case 'urgent':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'high':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'low':
      return 'bg-green-100 text-green-800 border-green-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const formatDate = (date) => {
  return format(new Date(date), 'MMM d, yyyy');
};

// Lifecycle
onMounted(() => {
  loadUserAndCases();
});

// Watchers
watch([cases, searchQuery, statusFilter], () => {
  applyFilters();
});
</script>
