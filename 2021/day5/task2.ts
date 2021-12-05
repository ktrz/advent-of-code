import { input } from './input2'
import { calculateBoard, extractLine } from './utils'
import { Line, Point } from './types'

const { abs, max, sign } = Math

const calculateLinePoints = ({ start, end }: Line): Point[] => {
  const deltaX = end.x - start.x
  const deltaXSign = sign(deltaX)
  const deltaY = end.y - start.y
  const deltaYSign = sign(deltaY)
  const delta = max(abs(deltaX), abs(deltaY))
  return Array.from({ length: delta + 1 }).map((_, index) => ({
    x: start.x + index * deltaXSign,
    y: start.y + index * deltaYSign,
  }))
}

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
