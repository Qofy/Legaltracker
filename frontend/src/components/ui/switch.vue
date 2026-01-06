<template>
  <button
    type="button"
    role="switch"
    :aria-checked="props.checked"
    :class="[
      'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
      props.checked ? (props.onClass || 'bg-blue-600') : (props.offClass || 'bg-gray-200'),
      props.disabled ? 'opacity-50 cursor-not-allowed' : ''
    ]"
    :disabled="props.disabled"
    @click="toggle"
  >
    <span
      :class="[
        'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
        props.checked ? 'translate-x-5' : 'translate-x-0'
      ]"
    />
  </button>
</template>

<script setup>
const props = defineProps({
  checked: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  onClass: {
    type: String,
    default: ''
  },
  offClass: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['update:checked']);

const toggle = () => {
  if (!props.disabled) {
    emit('update:checked', !props.checked);
  }
};
</script>
