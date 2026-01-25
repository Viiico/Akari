<template>
  <NavigationPanel />
  <main class="container min-h-screen text-white p-4">
    <div class="mb-6 flex flex-col items-center gap-4">
      <h2 class="text-2xl font-bold text-center text-white mb-4">Board Creator</h2>

      <div class="flex flex-wrap justify-center gap-4 mb-4">
        <button v-for="size in boardSizes" :key="size.val" @click="initCreatorBoard(size.val)"
          class="px-5 py-2 rounded font-medium transition-all duration-200 border"
          :class="currentSize === size.val ? 
            'bg-blue-600 text-white border-blue-500 shadow-lg' : 
            'bg-gray-800 hover:bg-gray-700 text-gray-200 border-gray-600 hover:border-gray-500'">
          {{ size.label }}
        </button>
      </div>

      <div v-if="isCreatorBoardValid && validateWalls()"
        class="px-6 py-3 bg-green-900/80 border border-green-500 rounded-lg text-center shadow-lg backdrop-blur-sm">
        <span class="font-bold text-lg text-green-300">✓ Board Valid</span>
        <p class="text-sm text-green-200 mt-1">All cells are correctly placed and walls have the required bulbs.</p>
      </div>
      
      <div v-else-if="!validateWalls()"
        class="px-6 py-3 bg-red-900/80 border border-red-500 rounded-lg text-center shadow-lg backdrop-blur-sm">
        <span class="font-bold text-lg text-red-300">Fix Walls</span>
        <p class="text-sm text-red-200 mt-1">Some walls don't have the required number of adjacent bulbs.</p>
      </div>
      
      <div v-else class="text-gray-400 text-sm bg-gray-800/50 px-4 py-2 rounded border border-gray-700">
        Fill the board. Left-click to place/edit cells. Right-click to clear.
      </div>
    </div>

    <!-- Game Board -->
    <div class="flex justify-center mb-8 relative">
      <div v-if="boardGrid.length > 0"
        class="inline-block p-4 bg-gray-900 border border-gray-700 rounded-lg shadow-xl select-none" @contextmenu.prevent>
        <div class="grid gap-0" :style="{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }">
          <div v-for="(row, rIndex) in boardGrid" :key="rIndex" class="contents">
            <template v-for="(cell, cIndex) in row" :key="cIndex">
              <div @click="handleLeftClick(rIndex, cIndex)" 
                   @contextmenu.prevent="handleRightClick(rIndex, cIndex)"
                   :class="[
                    'w-12 h-12 border flex items-center justify-center cursor-pointer transition-all duration-150',
                    getCellClasses(cell, rIndex, cIndex)
                  ]">
                
                <!-- Wall Cell -->
                <div v-if="cell.type === CellType.WALL" 
                     class="w-full h-full flex items-center justify-center relative">
                  <span v-if="cell.state >= 0 && cell.state <= 4" 
                        class="text-white font-bold text-xl relative z-10">
                    {{ cell.state }}
                  </span>
                  
                  <!-- Wall validation indicator -->
                  <div v-if="cell.state >= 0 && cell.state <= 4" 
                       class="absolute bottom-1 right-1 w-2 h-2 rounded-full"
                       :class="countAdjacentBulbs(rIndex, cIndex) === cell.state ? 
                              'bg-green-500' : 'bg-red-500'">
                  </div>
                </div>

                <!-- Reactive Cell with Bulb -->
                <div v-else-if="cell.state === ReactiveCellState.BULB" 
                     class="w-full h-full flex items-center justify-center">
                  <NuxtImg preload format="webp" src="/lightbulb.png" alt="Lightbulb" 
                    class="w-8 h-8 drop-shadow-lg" />
                </div>

              </div>
            </template>
          </div>
        </div>
      </div>
    </div>

    <!-- Type Selection Modal -->
    <div v-if="isModalOpen"
      class="fixed inset-0 bg-black/90 flex items-center justify-center z-50 backdrop-blur-sm"
      @click.self="closeModal">
      <div class="bg-gray-900 p-8 rounded-xl border border-gray-700 shadow-2xl flex flex-col items-center max-w-md w-full mx-4">
        <h3 class="text-2xl font-bold text-white mb-8">Select Cell Type</h3>

        <div class="grid grid-cols-2 gap-6 w-full">
          <!-- Wall Cell Option -->
          <div @click="selectWallType" 
               class="group cursor-pointer flex flex-col items-center p-4 rounded-lg border-2 border-gray-700 hover:border-blue-500 bg-gray-800/50 hover:bg-gray-800 transition-all duration-200">
            <div class="w-20 h-20 bg-black border border-gray-600 rounded flex items-center justify-center relative mb-3">
              <span class="text-gray-300 font-bold text-lg">WALL</span>
              <span class="absolute top-2 left-2 text-gray-400 text-xs font-mono group-hover:text-blue-400">1</span>
            </div>
            <span class="text-gray-300 font-medium">Wall Cell</span>
            <span class="text-gray-500 text-sm mt-1 text-center">Numbered (0-5) or solid black</span>
          </div>

          <!-- Bulb Cell Option -->
          <div @click="selectBulbType" 
               class="group cursor-pointer flex flex-col items-center p-4 rounded-lg border-2 border-gray-700 hover:border-yellow-500 bg-gray-800/50 hover:bg-gray-800 transition-all duration-200">
            <div class="w-20 h-20 bg-gray-900 border border-gray-600 rounded flex items-center justify-center relative mb-3">
              <NuxtImg preload format="webp" src="/lightbulb.png" alt="Lightbulb" 
                class="w-10 h-10 brightness-125" />
              <span class="absolute top-2 left-2 text-gray-400 text-xs font-mono group-hover:text-yellow-400">2</span>
            </div>
            <span class="text-gray-300 font-medium">Light Bulb</span>
            <span class="text-gray-500 text-sm mt-1 text-center">Lights up row & column</span>
          </div>
        </div>

        <button @click="closeModal" 
                class="mt-8 px-6 py-2 text-gray-400 hover:text-white text-sm border border-gray-700 rounded-lg hover:border-gray-600 transition-colors">
          Cancel (Esc)
        </button>
      </div>
    </div>

    <!-- Wall Input Modal -->
    <div v-if="isWallInputOpen" 
         class="fixed inset-0 bg-black/90 flex items-center justify-center z-50 backdrop-blur-sm"
         @click.self="closeModal">
      <div class="bg-gray-900 p-8 rounded-xl border border-gray-700 shadow-2xl flex flex-col items-center max-w-sm w-full mx-4">
        <h3 class="text-xl font-bold text-white mb-2">Wall Value</h3>
        <p class="text-gray-400 text-sm mb-6 text-center">Enter 0-4 for numbered walls, or 5 for solid black wall</p>
        
        <input ref="wallInputRef" type="number" min="0" max="5" v-model.number="wallValue" 
               @keyup.enter="confirmWall" @keyup.esc="closeModal"
               class="bg-gray-800 border-2 border-gray-700 text-white text-4xl text-center w-32 p-4 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none mb-6" />
        
        <div class="flex gap-3 w-full">
          <button @click="closeModal"
            class="flex-1 px-4 py-3 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-lg border border-gray-700 transition-colors">
            Cancel
          </button>
          <button @click="confirmWall"
            class="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
            Set Value
          </button>
        </div>
      </div>
    </div>

  </main>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import { useGameBoard } from '../composables/useGameBoard';
