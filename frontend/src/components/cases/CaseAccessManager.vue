<template>
  <div class="space-y-6">
    <!-- Case Owners -->
    <Card>
      <CardHeader>
        <CardTitle class="text-sm flex items-center space-x-2">
          <Crown class="w-4 h-4 text-yellow-600" />
          <span>Case Owners</span>
          <Badge variant="secondary">{{ owners.length }}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div class="space-y-2">
          <div v-for="owner in owners" :key="owner.id" class="flex items-center justify-between p-2 bg-gray-50 rounded">
            <div class="flex items-center space-x-2">
              <Avatar class="h-6 w-6">
                <AvatarFallback class="text-xs">{{ owner.full_name?.[0] }}</AvatarFallback>
              </Avatar>
              <div>
                <p class="text-sm font-medium">{{ owner.full_name }}</p>
                <p class="text-xs text-gray-500">{{ owner.email }}</p>
              </div>
            </div>
            <div>
              <Button v-if="isOwner && owner.id !== currentUser?.id" variant="ghost" size="icon" class="h-6 w-6" @click="handleRemoveAccess(owner.id, true)">
                <X class="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Shared Users -->
    <Card>
      <CardHeader>
        <CardTitle class="text-sm flex items-center space-x-2">
          <Users class="w-4 h-4 text-blue-600" />
          <span>Shared With</span>
          <Badge variant="secondary">{{ sharedUsers.length }}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div class="space-y-2">
          <div v-for="user in sharedUsers" :key="user.id" class="flex items-center justify-between p-2 bg-gray-50 rounded">
            <div class="flex items-center space-x-2">
              <Avatar class="h-6 w-6">
                <AvatarFallback class="text-xs">{{ user.full_name?.[0] }}</AvatarFallback>
              </Avatar>
              <div>
                <p class="text-sm font-medium">{{ user.full_name }}</p>
                <p class="text-xs text-gray-500">{{ user.email }}</p>
              </div>
            </div>
            <div class="flex items-center space-x-1">
              <template v-if="isOwner">
                <Button variant="ghost" size="sm" class="h-6 text-xs" @click="handleAddOwner(user.id)">
                  <Crown class="w-3 h-3 mr-1" />
                  Make Owner
                </Button>
                <Button variant="ghost" size="icon" class="h-6 w-6" @click="handleRemoveAccess(user.id, false)">
                  <X class="w-3 h-3" />
                </Button>
              </template>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Pending Invitations -->
    <Card v-if="pendingInvitations.length > 0">
      <CardHeader>
        <CardTitle class="text-sm flex items-center space-x-2">
          <Mail class="w-4 h-4 text-orange-600" />
          <span>Pending Invitations</span>
          <Badge variant="secondary">{{ pendingInvitations.length }}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div class="space-y-2">
          <div v-for="invite in pendingInvitations" :key="invite.id" class="flex items-center justify-between p-2 bg-orange-50 rounded">
            <div>
              <p class="text-sm font-medium">{{ invite.invitee_email }}</p>
              <p class="text-xs text-gray-500">{{ invite.invitation_type === 'case_ownership' ? 'Invited as owner' : 'Invited to collaborate' }}</p>
            </div>
            <div>
              <Button v-if="isOwner" variant="ghost" size="sm" class="h-6 text-xs text-red-600" @click="handleWithdrawInvitation(invite.id)">Withdraw</Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Invite New User -->
    <Card v-if="isOwner">
      <CardHeader>
        <CardTitle class="text-sm flex items-center space-x-2">
          <UserPlus class="w-4 h-4 text-green-600" />
          <span>Invite User</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div class="space-y-3">
          <div>
            <Label for="invite_email">Email Address</Label>
            <Input id="invite_email" type="email" v-model="inviteEmail" placeholder="user@example.com" />
          </div>

          <div>
            <Label for="invite_role">Role</Label>
            <Select v-model:value="inviteRole">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lawyer">Lawyer</SelectItem>
                <SelectItem value="customer">Customer</SelectItem>
                <SelectItem value="assistant">Assistant</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div class="flex items-center space-x-2">
            <input id="invite_as_owner" type="checkbox" v-model="inviteAsOwner" class="rounded" />
            <Label for="invite_as_owner" class="text-sm font-normal">Invite as case owner (can invite others and manage access)</Label>
          </div>

          <div>
            <Label for="invite_message">Personal Message (Optional)</Label>
            <Textarea id="invite_message" v-model="inviteMessage" placeholder="Add a personal message..." rows="2" />
          </div>

          <Button :disabled="!inviteEmail || isInviting" class="w-full bg-green-600 hover:bg-green-700" @click="handleInviteUser">
            <UserPlus class="w-4 h-4 mr-2" />
            <span>{{ isInviting ? 'Sending...' : 'Send Invitation' }}</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import { Case } from '@/entities/Case';
import { User } from '@/entities/User';
import { Invitation } from '@/entities/Invitation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Users, UserPlus, X, Crown, Mail } from 'lucide-vue-next';
import { useToast } from '@/components/ui/use-toast';
import { SendEmail } from '@/integrations/Core';

