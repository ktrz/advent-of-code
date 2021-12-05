import { input } from './input2'
import { calculateBoard, calculateLinePoints, extractLine } from './utils'
import { Board, Point } from './types'
import { greaterThan } from '../../utils'
import { flip, inc, lensPath, over, uncurryN } from 'ramda'

const lines = input.trim().split('\n').map(extractLine)

const board = calculateBoard(lines)

const coordLens = (x: number, y: number) => lensPath([x, y])

const incCoord = flip(
  uncurryN<Board>(2, ({ x, y }: Point) => over(coordLens(x, y), inc)),
)

const points = lines
  .map(calculateLinePoints)
  .flat()
  // .reduce((b, { x, y }) => over(coordLens(x, y), inc, b), board)
  .reduce(incCoord, board)

const solution = points.flat().filter(greaterThan(1)).length

console.log(solution)
