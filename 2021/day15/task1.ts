import { input } from './input2'
import {
  isTruthy,
  pluck,
  Point,
  sum,
  textToMatrix,
  toNumber,
} from '../../utils'
import { curry, memoizeWith, range } from 'ramda'

const getMatrixPositionFn = <T>() =>
  curry((matrix: T[][], pos: Point): T => matrix[pos.y][pos.x])

const pathCost = memoizeWith(
  (path: GraphPoint[]) => (path || []).map((point) => point.weight).join(','),
  (path: GraphPoint[]): number => path.map(pluck('weight')).reduce(sum, 0),
)

interface GraphPath {
  from: Point | null
  costs: GraphPoint[]
}

interface GraphPoint {
  point: Point
  weight: number
  path?: GraphPath
}

const getAdjacentPoints = curry((matrix: any[][], { x, y }: Point): Point[] =>
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

function bfs(matrix: GraphPoint[][], pos: Point = { x: 0, y: 0 }) {
  const queue: Point[] = []
  const yEndIndex = matrix.length - 1
  const xEndIndex = matrix[0].length - 1

  const matrixPosition = getMatrixPositionFn<GraphPoint>()(matrix)
  const getAdjacentMatrixPoints = getAdjacentPoints(matrix)
  const getCurrentMatrixPath = getCurrentPath(matrix)

  matrixPosition(pos).path = {
    from: null,
    costs: [],
  }
  queue.unshift(pos)

  while (queue.length) {
    const { x, y } = queue.pop()!
    if (x === xEndIndex && y === yEndIndex) {
      return matrix
    }

    const possibleExits = getAdjacentMatrixPoints({ x, y }).filter(
      (p) => !matrixPosition(p).path,
    )
    possibleExits.forEach((p) => {
      matrixPosition(p).path = getCurrentMatrixPath(p)
    })
    queue.unshift(...possibleExits)
  }
  return matrix
}

const getCurrentPath =
  (matrix: GraphPoint[][]) =>
  ({ x, y }: Point): GraphPath => {
    const matrixPosition = getMatrixPositionFn<GraphPoint>()(matrix)
    const getAdjacentMatrixPoints = getAdjacentPoints(matrix)

    const possibleEntries = getAdjacentMatrixPoints({ x, y })

    const minEntryCost = Math.min(
      ...possibleEntries
        .map((p) => matrixPosition(p).path)
        .filter(isTruthy)
        .map((path) => pathCost(path.costs)),
    )

    const entry = possibleEntries.find(
      (p) => pathCost(matrixPosition(p).path?.costs || []) === minEntryCost,
    )!

    return {
      from: entry,
      costs: [...(matrixPosition(entry).path?.costs || []), matrixPosition({x,y})]
    }
  }

const solution = (inputValue: string) => {
  const matrix = textToMatrix(
    inputValue,
    (v, point): GraphPoint => ({
      weight: toNumber(v),
      point,
    }),
  )

  const resMatrix = bfs(matrix)
  const resLine = resMatrix[resMatrix.length - 1]
  const tmp = resLine[resLine.length - 1]
  tmp.path?.costs?.map((p) => p.point)
  return pathCost(tmp.path?.costs!)
}

console.log(solution(input))
