import { CellType, ReactiveCellState } from "../Types/Game";
import { Cell, ReactiveCell } from "./Cell";
import { GenerateBoard } from "./GenerateBoard";
// import { DIFFICULTY } from "./Types/Game";

export class Board {
  static DEFAULT_SIZE = 7;
  rows: number = 0;
  cols: number = 0;
  board: Cell[][] = [];
  private solution: Cell[][] = [];

  private constructor(){
    this.rows = 0;
    this.cols = 0;
    this.board = [];
    this.solution = [];
  }

  static empty(rows = Board.DEFAULT_SIZE, cols = Board.DEFAULT_SIZE): Board {
      const board = new Board();
      board.rows = rows; board.cols = cols;
      const generatedBoard = new GenerateBoard(rows, cols);
      board.board = generatedBoard.board;
      board.solution = generatedBoard.solution;
      return board;
  }

    static random(rows = Board.DEFAULT_SIZE, cols = Board.DEFAULT_SIZE): Board {
      const board = new Board();
      board.rows = rows; board.cols = cols;
      const generatedBoard = new GenerateBoard(rows, cols, true);
      board.board = generatedBoard.board;
      board.solution = generatedBoard.solution;
      return board;
  }
}
