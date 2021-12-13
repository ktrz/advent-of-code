export interface Point {
  x: number
  y: number
}

export interface FoldInstruction {
  axis: 'x' | 'y'
  index: number
}

export type Board = string[][]
