import {
  CellType,
  ReactiveCellState,
  BoardSize,
  Difficulty,
  GenerationModes,
} from "../Types/Game";
import { Cell, ReactiveCell } from "./Cell";
import { GenerateBoard } from "./GenerateBoard";

export class Board {
  static DEFAULT_SIZE = BoardSize.SMALL;
  rows: number = BoardSize.SMALL;
  cols: number = BoardSize.SMALL;
  board: Cell[][] = [];
  private solution: Cell[][] = [];

  constructor(
    rows = Board.DEFAULT_SIZE,
    cols = Board.DEFAULT_SIZE,
    difficulty = Difficulty.EASY,
    mode = GenerationModes.EMPTY,
  ) {
    this.rows = rows;
    this.cols = cols;
    const generatedBoard = new GenerateBoard(rows, cols, difficulty, mode);
    this.board = generatedBoard.board;
    this.solution = generatedBoard.solution;
  }

  isSolved(): boolean {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        const boardCell = this.board[i]![j]!;
        const solutionCell = this.solution[i]![j]!;
        if (boardCell.type !== CellType.REACTIVE) continue;
        if(boardCell.state === ReactiveCellState.MARKED && solutionCell.state === ReactiveCellState.EMPTY) continue;
        if (boardCell.state !== solutionCell.state) return false;
      }
    }
    return true;
  }
}
