import { input } from './input2'

interface Point {
  x: number
  y: number
}

interface Line {
  start: Point
  end: Point
}

const extractLine = (lineStr: string): Line => {
  const [startStr, endStr] = lineStr.split(' -> ')
  const [x1, y1] = startStr.split(',')
  const [x2, y2] = endStr.split(',')

  return {
    start: {
      x: +x1,
      y: +y1,
    },
    end: {
      x: +x2,
      y: +y2,
    },
  }
}

function sign(value: number) {
  if (value > 0) {
    return 1
  } else if (value < 0) {
    return -1
  }
  return 0
}

const calculateLinePoints = ({ start, end }: Line): Point[] => {
  const deltaX = end.x - start.x
  const deltaXSign = sign(deltaX)
  const deltaY = end.y - start.y
  const deltaYSign = sign(deltaY)
  const delta = Math.max(Math.abs(deltaX), Math.abs(deltaY))
  return Array.from({ length: delta + 1 }).map((_, index) => ({
    x: start.x + index * deltaXSign,
    y: start.y + index * deltaYSign,
  }))
}

const lines = input.trim().split('\n').map(extractLine)

const xMax = Math.max(...lines.map((line) => [line.start.x, line.end.x]).flat())
const yMax = Math.max(...lines.map((line) => [line.start.y, line.end.y]).flat())

const board = Array.from({ length: xMax + 1 }).map(() =>
  Array.from({ length: yMax + 1 }).map(() => 0),
)

const points = lines
  .map(calculateLinePoints)
  .flat()
  .reduce((b, { x, y }) => {
    b[y][x] += 1
    return b
  }, board)

const solution = points.flat().filter((x) => x > 1).length

console.log(solution)
