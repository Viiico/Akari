<template>
    <div :class="cellClasses">
        <!-- <span class="flex justify-center items-center">{{  cell.isLit }}</span> -->
        <div v-if="cell.state === ReactiveCellState.EMPTY && !cell.isLit" class="empty-cell"></div>
        <div v-else-if="cell.state === ReactiveCellState.EMPTY && cell.isLit" class="lit-empty-cell"></div>
        <div v-if="cell.state === ReactiveCellState.BULB">
            <NuxtImg preload format="webp" src="/lightbulb.png" alt="Lightbulb icon" class="bulb-image" />
        </div>
        <span v-else-if="cell.state === ReactiveCellState.MARKED" class="marked-x">X</span>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { type ReactiveCell as ReactiveCellType } from '../lib/Game/Cell';
import { ReactiveCellState } from '../lib/Types/Game';

const props = defineProps<{
    cell: ReactiveCellType
}>();

const cellClasses = computed(() => {
    const base = 'cell reactive-cell w-12 h-12 flex items-center justify-center cursor-pointer transition-colors'

    if (props.cell.isLit || props.cell.state === ReactiveCellState.BULB) {
        return `${base} bg-yellow-200`
    }

    return `${base} bg-white`
})
</script>

<style scoped>
.reactive-cell {
    border: 2px solid #9CA3AF;
}

.reactive-cell:hover {
    border-color: #6B7280;
    opacity: 0.9;
}

.empty-cell {
    width: 100%;
    height: 100%;
}

.lit-empty-cell {
    width: 100%;
    height: 100%;
    background-color: rgba(253, 224, 71, 0.3);
}

.bulb-image {
    width: 28px;
    height: 28px;
    object-fit: contain;
}

.marked-x {
    color: #DC2626;
    font-size: 24px;
    font-weight: bold;
}

.lit-indicator {
    width: 100%;
    height: 100%;
    background-color: rgba(253, 224, 71, 0.3);
}
</style>