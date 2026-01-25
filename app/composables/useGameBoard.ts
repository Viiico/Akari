import { ref, reactive } from "vue";
import { Board } from "~/lib/Game/Board";
import { CellType, ReactiveCellState } from "~/lib/Types/Game";

export function useGameBoard() {
  const board = ref<Board>();
  const gameState = reactive({
    playingTime: 0,
  });

  const initializeBoard = (rows: number = Board.DEFAULT_SIZE, cols: number = Board.DEFAULT_SIZE) => {
      board.value = Board.empty(rows, cols);
      gameState.playingTime = 0;
  }

  return {
    // State
    board,
    gameState,


    // Computed
    rows: computed(() => board.value?.rows || 0),
    cols: computed(() => board.value?.cols || 0),
    boardGrid: computed(() => board.value?.board || []),

    // Actions
    initializeBoard
  }
}
