<template>
  <div class="flex h-full min-h-screen">
    <!-- Conversations list -->
    <aside class="w-80 border-r border-gray-200 bg-white p-4">
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-semibold">Conversations</h3>
          <Button size="sm" variant="ghost" @click="refresh">Refresh</Button>
        </div>

        <!-- Select lawyer and client to open their case conversation -->
        <div class="mb-3 space-y-2">
          <div class="text-xs text-gray-500">Pick Lawyer</div>
          <select v-model="selectedLawyerId" class="w-full px-2 py-1 border rounded-md bg-white">
            <option value="">— Select lawyer —</option>
            <option v-for="l in lawyers" :key="l.id" :value="l.id">{{ l.full_name || l.name || l.email }}</option>
          </select>

          <div class="text-xs text-gray-500">Pick Client</div>
          <select v-model="selectedClientId" class="w-full px-2 py-1 border rounded-md bg-white">
            <option value="">— Select client —</option>
            <option v-for="c in clients" :key="c.id" :value="c.id">{{ c.full_name || c.name || c.email }}</option>
          </select>

          <div class="flex gap-2">
            <Button size="sm" @click="openSelectedPair">Open Conversation</Button>
            <Button size="sm" variant="outline" @click="clearSelection">Clear</Button>
          </div>
        </div>

        <div class="space-y-2 overflow-y-auto" style="max-height: calc(100vh - 240px);">
        <div
          v-for="conv in conversations"
          :key="conv.caseId || conv.id"
          @click="selectConversation(conv)
          "
          :class="['p-3 rounded-md cursor-pointer flex items-start gap-3', selectedCaseId === conv.caseId ? 'bg-blue-50' : 'hover:bg-gray-100']"
        >
          <div class="flex-1">
            <div class="flex items-center justify-between">
              <div class="font-medium text-sm">{{ conv.title || ('Case ' + conv.caseId) }}</div>
              <div class="text-xs text-gray-500">{{ conv.count }}</div>
            </div>
            <div class="text-xs text-gray-500 truncate mt-1">{{ conv.lastMessagePreview }}</div>
          </div>
        </div>
      </div>
    </aside>

    <!-- Chat area -->
    <section class="flex-1 flex flex-col bg-gray-50">
      <div class="p-4 border-b bg-white">
        <h3 class="text-lg font-semibold">{{ currentConversationTitle }}</h3>
        <p class="text-sm text-gray-500">Messages for selected conversation</p>
      </div>

      <div class="flex-1 overflow-y-auto p-4" ref="messagesContainer">
        <div v-if="messages.length === 0" class="flex items-center justify-center h-full text-gray-500">
          <p>No messages for this conversation.</p>
        </div>
        <div v-else class="space-y-3">
          <div v-for="m in messages" :key="m.id" class="p-3 rounded-md" :class="m.sender_id === me?.id ? 'bg-blue-600 text-white self-end' : 'bg-white text-gray-800'">
            <div class="text-xs text-gray-500 mb-1">{{ formatDate(m.created_at) }} — {{ m.sender_name || m.sender_id }}</div>
            <div class="whitespace-pre-wrap">{{ m.content }}</div>
          </div>
        </div>
      </div>

      <div class="p-4 bg-white border-t">
        <div class="flex items-center gap-2">
          <input v-model="newMessage" @keydown.enter="sendMessage" placeholder="Type a message and press Enter" class="flex-1 px-3 py-2 border rounded-md bg-white" />
          <Button @click="sendMessage">Send</Button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, nextTick } from 'vue'
import { ChatMessage } from '@/services/entities'
import { Case, User } from '@/services/entities'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'

const conversations = ref([])
const selectedCaseId = ref(null)
const casesList = ref([])
const messages = ref([])
const me = ref(null)
const newMessage = ref('')
const messagesContainer = ref(null)
const lawyers = ref([])
const clients = ref([])
const selectedLawyerId = ref('')
const selectedClientId = ref('')

