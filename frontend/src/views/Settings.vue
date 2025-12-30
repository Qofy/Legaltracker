<template>
  <div v-if="isLoading" class="p-6 space-y-6">
    <div class="animate-pulse space-y-4">
      <Card v-for="i in 4" :key="i">
        <CardHeader>
          <div class="h-6 bg-gray-200 rounded w-1/3"></div>
        </CardHeader>
        <CardContent>
          <div class="h-20 bg-gray-200 rounded"></div>
        </CardContent>
      </Card>
    </div>
  </div>

  <div v-else class="p-6 bg-gray-50 min-h-screen">
    <div class="max-w-4xl mx-auto space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 flex items-center">
            <SettingsIcon class="w-8 h-8 text-blue-600 mr-3" />
            Settings
          </h1>
          <p class="text-gray-600 mt-1">Manage your preferences and AI configuration</p>
        </div>
        <Button @click="handleSave" :disabled="isSaving" class="bg-blue-600 hover:bg-blue-700">
          <Save class="w-4 h-4 mr-2" />
          {{ isSaving ? 'Saving...' : 'Save Settings' }}
        </Button>
      </div>

      <!-- Test Result -->
      <Card
        v-if="testResult"
        :class="testResult.type === 'success' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'"
      >
        <CardContent class="p-4">
          <div class="flex items-center space-x-2">
            <CheckCircle v-if="testResult.type === 'success'" class="w-5 h-5 text-green-600" />
            <AlertCircle v-else class="w-5 h-5 text-red-600" />
            <p :class="`text-sm font-medium ${testResult.type === 'success' ? 'text-green-800' : 'text-red-800'}`">
              {{ testResult.message }}
            </p>
          </div>
        </CardContent>
      </Card>

      <Tabs default-value="ai" class="space-y-6">
        <TabsList class="grid w-full grid-cols-4">
          <TabsTrigger value="ai">AI Configuration</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>

        <!-- AI Configuration -->
        <TabsContent value="ai" class="space-y-6">
          <Card class="material-elevation-2">
            <CardHeader>
              <CardTitle class="flex items-center">
                <Bot class="w-5 h-5 text-blue-600 mr-2" />
                AI Provider Configuration
              </CardTitle>
            </CardHeader>
            <CardContent class="space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label for="ai_provider">AI Provider</Label>
                  <div class="relative">
                    <select
                      id="ai_provider"
                      v-model="settings.ai_provider"
                      class="appearance-none w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8 bg-white"
                    >
                      <option value="openai">OpenAI (GPT)</option>
                      <option value="gemini">Google Gemini</option>
                      <option value="claude">Anthropic Claude</option>
                      <option value="mistral">Mistral AI</option>
                      <option value="deepseek">DeepSeek</option>
                      <option value="kimi">Kimi (Moonshot)</option>
                      <option value="local">Local (Ollama)</option>
                    </select>
                    <ChevronDown class="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <Label for="ai_model">Model</Label>
                  <div class="relative">
                    <select
                      id="ai_model"
                      v-model="settings.ai_model"
                      class="appearance-none w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8 bg-white"
                    >
                      <option
                        v-for="model in getModelOptions()"
                        :key="model"
                        :value="model"
                      >
                        {{ model }}
                      </option>
                    </select>
                    <ChevronDown class="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div v-if="settings.ai_provider === 'local'">
                <Label for="local_ai_url">Local AI URL (Ollama)</Label>
                <Input
                  id="local_ai_url"
                  v-model="settings.local_ai_url"
                  placeholder="http://localhost:11434"
                />
              </div>
              <div v-else>
                <Label :for="getCurrentApiKeyField()">
                  <Key class="w-4 h-4 inline mr-2" />
                  API Key for {{ settings.ai_provider }}
                </Label>
                <Input
                  :id="getCurrentApiKeyField()"
                  type="password"
                  v-model="settings[getCurrentApiKeyField()]"
                  :placeholder="`Enter your ${settings.ai_provider} API key`"
                />
              </div>

              <div class="flex items-center space-x-3">
                <Button
                  variant="outline"
                  @click="handleTestAI"
                  :disabled="isTesting"
                  class="flex items-center"
                >
                  <TestTube class="w-4 h-4 mr-2" />
                  {{ isTesting ? 'Testing...' : 'Test AI Connection' }}
                </Button>
                <Badge variant="secondary">
                  Current: {{ settings.ai_provider }} • {{ settings.ai_model }}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <!-- Profile -->
        <TabsContent value="profile" class="space-y-6">
          <Card class="material-elevation-2">
            <CardHeader>
              <CardTitle class="flex items-center">
                <UserIcon class="w-5 h-5 text-blue-600 mr-2" />
                Professional Information
              </CardTitle>
            </CardHeader>
            <CardContent class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label for="full_name">Full Name</Label>
                  <Input
                    id="full_name"
                    :model-value="user?.full_name || ''"
                    disabled
                    class="bg-gray-50"
                  />
                </div>
                <div>
                  <Label for="email">Email</Label>
                  <Input
                    id="email"
                    :model-value="user?.email || ''"
                    disabled
                    class="bg-gray-50"
                  />
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label for="phone">Phone</Label>
                  <Input
                    id="phone"
                    v-model="settings.phone"
                    placeholder="(555) 123-4567"
                  />
                </div>
                <div v-if="user?.user_type === 'lawyer'">
                  <Label for="bar_number">Bar Number</Label>
                  <Input
                    id="bar_number"
                    v-model="settings.bar_number"
                    placeholder="Enter your bar number"
                  />
                </div>
              </div>

              <div>
                <Label for="address">Address</Label>
                <Textarea
                  id="address"
                  v-model="settings.address"
                  placeholder="Enter your address"
                  :rows="3"
                />
              </div>

              <div v-if="user?.user_type === 'lawyer'">
                <Label for="specialization">Specializations (comma-separated)</Label>
                <Input
                  id="specialization"
                  :model-value="settings.specialization.join(', ')"
                  @update:model-value="handleSpecializationChange"
                  placeholder="Corporate Law, Criminal Defense, Family Law"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <!-- Notifications -->
        <TabsContent value="notifications" class="space-y-6">
          <Card class="material-elevation-2">
            <CardHeader>
              <CardTitle class="flex items-center">
                <Bell class="w-5 h-5 text-blue-600 mr-2" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent class="space-y-4">
              <div class="space-y-4">
                <div class="flex items-center justify-between">
                  <div>
                    <h4 class="font-medium">Email Notifications</h4>
                    <p class="text-sm text-gray-500">Receive email updates</p>
                  </div>
                  <Switch
                    :checked="settings.notification_preferences.email"
                    @update:checked="updateNotificationPref('email', $event)"
                  />
                </div>

                <div class="flex items-center justify-between">
                  <div>
                    <h4 class="font-medium">Case Updates</h4>
                    <p class="text-sm text-gray-500">Notifications when cases are updated</p>
                  </div>
                  <Switch
                    :checked="settings.notification_preferences.case_updates"
                    @update:checked="updateNotificationPref('case_updates', $event)"
                  />
                </div>

                <div class="flex items-center justify-between">
                  <div>
                    <h4 class="font-medium">Document Uploads</h4>
                    <p class="text-sm text-gray-500">Notifications for new documents</p>
                  </div>
                  <Switch
                    :checked="settings.notification_preferences.document_uploads"
                    @update:checked="updateNotificationPref('document_uploads', $event)"
                  />
                </div>

                <div class="flex items-center justify-between">
                  <div>
                    <h4 class="font-medium">AI Responses</h4>
                    <p class="text-sm text-gray-500">Notifications for AI chat responses</p>
                  </div>
                  <Switch
                    :checked="settings.notification_preferences.ai_responses"
                    @update:checked="updateNotificationPref('ai_responses', $event)"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <!-- Preferences -->
        <TabsContent value="preferences" class="space-y-6">
          <Card class="material-elevation-2">
            <CardHeader>
              <CardTitle class="flex items-center">
                <Globe class="w-5 h-5 text-blue-600 mr-2" />
                Language & Regional Preferences
              </CardTitle>
            </CardHeader>
            <CardContent class="space-y-4">
              <div>
                <Label for="language_preference">Language</Label>
                <div class="relative">
                  <select
                    id="language_preference"
                    v-model="settings.language_preference"
                    class="appearance-none w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8 bg-white"
                  >
                    <option value="en">English</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                    <option value="de">Deutsch</option>
                    <option value="pt">Português</option>
                    <option value="zh">中文</option>
                    <option value="ar">العربية</option>
                  </select>
                  <ChevronDown class="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { User } from '@/services/entities';
