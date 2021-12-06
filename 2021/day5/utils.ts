import { Board, Line, Point } from './types'
import { toNumber } from '../../utils'
import { range } from 'ramda'

const { abs, max, sign } = Math

export const toPoint = (x: number, y: number): Point => ({ x, y })

export const extractLine = (lineStr: string): Line => {
  const [x1, y1, x2, y2] = lineStr
    .split(' -> ')
    .map((coordStr) => coordStr.split(','))
    .flat()
    .map(toNumber)

  return {
    start: toPoint(x1, y1),
    end: toPoint(x2, y2),
  }
}

export function calculateBoard(lines: Line[]): Board {
  const xMax = max(...lines.map(({ start, end }) => [start.x, end.x]).flat())
  const yMax = max(...lines.map(({ start, end }) => [start.y, end.y]).flat())

  return range(0, xMax).map(() => range(0, yMax).map(() => 0))
}

export const calculateLinePoints = ({ start, end }: Line): Point[] => {
  const deltaX = end.x - start.x
  const deltaXSign = sign(deltaX)
  const deltaY = end.y - start.y
  const deltaYSign = sign(deltaY)
  const delta = max(abs(deltaX), abs(deltaY))
  return range(0, delta).map((_, index) => ({
    x: start.x + index * deltaXSign,
    y: start.y + index * deltaYSign,
  }))
}
