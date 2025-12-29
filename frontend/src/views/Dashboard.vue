<template>
  <div class="min-h-screen bg-gray-100 flex">
  <aside class= "w-1/4 ">
  <h1 class="flex gap-1.5 h-6">
  <Scale/>
   <span>
   LegalHub
   </span>
   </h1>
  </aside>

  <div class="w-1/5">
<h1>AI Assistance</h1>
  </div>

  <main class="w-1/1 ">
  <h1>Main</h1>
  </main>

  <div class="w-1/6 "> 
 <h1>Comment</h1>
 </div>

  </div>
</template>

<script setup>
import { useAuth } from '../composables/useAuth'
import {House, Scale} from 'lucide-vue-next'

const { user, logout } = useAuth()

const handleLogout = () => {
  logout()
}
</script>
