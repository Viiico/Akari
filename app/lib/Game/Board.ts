import { CellType, ReactiveCellState, BoardSize, Difficulty, GenerationModes } from "../Types/Game";
import { Cell, ReactiveCell } from "./Cell";
import { GenerateBoard } from "./GenerateBoard";

export class Board {
  static DEFAULT_SIZE = BoardSize.SMALL;
  rows: number = BoardSize.SMALL;
  cols: number = BoardSize.SMALL;
  board: Cell[][] = [];
  private solution: Cell[][] = [];

  constructor(rows = Board.DEFAULT_SIZE, cols = Board.DEFAULT_SIZE, difficulty = Difficulty.EASY, mode = GenerationModes.EMPTY) {
    this.rows = rows; this.cols = cols;
    const generatedBoard = new GenerateBoard(rows, cols, difficulty, mode);
    this.board = generatedBoard.board;
    this.solution = generatedBoard.solution;
  }
}
