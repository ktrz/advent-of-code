import { Board, FoldInstruction, Point } from './types'
import { isTruthy, pluck, toNumber } from '../../utils'
import { range } from 'ramda'

export const inputToBoard = (inputString: string) => {
  const points: Point[] = inputString
    .trim()
    .split('\n')
    .map((line) => line.split(',').map(toNumber))
    .map(([x, y]) => ({
      x,
      y,
    }))

  const maxX = Math.max(...points.map(pluck('x')))
  const maxY = Math.max(...points.map(pluck('y')))

  const board = range(0, maxY + 1).map(() => range(0, maxX + 1).map(() => '.'))

  points.forEach(({ x, y }) => {
    board[y][x] = '#'
  })

  return board
}

export function getFoldInstructions(foldInput: string): FoldInstruction[] {
  return foldInput
    .trim()
    .split('\n')
    .map((line) => line.match(/fold along (?<axis>\w)=(?<index>\d+)/))
    .filter(isTruthy)
    .map(({ groups }) => groups)
    .filter(isTruthy)
    .map((groups) => ({
      axis: groups.axis as FoldInstruction['axis'],
      index: +groups.index,
    }))
}

export const bendBoard = ({ axis, index }: FoldInstruction, board: Board) => {
  const isXFold = axis === 'x'
  const [xStart, yStart] = isXFold ? [index + 1, 0] : [0, index + 1]

  const foldCoordinates = isXFold
    ? ([x, y]: [number, number]) => [2 * index - x, y]
    : ([x, y]: [number, number]) => [x, 2 * index - y]

  const clampBoard = isXFold
    ? (board: Board) => board.map((line) => line.slice(0, index))
    : (board: Board) => board.slice(0, index)

  for (let y = yStart; y < board.length; y++) {
    for (let x = xStart; x < board[0].length; x++) {
      const [nextXIndex, nextYIndex] = foldCoordinates([x, y])
      if (board[y][x] === '#') {
        board[nextYIndex][nextXIndex] = '#'
      }
    }
  }
  return clampBoard(board)
}
