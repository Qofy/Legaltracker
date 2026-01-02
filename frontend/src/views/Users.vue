<template>
  <div class="space-y-6">
    <div class="flex flex-col justify-between gap-6 mb-6">
      <div>
        <h2 class="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <UsersIcon class="w-7 h-7 text-[#003aca]" />
          User Management
        </h2>
        <p class="text-gray-600 mt-1">
          View and manage system users.
        </p>
      </div>
      <Dialog v-model:open="showInviteDialog">
        <DialogTrigger as-child>
            <DialogHeader>
              <DialogTitle>Invite a New User</DialogTitle>
            </DialogHeader>
          <Button class="bg-[#003aca] hover:bg-[#002a8a] text-white px-2 h-10">
            <UserPlus class="w-4 h-4 mr-2"/>
            Invite User
          </Button>
        </DialogTrigger>
        
          <DialogContent>
            <InviteUserForm
              @invite="handleInvite"
              @cancel="showInviteDialog = false"
            />
          </DialogContent>
        </Dialog>
      </div>

      <Tabs default-value="customers" class="w-full">
        <TabsList class="grid w-full max-w-md grid-cols-2 mb-8 bg-gray-100 p-1 rounded-lg h-12">
          <TabsTrigger 
            value="customers" 
            class="data-[state=active]:bg-white data-[state=active]:text-[#003aca] data-[state=active]:shadow-sm rounded-md transition-all duration-200 font-medium flex items-center gap-2 h-10"
          >
            <UsersIcon class="w-4 h-4" />
            Customers ({{ customers.length }})
          </TabsTrigger>
          <TabsTrigger 
            value="lawyers"
            class="data-[state=active]:bg-white data-[state=active]:text-[#003aca] data-[state=active]:shadow-sm rounded-md transition-all duration-200 font-medium flex items-center gap-2 h-10"
          >
            <Scale class="w-4 h-4" />
            Lawyers ({{ lawyers.length }})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="customers" class="mt-0">
          <Card class="border-0 shadow-lg bg-white">
            <CardHeader class="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
              <CardTitle class="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <UsersIcon class="w-4 h-4 text-[#003aca]" />
                </div>
                Customer Management
                <Badge variant="secondary" class="ml-auto bg-blue-100 text-blue-700">
                  {{ customers.length }} Total
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent class="p-6">
              <UsersTable :users="customers" @edit="handleEdit" />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="lawyers" class="mt-0">
          <Card class="border-0 shadow-lg bg-white">
            <CardHeader class="bg-gradient-to-r from-purple-50 to-blue-50 border-b border-gray-100">
              <CardTitle class="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <div class="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <Scale class="w-4 h-4 text-[#003aca]" />
                </div>
                Lawyer Management
                <Badge variant="secondary" class="ml-auto bg-purple-100 text-purple-700">
                  {{ lawyers.length }} Total
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent class="p-6">
              <UsersTable :users="lawyers" @edit="handleEdit" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog v-model:open="editDialogOpen">
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User: {{ editingUser?.full_name }}</DialogTitle>
          </DialogHeader>
          <UserEditForm
            v-if="editingUser"
            :user="editingUser"
            @save="onSave"
            @cancel="editingUser = null"
          />
        </DialogContent>
      </Dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { User, Invitation } from '@/services/entities';
import { SendEmail } from '@/integrations/Core';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Users as UsersIcon, UserPlus, Scale } from 'lucide-vue-next';
import { useToast } from '@/components/ui/use-toast';
import InviteUserForm from '../components/users/InviteUserForm.vue';
import UsersTable from '../components/users/UsersTable.vue';
import UserEditForm from '../components/users/UserEditForm.vue';

const { toast } = useToast();

const users = ref([]);
const isLoading = ref(true);
const editingUser = ref(null);
const showInviteDialog = ref(false);
const currentUser = ref(null);

const editDialogOpen = computed({
  get: () => !!editingUser.value,
  set: (value) => {
    if (!value) editingUser.value = null;
  }
});

const lawyers = computed(() => users.value.filter(u => u.user_type === 'lawyer'));
const customers = computed(() => users.value.filter(u => u.user_type === 'customer'));

const loadData = async () => {
  isLoading.value = true;
  const [userList, me] = await Promise.all([
    User.list(),
    User.me()
  ]);
  users.value = userList;
  currentUser.value = me;
  isLoading.value = false;
};

const handleEdit = (user) => {
  editingUser.value = user;
};

const onSave = () => {
  editingUser.value = null;
  loadData();
};

const handleInvite = async ({ email, role, message }) => {
  if (!currentUser.value) {
    toast({
      variant: 'destructive',
      title: 'Error',
      description: 'You must be logged in to send invitations.'
    });
    return;
  }

  try {
    await Invitation.create({
      inviter_id: currentUser.value.id,
      invitee_email: email,
      invitation_type: `${currentUser.value.user_type}_to_${role}`,
      status: 'pending',
      message: message
    });

    const appName = 'LegalHub';
    const appUrl = window.location.origin;
    const emailBody = `
      <p>Hello,</p>
      <p>You have been invited by ${currentUser.value.full_name} (${currentUser.value.email}) to join ${appName} as a ${role}.</p>
      ${message ? `<p><strong>Message from inviter:</strong><br/><em>${message}</em></p>` : ''}
      <p>Please click the link below to accept the invitation and sign up:</p>
      <p><a href="${appUrl}" style="padding: 10px 15px; background-color: #1565C0; color: white; text-decoration: none; border-radius: 5px;">Join ${appName}</a></p>
      <p>If you have any questions, please contact ${currentUser.value.email}.</p>
      <p>Thank you,<br/>The LegalHub Team</p>
    `;

    await SendEmail({
      to: email,
      subject: `Invitation to join ${appName}`,
      body: emailBody
    });

    toast({
      title: 'Invitation Sent!',
      description: `An invitation has been sent to ${email}.`
    });
    showInviteDialog.value = false;

  } catch (error) {
    console.error('Failed to send invitation:', error);
    toast({
      variant: 'destructive',
      title: 'Invitation Failed',
      description: error.message || 'Could not send the invitation. Please try again.'
    });
  }
};

onMounted(() => {
  loadData();
});
</script>