const currentConversationTitle = computed(() => {
  const conv = conversations.value.find(c => c.caseId === selectedCaseId.value)
  return conv ? (conv.title || ('Case ' + conv.caseId)) : '—'
})

const formatDate = (d) => {
  try { return format(new Date(d), 'PPP p') } catch (e) { return d }
}

const buildConversations = (casesList, msgs) => {
  const map = new Map()
  msgs.forEach(m => {
    const cid = m.case_id || 'none'
    if (!map.has(cid)) map.set(cid, { caseId: cid, count: 0, lastMessageAt: 0, lastMessagePreview: '', title: '' })
    const item = map.get(cid)
    item.count += 1
    if (new Date(m.created_at).getTime() > item.lastMessageAt) {
      item.lastMessageAt = new Date(m.created_at).getTime()
      item.lastMessagePreview = m.content.substring(0, 120)
    }
  })
  // enrich with case titles
  const out = []
  for (const [cid, val] of map.entries()) {
    const c = casesList.find(x => String(x.id) === String(cid))
    val.title = c ? (c.case_number + ' — ' + c.title) : (cid === 'none' ? 'General' : ('Case ' + cid))
    out.push(val)
  }
  // sort by lastMessageAt desc
  out.sort((a,b) => b.lastMessageAt - a.lastMessageAt)
  conversations.value = out
}

const load = async () => {
  try {
    me.value = await User.me()
    const [casesRes, allMessages, lawyersRes, clientsRes] = await Promise.all([
      Case.list(),
      ChatMessage.list('-created_date'),
      User.filter({ user_type: 'lawyer' }),
      User.filter({ user_type: 'customer' })
    ])

    casesList.value = casesRes || []
    lawyers.value = lawyersRes || []
    clients.value = clientsRes || []
    buildConversations(casesList.value, allMessages || [])
  } catch (err) {
    console.error('Failed to load admin messages:', err)
  }
}

const clearSelection = () => {
  selectedLawyerId.value = ''
  selectedClientId.value = ''
}

const openSelectedPair = async () => {
  if (!selectedLawyerId.value || !selectedClientId.value) {
    alert('Please select both a lawyer and a client')
    return
  }

  // try to find an existing case that links the chosen lawyer and client
  const found = casesList.value.find(c => {
    const lawMatch = String(c.lawyer_id) === String(selectedLawyerId.value) || String(c.assigned_lawyer_id) === String(selectedLawyerId.value)
    const custIds = (c.customer_ids || []).map(x => String(x))
    const ownerIds = (c.owner_ids || []).map(x => String(x))
    const clientMatch = custIds.includes(String(selectedClientId.value)) || ownerIds.includes(String(selectedClientId.value))
    return lawMatch && clientMatch
  })

  if (found) {
    selectedCaseId.value = found.id
    await loadMessages()
  } else {
    alert('No case found linking the selected lawyer and client.')
  }
}

const selectConversation = async (conv) => {
  selectedCaseId.value = conv.caseId
  await loadMessages()
}

const loadMessages = async () => {
  if (!selectedCaseId.value) { messages.value = []; return }
  try {
    const msgs = await ChatMessage.filter({ case_id: selectedCaseId.value }, '-created_at')
    messages.value = msgs || []
    await nextTick()
    if (messagesContainer.value) messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  } catch (err) {
    console.error('Failed to load messages for case:', err)
  }
}

const sendMessage = async () => {
  if (!newMessage.value.trim() || !selectedCaseId.value) return
  try {
    const payload = {
      case_id: selectedCaseId.value,
      content: newMessage.value.trim(),
      sender_id: me.value?.id
    }
    await ChatMessage.create(payload)
    newMessage.value = ''
    await loadMessages()
  } catch (err) {
    console.error('Failed to send message:', err)
  }
}

const refresh = () => load()

onMounted(() => {
  load()
})
</script>

<style scoped>
.bg-blue-50 { background-color: rgba(96,165,250,0.08) }
.bg-white { background-color: var(--lt-card) }
</style>
