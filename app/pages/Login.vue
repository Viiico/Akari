<template>
  <div class="p-6 max-w-md mx-auto mt-12 bg-gray-800 rounded-lg shadow-md text-white">
    <h1 class="text-2xl font-bold mb-6 text-center">Log in to your account</h1>

    <form @submit.prevent="handleLogin" class="flex flex-col gap-4">
      <!-- user name field -->
      <input 
        v-model="username" 
        type="text" 
        placeholder="user name" 
        required
        class="px-3 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-500" 
      />

      <!-- password field -->
      <input 
        v-model="password" 
        type="password" 
        placeholder="password" 
        required
        class="px-3 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-500" 
      />

      <!-- login button -->
      <button 
        type="submit" 
        class="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded font-semibold"
      >
        Log in
      </button>
    </form>

    <!-- registration link-->
    <p class="mt-4 text-center text-gray-400">
      Don't have an account?  
      <NuxtLink to="/register" class="text-blue-500 hover:underline">Sign up</NuxtLink>
    </p>

  
    <p v-if="error" class="text-red-500 mt-2 text-center">{{ error }}</p>
  </div>

</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const username = ref('');
const password = ref('');
const error = ref('');
const router = useRouter();

const handleLogin = async () => {
  error.value = '';

  try {
    const res = await $fetch('/api/auth/login', {
      method: 'POST',
      body: { username: username.value, password: password.value }
    });

    if (res.success) {
      
      localStorage.setItem('user', JSON.stringify(res.user));
      router.push('/Leaderboards');
    } else {
      error.value = res.message || 'Incorrect login details!';
    }
  } catch (err) {
    error.value = err?.message || 'Login error!';
  }
};
</script>