<template>
  <div>
    <Card v-if="!isOwner">
      <CardContent class="p-6 text-center">
        <Eye class="w-12 h-12 text-gray-400 mx-auto mb-3" />
        <p class="text-sm text-gray-500">Only case owners can manage guest passes</p>
      </CardContent>
    </Card>

    <div v-else class="space-y-6">
      <!-- Active Guest Passes -->
      <Card>
        <CardHeader>
          <CardTitle class="text-sm flex items-center space-x-2">
            <Link2 class="w-4 h-4 text-blue-600" />
            <span>Guest Passes</span>
            <Badge variant="secondary">{{ activeCount }} active</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="space-y-2">
            <div v-if="guestPasses.length === 0">
              <p class="text-sm text-gray-500 text-center py-4">No guest passes created yet</p>
            </div>
            <div v-else>
              <div v-for="pass in guestPasses" :key="pass.id" class="p-3 bg-gray-50 rounded border">
                <div class="flex items-start justify-between mb-2">
                  <div class="flex-1">
                    <div class="flex items-center space-x-2 mb-1">
                      <p class="text-sm font-medium">{{ pass.guest_name || pass.guest_email }}</p>
                      <Badge :class="getStatusColor(pass)"> {{ getStatusText(pass) }} </Badge>
                    </div>
                    <p class="text-xs text-gray-600">{{ pass.guest_email }}</p>
                    <p class="text-xs text-gray-500 mt-1">
                      <Calendar class="w-3 h-3 inline mr-1" />
                      Expires: {{ formatDate(pass.expires_at) }}
                    </p>
                    <p v-if="pass.notes" class="text-xs text-gray-600 mt-1 italic">{{ pass.notes }}</p>
                  </div>
                  <div class="flex items-center space-x-1">
                    <template v-if="pass.status === 'active' && new Date(pass.expires_at) > new Date()">
                      <Button variant="ghost" size="icon" class="h-6 w-6" @click="copyAccessLink(pass.pass_token)">
                        <Copy class="w-3 h-3" />
                      </Button>
                      <Button variant="ghost" size="icon" class="h-6 w-6 text-red-600" @click="handleRevokePass(pass.id)">
                        <X class="w-3 h-3" />
                      </Button>
                    </template>
                  </div>
                </div>
                <Badge variant="outline" class="text-xs">{{ (pass.access_level || '').replace('_', ' ') }}</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Create Guest Pass -->
      <Card>
        <CardHeader>
          <CardTitle class="text-sm flex items-center space-x-2">
            <Link2 class="w-4 h-4 text-green-600" />
            <span>Create Guest Pass</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="space-y-3">
            <div>
              <Label for="guest_email">Guest Email *</Label>
              <Input id="guest_email" type="email" v-model="guestEmail" placeholder="guest@example.com" />
            </div>

            <div>
              <Label for="guest_name">Guest Name (Optional)</Label>
              <Input id="guest_name" v-model="guestName" placeholder="John Doe" />
            </div>

            <div>
              <Label for="access_level">Access Level</Label>
              <Select v-model:value="accessLevel">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="view_only">View Only (Case details only)</SelectItem>
                  <SelectItem value="view_documents">View Documents (Can see documents)</SelectItem>
                  <SelectItem value="full_access">Full Access (Can view and comment)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label for="expiry">Valid For</Label>
              <Select v-model:value="expiryDuration">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="1h">1 Hour</SelectItem>
                  <SelectItem value="24h">24 Hours</SelectItem>
                  <SelectItem value="7d">7 Days</SelectItem>
                  <SelectItem value="30d">30 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label for="notes">Notes (Optional)</Label>
              <Textarea id="notes" v-model="notes" placeholder="Add context about this guest access..." rows="2" />
            </div>

            <Button :disabled="!guestEmail || isCreating" class="w-full bg-green-600 hover:bg-green-700" @click="handleCreateGuestPass">
              <Link2 class="w-4 h-4 mr-2" />
              <span>{{ isCreating ? 'Creating...' : 'Create Guest Pass' }}</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import { GuestPass } from '@/entities/GuestPass';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Link2, Copy, X, Eye, Calendar } from 'lucide-vue-next';
import { useToast } from '@/components/ui/use-toast';
import { SendEmail } from '@/integrations/Core';
import { format, addDays, addHours } from 'date-fns';

const props = defineProps({ caseData: { type: Object, required: true }, currentUser: { type: Object }, isOwner: { type: Boolean, default: false } });

const guestPasses = ref([]);
const guestEmail = ref('');
const guestName = ref('');
const accessLevel = ref('view_only');
const expiryDuration = ref('24h');
const notes = ref('');
const isCreating = ref(false);

