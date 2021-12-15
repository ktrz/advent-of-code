import { curry, last, range } from 'ramda'
import * as colors from 'colors'
import { Point } from '../../utils'
import { GraphPoint } from './types'

export const getMatrixPositionFn = <T>() =>
  curry((matrix: T[][], pos: Point): T => matrix[pos.y][pos.x])

export function visualizeSolution(result: GraphPoint[][]) {
  const output = result.map((line) => line.map((p) => `${p.weight.toString()}`))
  const matrixPosition = getMatrixPositionFn<GraphPoint>()(result)
  const queue = [last(last(result)!)!]
  const visited = new Set(queue)
  while (queue.length) {
    const { point, from } = queue.pop()!
    const { x, y } = point
    output[y][x] = colors.bgRed.white(output[y][x])
    const toVisit = (from || [])
      .map((p) => matrixPosition(p))
      .filter((p) => !visited.has(p))
    toVisit.forEach((p) => visited.add(p))
    queue.unshift(...toVisit)
  }

  console.log(output.map((line) => line.join(',')).join('\n'))
}

export const getAdjacentPoints = curry(
  (matrix: any[][], { x, y }: Point): Point[] =>
    range(y - 1, y + 2)
      .map((possibleY) =>
        range(x - 1, x + 2).map((possibleX) => ({
          x: possibleX,
          y: possibleY,
        })),
      )
      .flat()
      .filter((p) => !(p.x === x && p.y === y))
      .filter((p) => inRange(0, matrix[0].length, p.x))
      .filter((p) => inRange(0, matrix.length, p.y))
      .filter((p) => p.x === x || p.y === y),
)

const inRange = (from: number, to: number, value: number): boolean =>
  value >= from && value < to

export const stringifyPoint = ({ x, y }: Point): string => [y, x].join(',')
