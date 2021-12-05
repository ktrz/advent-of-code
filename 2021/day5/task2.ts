import { input } from './input2'
import { calculateBoard, calculateLinePoints, extractLine } from './utils'

const lines = input.trim().split('\n').map(extractLine)

const board = calculateBoard(lines)

const points = lines
  .map(calculateLinePoints)
  .flat()
  .reduce((b, { x, y }) => {
    b[y][x] += 1
    return b
  }, board)

const solution = points.flat().filter((x) => x > 1).length

console.log(solution)
