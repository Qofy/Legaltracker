<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <div class="max-w-4xl mx-auto space-y-8">
      <div class="text-center">
        <HelpCircle class="w-16 h-16 text-blue-600 mx-auto mb-4" />
        <h1 class="text-4xl font-bold text-gray-900">LegalHub Help Center</h1>
        <p class="text-xl text-gray-600 mt-2">Your guide to using the platform effectively.</p>
      </div>

      <Card class="material-elevation-2">
        <CardHeader>
          <CardTitle class="flex items-center space-x-2">
            <User class="w-6 h-6 text-blue-600" />
            <span>User Roles Explained</span>
          </CardTitle>
        </CardHeader>
        <CardContent class="space-y-4">
          <div>
            <h3 class="font-semibold text-lg flex items-center">
              <Scale class="w-5 h-5 mr-2 text-blue-800"/>
              Lawyer
            </h3>
            <p class="text-gray-700 ml-7">
              Lawyers can manage their cases, create new cases, upload documents, assign tasks, and communicate with clients. They have a full overview of their assigned cases.
            </p>
          </div>
          <div>
            <h3 class="font-semibold text-lg flex items-center">
              <UserCheck class="w-5 h-5 mr-2 text-green-800"/>
              Customer / Mandant
            </h3>
            <p class="text-gray-700 ml-7">
              Customers can view the status of their cases, access shared documents, and communicate with their assigned lawyer through the chat and comment panels.
            </p>
          </div>
          <div>
            <h3 class="font-semibold text-lg flex items-center">
              <User class="w-5 h-5 mr-2 text-purple-800"/>
              Administrator
            </h3>
            <p class="text-gray-700 ml-7">
              Admins have full access to the system. They can manage all users (lawyers and customers), view all cases, and have the ability to impersonate other users for debugging and support purposes.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card class="material-elevation-2">
        <CardHeader>
          <CardTitle class="flex items-center space-x-2">
            <FileText class="w-6 h-6 text-blue-600" />
            <span>Managing Cases</span>
          </CardTitle>
        </CardHeader>
        <CardContent class="space-y-4">
          <p>The <strong>Cases</strong> page (for lawyers/admins) is your central hub. Here you can:</p>
          <ul class="list-disc list-inside space-y-2 text-gray-700">
            <li>Click the <strong>"New Case"</strong> button to open a form and create a new case.</li>
            <li>When creating a case, you can assign one or more customers to it from a dropdown list of existing clients.</li>
            <li>View all cases in a grid or list format. Use the search and filter options to quickly find what you're looking for.</li>
            <li>Click on any case card to navigate to the <strong>Case Details</strong> page, where you can manage documents, action items, and view all case-related information.</li>
          </ul>
        </CardContent>
      </Card>

      <Card class="material-elevation-2">
        <CardHeader>
          <CardTitle class="flex items-center space-x-2">
            <MessageSquare class="w-6 h-6 text-blue-600" />
            <span>Communication & AI</span>
          </CardTitle>
        </CardHeader>
        <CardContent class="space-y-4">
          <p>The panels on the left and right are your communication hubs:</p>
          <ul class="list-disc list-inside space-y-2 text-gray-700">
            <li>
              <strong>AI Chat (Left Panel):</strong> Once you select a case, you can interact with our AI assistant. Ask it to summarize documents, suggest case strategies, or answer questions about the case data. Configure your preferred AI provider in the <strong>Settings</strong> page.
            </li>
            <li>
              <strong>Comments (Right Panel):</strong> Use this panel for general communication about the selected case. You can leave notes, ask questions, or post updates. Lawyers can mark comments as "internal" to hide them from clients.
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card class="material-elevation-2">
        <CardHeader>
          <CardTitle class="flex items-center space-x-2">
            <Settings class="w-6 h-6 text-blue-600" />
            <span>Settings & Feedback</span>
          </CardTitle>
        </CardHeader>
        <CardContent class="space-y-4">
          <p>Customize your experience and help us improve:</p>
          <ul class="list-disc list-inside space-y-2 text-gray-700">
            <li>
              <strong>Settings:</strong> Configure your profile and set up API keys for AI providers.
            </li>
            <li>
              <strong>Feedback Buttons:</strong> Use the floating
              <span class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-600 text-white">
                <Bug class="w-4 h-4"/>
              </span>
              and
              <span class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-600 text-white">
                <Hammer class="w-4 h-4"/>
              </span>
              buttons on the bottom right to report bugs or request new features.
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup>
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  HelpCircle,
  User,
  Scale,
  UserCheck,
  MessageSquare,
  FileText,
  Settings,
  Bug,
  Hammer
} from 'lucide-vue-next';
</script>
