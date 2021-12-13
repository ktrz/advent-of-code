import { Board, FoldInstruction, Point } from './types'
import { isTruthy, pluck, toNumber } from '../../utils'
import { pipe, range } from 'ramda'

const parsePoints = (inputString: string) =>
  inputString
    .trim()
    .split('\n')
    .map((line) => line.split(',').map(toNumber))
    .map(([x, y]) => ({
      x,
      y,
    }))

const createEmptyBoard = (x: number, y: number) =>
  range(0, y + 1).map(() => range(0, x + 1).map(() => '.'))

const calculateMaxCoordinates = (points: Point[]) => ({
  points,
  maxX: Math.max(...points.map(pluck('x'))),
  maxY: Math.max(...points.map(pluck('y'))),
})
const calculateBoard = ({
  points,
  maxX,
  maxY,
}: {
  points: Point[]
  maxX: number
  maxY: number
}) => ({
  points,
  board: createEmptyBoard(maxX, maxY),
})

const fillBoard = ({ points, board }: { points: Point[]; board: Board }) =>
  points.reduce((board, { x, y }) => {
    board[y][x] = '#'
    return board
  }, board)

export const inputToBoard = pipe(
  parsePoints,
  calculateMaxCoordinates,
  calculateBoard,
  fillBoard,
)

export const getFoldInstructions = (foldInput: string): FoldInstruction[] =>
  foldInput
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

export { bendBoard } from './utils'
