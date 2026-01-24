export enum CellType {
    REACTIVE = 'REACTIVE',
    WALL = 'WALL'
}

export enum ReactiveCellState {
    EMPTY = 0,
    BULB = 1,
    MARKED = 2
}

export enum Difficulty {
    EASY = 'EASY',
    MEDIUM = 'MEDIUM',
    HARD = 'HARD'
}

// WallCellState: 0-4 Liczba żarówek. 5 - Czarne Pole bez podpowiedzi

export interface ICell {
    type: CellType,
    state: number
}