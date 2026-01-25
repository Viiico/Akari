<template>
    <NavigationPanel />
    <main class="game-container">
        <div class="container mx-auto p-4">
            <!-- Winning Message -->
            <div v-if="gameState === GameStates.WON"
                class="mb-6 p-4 bg-green-900/30 border border-green-500 rounded-md">
                <h3 class="text-lg font-semibold text-green-400 text-center">Gratulacje! Rozwiązałeś planszę!</h3>
            </div>
            <!-- Game Board -->
            <div class="flex justify-center mb-6">
                <div id='board' v-if="boardGrid.length > 0" class="inline-block p-4 bg-gray 800 rounded-lg">
                    <div class="grid gap-0" :style="{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }">
                        <div v-for="(row, rowIndex) in boardGrid" :key="rowIndex" class="contents">
                            <template v-for="(cell, colIndex) in row" :key="colIndex">
                                <WallCell v-if="cell.type === CellType.WALL" :cell="cell"></WallCell>
                                <ReactiveCell v-else-if="cell.type === CellType.REACTIVE" :cell="cell"
                                    @click="handleCellClickLeft(rowIndex, colIndex)"
                                    @click.right.prevent="handleCellClickRight(rowIndex, colIndex)"></ReactiveCell>
                            </template>
                        </div>
                    </div>
                </div>
            </div>
            <div class="mt-8 flex flex-wrap gap-3 justify-center">
                <button @click="quitGame"
                    class="button px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors disabled:bg-gray-500">
                    Quit the game
                </button>
                <button @click="printDiv('board')"
                    class="button px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors disabled:bg-gray-500">
                    Print the game board
                </button>
                <button @click="initializeBoard(selectedSize, selectedSize)"
                    class="button px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors disabled:bg-gray-500">
                    Start a new game
                </button>
            </div>
        </div>
    </main>
    <!-- <main class="how-to-play-page">
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
    </main> -->
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useGameBoard } from '../composables/useGameBoard';
import { CellType, GameStates } from '../lib/Types/Game';
import { BoardSize as BoardSizeType, Difficulty as DifficultyType } from "../lib/Types/Game";
import { useState } from '#app';
import { useRouter } from 'vue-router';

const router = useRouter()
const selectedSize = useState('selectedSize', () => BoardSizeType.SMALL);
const selectedDifficulty = useState('selectedDifficulty', () => DifficultyType.EASY);


const {
    board,
    gameState,
    rows,
    cols,
    boardGrid,
    initializeBoard,
    handleCellClickLeft,
    handleCellClickRight
} = useGameBoard();

onMounted(() => {
    initializeBoard(selectedSize.value, selectedSize.value);
});


function printDiv(divName: string) {
    var printContents = document.getElementById(divName).innerHTML;
    var originalContents = document.body.innerHTML;

    document.body.innerHTML = printContents;

    window.print();

    document.body.innerHTML = originalContents;
}

function quitGame() {
    router.push('/');
}



// const selectedSizeLabel = computed(() => {
//     const sizes = { small: '7×7', medium: '10×10', large: '14×14' };
//     return sizes[selectedSize.value] || '7×7';
// });

// const selectedDifficultyLabel = computed(() => {
//     const difficulties = { easy: 'Easy', medium: 'Medium', hard: 'Hard' };
//     return difficulties[selectedDifficulty.value] || 'Easy';
// });

// const isSubmitting = ref(false);
// const lastSubmission = ref(null);
// const error = ref(null);

// const submitRandomScore = async () => {
//     isSubmitting.value = true;
//     error.value = null;

//     const score = Math.floor(Math.random() * 10000) + 1000;
//     const completionTime = Math.floor(Math.random() * 600) + 60;

//     console.log(`About to send: ${username.value}, ...`);


//     const response = await $fetch.raw('/api/scores/submit-score', {
//         method: 'POST',
//         body: {
//             username: username.value,
//             score,
//             completionTime
//         },
//         async onResponseError({ response }) {
//             isSubmitting.value = false;
//             error.value = (response._data).message;
//             return;
//         }
//     });

//     lastSubmission.value = {
//         score: randomScore,
//         completionTime: randomTime,
//         userId: response.userId || 'Unknown'
//     };
// };
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