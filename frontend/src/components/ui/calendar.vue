<template>
  <div class="p-3">
    <div class="flex items-center justify-between mb-4">
      <button
        type="button"
        @click="previousMonth"
        class="p-1 hover:bg-gray-100 rounded"
      >
        <ChevronLeft class="w-5 h-5" />
      </button>
      <div class="font-semibold">
        {{ format(currentMonth, 'MMMM yyyy') }}
      </div>
      <button
        type="button"
        @click="nextMonth"
        class="p-1 hover:bg-gray-100 rounded"
      >
        <ChevronRight class="w-5 h-5" />
      </button>
    </div>

    <div class="grid grid-cols-7 gap-1 mb-2">
      <div
        v-for="day in weekDays"
        :key="day"
        class="text-center text-xs font-medium text-gray-500 py-2"
      >
        {{ day }}
      </div>
    </div>

    <div class="grid grid-cols-7 gap-1">
      <div
        v-for="i in firstDayOfMonth"
        :key="`empty-${i}`"
        class="aspect-square"
      ></div>
      <button
        v-for="day in daysInMonth"
        :key="day"
        type="button"
        @click="selectDate(day)"
        :class="[
          'aspect-square flex items-center justify-center rounded-md text-sm hover:bg-gray-100 transition',
          isSelected(day) ? 'bg-blue-600 text-white hover:bg-blue-700' : '',
          isToday(day) ? 'border border-blue-600' : '',
          !isSelected(day) ? 'text-gray-700' : ''
        ]"
      >
        {{ day }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { format, startOfMonth, endOfMonth, getDay, getDaysInMonth, isSameDay, isToday, addMonths, subMonths } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-vue-next';

const props = defineProps({
  modelValue: {
    type: Date,
    default: null
  },
  selected: {
    type: Date,
    default: null
  },
  mode: {
    type: String,
    default: 'single'
  }
});

const emit = defineEmits(['update:modelValue', 'update:selected', 'select']);

const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

// Use selected prop if available, otherwise use modelValue
const selectedDate = computed(() => props.selected || props.modelValue);
const currentMonth = ref(selectedDate.value || new Date());

const firstDayOfMonth = computed(() => {
  return getDay(startOfMonth(currentMonth.value));
});

const daysInMonth = computed(() => {
  return getDaysInMonth(currentMonth.value);
});

const selectDate = (day) => {
  const selected = new Date(
    currentMonth.value.getFullYear(),
    currentMonth.value.getMonth(),
    day
  );
  emit('update:modelValue', selected);
  emit('update:selected', selected);
  emit('select', selected);
};

const isSelected = (day) => {
  if (!selectedDate.value) return false;
  const date = new Date(
    currentMonth.value.getFullYear(),
    currentMonth.value.getMonth(),
    day
  );
  return isSameDay(date, selectedDate.value);
};

const previousMonth = () => {
  currentMonth.value = subMonths(currentMonth.value, 1);
};

const nextMonth = () => {
  currentMonth.value = addMonths(currentMonth.value, 1);
};
</script>
