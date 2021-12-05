import { Line } from './types'

const { max } = Math

export const extractLine = (lineStr: string): Line => {
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

export function calculateBoard(lines: Line[]) {
  const xMax = max(...lines.map((line) => [line.start.x, line.end.x]).flat())
  const yMax = max(...lines.map((line) => [line.start.y, line.end.y]).flat())

  return Array.from({ length: xMax + 1 }).map(() =>
    Array.from({ length: yMax + 1 }).map(() => 0),
  )
}