import { CellType, ReactiveCellState, GenerationModes, Difficulty as DifficultyType } from '../lib/Types/Game';

const {
    boardGrid,
    initializeBoard,
    cols,
    clearCell,
    setWall,
    tryPlaceBulb,
    validateWalls,
    countAdjacentBulbs,
    isCreatorBoardValid
} = useGameBoard();

const currentSize = ref(7);
const boardSizes = [
    { label: 'Small (7×7)', val: 7 },
    { label: 'Medium (10×10)', val: 10 },
    { label: 'Large (14×14)', val: 14 },
];

const isModalOpen = ref(false);
const isWallInputOpen = ref(false);
const selectedCoords = ref({ r: -1, c: -1 });
const wallValue = ref(0);
const wallInputRef = ref < HTMLInputElement | null > (null);

const flashingCells = ref < Set < string >> (new Set());

onMounted(() => {
    initCreatorBoard(7);
    window.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
    window.removeEventListener('keydown', handleKeydown);
});

const initCreatorBoard = (size: number) => {
    currentSize.value = size;
    initializeBoard(size, size, DifficultyType.EASY, GenerationModes.EMPTY);
};

const getCellClasses = (cell: any, r: number, c: number) => {
    const isFlash = flashingCells.value.has(`${r}-${c}`);

    if (cell.type === CellType.WALL) {
        return 'bg-black text-white hover:border-blue-400';
    }

    let base = 'bg-gray-900';
    if (cell.state === ReactiveCellState.BULB) {
        base = isFlash ? 'bg-red-600' : 'bg-gray-800';
    } else if (cell.isLit) {
        base = 'bg-yellow-400/20';
    }

    if (isFlash) return `${base} animate-flash-red border-red-500`;

    return `${base} hover:border-blue-400`;
};

const handleLeftClick = (r: number, c: number) => {
    selectedCoords.value = { r, c };
    isModalOpen.value = true;
    isWallInputOpen.value = false;
};

const handleRightClick = (r: number, c: number) => {
    clearCell(r, c);
};

const selectWallType = () => {
    isModalOpen.value = false;
    isWallInputOpen.value = true;
    wallValue.value = 0;
    nextTick(() => wallInputRef.value?.focus());
};

const confirmWall = () => {
    let val = wallValue.value;
    if (val < 0) val = 0;
    if (val > 5) val = 5;

    const { r, c } = selectedCoords.value;
    setWall(r, c, val);
    closeModal();
};

const selectBulbType = () => {
    const { r, c } = selectedCoords.value;
    closeModal();
    clearCell(r, c);
    const result = tryPlaceBulb(r, c);
    if (!result.success && result.blocker) {
        triggerFlash(result.blocker.r, result.blocker.c);
    }
};

const closeModal = () => {
    isModalOpen.value = false;
    isWallInputOpen.value = false;
    selectedCoords.value = { r: -1, c: -1 };
};

const triggerFlash = (r: number, c: number) => {
    const key = `${r}-${c}`;
    flashingCells.value.add(key);
    setTimeout(() => {
        flashingCells.value.delete(key);
    }, 400);
};

const handleKeydown = (e: KeyboardEvent) => {
    if (isModalOpen.value && !isWallInputOpen.value) {
        if (e.key === '1') selectWallType();
        if (e.key === '2') selectBulbType();
        if (e.key === 'Escape') closeModal();
    }
};
</script>

<style scoped>
.container {
    width: 95%;
    max-width: 1200px;
    margin: 0 auto;
    background-color: #1F1F1F;
}

/* Walnąć po oczach, bo po łapach nie da rady */
@keyframes redFlash {

    0%,
    100% {
        background-color: #1f2937;
    }

    50% {
        background-color: #dc2626;
    }
}

.animate-flash-red {
    animation: redFlash 0.2s ease-in-out 2;
}
</style>