let toast;
try { toast = useToast().toast; } catch (e) { toast = (opts) => { console.info('toast', opts); }; }

const loadGuestPasses = async () => {
  try {
    const passes = await GuestPass.filter({ case_id: props.caseData.id }, '-created_date');
    guestPasses.value = passes || [];
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Failed to load guest passes:', err);
  }
};

onMounted(() => { if (props.caseData) loadGuestPasses(); });
watch(() => props.caseData, (c) => { if (c) loadGuestPasses(); });

const generateToken = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

const calculateExpiry = (duration) => {
  const now = new Date();
  switch(duration) {
    case '1h': return addHours(now, 1);
    case '24h': return addHours(now, 24);
    case '7d': return addDays(now, 7);
    case '30d': return addDays(now, 30);
    default: return addHours(now, 24);
  }
};

const handleCreateGuestPass = async () => {
  if (!guestEmail.value || !props.isOwner) return;
  isCreating.value = true;
  try {
    const token = generateToken();
    const expiresAt = calculateExpiry(expiryDuration.value);

    const passData = {
      case_id: props.caseData.id,
      issued_by: props.currentUser?.id,
      guest_email: guestEmail.value,
      guest_name: guestName.value,
      pass_token: token,
      expires_at: expiresAt.toISOString(),
      access_level: accessLevel.value,
      status: 'active',
      notes: notes.value
    };

    await GuestPass.create(passData);

    const appUrl = window.location.origin;
    const accessUrl = `${appUrl}/guest-access?token=${token}&case=${props.caseData.id}`;

    await SendEmail({
      to: guestEmail.value,
      subject: `Temporary access to case: ${props.caseData.title}`,
      body: `
        <p>Hello${guestName.value ? ' ' + guestName.value : ''},</p>
        <p>${props.currentUser?.full_name} has granted you temporary access to view a legal case.</p>
        <p><strong>Case:</strong> ${props.caseData.title} (${props.caseData.case_number})</p>
        <p><strong>Access Level:</strong> ${accessLevel.value.replace('_', ' ')}</p>
        <p><strong>Valid Until:</strong> ${format(expiresAt, 'PPP p')}</p>
        ${notes.value ? `<p><strong>Notes:</strong> ${notes.value}</p>` : ''}
        <p><a href="${accessUrl}" style="padding: 10px 15px; background-color: #1565C0; color: white; text-decoration: none; border-radius: 5px;">Access Case</a></p>
        <p style="color: #666; font-size: 12px;">This is a temporary access link that will expire on ${format(expiresAt, 'PPP p')}.</p>
      `
    });

    if (toast) toast({ title: 'Guest pass created!', description: `Access link sent to ${guestEmail.value}` });
    guestEmail.value = '';
    guestName.value = '';
    notes.value = '';
    await loadGuestPasses();
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Failed to create guest pass:', err);
    if (toast) toast({ variant: 'destructive', title: 'Error', description: 'Failed to create guest pass' });
  }
  isCreating.value = false;
};

const handleRevokePass = async (passId) => {
  try {
    await GuestPass.update(passId, { status: 'revoked' });
    if (toast) toast({ title: 'Pass revoked', description: 'Guest pass has been revoked' });
    await loadGuestPasses();
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Failed to revoke pass:', err);
    if (toast) toast({ variant: 'destructive', title: 'Error', description: 'Failed to revoke pass' });
  }
};

const copyAccessLink = (token) => {
  try {
    const appUrl = window.location.origin;
    const accessUrl = `${appUrl}/guest-access?token=${token}&case=${props.caseData.id}`;
    navigator.clipboard.writeText(accessUrl);
    if (toast) toast({ title: 'Link copied!', description: 'Access link copied to clipboard' });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Failed to copy link:', err);
  }
};

const getStatusColor = (pass) => {
  if (pass.status === 'revoked') return 'bg-red-100 text-red-800';
  if (pass.status === 'expired') return 'bg-gray-100 text-gray-800';
  if (new Date(pass.expires_at) < new Date()) return 'bg-orange-100 text-orange-800';
  return 'bg-green-100 text-green-800';
};

const getStatusText = (pass) => {
  if (pass.status === 'revoked') return 'Revoked';
  if (new Date(pass.expires_at) < new Date()) return 'Expired';
  return 'Active';
};

const formatDate = (d) => {
  try { return format(new Date(d), 'PPP p'); } catch (e) { return ''; }
};

const activeCount = computed(() => guestPasses.value.filter(p => p.status === 'active' && new Date(p.expires_at) > new Date()).length);
</script>

<style scoped>
/* no custom styles */
</style>