const props = defineProps({ caseData: { type: Object, required: true }, onUpdate: { type: Function }, currentUser: { type: Object } });

const allUsers = ref([]);
const owners = ref([]);
const sharedUsers = ref([]);
const inviteEmail = ref('');
const inviteRole = ref('customer');
const inviteMessage = ref('');
const inviteAsOwner = ref(false);
const isInviting = ref(false);
const pendingInvitations = ref([]);

let toast;
try { toast = useToast().toast; } catch (e) { toast = (opts) => { /* fallback no-op */ console.info('toast', opts); }; }

const loadUsers = async () => {
  try {
    const users = await User.list();
    allUsers.value = users || [];

    // owners
    if (props.caseData.owner_ids) {
      owners.value = allUsers.value.filter(u => (props.caseData.owner_ids || []).includes(u.id));
    } else {
      owners.value = [];
    }

    // shared users
    if (props.caseData.shared_with_users) {
      sharedUsers.value = allUsers.value.filter(u => (props.caseData.shared_with_users || []).includes(u.id));
    } else {
      sharedUsers.value = [];
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Failed to load users:', err);
  }
};

const loadInvitations = async () => {
  try {
    const invites = await Invitation.filter({ case_id: props.caseData.id, status: 'pending' });
    pendingInvitations.value = invites || [];
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Failed to load invitations:', err);
  }
};

onMounted(() => { loadUsers(); loadInvitations(); });
watch(() => props.caseData, () => { loadUsers(); loadInvitations(); });

const isOwner = computed(() => (props.caseData.owner_ids || []).includes(props.currentUser?.id) || props.currentUser?.user_type === 'admin');

const handleInviteUser = async () => {
  if (!inviteEmail.value || !isOwner.value) return;
  isInviting.value = true;
  try {
    const invitation = await Invitation.create({
      inviter_id: props.currentUser.id,
      invitee_email: inviteEmail.value,
      invitation_type: inviteAsOwner.value ? 'case_ownership' : 'case_access',
      case_id: props.caseData.id,
      role: inviteRole.value,
      message: inviteMessage.value,
      status: 'pending'
    });

    const appUrl = window.location.origin;
    await SendEmail({
      to: inviteEmail.value,
      subject: `Invitation to ${inviteAsOwner.value ? 'own' : 'collaborate on'} case: ${props.caseData.title}`,
      body: `
        <p>Hello,</p>
        <p>${props.currentUser.full_name} has invited you to ${inviteAsOwner.value ? 'be an owner of' : 'collaborate on'} a legal case.</p>
        <p><strong>Case:</strong> ${props.caseData.title} (${props.caseData.case_number})</p>
        ${inviteMessage.value ? `<p><strong>Message:</strong> ${inviteMessage.value}</p>` : ''}
        <p><a href="${appUrl}/cases?caseId=${props.caseData.id}" style="padding: 10px 15px; background-color: #1565C0; color: white; text-decoration: none; border-radius: 5px;">View Case</a></p>
      `
    });

    if (toast) toast({ title: 'Invitation sent!', description: `Invitation sent to ${inviteEmail.value}` });
    inviteEmail.value = '';
    inviteMessage.value = '';
    await loadInvitations();
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Failed to invite user:', err);
    if (toast) toast({ variant: 'destructive', title: 'Error', description: 'Failed to send invitation' });
  }
  isInviting.value = false;
};

const handleWithdrawInvitation = async (invitationId) => {
  try {
    await Invitation.update(invitationId, { status: 'withdrawn', withdrawn_at: new Date().toISOString(), withdrawn_by: props.currentUser.id });
    if (toast) toast({ title: 'Invitation withdrawn', description: 'The invitation has been withdrawn' });
    await loadInvitations();
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Failed to withdraw invitation:', err);
    if (toast) toast({ variant: 'destructive', title: 'Error', description: 'Failed to withdraw invitation' });
  }
};

const handleRemoveAccess = async (userId, isOwnerRole) => {
  try {
    const updatedCase = { ...props.caseData };
    if (isOwnerRole) {
      updatedCase.owner_ids = (updatedCase.owner_ids || []).filter(id => id !== userId);
    } else {
      updatedCase.shared_with_users = (updatedCase.shared_with_users || []).filter(id => id !== userId);
    }
    await Case.update(props.caseData.id, updatedCase);
    if (toast) toast({ title: 'Access removed', description: 'User access has been removed from this case' });
    if (props.onUpdate) props.onUpdate();
    await loadUsers();
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Failed to remove access:', err);
    if (toast) toast({ variant: 'destructive', title: 'Error', description: 'Failed to remove access' });
  }
};

const handleAddOwner = async (userId) => {
  try {
    const updatedOwners = [...(props.caseData.owner_ids || []), userId];
    await Case.update(props.caseData.id, { owner_ids: updatedOwners });
    if (toast) toast({ title: 'Owner added', description: 'User is now a case owner' });
    if (props.onUpdate) props.onUpdate();
    await loadUsers();
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Failed to add owner:', err);
  }
};
</script>

<style scoped>
/* component-local styles (none) */
</style>
