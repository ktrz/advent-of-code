import { input } from './input2'
import { calculateBoard, extractLine } from './utils'
import { Line, Point } from './types'
import { greaterThan } from '../../utils'

const { abs, sign } = Math

const calculateLinePoints = ({ start, end }: Line): Point[] => {
  if (start.x === end.x) {
    const deltaY = end.y - start.y
    const deltaSign = sign(deltaY)
    return Array.from({ length: abs(deltaY) + 1 })
      .map((_, index) => start.y + index * deltaSign)
      .map((y) => ({
        x: start.x,
        y,
      }))
  } else if (start.y === end.y) {
    const deltaX = end.x - start.x
    const deltaSign = sign(deltaX)
    return Array.from({ length: abs(deltaX) + 1 })
      .map((_, index) => start.x + index * deltaSign)
      .map((x) => ({
        x,
        y: start.y,
      }))
  }
  return []
}

const lines = input.trim().split('\n').map(extractLine)
const board = calculateBoard(lines)

const points = lines
  .filter(({ start, end }) => start.x === end.x || start.y === end.y)
  .map(calculateLinePoints)
  .flat()
  .reduce((b, { x, y }) => {
    b[y][x] += 1
    return b
  }, board)

const solution = points.flat().filter(greaterThan(1)).length

console.log(solution)
