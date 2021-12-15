import { GraphPoint } from './types'
import { Point } from '../../utils'
import Heap from 'heap-js'
import { getAdjacentPoints, getMatrixPositionFn, stringifyPoint } from './utils'

export function dijkstra(
  matrix: GraphPoint[][],
  { x, y }: Point = { x: 0, y: 0 },
) {
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