import { InvokeLLM } from '@/integrations/Core';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Settings as SettingsIcon,
  Bot,
  Key,
  Globe,
  Bell,
  User as UserIcon,
  Save,
  TestTube,
  AlertCircle,
  CheckCircle,
  ChevronDown
} from 'lucide-vue-next';

const user = ref(null);
const isLoading = ref(true);
const isSaving = ref(false);
const isTesting = ref(false);
const testResult = ref(null);

const settings = ref({
  // AI Settings
  ai_provider: 'openai',
  ai_model: 'gpt-3.5-turbo',
  openai_api_key: '',
  gemini_api_key: '',
  claude_api_key: '',
  mistral_api_key: '',
  deepseek_api_key: '',
  kimi_api_key: '',
  local_ai_url: '',

  // User Preferences
  language_preference: 'en',
  notification_preferences: {
    email: true,
    case_updates: true,
    document_uploads: true,
    ai_responses: true
  },

  // UI Settings
  theme: 'light',
  sidebar_collapsed: false,

  // Professional Info
  bar_number: '',
  specialization: [],
  phone: '',
  address: ''
});

const loadUserSettings = async () => {
  isLoading.value = true;
  try {
    const userData = await User.me();
    user.value = userData;

    settings.value = {
      ...settings.value,
      language_preference: userData.language_preference || 'en',
      notification_preferences: userData.notification_preferences || {
        email: true,
        case_updates: true,
        document_uploads: true,
        ai_responses: true
      },
      bar_number: userData.bar_number || '',
      specialization: userData.specialization || [],
      phone: userData.phone || '',
      address: userData.address || '',
      // AI settings would be stored in user data
      ai_provider: userData.ai_provider || 'openai',
      ai_model: userData.ai_model || 'gpt-3.5-turbo',
      openai_api_key: userData.openai_api_key || '',
      gemini_api_key: userData.gemini_api_key || '',
      claude_api_key: userData.claude_api_key || '',
      mistral_api_key: userData.mistral_api_key || '',
      deepseek_api_key: userData.deepseek_api_key || '',
      kimi_api_key: userData.kimi_api_key || '',
      local_ai_url: userData.local_ai_url || 'http://localhost:11434'
    };
  } catch (error) {
    console.error('Failed to load user settings:', error);
  }
  isLoading.value = false;
};

