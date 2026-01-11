<template>
  <NavigationPanel />
  <h1>Leaderboards</h1>
  <p v-if="pending">Loading...</p>
  <p v-if="error"> An error has occured: {{ error.data.message }}</p>
  <ul v-else class="list-disc list-inside p-4">
    <li v-for="fruit in data?.fruits" :key="fruit.id">
      {{ fruit.name }}
    </li>
  </ul>
</template>

<script setup>
const { data, pending, error } = useFetch('/api/hello', {server: false});
</script>

<style></style>