import { input } from './input1'
import {
  isTruthy,
  pluck,
  Point,
  sum,
  textToMatrix,
  toNumber,
} from '../../utils'
import { applyTo, curry, last, memoizeWith, range } from 'ramda'
import * as colors from 'colors'

const getMatrixPositionFn = <T>() =>
  curry((matrix: T[][], pos: Point): T => matrix[pos.y][pos.x])

const pathCost = memoizeWith(
  (path: GraphPoint[]) => (path || []).map((point) => point.weight).join(','),
  (path: GraphPoint[]): number =>
    (path || []).map(pluck('weight')).reduce(sum, 0),
)

interface GraphPath {
  from: Point | null
  costs: GraphPoint[]
}

interface GraphPoint {
  point: Point
  weight: number
  path?: GraphPath
  from?: Point[]
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

  let i = 0
  while (queue.length) {
    i++
    const { x, y } = queue.pop()!
    if (x === xEndIndex && y === yEndIndex) {
      i // ?
      matrix.length // ?
      return matrix
    }

    const possibleExits = getAdjacentMatrixPoints({ x, y }).filter(
      (p) => !matrixPosition(p).path,
    )
    possibleExits.forEach((p) => {
      const { path, from } = getCurrentMatrixPath(p)
      matrixPosition(p).path = path
      matrixPosition(p).from = from
    })
    queue.unshift(...possibleExits.reverse())
  }

  i // ?

  return matrix
}

const getCurrentPath =
  (matrix: GraphPoint[][]) =>
  ({ x, y }: Point): { path: GraphPath; from: Point[] } => {
    const matrixPosition = getMatrixPositionFn<GraphPoint>()(matrix)
    const getAdjacentMatrixPoints = getAdjacentPoints(matrix)

    const possibleEntries = getAdjacentMatrixPoints({ x, y })

    const possibleEntriesCosts = possibleEntries
      .map((p) => matrixPosition(p).path)
      .filter(isTruthy)
      .map((path) => pathCost(path.costs))

    possibleEntriesCosts // ?
    const minEntryCost = Math.min(...possibleEntriesCosts)

    minEntryCost // ?
    const entries = possibleEntries.filter((p) => {
      const matrixPos = matrixPosition(p)
      return (
        matrixPos.path?.costs &&
        pathCost(matrixPos.path?.costs || []) === minEntryCost
      )
    })
    let entry = entries[0]
    return {
      path: {
        from: entry,
        costs: [
          ...(matrixPosition(entry).path?.costs || []),
          matrixPosition({ x, y }),
        ],
      },
      from: entries,
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

  return bfs(repeatMatrix(matrix, 5))
}

const increaseRisk = curry(
  (matrix: GraphPoint[][], inc: number): GraphPoint[][] =>
    matrix.map((line) =>
      line.map((point) => ({
        ...point,
        weight: applyTo(point.weight + inc, (v) => (v > 9 ? v - 9 : v)),
      })),
    ),
)

function repeatMatrix(matrix: GraphPoint[][], times = 5): GraphPoint[][] {
  const extendedLine = range(0, times)
    .map(() => matrix)
    .map(increaseRisk)
    .reduce((r, m) => r.map((rLine, rY) => [...rLine, ...m[rY]]))

  return range(0, times)
    .map(() => extendedLine)
    .map(increaseRisk)
    .reduce((r, m) => [...r, ...m])
    .map((line, y) =>
      line.map((point, x) => ({
        ...point,
        point: { x, y },
      })),
    )
}

function visualizeSolution(result: GraphPoint[][]) {
  const output = result.map((line) => line.map((p) => p.weight.toString()))
  const resLine = last(result)!
  const tmp = last(resLine)!
  const matrixPosition = getMatrixPositionFn<GraphPoint>()(result)
  const queue = [tmp]
  const visited = new Set(queue)
  while (queue.length) {
    const curr = queue.pop()!

    const { x, y } = curr.point
    output[y][x] = colors.bgRed.white(output[y][x])

    const toVisit = (curr.from || [])
      .map((p) => matrixPosition(p))
      .filter((p) => !visited.has(p))
    toVisit.forEach((p) => visited.add(p))
    queue.unshift(...toVisit)
  }

  console.log(output.map((line) => line.join(',')).join('\n'))
}

{
  const resMatrix = solution(input)

  visualizeSolution(resMatrix)
  const resLine = last(resMatrix)!
  const tmp = last(resLine)!
  console.log(pathCost(tmp.path?.costs!))
}
