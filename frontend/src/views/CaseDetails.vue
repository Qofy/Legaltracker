<template>
  <div v-if="isLoading" class="p-6">
    <div class="animate-pulse space-y-4">
      <div class="h-10 bg-gray-200 rounded w-1/3"></div>
      <div class="h-60 bg-gray-200 rounded"></div>
    </div>
  </div>

  <div v-else-if="error" class="p-6 text-center">
    <Card class="max-w-md mx-auto">
      <CardContent class="p-8">
        <FileText class="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 class="text-lg font-semibold text-gray-900 mb-2">Unable to Load Case</h3>
        <p class="text-gray-600 mb-4">{{ error }}</p>
        <div class="space-x-3">
          <Button @click="router.go(-1)" variant="outline">
            Go Back
          </Button>
          <Button @click="window.location.reload()">
            Retry
          </Button>
        </div>
      </CardContent>
    </Card>
  </div>

  <div v-else-if="!caseData" class="p-6 text-center">
    <Card class="max-w-md mx-auto">
      <CardContent class="p-8">
        <FileText class="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 class="text-lg font-semibold text-gray-900 mb-2">Case Not Found</h3>
        <p class="text-gray-600 mb-4">The requested case could not be found.</p>
        <Button @click="router.push('/cases')">
          Back to Cases
        </Button>
      </CardContent>
    </Card>
  </div>

  <div v-else class="p-6 bg-gray-50 min-h-full">
    <div class="max-w-7xl mx-auto space-y-6">
      <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 flex items-center">
            <FileText class="w-8 h-8 text-blue-600 mr-3" />
            {{ caseData.title }}
          </h1>
          <p class="text-gray-600 mt-1">Case #{{ caseData.case_number }}</p>
        </div>
        <div class="flex space-x-2">
          <Dialog v-model:open="showEditCase">
            <DialogTrigger as-child>
              <Button variant="outline">
                <Edit class="w-4 h-4 mr-2" />
                Edit
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Case</DialogTitle>
              </DialogHeader>
              <EditCaseForm
                :case-data="caseData"
                @submit="handleUpdateCase"
                @cancel="showEditCase = false"
              />
            </DialogContent>
          </Dialog>
          <Button variant="outline" @click="handleArchiveCase">
            <Archive class="w-4 h-4 mr-2" />
            Archive
          </Button>
          <Button variant="destructive" @click="handleDeleteCase">
            <Trash2 class="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      <Tabs default-value="overview">
        <TabsList>
          <TabsTrigger value="overview">
            <Briefcase class="w-4 h-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="timeline">
            <Clock class="w-4 h-4 mr-2" />
            AI Timeline
          </TabsTrigger>
          <TabsTrigger value="prediction">
            <Target class="w-4 h-4 mr-2" />
            Outcome Prediction
          </TabsTrigger>
          <TabsTrigger value="conflicts">
            <Shield class="w-4 h-4 mr-2" />
            Conflict Check
          </TabsTrigger>
          <TabsTrigger value="summary">
            <Sparkles class="w-4 h-4 mr-2" />
            AI Summary
          </TabsTrigger>
          <TabsTrigger value="research">
            <Scale class="w-4 h-4 mr-2" />
            Legal Research
          </TabsTrigger>
          <TabsTrigger value="documents">
            <UploadCloud class="w-4 h-4 mr-2" />
            Documents
          </TabsTrigger>
          <TabsTrigger value="actions">
            <ListTodo class="w-4 h-4 mr-2" />
            Action Items
          </TabsTrigger>
          <TabsTrigger value="access">
            <Users class="w-4 h-4 mr-2" />
            Access & Sharing
          </TabsTrigger>
          <TabsTrigger value="guests">
            <Key class="w-4 h-4 mr-2" />
            Guest Passes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" class="mt-4">
          <CaseOverview :case-data="caseData" :lawyer="lawyer" :customers="customers" />
        </TabsContent>

        <TabsContent value="timeline" class="mt-4">
          <AITimelineGenerator
            :case-data="caseData"
            :documents="documents"
            :action-items="actionItems"
          />
        </TabsContent>

        <TabsContent value="prediction" class="mt-4">
          <AIOutcomePredictor
            :case-data="caseData"
            :documents="documents"
            :action-items="actionItems"
          />
        </TabsContent>

        <TabsContent value="conflicts" class="mt-4">
          <AIConflictDetector
            :case-data="caseData"
            :all-cases="allCases"
            :all-users="allUsers"
          />
        </TabsContent>

        <TabsContent value="summary" class="mt-4">
          <AICaseSummary
            :case-data="caseData"
            :documents="documents"
            :action-items="actionItems"
            :users="[user, lawyer, ...customers].filter(Boolean)"
          />
        </TabsContent>

        <TabsContent value="research" class="mt-4">
          <LegalResearchAssistant
            :case-id="caseData.id"
            :case-data="caseData"
            @save-to-case="handleSaveResearch"
          />
        </TabsContent>

        <TabsContent value="documents" class="mt-4">
          <DocumentsManager :case-id="caseId" />
        </TabsContent>

        <TabsContent value="actions" class="mt-4">
          <ActionItemsManager :case-id="caseId" />
        </TabsContent>

        <TabsContent value="access" class="mt-4">
          <CaseAccessManager
            :case-data="caseData"
            :current-user="user"
            @update="loadCaseDetails(caseId)"
          />
        </TabsContent>

        <TabsContent value="guests" class="mt-4">
          <GuestPassManager
            :case-data="caseData"
            :current-user="user"
            :is-owner="caseData?.owner_ids?.includes(user?.id) || user?.user_type === 'admin'"
          />
        </TabsContent>
      </Tabs>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
