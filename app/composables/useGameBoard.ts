import { ref, reactive } from "vue";
import { Board } from "~/lib/Game/Board";
import type { ReactiveCell } from "~/lib/Game/Cell";
import {
  CellType,
  ReactiveCellState,
  Difficulty,
  GenerationModes,
} from "~/lib/Types/Game";

export function useGameBoard() {
  const board = ref<Board>(new Board());
  const gameState = reactive({
    playingTime: 0,
  });
  const stateRows = ref(0);
  const stateCols = ref(0);

  const initializeBoard = (
    rows: number = Board.DEFAULT_SIZE,
    cols: number = Board.DEFAULT_SIZE,
  ) => {
    board.value = new Board(rows, cols, Difficulty.HARD, GenerationModes.VALID);
    stateRows.value = board.value.rows;
    stateCols.value = board.value.cols;
    gameState.playingTime = 0;
  };

  const propagateLight = (bulbRow: number, bulbCol: number) => {
    if (!board.value) return;

    const directions = [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ];

    for (const dir of directions) {
      let currentRow = bulbRow + dir[0]!;
      let currentCol = bulbCol + dir[1]!;

      while (
        currentRow >= 0 &&
        currentRow < stateRows.value &&
        currentCol >= 0 &&
        currentCol < stateCols.value
      ) {
        const cell = board.value.board[currentRow]![currentCol]!;

        if (cell.type === CellType.WALL) break;

        if (cell.type === CellType.REACTIVE) {
          cell.isLit = true;
        }

        currentRow += dir[0]!;
        currentCol += dir[1]!;
      }
    }
  };

  const removeLightFromBulb = (bulbRow: number, bulbCol: number) => {
    if (!board.value) return;

    const directions = [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ];

    for (const dir of directions) {
      let currentRow = bulbRow + dir[0]!;
      let currentCol = bulbCol + dir[1]!;

      while (
        currentRow >= 0 &&
        currentRow < stateRows.value &&
        currentCol >= 0 &&
        currentCol < stateCols.value
      ) {
        const cell = board.value.board[currentRow]![currentCol]!;

        if (cell.type === CellType.WALL) break;

        if (cell.type === CellType.REACTIVE) {
          if (cell.state !== ReactiveCellState.BULB) {
            cell.isLit = false;
          }
        }

        currentRow += dir[0]!;
        currentCol += dir[1]!;
      }
    }
  };

  const updateLighting = () => {
    if (!board.value) return;

    for (let i = 0; i < stateRows.value; i++) {
      for (let j = 0; j < stateCols.value; j++) {
        const cell = board.value.board[i]![j]!;
        if (
          cell.type === CellType.REACTIVE &&
          cell.state !== ReactiveCellState.BULB
        ) {
          cell.isLit = false;
        }
      }
    }

    for (let i = 0; i < stateRows.value; i++) {
      for (let j = 0; j < stateCols.value; j++) {
        const cell = board.value.board[i]![j]!;
        if (
          cell.type === CellType.REACTIVE &&
          cell.state === ReactiveCellState.BULB
        ) {
          propagateLight(i, j);
        }
      }
    }
  };

  const handleCellClickLeft = (row: number, col: number) => {
    console.log("Left clikg");

    // TODO. Zmienić nie zaczęcie gry
    if (!board.value) return; // Gra się nie zaczęła
    const cell = board.value.board[row]?.[col]!;

    if (cell.type !== CellType.REACTIVE) return;
    cell.state =
      cell.state === ReactiveCellState.BULB
        ? ReactiveCellState.EMPTY
        : ReactiveCellState.BULB;
    updateLighting();
  };

  const handleCellClickRight = (row: number, col: number) => {
    // TODO. Zmienić nie zaczęcie gry
    if (!board.value) return; // Gra się nie zaczęła

    const cell = board.value.board[row]?.[col];

    if (cell?.type !== CellType.REACTIVE) return;
    cell.state =
      cell.state === ReactiveCellState.MARKED
        ? ReactiveCellState.EMPTY
        : ReactiveCellState.MARKED;

    updateLighting();
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
