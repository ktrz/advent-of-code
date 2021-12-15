import { input } from './input2'
import { Point, textToMatrix, toNumber } from '../../utils'
import { applyTo, curry, last, range } from 'ramda'
import Heap from 'heap-js'
import { getAdjacentPoints, getMatrixPositionFn, stringifyPoint } from './utils'
import { GraphPoint } from './types'

function dijkstra(matrix: GraphPoint[][], { x, y }: Point = { x: 0, y: 0 }) {
  matrix[y][x].path.cost = 0

  const matrixPosition = getMatrixPositionFn<GraphPoint>()(matrix)
  const getAdjacentMatrixPoints = getAdjacentPoints(matrix)

  const visited = new Set<string>()
  const heap = new Heap(
    (a: GraphPoint, b: GraphPoint) => a.path.cost - b.path.cost,
  )

  heap.push(matrix[0][0])
  while (heap.length) {
    const u = heap.pop()!
    visited.add(stringifyPoint(u.point))
    getAdjacentMatrixPoints(u.point)
      .filter((p) => !visited.has(stringifyPoint(p)))
      .forEach((v) => {
        const matPosV = matrixPosition(v)
        const alt = u.path.cost + matPosV.weight
        if (alt <= matPosV.path.cost) {
          matPosV.path.cost = alt
          matPosV.path.from = u.point
          matPosV.from = matPosV.from || []
          matPosV.from.push(u.point)
        }
        heap.push(matPosV)
        visited.add(stringifyPoint(v))
      })
  }
  return matrix
}

const solution = (inputValue: string) => {
  const matrix = textToMatrix(
    inputValue,
    (v, point): GraphPoint => ({
      weight: toNumber(v),
      point,
      path: {
        cost: Infinity,
        from: null,
      },
    }),
  )

  return dijkstra(repeatMatrix(matrix, 5))
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
        path: {
          from: null,
          cost: Infinity,
        },
      })),
    )
}

{
  const resMatrix = solution(input)
  // visualizeSolution(resMatrix)
  const resLine = last(last(resMatrix)!)!
  console.log(resLine.path.cost) // ?
}
