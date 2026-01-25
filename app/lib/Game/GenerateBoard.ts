import { Cell, WallCell, ReactiveCell } from "./Cell";


export class GenerateBoard {
  public board: Cell[][] = [];
  public solution: Cell[][] = [];
  private cellsToFill: number[] = [];

    public constructor(rows: number, cols: number, isRandom: boolean = false) {
      this.board = new Array();
      this.solution = new Array();
      for (let i = 0; i < rows; i++) {
        const boardRow = new Array();
        const solutionRow = new Array();

        for(let j = 0; j < cols; j++){
          let newCell = null;
          if(isRandom){
            newCell = getRandomInt(2) === 0 ? new ReactiveCell(getRandomInt(4)) : new WallCell(getRandomInt(6));
          }else{
            newCell = new ReactiveCell(0);
          }
            boardRow.push(newCell);
            solutionRow.push(newCell);
            this.cellsToFill.push(i * cols + j);
        }

        this.board.push(boardRow);
        this.solution.push(solutionRow);
      }
    }
}

function getRandomInt(max: number): number{
    return Math.floor(Math.random() * max);
}