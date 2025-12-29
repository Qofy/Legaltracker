<template>
  <div class="min-h-screen bg-gradient-to-br from-primary-600 to-primary-900 flex items-center justify-center">
    <div class="text-center text-white p-8">
      <h1 class="text-6xl font-bold mb-4">LegalHub</h1>
      <p class="text-2xl mb-8">Legal Case Management System</p>
      <div class="space-x-4">
        <router-link
          to="/login"
          class="inline-block bg-white text-primary-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
        >
          Login
        </router-link>
        <router-link
          to="/dashboard"
          class="inline-block bg-secondary-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-secondary-600 transition"
        >
          Dashboard
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>
