<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <div class="max-w-7xl mx-auto space-y-6">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 flex items-center">
            <UsersIcon class="w-8 h-8 text-blue-600 mr-3" />
            User Management
          </h1>
          <p class="text-gray-600 mt-1">
            View and manage system users.
          </p>
        </div>
        <Dialog v-model:open="showInviteDialog">
          <DialogTrigger as-child>
            <Button>
              <UserPlus class="w-4 h-4 mr-2"/>
              Invite User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite a New User</DialogTitle>
            </DialogHeader>
            <InviteUserForm
              @invite="handleInvite"
              @cancel="showInviteDialog = false"
            />
          </DialogContent>
        </Dialog>
      </div>

      <Tabs default-value="customers">
        <TabsList class="grid w-full grid-cols-2">
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="lawyers">Lawyers</TabsTrigger>
        </TabsList>
        <TabsContent value="customers">
          <Card>
            <CardHeader>
              <CardTitle>Customers ({{ customers.length }})</CardTitle>
            </CardHeader>
            <CardContent>
              <UsersTable :users="customers" @edit="handleEdit" />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="lawyers">
          <Card>
            <CardHeader>
              <CardTitle>Lawyers ({{ lawyers.length }})</CardTitle>
            </CardHeader>
            <CardContent>
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
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { User } from '@/entities/User';
import { Invitation } from '@/entities/Invitation';
import { SendEmail } from '@/integrations/Core';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Users as UsersIcon, UserPlus } from 'lucide-vue-next';
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
