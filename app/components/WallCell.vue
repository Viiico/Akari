<template>
    <div :class="cellClasses">
        <span v-if="showNumber" class="number">{{ cell.state }}</span>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { type WallCell as WallCellType } from "../lib/Game/Cell";

const props = defineProps<{
    cell: WallCellType
}>();

const showNumber = computed(() => {
    return props.cell.state >= 0 && props.cell.state <= 4;
});

const cellClasses = computed(() => {
    const base = 'cell wall-cell w-12 h-12 flex items-center justify-center';
    return `${base} bg-black`;
});
</script>

<style scoped>
.wall-cell {
    border: 1px solid #374151;
}

.number {
    color: white;
    font-weight: bold;
    font-size: 1.2rem;
}
</style>