import { ref, reactive, computed, onMounted } from "vue";
import { Board } from "~/lib/Game/Board";
import { GameStates } from "~/lib/Types/Game";
import {
  CellType,
  ReactiveCellState,
  Difficulty,
  GenerationModes,
} from "~/lib/Types/Game";
import { WallCell, ReactiveCell } from "~/lib/Game/Cell";

export function useGameBoard() {
  const board = ref<Board>(new Board());
  const gameState = ref<GameStates>(GameStates.NOT_STARTED);
  const stateRows = ref(0);
  const stateCols = ref(0);
  const isSolved = ref(false);
  const movesCount = ref(0);
  const timer = ref(0);
  const timerInterval = ref<NodeJS.Timeout | null>(null);

  const startTimer = () => {
    if (timerInterval.value) clearInterval(timerInterval.value);
    timer.value = 0;
    gameState.value = GameStates.PLAYING;
    timerInterval.value = setInterval(() => {
      timer.value += 10;
    }, 10);
  };

  const stopTimer = () => {
    if (timerInterval.value) {
      clearInterval(timerInterval.value);
      timerInterval.value = null;
    }
    gameState.value = GameStates.NOT_STARTED;
  };

  const resetTimer = () => {
    stopTimer();
    timer.value = 0;
  };

  onMounted(() => {
    stopTimer();
  });

  const initializeBoard = (
    rows: number = Board.DEFAULT_SIZE,
    cols: number = Board.DEFAULT_SIZE,
    difficulty: Difficulty = Difficulty.EASY,
    mode: GenerationModes = GenerationModes.VALID,
  ) => {
    resetTimer();
    board.value = new Board(rows, cols, difficulty, mode);
    stateRows.value = board.value.rows;
    stateCols.value = board.value.cols;
    isSolved.value = false;
    gameState.value = GameStates.NOT_STARTED;
    movesCount.value = 0;
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

  const updateLighting = () => {
    if (!board.value) return;

    // Reset all lights
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

    // Propagate from existing bulbs
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

  const checkIfWon = () => {
    if (!board.value) return;
    isSolved.value = board.value.isSolved();
    if (isSolved.value) {
      stopTimer();
      gameState.value = GameStates.WON;
    }
    return isSolved.value;
  };

  const calculatedScore = computed(() => {
    if (!board.value || gameState.value !== GameStates.WON) return 0;

    let bulbCount = 0;
    for (let i = 0; i < stateRows.value; i++) {
      for (let j = 0; j < stateCols.value; j++) {
        const cell = board.value.board[i]![j]!;
        if (
          cell.type === CellType.REACTIVE &&
          cell.state === ReactiveCellState.BULB
        ) {
          bulbCount++;
        }
      }
    }

    const baseScore = bulbCount * 100;
    const timeBonus = Math.max(0, 1000 - timer.value) * 10;
    const idealMoves = bulbCount;
    const movesBonus = Math.max(0, idealMoves * 50 - movesCount.value * 10);
    const boardArea = stateRows.value * stateCols.value;
    const sizeMultiplier = 1 + boardArea / 100;

    let finalScore = Math.floor(
      (baseScore + timeBonus + movesBonus) * sizeMultiplier,
    );
    return Math.max(100, finalScore);
  });

  const handleCellClickLeft = (row: number, col: number) => {
    if (!board.value || gameState.value === GameStates.WON) return;

    if (gameState.value === GameStates.NOT_STARTED) {
      startTimer();
      gameState.value = GameStates.PLAYING;
    }

    const cell = board.value.board[row]?.[col]!;
    if (cell.type !== CellType.REACTIVE) return;
    cell.state =
      cell.state === ReactiveCellState.BULB
        ? ReactiveCellState.EMPTY
        : ReactiveCellState.BULB;
    movesCount.value++;
    updateLighting();
    checkIfWon();
  };

  const handleCellClickRight = (row: number, col: number) => {
    if (!board.value && gameState.value === GameStates.PLAYING) return;

    if (gameState.value === GameStates.NOT_STARTED) {
      startTimer();
      gameState.value = GameStates.PLAYING;
    }

    const cell = board.value.board[row]?.[col];
    if (cell?.type !== CellType.REACTIVE) return;
    cell.state =
      cell.state === ReactiveCellState.MARKED
        ? ReactiveCellState.EMPTY
        : ReactiveCellState.MARKED;

    movesCount.value++;
    updateLighting();
    checkIfWon();
  };

  // --- BoardCreator ---

  const clearCell = (row: number, col: number) => {
    if (!board.value) return;
    board.value.board[row]![col] = new ReactiveCell(ReactiveCellState.EMPTY);
    updateLighting();
  };

  const setWall = (row: number, col: number, wallState: number) => {
    if (!board.value) return;
    board.value.board[row]![col] = new WallCell(wallState);
    updateLighting();
  };

  const findBlockingBulb = (
    targetRow: number,
    targetCol: number,
  ): { r: number; c: number } | null => {
    if (!board.value) return null;
    const directions = [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ];

    for (const dir of directions) {
      let r = targetRow + dir[0]!;
      let c = targetCol + dir[1]!;

      while (r >= 0 && r < stateRows.value && c >= 0 && c < stateCols.value) {
        const cell = board.value.board[r]![c]!;
        if (cell.type === CellType.WALL) break;
        if (
          cell.type === CellType.REACTIVE &&
          cell.state === ReactiveCellState.BULB
        ) {
          return { r, c };
        }
        r += dir[0]!;
        c += dir[1]!;
      }
    }
    return null;
  };

  const tryPlaceBulb = (
    row: number,
    col: number,
  ): { success: boolean; blocker?: { r: number; c: number } } => {
    if (!board.value) return { success: false };

    const cell = board.value.board[row]![col]!;

    if (cell.type === CellType.WALL) return { success: false };

    if (
      cell.type === CellType.REACTIVE &&
      cell.isLit &&
      cell.state !== ReactiveCellState.BULB
    ) {
      const blocker = findBlockingBulb(row, col);
      return { success: false, blocker: blocker || undefined };
    }

    board.value.board[row]![col] = new ReactiveCell(ReactiveCellState.BULB);
    updateLighting();
    return { success: true };
  };

  const isCreatorBoardValid = computed(() => {
    if (!board.value) return false;

    // Check reactive cells
    for (let i = 0; i < stateRows.value; i++) {
      for (let j = 0; j < stateCols.value; j++) {
        const cell = board.value.board[i]![j]!;
        if (cell.type === CellType.REACTIVE) {
          if (cell.state !== ReactiveCellState.BULB && !cell.isLit) {
            return false;
          }
          if (cell.state === ReactiveCellState.BULB) {
            if (findBlockingBulb(i, j)) return false;
          }
        }
      }
    }

    // Check walls
    return validateWalls();
  });

  const validateWalls = (): boolean => {
    if (!board.value) return false;

    for (let i = 0; i < stateRows.value; i++) {
      for (let j = 0; j < stateCols.value; j++) {
        const cell = board.value.board[i]![j]!;
        if (cell.type === CellType.WALL) {
          const wallState = cell.state;
          if (wallState >= 0 && wallState <= 4) {
            // Only validate numbered walls (0-4)
            const adjacentBulbs = countAdjacentBulbs(i, j);
            if (adjacentBulbs !== wallState) {
              return false;
            }
          }
        }
      }
    }
    return true;
  };

  const countAdjacentBulbs = (row: number, col: number): number => {
    if (!board.value) return 0;

    let count = 0;
    const directions = [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ];

    for (const [dr, dc] of directions) {
      const newRow = row + dr!;
      const newCol = col + dc!;

      if (
        newRow >= 0 &&
        newRow < stateRows.value &&
        newCol >= 0 &&
        newCol < stateCols.value
      ) {
        const cell = board.value.board[newRow]![newCol]!;
        if (
          cell.type === CellType.REACTIVE &&
          cell.state === ReactiveCellState.BULB
        ) {
          count++;
        }
      }
    }

    return count;
  };

  const formattedTime = computed(() => {
    const minutes = Math.floor(timer.value / 60000);
    const seconds = Math.floor((timer.value % 60000) / 1000);
    const milliseconds = timer.value % 1000;

    return (
      `${minutes.toString().padStart(2, "0")}:` +
      `${seconds.toString().padStart(2, "0")}.` +
      `${milliseconds.toString().padStart(3, "0")}`
    );
  });

  return {
    board,
    gameState,
    movesCount,
    timer,
    rows: computed(() => board.value?.rows || 0),
    cols: computed(() => board.value?.cols || 0),
    boardGrid: computed(() => board.value?.board || []),
    formattedTime,
    calculatedScore,
    initializeBoard,
    handleCellClickLeft,
    handleCellClickRight,
    clearCell,
    setWall,
    tryPlaceBulb,
    validateWalls,
    countAdjacentBulbs,
    isCreatorBoardValid,
  };
}
