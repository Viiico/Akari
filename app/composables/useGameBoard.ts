import { ref, reactive } from "vue";
import { Board } from "~/lib/Game/Board";
import type { ReactiveCell } from "~/lib/Game/Cell";
import { CellType, ReactiveCellState } from "~/lib/Types/Game";

export function useGameBoard() {
  const board = ref<Board>(Board.empty());
  const gameState = reactive({
    playingTime: 0,
  });

  const initializeBoard = (
    rows: number = Board.DEFAULT_SIZE,
    cols: number = Board.DEFAULT_SIZE,
  ) => {
    board.value = Board.random(rows, cols);
    gameState.playingTime = 0;
  };

  const handleCellClickLeft = (row: number, col: number) => {
    const cell = board.value.board[row]?.[col];
    if (cell?.type !== CellType.REACTIVE) return;
    cell.state =
      cell.state === ReactiveCellState.EMPTY
        ? ReactiveCellState.BULB
        : ReactiveCellState.EMPTY;

    // TODO: Do actual logic of light propagation and checking if game is won
  };

  const handleCellClickRight = (row: number, col: number) => {
    const cell = board.value.board[row]?.[col];
    if (cell?.type !== CellType.REACTIVE) return;
    cell.state =
      cell.state === ReactiveCellState.MARKED
        ? ReactiveCellState.EMPTY
        : ReactiveCellState.MARKED;

    // TODO: Do actual logic of light propagation(Deleting light source)
  };

  return {
    // State
    board,
    gameState,

    // Computed
    rows: computed(() => board.value?.rows || 0),
    cols: computed(() => board.value?.cols || 0),
    boardGrid: computed(() => board.value?.board || []),

    // Actions
    initializeBoard,
    handleCellClickLeft,
    handleCellClickRight,
  };
}
