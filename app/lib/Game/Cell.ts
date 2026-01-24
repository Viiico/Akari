import { CellType, ReactiveCellState, type ICell } from "../Types/Game"; 
export abstract class Cell implements ICell {
    public type: CellType;
    public state: number;

    constructor(type: CellType, state: number) {
        this.type = type;
        this.state = state;
    }
}

export class WallCell extends Cell {
    constructor(state: number) {
        super(CellType.WALL, state);
    }
}

export class ReactiveCell extends Cell {
    isLit: boolean = false;
    constructor(state: ReactiveCellState, isLit = false) {
        super(CellType.REACTIVE, state);
        this.isLit = isLit;
    }
}