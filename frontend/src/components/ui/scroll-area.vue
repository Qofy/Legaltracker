<template>
  <div class="relative overflow-hidden" :class="className">
    <div
      ref="scrollArea"
      class="h-full w-full overflow-auto"
      :style="{ height: '100%' }"
    >
      <slot />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  className: { type: String, default: '' }
})

const scrollArea = ref(null)
</script>