const handleSave = async () => {
  isSaving.value = true;
  try {
    await User.updateMyUserData(settings.value);
    testResult.value = { type: 'success', message: 'Settings saved successfully!' };
    setTimeout(() => testResult.value = null, 3000);
  } catch (error) {
    console.error('Failed to save settings:', error);
    testResult.value = { type: 'error', message: 'Failed to save settings.' };
  }
  isSaving.value = false;
};

const handleTestAI = async () => {
  isTesting.value = true;
  testResult.value = null;

  try {
    const testResponse = await InvokeLLM({
      prompt: "Please respond with: 'AI connection test successful!' This is just a test message."
    });

    if (testResponse && testResponse.includes('AI connection test successful')) {
      testResult.value = {
        type: 'success',
        message: 'AI connection test successful! Your settings are working correctly.'
      };
    } else {
      testResult.value = {
        type: 'success',
        message: `AI responded: ${testResponse.substring(0, 100)}...`
      };
    }
  } catch (error) {
    testResult.value = {
      type: 'error',
      message: `AI test failed: ${error.message}. Please check your API keys and settings.`
    };
  }

  isTesting.value = false;
};

const getModelOptions = () => {
  switch(settings.value.ai_provider) {
    case 'openai':
      return ['gpt-3.5-turbo', 'gpt-4', 'gpt-4-turbo-preview'];
    case 'gemini':
      return ['gemini-pro', 'gemini-pro-vision'];
    case 'claude':
      return ['claude-3-sonnet', 'claude-3-haiku', 'claude-2'];
    case 'mistral':
      return ['mistral-small', 'mistral-medium', 'mistral-large'];
    case 'deepseek':
      return ['deepseek-coder', 'deepseek-chat'];
    case 'kimi':
      return ['moonshot-v1-8k', 'moonshot-v1-32k'];
    case 'local':
      return ['llama2', 'codellama', 'mistral', 'custom'];
    default:
      return [];
  }
};

const getCurrentApiKeyField = () => {
  switch(settings.value.ai_provider) {
    case 'openai': return 'openai_api_key';
    case 'gemini': return 'gemini_api_key';
    case 'claude': return 'claude_api_key';
    case 'mistral': return 'mistral_api_key';
    case 'deepseek': return 'deepseek_api_key';
    case 'kimi': return 'kimi_api_key';
    default: return '';
  }
};

const handleSpecializationChange = (value) => {
  settings.value.specialization = value.split(',').map(s => s.trim()).filter(s => s);
};

const updateNotificationPref = (key, value) => {
  settings.value.notification_preferences[key] = value;
};

onMounted(() => {
  loadUserSettings();
});
</script>
