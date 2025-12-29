<template>
  <div v-if="isLoading" class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p class="text-gray-600">Validating access...</p>
    </div>
  </div>

  <div v-else-if="error" class="min-h-screen flex items-center justify-center bg-gray-50 p-6">
    <Card class="max-w-md">
      <CardContent class="p-8 text-center">
        <Lock class="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 class="text-xl font-bold text-gray-900 mb-2">Access Denied</h2>
        <p class="text-gray-600 mb-4">{{ error }}</p>
        <Button variant="outline" @click="goHome">
          Go to Home
        </Button>
      </CardContent>
    </Card>
  </div>

  <div v-else class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-5xl mx-auto space-y-6">
      <!-- Guest Access Header -->
      <Card class="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <CardContent class="p-6">
          <div class="flex items-start justify-between">
            <div>
              <h1 class="text-2xl font-bold mb-2">Guest Access</h1>
              <p class="text-blue-100">
                You have temporary access to view this case
              </p>
            </div>
            <Badge class="bg-white text-blue-600">
              <Eye class="w-3 h-3 mr-1" />
              {{ guestPass.access_level.replace('_', ' ') }}
            </Badge>
          </div>
          <div class="mt-4 flex items-center space-x-4 text-sm">
            <div class="flex items-center space-x-1">
              <Calendar class="w-4 h-4" />
              <span>Expires: {{ formatDate(guestPass.expires_at) }}</span>
            </div>
            <div v-if="guestPass.guest_name">
              Viewing as: {{ guestPass.guest_name }}
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Case Information -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center space-x-2">
            <FileText class="w-5 h-5 text-blue-600" />
            <span>Case Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent class="space-y-4">
          <div>
            <h2 class="text-2xl font-bold text-gray-900">{{ caseData.title }}</h2>
            <p class="text-gray-600">Case #{{ caseData.case_number }}</p>
          </div>

          <div v-if="caseData.description">
            <h3 class="text-sm font-semibold text-gray-700 mb-1">Description</h3>
            <p class="text-gray-600">{{ caseData.description }}</p>
          </div>

          <div class="flex flex-wrap gap-2">
            <Badge :class="getStatusColor(caseData.status)">
              {{ caseData.status.replace('_', ' ') }}
            </Badge>
            <Badge variant="outline">
              {{ caseData.case_type?.replace('_', ' ') }}
            </Badge>
            <Badge variant="outline">
              {{ caseData.priority }} priority
            </Badge>
          </div>

          <div v-if="caseData.court_date" class="flex items-center space-x-2 text-sm text-gray-600">
            <Calendar class="w-4 h-4" />
            <span>Court Date: {{ formatDate(caseData.court_date, 'PPP') }}</span>
          </div>
        </CardContent>
      </Card>

      <!-- Documents -->
      <Card v-if="guestPass.access_level === 'view_documents' || guestPass.access_level === 'full_access'">
        <CardHeader>
          <CardTitle class="flex items-center space-x-2">
            <FileText class="w-5 h-5 text-blue-600" />
            <span>Documents</span>
            <Badge variant="secondary">{{ documents.length }}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div v-if="documents.length === 0" class="text-center py-8 text-gray-500">
            <FileText class="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p>No documents available</p>
          </div>
          <div v-else class="space-y-2">
            <div
              v-for="doc in documents"
              :key="doc.id"
              class="flex items-center justify-between p-3 bg-gray-50 rounded hover:bg-gray-100 transition-colors"
            >
              <div class="flex items-center space-x-3">
                <FileText class="w-5 h-5 text-gray-500" />
                <div>
                  <p class="font-medium text-gray-900">{{ doc.file_name }}</p>
                  <p class="text-xs text-gray-500">
                    {{ formatDate(doc.created_date, 'MMM d, yyyy') }}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                as-child
              >
                <a :href="doc.file_url" target="_blank" rel="noopener noreferrer">
                  <Eye class="w-4 h-4 mr-2" />
                  View
                </a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Access Limitations -->
      <Card class="bg-yellow-50 border-yellow-200">
        <CardContent class="p-4">
          <div class="flex items-start space-x-2">
            <AlertCircle class="w-5 h-5 text-yellow-600 mt-0.5" />
            <div class="text-sm">
              <p class="font-semibold text-yellow-900 mb-1">Limited Access</p>
              <p class="text-yellow-800">
                This is a temporary guest access link.
                <template v-if="guestPass.access_level === 'view_only'">
                  You can only view case information.
                </template>
                <template v-if="guestPass.access_level === 'view_documents'">
                  You can view case information and documents.
                </template>
                <template v-if="guestPass.access_level === 'full_access'">
                  You can view all case information and documents.
                </template>
                This link expires on {{ formatDate(guestPass.expires_at) }}.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { format } from 'date-fns';
import { GuestPass } from '@/entities/GuestPass';
import { Case } from '@/entities/Case';
import { Document } from '@/entities/Document';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  FileText,
  Calendar,
  AlertCircle,
  Eye,
  Lock
} from 'lucide-vue-next';

const route = useRoute();

const guestPass = ref(null);
const caseData = ref(null);
const documents = ref([]);
const isLoading = ref(true);
const error = ref(null);

const validateAccessAndLoadData = async () => {
  isLoading.value = true;
  error.value = null;

  try {
    const token = route.query.token;
    const caseId = route.query.case;

    if (!token || !caseId) {
      error.value = 'Invalid access link. Missing token or case ID.';
      isLoading.value = false;
      return;
    }

    // Validate guest pass
    const passes = await GuestPass.filter({ pass_token: token, case_id: caseId });

    if (passes.length === 0) {
      error.value = 'Invalid or expired guest pass.';
      isLoading.value = false;
      return;
    }

    const pass = passes[0];

    // Check if pass is active and not expired
    if (pass.status !== 'active') {
      error.value = 'This guest pass has been revoked.';
      isLoading.value = false;
      return;
    }

    if (new Date(pass.expires_at) < new Date()) {
      error.value = 'This guest pass has expired.';
      isLoading.value = false;
      return;
    }

    // Update last accessed
    await GuestPass.update(pass.id, {
      last_accessed: new Date().toISOString()
    });

    guestPass.value = pass;

    // Load case data
    const caseInfo = await Case.get(caseId);
    caseData.value = caseInfo;

    // Load documents if access level permits
    if (pass.access_level === 'view_documents' || pass.access_level === 'full_access') {
      const docs = await Document.filter({ case_id: caseId });
      documents.value = docs;
    }

  } catch (err) {
    console.error('Failed to validate access:', err);
    error.value = 'Failed to validate access. Please contact the case owner.';
  }

  isLoading.value = false;
};

const getStatusColor = (status) => {
  switch(status) {
    case 'open': return 'bg-blue-100 text-blue-800';
    case 'in_progress': return 'bg-yellow-100 text-yellow-800';
    case 'closed': return 'bg-green-100 text-green-800';
    case 'on_hold': return 'bg-gray-100 text-gray-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const formatDate = (date, formatStr = 'PPP p') => {
  return format(new Date(date), formatStr);
};

const goHome = () => {
  window.location.href = '/';
};

onMounted(() => {
  validateAccessAndLoadData();
});
</script>