// TODO: Import entities when API is ready
// import { Case } from '@/entities/Case';
// import { User } from '@/entities/User';
// import { Document } from '@/entities/Document';
// import { ActionItem } from '@/entities/ActionItem';
import {
  FileText,
  Edit,
  Archive,
  Trash2,
  Users,
  Briefcase,
  UploadCloud,
  ListTodo,
  Key,
  Sparkles,
  Scale,
  Clock,
  Target,
  Shield,
} from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import CaseOverview from '@/components/casedetails/CaseOverview.vue';
import DocumentsManager from '@/components/casedetails/DocumentsManager.vue';
import ActionItemsManager from '@/components/casedetails/ActionItemsManager.vue';
import EditCaseForm from '@/components/casedetails/EditCaseForm.vue';
import CaseAccessManager from '@/components/cases/CaseAccessManager.vue';
import GuestPassManager from '@/components/cases/GuestPassManager.vue';
import AICaseSummary from '@/components/ai/AICaseSummary.vue';
import LegalResearchAssistant from '@/components/ai/LegalResearchAssistant.vue';
import AITimelineGenerator from '@/components/ai/AITimelineGenerator.vue';
import AIOutcomePredictor from '@/components/ai/AIOutcomePredictor.vue';
import AIConflictDetector from '@/components/ai/AIConflictDetector.vue';

const route = useRoute();
const router = useRouter();

// State
const caseData = ref(null);
const lawyer = ref(null);
const customers = ref([]);
const isLoading = ref(true);
const error = ref(null);
const showEditCase = ref(false);
const caseId = ref(null);
const user = ref(null);
const documents = ref([]);
const actionItems = ref([]);
const allCases = ref([]);
const allUsers = ref([]);

// Methods
const loadCaseDetails = async (id) => {
  isLoading.value = true;
  error.value = null;
  try {
    // TODO: Replace with actual API calls when ready
    // const [caseDetails, currentUser, allCasesData, allUsersData] = await Promise.all([
    //   Case.get(id),
    //   User.me(),
    //   Case.list(),
    //   User.list()
    // ]);

    // caseData.value = caseDetails;
    // user.value = currentUser;
    // allCases.value = allCasesData;
    // allUsers.value = allUsersData;

    // const [docs, actions] = await Promise.all([
    //   Document.filter({ case_id: id }),
    //   ActionItem.filter({ case_id: id })
    // ]);

    // if (caseDetails.lawyer_id) {
    //   const lawyerData = allUsersData.find(u => u.id === caseDetails.lawyer_id);
    //   lawyer.value = lawyerData || null;
    //   if (!lawyerData) console.warn(`Lawyer with ID ${caseDetails.lawyer_id} not found.`);
    // } else {
    //   lawyer.value = null;
    // }

    // if (caseDetails.customer_ids && caseDetails.customer_ids.length > 0) {
    //   const validCustomers = allUsersData.filter(u => caseDetails.customer_ids.includes(u.id));
    //   customers.value = validCustomers;
    //   if (validCustomers.length !== caseDetails.customer_ids.length) {
    //     console.warn('Some customers linked to this case were not found.');
    //   }
    // } else {
    //   customers.value = [];
    // }

    // documents.value = docs;
    // actionItems.value = actions;

    console.log('TODO: Load case details for case ID:', id);
  } catch (err) {
    console.error('Failed to load case details:', err);
    error.value = 'Failed to load case details. You may not have permission to view this case, or it may not exist.';
    caseData.value = null;
    user.value = null;
    allCases.value = [];
    allUsers.value = [];
  }
  isLoading.value = false;
};

const handleUpdateCase = async (updatedData) => {
  try {
    // TODO: Replace with actual API call when ready
    // await Case.update(caseId.value, updatedData);
    console.log('TODO: Update case:', updatedData);
    showEditCase.value = false;
    loadCaseDetails(caseId.value);
  } catch (error) {
    console.error('Failed to update case:', error);
  }
};

const handleArchiveCase = async () => {
  if (window.confirm('Are you sure you want to archive this case?')) {
    try {
      // TODO: Replace with actual API call when ready
      // await Case.update(caseId.value, { status: 'archived' });
      console.log('TODO: Archive case');
      router.push('/cases');
    } catch (error) {
      console.error('Failed to archive case:', error);
    }
  }
};

const handleDeleteCase = async () => {
  if (window.confirm('Are you sure you want to permanently delete this case? This action cannot be undone.')) {
    try {
      // TODO: Replace with actual API call when ready
      // await Case.delete(caseId.value);
      console.log('TODO: Delete case');
      router.push('/cases');
    } catch (error) {
      console.error('Failed to delete case:', error);
    }
  }
};

const handleSaveResearch = (research) => {
  const existingResearch = localStorage.getItem('legalResearch');
  let researchArray = [];

  if (existingResearch) {
    try {
      researchArray = JSON.parse(existingResearch);
    } catch (e) {
      console.error('Failed to parse existing research:', e);
    }
  }

  const saved = {
    ...research,
    caseId: caseData.value.id,
    caseNumber: caseData.value.case_number,
    caseTitle: caseData.value.title,
    savedBy: user.value?.email,
    savedAt: new Date().toISOString(),
  };

  researchArray.unshift(saved);
  localStorage.setItem('legalResearch', JSON.stringify(researchArray.slice(0, 50)));
};

// Lifecycle
onMounted(() => {
  const id = route.query.caseId;
  if (id) {
    caseId.value = id;
    loadCaseDetails(id);
  } else {
    error.value = 'No case ID provided.';
    isLoading.value = false;
  }
});

// Watch for route changes
watch(
  () => route.query.caseId,
  (newId) => {
    if (newId) {
      caseId.value = newId;
      loadCaseDetails(newId);
    }
  }
);
</script>
