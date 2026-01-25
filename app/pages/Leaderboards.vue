<template>
  <NavigationPanel />


  <div class="p-6 max-w-5xl mx-auto">
    <!-- Header -->
    <h1 class="text-2xl font-bold text-center text-white mb-6">
      Game statistics
    </h1>

    <!-- Buttons: daily / weekly / all time-->
    <div class="flex flex-wrap gap-3 justify-center mb-6">
      <button v-for="type in types" :key="type.value" type="button" @click="setType(type.value)" :class="[
        'px-6 py-2 rounded-lg border transition-colors min-w-[120px]',
        selectedType === type.value
          ? 'bg-blue-600 border-blue-600 text-white'
          : 'bg-gray-700 border-gray-600 hover:bg-gray-600 text-gray-200'
      ]">
        {{ type.label }}
      </button>
    </div>

    <p v-if="pending" class="text-gray-400 text-center">
      Loading data...
    </p>

    <p v-if="error" class="text-red-500 text-center">
      Error: {{ error.message }}
    </p>

    <div v-if="!pending && !error" class="max-h-[400px] overflow-y-auto border rounded"> </div>

    <!-- Scores table -->
    <div class="max-h-[400px] overflow-y-auto border rounded">
      <table class="w-full border-collapse table-fixed">
        <thead class="bg-gray-800 text-white sticky top-0">
          <tr>
            <th class="border p-2 w-12">No.</th>
            <th class="border p-2 w-1/3">User name</th>
            <th class="border p-2 w-1/3">Score</th>
            <th class="border p-2">Date</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(score, index) in filteredScores" :key="score.id">
            <td class="border p-2 text-center">{{ index + 1 }}</td>
            <td class="border p-2 text-center">{{ score.username }}</td>
            <td class="border p-2 text-center">{{ score.score }}</td>
            <td class="border p-2 text-center">{{ new Date(score.createdAt).toLocaleString() }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { LeaderBoardPeriods as LeaderboardPeriodsType } from "../lib/Types/Generic"

definePageMeta({
  middleware: ['auth']
});

const types = Object.values(LeaderboardPeriodsType)
  .map((period) => ({ label: period.toLowerCase(), value: period }))

const selectedType = ref('daily')

const scores = ref([])

const { data, pending, error } = useFetch(
  () => `/api/scores?type=${selectedType.value}`,
  { server: false }
)

watch(data, () => {
  if (data.value?.scores) {
    scores.value = data.value.scores
  }
})

const filteredScores = computed(() => {
  return scores.value
})

const setType = (type) => {
  selectedType.value = type
}
</script>

<style></style>