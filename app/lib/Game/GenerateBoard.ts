import { Cell, WallCell, ReactiveCell } from "./Cell";
import {
  CellType,
  ReactiveCellState,
  BoardSize,
  Difficulty,
  GenerationModes,
} from "../Types/Game";

export class GenerateBoard {
  public board: Cell[][] = [];
  public solution: Cell[][] = [];
  private cellsToFill: number[] = [];

  public constructor(
    rows: number,
    cols: number,
    difficulty: Difficulty,
    mode: GenerationModes,
  ) {
    this.board = new Array(rows);
    this.solution = new Array(rows);

    if (mode === GenerationModes.EMPTY || mode === GenerationModes.RANDOM) {
      for (let i = 0; i < rows; i++) {
        const boardRow = new Array(cols);
        const solutionRow = new Array(cols);
        for (let j = 0; j < cols; j++) {
          let newCell = null;
          if (mode === GenerationModes.RANDOM) {
            newCell =
              getRandomInt(2) === 0
                ? new ReactiveCell(getRandomInt(4))
                : new WallCell(getRandomInt(6));
          } else {
            newCell = new ReactiveCell(0);
          }
          boardRow[j] = newCell;
          solutionRow[j] = newCell;
        }
        this.board[i] = boardRow;
        this.solution[i] = solutionRow;
      }
      return;
    }
    
    this.generateValidBoard(rows, cols, difficulty);
  }

  private generateValidBoard(
    rows: number,
    cols: number,
    difficulty: Difficulty,
  ) {
    this.cellsToFill = [];

    for (let i = 0; i < rows; i++) {
      this.solution[i] = new Array(cols);
      this.board[i] = new Array(cols);
      for (let j = 0; j < cols; j++) {
        this.solution[i]![j] = new ReactiveCell(0);
        this.board[i]![j] = new ReactiveCell(0);
        this.cellsToFill.push(i * cols + j);
      }
    }

    while(this.cellsToFill.length > 0){
      const randomIndex = getRandomInt(this.cellsToFill.length);
      
      const cellIndex = this.cellsToFill[randomIndex]!;
      this.cellsToFill.splice(randomIndex, 1);
      const cellRow = Math.floor(cellIndex / cols);
      const cellCol = cellIndex % cols;
      this.genValidWall(cellRow, cellCol, this.solution, difficulty);
    }

    for(let i=0; i<rows; i++){
      for(let j=0; j<cols; j++){
        if(this.solution[i]![j]?.type === CellType.REACTIVE){
          this.board[i]![j] = new ReactiveCell(0);
        }else{
          this.board[i]![j] = new WallCell(this.solution[i]![j]!.state);
        }
      }
    }
  }

  private genValidWall(
    cellRow: number,
    cellCol: number,
    board: Cell[][],
    difficulty: Difficulty,
  ) {
    const freeSpots: number[] = this.findFreeSpots(cellRow, cellCol, board);

    if (freeSpots.length === 0) {
      board[cellRow]![cellCol] = new WallCell(5);
      return;
    }

    let wallState: number = getRandomInt(freeSpots.length + 2) - 1; // +2 to include 0 and 5
    if (wallState === -1) {
      switch (difficulty) {
        case Difficulty.EASY:
          wallState = 0;
          break;
        case Difficulty.MEDIUM:
          wallState = 2;
          break;
        case Difficulty.HARD:
          wallState = 1;
          break;
      }
    }
    board[cellRow]![cellCol] = new WallCell(wallState);

    for (let i = 0; i < wallState; i++) {
      const randomLocationIndex = getRandomInt(freeSpots.length);
      const randomLocation = freeSpots[randomLocationIndex]!;
      this.cellsToFill.splice(this.cellsToFill.indexOf(randomLocation), 1);
      freeSpots.splice(randomLocationIndex, 1);
      const bulbRow = Math.floor(randomLocation / board[0]!.length);
      const bulbCol = randomLocation % board[0]!.length;
      board[bulbRow]![bulbCol] = new ReactiveCell(ReactiveCellState.BULB);
      board[bulbRow]![bulbCol].isLit = true;
      this.propagateLight(bulbRow, bulbCol, board);
    }
  }

  private findFreeSpots(
    spotRow: number,
    spotCol: number,
    board: Cell[][],
  ): number[] {
    const freeSpots: number[] = [];
    const directions = [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ];

    for (const innerDir of directions) {
      const wallRow = spotRow + innerDir[0]!;
      if (wallRow < 0 || wallRow >= board.length) continue; // Out of bounds
      const wallCol = spotCol + innerDir[1]!;
      if (wallCol < 0 || wallCol >= board[wallRow]!.length) continue; // Out of bounds
      if (board[wallRow]![wallCol]!.type === CellType.WALL) continue; // Pole zajęte przez ścianę, nie postawimy światła
      if (board[wallRow]![wallCol]!.state !== ReactiveCellState.EMPTY) continue; // Pole zajęte przez światło, lub już oświetlone, nie postawimy żarówki

      let canBulbBePlaced: boolean = true;
      for (const outerDir of directions) {
        // Sprawdzamy pola wokół żarówki, aby nie postawić jej w niedozwolnym miejscu
        const bulbRow = wallRow + outerDir[0]!;
        if (bulbRow < 0 || bulbRow >= board.length) continue; // Out of bounds
        const bulbCol = wallCol + outerDir[1]!;
        if (bulbCol < 0 || bulbCol >= board[bulbRow]!.length) continue; // Out of bounds
        if (bulbRow === spotRow && bulbCol === spotCol) continue; // Nie uznajemy pola na którym postawimy ścianę
        const bulbCell: Cell = board[bulbRow]![bulbCol]!;

        if (bulbCell.type === CellType.WALL || bulbCell.isLit) {
          // Pole obok jest ścianą, która z założenia ma spełnione warunki
          canBulbBePlaced = false; // Usuwamy pozycję z listy
          const bulbIndex = this.cellsToFill.indexOf(
            bulbRow * board[0]!.length + bulbCol,
          );
          if (bulbIndex === -1) continue; // Już usunięta
          this.cellsToFill.splice(bulbIndex, 1);
        }
      }

      if (!canBulbBePlaced) continue;
      freeSpots.push(wallRow * board[0]!.length + wallCol);
    }

    return freeSpots;
  }

  propagateLight(bulbRow: number, bulbCol: number, board: Cell[][]) {
    const directions = [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ];

    for(const dir of directions){
      let lightRow = bulbRow + dir[0]!;
      let lightCol = bulbCol + dir[1]!;
      while(lightRow >= 0 && lightRow < board.length && lightCol >= 0 && lightCol < board[lightRow]!.length){
        const cell: ReactiveCell = board[lightRow]![lightCol]! as ReactiveCell;
        if(cell.type !== CellType.REACTIVE) break; // Hit wall
        if(!cell.isLit) this.cellsToFill.splice(this.cellsToFill.indexOf(lightRow * board[0]!.length + lightCol), 1);
        cell.isLit = true;
        lightRow += dir[0]!;
        lightCol += dir[1]!;
      }
    }
  }
}

function getRandomInt(max: number): number {
  // if (!Number.isFinite(max) || max <= 0) return 0;
  return Math.floor(Math.random() * max);
}

function weightedRandom(weights: number[]): number {
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
  let random = Math.random() * totalWeight;
  
  for (let i = 0; i < weights.length; i++) {
    if (random < weights[i]!) {
      return i;
    }
    random -= weights[i]!;
  }
  
  return weights.length - 1;
}
