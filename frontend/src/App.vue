<template>
  <router-view />
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuth } from './composables/useAuth'

const { loadUser, isAuthenticated } = useAuth()

onMounted(async () => {
  if (isAuthenticated.value) {
    await loadUser()
  }
})
</script>
