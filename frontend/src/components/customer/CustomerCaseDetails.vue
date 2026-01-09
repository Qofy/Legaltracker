<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-4">
        <button
          @click="$emit('back')"
          class="p-2 hover:bg-gray-100 rounded-md transition"
        >
          <svg
            class="w-5 h-5 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <div>
          <h2 class="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <svg
              class="w-7 h-7 text-[#003aca]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <!-- Comments Panel -->
              <div v-if="currentCase" class="comments-area">
                <CommentsPannel
                  :case-id="currentCase.id"
                  :user="props.currentUser || authStore.user"
                />
              </div>

              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Case Details
          </h2>
          <p class="text-gray-500 mt-1">View your case information and progress</p>
        </div>
      </div>
    </div>

    <!-- Case Selection (if multiple cases and no specific case passed) -->
    <div
      v-if="!props.selectedCase && myCases.length > 1"
      class="bg-white rounded-lg border border-gray-200 p-4"
    >
      <label class="block text-sm font-medium text-gray-700 mb-2">Select Case</label>
      <select
        v-model="selectedCaseId"
        @change="loadCaseDetails"
        class="w-full md:w-96 px-3 py-2 border border-gray-300 rounded-md"
      >
        <option v-for="c in myCases" :key="c.id" :value="c.id">
          {{ c.title }} - #{{ c.case_number }}
        </option>
      </select>
    </div>

    <!-- Case Information -->
    <div v-if="currentCase" class="bg-white rounded-lg border border-gray-200 p-6">
      <div class="flex items-start justify-between mb-6">
        <div>
          <h3 class="text-2xl font-bold text-gray-900">{{ currentCase.title }}</h3>
          <p class="text-sm text-gray-600 mt-1">Case #{{ currentCase.case_number }}</p>
        </div>
        <span
          :class="[
            'px-3 py-1 rounded-full text-sm font-medium',
            getStatusBadge(currentCase.status),
          ]"
        >
          {{ currentCase.status }}
        </span>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <div>
          <p class="text-sm text-gray-600 mb-1">Case Type</p>
          <p class="font-semibold text-gray-900 capitalize">
            {{ currentCase.case_type || "Civil" }}
          </p>
        </div>
        <div>
          <p class="text-sm text-gray-600 mb-1">Priority</p>
          <span
            :class="[
              'px-2 py-1 rounded text-sm font-medium',
              getPriorityBadge(currentCase.priority),
            ]"
          >
            {{ currentCase.priority }}
          </span>
        </div>
        <div>
          <p class="text-sm text-gray-600 mb-1">Filing Date</p>
          <p class="font-semibold text-gray-900">
            {{ formatDate(currentCase.filing_date) }}
          </p>
        </div>
        <div>
          <p class="text-sm text-gray-600 mb-1">Last Updated</p>
          <p class="font-semibold text-gray-900">
            {{ formatDate(currentCase.updated_date) }}
          </p>
        </div>
        <div>
          <p class="text-sm text-gray-600 mb-1">Court</p>
          <p class="font-semibold text-gray-900">
            {{ currentCase.court || "Not specified" }}
          </p>
        </div>
        <div>
          <p class="text-sm text-gray-600 mb-1">Judge</p>
          <p class="font-semibold text-gray-900">
            {{ currentCase.judge || "Not assigned" }}
          </p>
        </div>
      </div>

      <div class="border-t border-gray-200 pt-4">
        <p class="text-sm text-gray-600 mb-2">Description</p>
        <p class="text-gray-900">
          {{ currentCase.description || "No description available" }}
        </p>
      </div>
    </div>

    <!-- Lawyer Information -->
    <div v-if="currentCase" class="bg-white rounded-lg border border-gray-200 p-6">
      <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <svg
          class="w-5 h-5 text-[#003aca]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
        Your Lawyer
      </h3>
      <div class="flex items-start gap-4">
        <div class="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
          <svg
            class="w-8 h-8 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </div>
        <div class="flex-1">
          <h4 class="font-semibold text-gray-900">
            {{ lawyerInfo.name || "Not assigned" }}
          </h4>
          <p class="text-sm text-gray-600 mt-1">{{ lawyerInfo.email || "N/A" }}</p>
          <p class="text-sm text-gray-600">{{ lawyerInfo.phone || "N/A" }}</p>
          <div v-if="lawyerInfo.specializations" class="flex items-center gap-2 mt-2">
            <span
              v-for="spec in lawyerInfo.specializations.split(',').slice(0, 3)"
              :key="spec"
              class="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs"
            >
              {{ spec.trim() }}
            </span>
          </div>
        </div>
        <button
          @click="handleSendMessage"
          class="px-4 py-2 bg-[#003aca] text-white rounded-md text-sm font-medium hover:bg-[#0031a0]"
        >
          Send Message
        </button>
      </div>
    </div>

    <!-- Case Timeline -->
    <div v-if="currentCase" class="bg-white rounded-lg border border-gray-200 p-6">
      <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <svg
          class="w-5 h-5 text-[#003aca]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        Case Timeline
      </h3>
      <div class="relative">
        <div class="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
        <div class="space-y-6">
          <div v-if="timeline.length === 0" class="text-center py-8 text-gray-500">
            <p class="text-sm">No timeline events yet</p>
          </div>
          <div v-else v-for="event in timeline" :key="event.id" class="relative pl-10">
            <div
              class="absolute left-2 top-1 w-4 h-4 rounded-full bg-blue-600 border-4 border-white"
            ></div>
            <div class="bg-gray-50 rounded-lg p-4">
              <div class="flex items-start justify-between">
                <div>
                  <h4 class="font-semibold text-gray-900">{{ event.title }}</h4>
                  <p class="text-sm text-gray-600 mt-1">{{ event.description }}</p>
                </div>
                <span class="text-xs text-gray-500">{{ formatDate(event.date) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Upcoming Deadlines -->
    <div v-if="currentCase" class="bg-white rounded-lg border border-gray-200 p-6">
      <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <svg
          class="w-5 h-5 text-[#003aca]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        Important Dates & Deadlines
      </h3>
      <div class="space-y-3">
        <div v-if="deadlines.length === 0" class="text-center py-8 text-gray-500">
          <p class="text-sm">No upcoming deadlines</p>
        </div>
        <div
          v-else
          v-for="deadline in deadlines"
          :key="deadline.id"
          class="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
        >
          <div class="flex items-center gap-3">
            <div
              :class="[
                'w-12 h-12 rounded-lg flex items-center justify-center',
                isOverdue(deadline.due_date) ? 'bg-red-100' : 'bg-blue-100',
              ]"
            >
              <svg
                :class="[
                  'w-6 h-6',
                  isOverdue(deadline.due_date) ? 'text-red-600' : 'text-blue-600',
                ]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div>
              <h4 class="font-semibold text-gray-900">{{ deadline.title }}</h4>
              <p class="text-sm text-gray-600">{{ deadline.description }}</p>
            </div>
          </div>
          <div class="text-right">
            <p
              :class="[
                'font-semibold',
                isOverdue(deadline.due_date) ? 'text-red-600' : 'text-gray-900',
              ]"
            >
              {{ formatDate(deadline.due_date) }}
            </p>
            <p class="text-xs text-gray-500">{{ deadline.type }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Case Progress & Points -->
    <div v-if="currentCase" class="bg-white rounded-lg border border-gray-200 p-6">
      <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <svg
          class="w-5 h-5 text-[#003aca]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        Case Progress & Key Points
      </h3>

      <div class="space-y-4">
        <!-- Progress Summary -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div class="bg-blue-50 rounded-lg p-4">
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium text-blue-700">Total Points</span>
              <div
                class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center"
              >
                <span class="text-sm font-bold text-blue-700">{{
                  casePoints[currentCase.id]?.length || 0
                }}</span>
              </div>
            </div>
          </div>

          <div class="bg-green-50 rounded-lg p-4">
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium text-green-700"
                >Positive Developments</span
              >
              <div
                class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center"
              >
                <span class="text-sm font-bold text-green-700">{{
                  getPointsByOutcome(currentCase.id, "positive")
                }}</span>
              </div>
            </div>
          </div>

          <div class="bg-amber-50 rounded-lg p-4">
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium text-amber-700">Areas of Focus</span>
              <div
                class="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center"
              >
                <span class="text-sm font-bold text-amber-700">{{
                  getPointsByOutcome(currentCase.id, "neutral")
                }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Case Points List -->
        <div class="space-y-3">
          <div
            v-if="casePoints[currentCase.id] && casePoints[currentCase.id].length > 0"
            v-for="point in casePoints[currentCase.id]"
            :key="point.id"
            class="border rounded-lg p-4 hover:shadow-sm transition-shadow"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-2">
                  <span
                    :class="getOutcomeIndicator(point.outcome)"
                    class="px-2 py-1 rounded-full text-xs font-medium"
                  >
                    {{
                      point.outcome === "positive"
                        ? "Positive"
                        : point.outcome === "negative"
                        ? "Challenge"
                        : "Update"
                    }}
                  </span>
                  <span class="text-xs text-gray-500">{{
                    formatDate(point.created_at)
                  }}</span>
                </div>
                <p class="text-gray-800 leading-relaxed">{{ point.description }}</p>
              </div>
            </div>
          </div>

          <div
            v-if="!casePoints[currentCase.id] || casePoints[currentCase.id].length === 0"
            class="text-center py-8 text-gray-500"
          >
            <div class="mb-3">
              <svg
                class="w-12 h-12 text-gray-300 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <p class="text-sm">
              Your lawyer will add important case updates and key points here as your case
              progresses.
            </p>
            <p class="text-xs text-gray-400 mt-1">
              Check back regularly for the latest developments.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { Case, User, ActionItem } from "@/services/entities";
import { useAuthStore } from "@/stores/auth";
import { format } from "date-fns";
import CommentsPannel from "@/components/comments/CommentsPannel.vue";

// Props
const props = defineProps({
  selectedCase: {
    type: Object,
    default: null,
  },
  currentUser: {
    type: Object,
    default: null,
  },
});

// Emits
const emit = defineEmits(["back", "open-messages"]);

const authStore = useAuthStore();

const myCases = ref([]);
const selectedCaseId = ref("");
const currentCase = ref(null);
const lawyerInfo = ref({});
const timeline = ref([]);
const deadlines = ref([]);
const casePoints = ref({});

// Helper function to get lawyer ID from case (handles different field names)
const getLawyerId = (caseData) => {
  const possibleIds = [
    caseData.lawyer_id,
    caseData.assigned_lawyer_id,
    caseData.lawyerId,
    caseData.assignedLawyerId,
  ];
  return possibleIds.find((id) => id && id !== null && id !== undefined) || null;
};

// Case points functions
const loadCasePoints = () => {
  try {
    const stored = localStorage.getItem("legaltracker_case_points");
    if (stored) {
      casePoints.value = JSON.parse(stored);
      console.log(
        "Loaded case points for case:",
        currentCase.value?.id,
        casePoints.value[currentCase.value?.id]
      );
    } else {
      console.log("No case points found in localStorage");
      casePoints.value = {};
    }
  } catch (error) {
    console.error("Error loading case points:", error);
    casePoints.value = {};
  }
};

const getPointsByOutcome = (caseId, outcome) => {
  const points = casePoints.value[caseId] || [];
  return points.filter((point) => point.outcome === outcome).length;
};

const getOutcomeIndicator = (outcome) => {
  switch (outcome) {
    case "positive":
      return "bg-green-100 text-green-700";
    case "negative":
      return "bg-red-100 text-red-700";
    default:
      return "bg-blue-100 text-blue-700";
  }
};

// Temporary function to add test case points
const addTestPoints = () => {
  if (!currentCase.value) return;

  const testPoints = [
    {
      id: Date.now() + 1,
      description:
        "Initial case review completed. Evidence collection has begun and preliminary research shows strong foundation for the case.",
      outcome: "positive",
      created_at: new Date().toISOString(),
    },
    {
      id: Date.now() + 2,
      description:
        "Filed motion for discovery. Requested all relevant documents from opposing party regarding mining permits and environmental impact assessments.",
      outcome: "neutral",
      created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    },
    {
      id: Date.now() + 3,
      description:
        "Successfully obtained court injunction to halt mining activities pending environmental assessment. This is a significant win for the community.",
      outcome: "positive",
      created_at: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    },
  ];

  // Save to localStorage
  const allCasePoints = JSON.parse(
    localStorage.getItem("legaltracker_case_points") || "{}"
  );
  allCasePoints[currentCase.value.id] = testPoints;
  localStorage.setItem("legaltracker_case_points", JSON.stringify(allCasePoints));

  // Reload case points
  loadCasePoints();

  alert("Test case points added! You can now see how they appear.");
};

const loadMyCases = async () => {
  try {
    const userId = authStore.user?.id;
    if (!userId) return;

    const allCases = await Case.list();
    myCases.value = allCases.filter(
      (c) =>
        c.customers &&
        Array.isArray(c.customers) &&
        c.customers.some((customer) => customer.id === userId)
    );

    if (myCases.value.length > 0 && !props.selectedCase) {
      selectedCaseId.value = myCases.value[0].id;
      await loadCaseDetails();
    }
  } catch (error) {
    console.error("Failed to load cases:", error);
  }
};

const loadCaseDetails = async (caseToLoad = null) => {
  try {
    let targetCase = null;

    if (caseToLoad) {
      targetCase = caseToLoad;
    } else if (props.selectedCase) {
      targetCase = props.selectedCase;
    } else if (selectedCaseId.value) {
      targetCase = myCases.value.find((c) => c.id === selectedCaseId.value);
    }

    if (!targetCase) return;

    currentCase.value = targetCase;
    console.log("Current case set to:", {
      id: currentCase.value.id,
      title: currentCase.value.title,
    });

    console.log("Loading case details for:", {
      caseId: targetCase.id,
      title: targetCase.title,
      lawyer_id: targetCase.lawyer_id,
      assigned_lawyer_id: targetCase.assigned_lawyer_id,
      lawyerId: targetCase.lawyerId,
      assignedLawyerId: targetCase.assignedLawyerId,
      existingLawyerInfo: targetCase.lawyerInfo,
    });

    // Load lawyer information
    // First check if case already has lawyer info loaded (from parent component)
    if (targetCase.lawyerInfo && targetCase.lawyerInfo.name) {
      console.log("Using existing lawyer info from case:", targetCase.lawyerInfo);
      lawyerInfo.value = {
        name: targetCase.lawyerInfo.name,
        email: targetCase.lawyerInfo.email || "Email not available",
        phone: targetCase.lawyerInfo.phone || "Phone not available",
        specializations: targetCase.lawyerInfo.specializations,
      };
    } else {
      // Try to load lawyer info by ID
      const lawyerId = getLawyerId(targetCase);
      console.log("Found lawyer ID:", lawyerId);

      if (lawyerId) {
        try {
          const lawyer = await User.get(lawyerId);
          console.log("Loaded lawyer:", lawyer);
          lawyerInfo.value = {
            name: lawyer.full_name || lawyer.name || "Name not available",
            email: lawyer.email || "Email not available",
            phone: lawyer.phone || "Phone not available",
            specializations: lawyer.specializations,
          };
        } catch (error) {
          console.error("Failed to load lawyer info:", error);
          lawyerInfo.value = {
            name: "Error loading lawyer info",
            email: "N/A",
            phone: "N/A",
          };
        }
      } else {
        console.log("No lawyer ID found in case data");
        lawyerInfo.value = {
          name: "Not assigned yet",
          email: "N/A",
          phone: "N/A",
        };
      }
    }

    // Build timeline from case data and comments
    timeline.value = [];

    // Add case filing
    if (currentCase.value.filing_date) {
      timeline.value.push({
        id: "filed",
        title: "Case Filed",
        description: "Your case has been officially filed",
        date: currentCase.value.filing_date,
      });
    }

    // Add case creation
    timeline.value.push({
      id: "created",
      title: "Case Created",
      description: lawyerInfo.value.name
        ? `Case assigned to ${lawyerInfo.value.name}`
        : "Case created in system",
      date: currentCase.value.created_date,
    });

    // Add status updates
    if (
      currentCase.value.updated_date &&
      currentCase.value.updated_date !== currentCase.value.created_date
    ) {
      timeline.value.push({
        id: "updated",
        title: "Status Updated",
        description: `Case status changed to ${currentCase.value.status}`,
        date: currentCase.value.updated_date,
      });
    }

    // TODO: Add comments and other activities to timeline when comment API is integrated

    // Sort timeline by date (newest first)
    timeline.value.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Load deadlines
    const allTasks = await ActionItem.list();
    deadlines.value = allTasks
      .filter((t) => t.case_id === currentCase.value.id && t.due_date)
      .map((t) => ({
        id: t.id,
        title: t.title,
        description: t.description || "No description",
        due_date: t.due_date,
        type: t.action_type || "Task",
      }))
      .sort((a, b) => new Date(a.due_date) - new Date(b.due_date));

    // Load case points
    loadCasePoints();
  } catch (error) {
    console.error("Failed to load case details:", error);
  }
};

const getStatusBadge = (status) => {
  switch (status) {
    case "open":
      return "bg-blue-100 text-blue-700 border border-blue-200";
    case "in_progress":
      return "bg-yellow-100 text-yellow-700 border border-yellow-200";
    case "closed":
      return "bg-green-100 text-green-700 border border-green-200";
    case "on_hold":
      return "bg-gray-100 text-gray-700 border border-gray-200";
    default:
      return "bg-gray-100 text-gray-700 border border-gray-200";
  }
};

const getPriorityBadge = (priority) => {
  switch (priority) {
    case "urgent":
      return "bg-red-100 text-red-700";
    case "high":
      return "bg-orange-100 text-orange-700";
    case "medium":
      return "bg-yellow-100 text-yellow-700";
    case "low":
      return "bg-green-100 text-green-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const formatDate = (date) => {
  try {
    return format(new Date(date), "MMM d, yyyy");
  } catch (e) {
    return "";
  }
};

const isOverdue = (date) => {
  return new Date(date) < new Date();
};

// Watch for changes in selectedCase prop
watch(
  () => props.selectedCase,
  (newCase) => {
    if (newCase) {
      loadCaseDetails(newCase);
    }
  },
  { immediate: true }
);

onMounted(() => {
  if (!props.selectedCase) {
    loadMyCases();
  } else {
    loadCaseDetails(props.selectedCase);
  }
});

// When the user clicks "Send Message":
// - If a lawyer is assigned, ask the parent to open the Messages view for this case
// - Otherwise fall back to mailto if we have an email, or show an alert
const handleSendMessage = () => {
  if (
    currentCase.value &&
    (currentCase.value.lawyer_id || lawyerInfo.value?.email || lawyerInfo.value?.name)
  ) {
    emit("open-messages", currentCase.value.id);
    return;
  }

  if (lawyerInfo.value && lawyerInfo.value.email) {
    const subject = encodeURIComponent(
      `Regarding Case: ${currentCase.value?.title || ""} (#${
        currentCase.value?.case_number || ""
      })`
    );
    const body = encodeURIComponent(
      `Dear ${
        lawyerInfo.value.name || "Lawyer"
      },\n\nI would like to discuss my case.\n\nThank you.`
    );
    window.location.href = `mailto:${lawyerInfo.value.email}?subject=${subject}&body=${body}`;
    return;
  }

  alert(
    "No lawyer assigned to this case yet. Please check back later or contact support."
  );
};
</script>

<style scoped>
.comments-area {
  margin-top: 1rem;
}
</style>
