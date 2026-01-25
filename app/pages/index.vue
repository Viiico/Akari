<template>
    <NavigationPanel />
    <main class="how-to-play-page">
        <div class="container">
            <div class="content-column">
                <section class="section">
                    <h2 class="section-title">Game Configuration</h2>
                    <form @submit.prevent="startGame" class="space-y-6">
                        <!-- Board Size Selection -->
                        <div class="space-y-3">
                            <label class="block text-cbd5e0 text-sm font-medium mb-2">
                                Board Size
                            </label>
                            <div class="flex flex-wrap gap-3 justify-center">
                                <button v-for="size in boardSizes" :key="size.value" type="button"
                                    @click="selectedSize = size.value" :class="[
                                        'px-6 py-3 rounded-lg border transition-colors flex-1 min-w-[120px]',
                                        selectedSize === size.value
                                            ? 'bg-blue-600 border-blue-600 text-white'
                                            : 'bg-gray-700 border-gray-600 hover:bg-gray-600 text-gray-200'
                                    ]">
                                    {{ size.label }}
                                </button>
                            </div>
                        </div>

                        <!-- Difficulty Selection -->
                        <div class="space-y-3">
                            <label class="block text-cbd5e0 text-sm font-medium mb-2">
                                Difficulty
                            </label>
                            <div class="flex flex-wrap gap-3 justify-center">
                                <button v-for="diff in difficulties" :key="diff.value" type="button"
                                    @click="selectedDifficulty = diff.value" :class="[
                                        'px-6 py-3 rounded-lg border transition-colors flex-1 min-w-[120px]',
                                        selectedDifficulty === diff.value
                                            ? 'bg-blue-600 border-blue-600 text-white'
                                            : 'bg-gray-700 border-gray-600 hover:bg-gray-600 text-gray-200'
                                    ]">
                                    {{ diff.label }}
                                </button>
                            </div>
                        </div>

                        <div class="pt-6">
                            <button type="submit"
                                class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors text-lg">
                                Start Game
                            </button>
                        </div>
                    </form>
                </section>

                <section class="section">
                    <h2 class="section-title">How to Play</h2>
                    <p class="paragraph text-lg">
                        Place light bulbs on the grid to illuminate all white cells. Light bulbs illuminate in straight
                        lines until blocked by black cells. Numbers in black cells indicate exactly how many adjacent bulbs
                        are required.
                    </p>
                    <NuxtLink to="/HowToPlay"
                        class="inline-block mt-4 text-blue-400 hover:text-blue-300 transition-colors text-lg font-medium">
                        Read full instructions →
                    </NuxtLink>
                </section>
            </div>
        </div>
    </main>
</template>

<script setup>
import { BoardSize as BoardSizeType, Difficulty as DifficultyType } from "../lib/Types/Game";

const selectedSize = useState('selectedSize', () => BoardSizeType.SMALL);
const selectedDifficulty = useState('selectedDifficulty', () => DifficultyType.EASY);

const boardSizes = Object.values(BoardSizeType)
    .filter(val => typeof val === 'number')
    .map((size) => ({ label: `${size}x${size}`, value: size }));

const difficulties = Object.values(DifficultyType)
    .map((diff) => ({ label: diff, value: diff }));


const startGame = async () => {
    await navigateTo("/Game")
};
</script>

<style scoped>
.how-to-play-page {
    height: calc(120vh - 60px);
    background-color: #1F1F1F;
    color: white;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: auto;
}

.container {
    width: 100%;
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 2rem;
}

.content-column {
    display: flex;
    flex-direction: column;
    gap: 3rem;
    width: 100%;
    max-width: 900px;
    margin: 0 auto;
}

.section {
    background-color: #2a2a2a;
    padding: 2.5rem 3rem;
    border-radius: 12px;
    border-left: 6px solid #4299e1;
    display: flex;
    flex-direction: column;
    width: 100%;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.section-title {
    font-size: 1.8rem;
    font-weight: 600;
    margin-bottom: 1.5rem;
    color: #e2e8f0;
    text-align: center;
}

.paragraph {
    font-size: 1.1rem;
    line-height: 1.7;
    margin-bottom: 0.75rem;
    color: #cbd5e0;
    flex-grow: 1;
    text-align: center;
}

.text-cbd5e0 {
    color: #cbd5e0;
}

@media (max-width: 768px) {
    .how-to-play-page {
        height: calc(120vh - 60px);
        padding: 1rem;
    }
    
    .container {
        padding: 0 1rem;
    }
    
    .content-column {
        gap: 2rem;
    }
    
    .section {
        padding: 1.5rem;
    }
    
    .section-title {
        font-size: 1.4rem;
    }
    
    .paragraph {
        font-size: 1rem;
    }
}

@media (max-height: 700px) {
    .content-column {
        gap: 1.5rem;
    }
    
    .section {
        padding: 1.5rem 2rem;
    }
}
</style>