<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-4xl font-bold text-gray-900">
          LegalHub
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Create your account
        </p>
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="handleSignup">
        <!-- User Type Selection -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-3">
            I am registering as a:
          </label>
          <div class="grid grid-cols-3 gap-3">
            <button
              type="button"
              @click="formData.user_type = 'admin'"
              :class="[
                'relative flex flex-col items-center justify-center p-4 border-2 rounded-lg transition-all',
                formData.user_type === 'admin'
                  ? 'border-[#003aca] bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400 bg-white'
              ]"
            >
              <svg class="w-8 h-8 mb-2" :class="formData.user_type === 'admin' ? 'text-[#003aca]' : 'text-gray-400'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span class="text-sm font-medium" :class="formData.user_type === 'admin' ? 'text-[#003aca]' : 'text-gray-700'">Admin</span>
            </button>

            <button
              type="button"
              @click="formData.user_type = 'lawyer'"
              :class="[
                'relative flex flex-col items-center justify-center p-4 border-2 rounded-lg transition-all',
                formData.user_type === 'lawyer'
                  ? 'border-[#003aca] bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400 bg-white'
              ]"
            >
              <svg class="w-8 h-8 mb-2" :class="formData.user_type === 'lawyer' ? 'text-[#003aca]' : 'text-gray-400'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
              </svg>
              <span class="text-sm font-medium" :class="formData.user_type === 'lawyer' ? 'text-[#003aca]' : 'text-gray-700'">Lawyer</span>
            </button>

            <button
              type="button"
              @click="formData.user_type = 'customer'"
              :class="[
                'relative flex flex-col items-center justify-center p-4 border-2 rounded-lg transition-all',
                formData.user_type === 'customer'
                  ? 'border-[#003aca] bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400 bg-white'
              ]"
            >
              <svg class="w-8 h-8 mb-2" :class="formData.user_type === 'customer' ? 'text-[#003aca]' : 'text-gray-400'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span class="text-sm font-medium" :class="formData.user_type === 'customer' ? 'text-[#003aca]' : 'text-gray-700'">Customer</span>
            </button>
          </div>
        </div>

        <!-- Full Name -->
        <div>
          <label for="full_name" class="sr-only">Full Name</label>
          <input
            id="full_name"
            v-model="formData.full_name"
            name="full_name"
            type="text"
            required
            class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-[#003aca] focus:border-[#003aca] focus:z-10 sm:text-sm"
            placeholder="Full Name"
          />
        </div>

        <!-- Email -->
        <div>
          <label for="email" class="sr-only">Email address</label>
          <input
            id="email"
            v-model="formData.email"
            name="email"
            type="email"
            required
            class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-[#003aca] focus:border-[#003aca] focus:z-10 sm:text-sm"
            placeholder="Email address"
          />
        </div>

        <!-- Password -->
        <div>
          <label for="password" class="sr-only">Password</label>
          <input
            id="password"
            v-model="formData.password"
            name="password"
            type="password"
            required
            minlength="8"
            class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-[#003aca] focus:border-[#003aca] focus:z-10 sm:text-sm"
            placeholder="Password (min. 8 characters)"
          />
        </div>

        <!-- Confirm Password -->
        <div>
          <label for="confirm_password" class="sr-only">Confirm Password</label>
          <input
            id="confirm_password"
            v-model="formData.confirm_password"
            name="confirm_password"
            type="password"
            required
            minlength="8"
            class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-[#003aca] focus:border-[#003aca] focus:z-10 sm:text-sm"
            placeholder="Confirm Password"
          />
        </div>

        <!-- Additional Fields for Lawyer -->
        <div v-if="formData.user_type === 'lawyer'" class="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 class="text-sm font-semibold text-gray-700">Lawyer Details</h3>
          <div>
            <input
              v-model="formData.bar_number"
              type="text"
              placeholder="Bar Number"
              class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-[#003aca] focus:border-[#003aca] sm:text-sm"
            />
          </div>
          <div>
            <input
              v-model="formData.firm_name"
              type="text"
              placeholder="Firm Name"
              class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-[#003aca] focus:border-[#003aca] sm:text-sm"
            />
          </div>
          <div>
            <input
              v-model="formData.specializations"
              type="text"
              placeholder="Specializations (e.g., Civil, Corporate, Criminal)"
              class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-[#003aca] focus:border-[#003aca] sm:text-sm"
            />
          </div>
        </div>

        <!-- Phone (Optional) -->
        <div>
          <label for="phone" class="sr-only">Phone Number (Optional)</label>
          <input
            id="phone"
            v-model="formData.phone"
            name="phone"
            type="tel"
            class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-[#003aca] focus:border-[#003aca] focus:z-10 sm:text-sm"
            placeholder="Phone Number (Optional)"
          />
        </div>

        <!-- Error Message -->
        <div v-if="error" class="text-red-600 text-sm text-center bg-red-50 p-3 rounded-md border border-red-200">
          {{ error }}
        </div>

        <!-- Submit Button -->
        <div>
          <button
            type="submit"
            :disabled="loading"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#003aca] hover:bg-[#0031a0] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#003aca] disabled:opacity-50"
          >
            {{ loading ? 'Creating Account...' : 'Create Account' }}
          </button>
        </div>

        <!-- Login Link -->
        <div class="text-center">
          <p class="text-sm text-gray-600">
            Already have an account?
            <router-link to="/login" class="font-medium text-[#003aca] hover:text-[#0031a0]">
              Sign in here
            </router-link>
          </p>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const formData = ref({
  user_type: 'customer', // Default to customer
  full_name: '',
  email: '',
  password: '',
  confirm_password: '',
  phone: '',
  bar_number: '',
  firm_name: '',
  specializations: '',
});

const loading = ref(false);
const error = ref('');

const handleSignup = async () => {
  loading.value = true;
  error.value = '';

  // Validation
  if (formData.value.password !== formData.value.confirm_password) {
    error.value = 'Passwords do not match';
    loading.value = false;
    return;
  }

  if (formData.value.password.length < 8) {
    error.value = 'Password must be at least 8 characters long';
    loading.value = false;
    return;
  }

  try {
    // Prepare registration data
    const registrationData = {
      email: formData.value.email,
      password: formData.value.password,
      full_name: formData.value.full_name,
      user_type: formData.value.user_type,
      phone: formData.value.phone || undefined,
    };

    // Add lawyer-specific fields
    if (formData.value.user_type === 'lawyer') {
      registrationData.bar_number = formData.value.bar_number || undefined;
      registrationData.firm_name = formData.value.firm_name || undefined;
      registrationData.specializations = formData.value.specializations || undefined;
    }

    // Use the auth store's register method (it handles token storage automatically)
    await authStore.register(registrationData);

    // Redirect to dashboard
    router.push('/dashboard');
  } catch (err) {
    console.error('Signup error:', err);
    error.value = err.response?.data?.message || 'Registration failed. Please try again.';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
/* No custom styles needed */
</style>
