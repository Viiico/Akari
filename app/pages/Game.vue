[file name]: Game.vue
[file content begin]
<template>
    <NavigationPanel />
    <main class="container min-h-screen text-white p-4">
        <!-- Winning Message -->
        <div v-if="gameState === GameStates.WON" class="mb-6 p-4 bg-green-800 border border-green-600 rounded">
            <h3 class="text-xl font-bold text-center mb-2">Gratulacje! Rozwiązałeś planszę!</h3>
            <div class="flex justify-center space-x-8">
                <div class="text-center">
                    <div class="text-gray-300 text-sm">Czas</div>
                    <div class="text-2xl font-bold">{{ formattedTime }}</div>
                </div>
                <div class="text-center">
                    <div class="text-gray-300 text-sm">Ruchy</div>
                    <div class="text-2xl font-bold">{{ movesCount }}</div>
                </div>
                <div class="text-center">
                    <div class="text-gray-300 text-sm">Wynik</div>
                    <div class="text-2xl font-bold text-yellow-400">{{ calculatedScore }}</div>
                </div>
            </div>
            
            <!-- Score Submission Section -->
            <div class="text-center mt-6">
                <button 
                    v-if="userLoggedIn && !scoreSubmitted && !isSubmitting"
                    @click="submitScore"
                    class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
                >
                    Zapisz wynik w rankingu
                </button>
                <button 
                    v-if="userLoggedIn && !scoreSubmitted && isSubmitting"
                    disabled
                    class="px-6 py-3 bg-blue-400 text-white font-medium rounded-md transition-colors"
                >
                    Zapisywanie...
                </button>
                <div 
                    v-if="userLoggedIn && scoreSubmitted"
                    class="text-green-400 font-medium"
                >
                    ✓ Wynik został zapisany!
                </div>
                <div 
                    v-if="!userLoggedIn"
                    class="text-yellow-400 text-sm mt-2"
                >
                    Zaloguj się, aby zapisać swój wynik w rankingu.
                </div>
                <div 
                    v-if="submitError"
                    class="text-red-400 text-sm mt-2"
                >
                    {{ submitError }}
                </div>
            </div>
        </div>

        <!-- Game Stats (During Play) -->
        <div v-if="gameState !== GameStates.WON" class="mb-6 flex justify-center space-x-8">
            <div class="text-center">
                <div class="text-gray-400 text-sm">Czas</div>
                <div class="text-2xl font-bold">{{ formattedTime }}</div>
            </div>
            <div class="text-center">
                <div class="text-gray-400 text-sm">Ruchy</div>
                <div class="text-2xl font-bold">{{ movesCount }}</div>
            </div>
        </div>

        <!-- Login Warning -->
        <div v-if="!userLoggedIn"
            class="mb-6 p-3 bg-yellow-900 border border-yellow-700 rounded max-w-md mx-auto items-center flex justify-center">
            <div class="flex items-center">
                <p class="text-sm items-center flex justify-center">
                    <button @click="toggleSignDropdown"
                        class="nav-link inline-block text-blue-400 hover:text-blue-300 transition-colors font-medium">
                        Zaloguj się
                    </button>
                    , aby Twój wynik został zapisany w rankingu.
                </p>
            </div>
        </div>

        <!-- Game Board -->
        <div class="flex justify-center mb-8">
            <div id='board' v-if="boardGrid.length > 0"
                class="inline-block p-4 bg-gray-800 border border-gray-700 rounded">
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

        <!-- Game Controls -->
        <div class="flex flex-wrap justify-center gap-4">
            <NuxtLink to="/" class="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded">
                Wyjdź z gry
            </NuxtLink>
            <button @click="printDiv('board')"
                class="px-5 py-2 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded">
                Drukuj planszę
            </button>
            <button @click="startNewGame"
                class="px-5 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded">
                Nowa gra
            </button>
        </div>
    </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useGameBoard } from '../composables/useGameBoard';
import { CellType, GameStates } from '../lib/Types/Game';
import { BoardSize as BoardSizeType, Difficulty as DifficultyType } from "../lib/Types/Game";
import { useState } from '#app';
import { useRouter } from 'vue-router';

const router = useRouter()
const selectedSize = useState('selectedSize', () => BoardSizeType.SMALL);
const selectedDifficulty = useState('selectedDifficulty', () => DifficultyType.EASY);
const userLoggedIn = useState("userLoggedIn", () => false);
const userLoginDropdownOpen = useState("userLoginDropdownOpen", () => false);
const username = useState('username', () => '');

const {
    board,
    gameState,
    rows,
    cols,
    boardGrid,
    movesCount,
    timer,
    formattedTime,
    calculatedScore,
    initializeBoard,
    handleCellClickLeft,
    handleCellClickRight
} = useGameBoard();

const isSubmitting = ref(false);
const submitError = ref('');
const scoreSubmitted = ref(false);

onMounted(() => {
    initializeBoard(selectedSize.value, selectedSize.value, selectedDifficulty.value);
});

const toggleSignDropdown = () => {
    userLoginDropdownOpen.value = !userLoginDropdownOpen.value;
}

const startNewGame = () => {
    scoreSubmitted.value = false;
    submitError.value = '';
    initializeBoard(selectedSize.value, selectedSize.value, selectedDifficulty.value);
};

const submitScore = async () => {
    if (!userLoggedIn.value) {
        submitError.value = 'Musisz być zalogowany, aby zapisać wynik.';
        return;
    }

    isSubmitting.value = true;
    submitError.value = '';

    try {
        // Konwersja czasu z milisekund na sekundy
        const completionTimeInSeconds = Math.floor(timer.value / 1000);
        
        const response = await $fetch.raw('/api/scores/submit-score', {
            method: 'POST',
            body: {
                username: username.value,
                score: calculatedScore.value,
                completionTime: completionTimeInSeconds,
                boardSize: selectedSize.value,
                difficulty: selectedDifficulty.value,
                moves: movesCount.value
            },
            async onResponseError({ response }) {
                isSubmitting.value = false;
                submitError.value = response._data?.message || 'Wystąpił błąd podczas zapisywania wyniku.';
                return;
            }
        });

        if (response.ok) {
            scoreSubmitted.value = true;
            submitError.value = '';
        } else {
            submitError.value = 'Wystąpił błąd podczas zapisywania wyniku.';
        }
    } catch (error: any) {
        submitError.value = error.message || 'Wystąpił błąd podczas zapisywania wyniku.';
    } finally {
        isSubmitting.value = false;
    }
};

function printDiv(divName: string) {
    const printContents = document.getElementById(divName)!.innerHTML;
    const originalContents = document.body.innerHTML;

    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
}
</script>

<style scoped>
.container {
    width: 95%;
    max-width: 1200px;
    margin: 0 auto;
    background-color: #1F1F1F;
}
</style>
[file content end]