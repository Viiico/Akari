import { ref, reactive } from "vue";
import { Board } from "~/lib/Game/Board";
import type { ReactiveCell } from "~/lib/Game/Cell";
import { GameStates } from "~/lib/Types/Game";
import {
  CellType,
  ReactiveCellState,
  Difficulty,
  GenerationModes,
} from "~/lib/Types/Game";

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
  ) => {
    resetTimer();
    board.value = new Board(rows, cols, difficulty, GenerationModes.VALID);
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
  
  // Liczba żarówek w rozwiązaniu
  let bulbCount = 0;
  for (let i = 0; i < stateRows.value; i++) {
    for (let j = 0; j < stateCols.value; j++) {
      const cell = board.value.board[i]![j]!;
      if (cell.type === CellType.REACTIVE && cell.state === ReactiveCellState.BULB) {
        bulbCount++;
      }
    }
  }
  
  const baseScore = bulbCount * 100;
  
  // Modyfikator za szybkość: im szybciej, tym lepiej. Możemy użyć odwrotności czasu.
  const timeBonus = Math.max(0, 1000 - timer.value) * 10;
  
  // Modyfikator za efektywność ruchów: im mniej ruchów, tym lepiej.
  // Idealna liczba ruchów to liczba żarówek (każda żarówka to jeden ruch).
  const idealMoves = bulbCount;
  const movesBonus = Math.max(0, (idealMoves * 50) - (movesCount.value * 10));
  
  // Modyfikator za rozmiar planszy: im większa plansza, tym większy mnożnik.
  const boardArea = stateRows.value * stateCols.value;
  const sizeMultiplier = 1 + (boardArea / 100);
  
  let finalScore = Math.floor((baseScore + timeBonus + movesBonus) * sizeMultiplier);
  finalScore = Math.floor(finalScore);
  return Math.max(100, finalScore);
});

  const handleCellClickLeft = (row: number, col: number) => {
    if (!board.value || gameState.value === GameStates.WON) return; // Gra nie jest w trakcie

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
    if (!board.value && gameState.value === GameStates.PLAYING) return; // Gra się nie zaczęła

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
    // State
    board,
    gameState,
    movesCount,
    timer,

    // Computed
    rows: computed(() => board.value?.rows || 0),
    cols: computed(() => board.value?.cols || 0),
    boardGrid: computed(() => board.value?.board || []),
    formattedTime,
    calculatedScore,

    // Actions
    initializeBoard,
    handleCellClickLeft,
    handleCellClickRight,
  };
}
