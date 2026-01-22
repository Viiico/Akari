<template>
  <NavigationPanel />
  <h1>Leaderboards</h1>
  <p v-if="pending">Loading...</p>
  <p v-if="error"> An error has occured: {{ error.data.message }}</p>
  <ul v-else class="list-disc list-inside p-4">
    <li v-for="score in data?.scores" :key="score.id">
      User {{ score.username }} - Score: {{ score.score }} - Time: {{ score.completionTime }}s
    </li>
  </ul>
</template>

<script setup>
const { data, pending, error } = useFetch('/api/scores', {server: false});


watchEffect(() => {
  if (data.value) {
    console.log('Leaderboard data:', data.value);
    console.log('Scores array:', data.value.scores);
  }
});

</script>

<style></style>