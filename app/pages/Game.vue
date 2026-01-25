<template>
    <NavigationPanel />
    <main class="how-to-play-page">
        <div class="container">
            <h1>Play Game - {{ selectedSizeLabel }} ({{ selectedDifficultyLabel }})</h1>

            <div class="mt-8 flex flex-wrap gap-3 justify">
                <button @click="submitRandomScore" :disabled="isSubmitting"
                    class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors disabled:bg-gray-500">
                    {{ isSubmitting ? 'Submitting...' : 'Submit Random Score' }}
                </button>
                <button @click="printDiv('board')"
                    class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors disabled:bg-gray-500">
                    Print
                </button>
            </div>

            <div v-if="lastSubmission" class="mt-6 p-4 bg-gray-800 rounded-md">
                <h3 class="text-lg font-semibold text-green-400">Last Submission:</h3>
                <p>Score: {{ lastSubmission.score }}</p>
                <p>Time: {{ lastSubmission.completionTime }}s</p>
            </div>

            <div v-if="error" class="mt-6 p-4 bg-red-900/30 border border-red-500 rounded-md">
                <p class="text-red-400">Error: {{ error }}</p>
            </div>

        </div>
    </main>
</template>

<script setup>
const username = useState("username", () => "");
const selectedSize = useState('selectedSize', () => 'small');
const selectedDifficulty = useState('selectedDifficulty', () => 'easy');

const selectedSizeLabel = computed(() => {
    const sizes = { small: '7×7', medium: '10×10', large: '14×14' };
    return sizes[selectedSize.value] || '7×7';
});

const selectedDifficultyLabel = computed(() => {
    const difficulties = { easy: 'Easy', medium: 'Medium', hard: 'Hard' };
    return difficulties[selectedDifficulty.value] || 'Easy';
});

const isPrinting = ref(false);
const isSubmitting = ref(false);
const lastSubmission = ref(null);
const error = ref(null);

const submitRandomScore = async () => {
    isSubmitting.value = true;
    error.value = null;

    const score = Math.floor(Math.random() * 10000) + 1000;
    const completionTime = Math.floor(Math.random() * 600) + 60;

    console.log(`About to send: ${username.value}, ...`);
    

    const response = await $fetch.raw('/api/scores/submit-score', {
        method: 'POST',
        body: {
            username: username.value,
            score,
            completionTime
        },
        async onResponseError({ response }) {
            isSubmitting.value = false;
            error.value = (response._data).message;
            return;
        }
    });

    lastSubmission.value = {
        score: randomScore,
        completionTime: randomTime,
        userId: response.userId || 'Unknown'
    };
};

function printDiv(divName) {
    if(divName==null){
        error.value='Brak'
        return
    }
    else{
    printContents = document.getElementById(divName).innerHTML;
    originalContents = document.body.innerHTML;

    document.body.innerHTML = printContents;

    window.print();

    document.body.innerHTML = originalContents;
    }
}


</script>

<style scoped>
.how-to-play-page {
    min-height: calc(100vh - 60px);
    background-color: #1F1F1F;
    color: white;
    padding: 2rem 1rem;
}

.container {
    width: 95%;
    max-width: 1200px;
    margin: 0 auto;
}
</style>