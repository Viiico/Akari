export enum CellType {
  REACTIVE = "REACTIVE",
  WALL = "WALL",
}

export enum ReactiveCellState {
  EMPTY = 0,
  BULB = 1,
  MARKED = 2,
}

export enum Difficulty {
  EASY = "EASY",
  MEDIUM = "MEDIUM",
  HARD = "HARD",
}

export enum BoardSize {
  SMALL = 7,
  MEDIUM = 10,
  LARGE = 14,
}

export enum GenerationModes {
  RANDOM = "RANDOM",
  EMPTY = "EMPTY",
  VALID = "VALID",
}

export enum GameStates {
  NOT_STARTED = "NOT_STARTED",
  PLAYING = "PLAYING",
  WON = "WON",
}

// WallCellState: 0-4 Liczba żarówek. 5 - Czarne Pole bez podpowiedzi

export interface ICell {
  type: CellType;
  state: number;
}
