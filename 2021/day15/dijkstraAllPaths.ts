import { GraphPoint } from './types'
import { Point } from '../../utils'
import { getAdjacentPoints, getMatrixPositionFn } from './utils'
import { dijkstra } from './dijkstra'

export function dijkstraAllPaths(
  matrix: GraphPoint[][],
  start: Point = { x: 0, y: 0 },
) {
  const { x, y } = start

  const matrixPosition = getMatrixPositionFn<GraphPoint>()(matrix)
  const getAdjacentMatrixPoints = getAdjacentPoints(matrix)

  matrix = dijkstra(matrix, start)

  matrix = matrix.map((row, mY) =>
    row.map((p, mX) => {
      if (x === mX && y === mY) {
        return p
      }

      const neighbours = getAdjacentMatrixPoints({ x: mX, y: mY })
      const minEntryCost = Math.min(
        ...neighbours
          .map((p) => matrixPosition(p).path)
          .map((path) => path.cost),
      )

      const entries = neighbours.filter(
        (p) => matrixPosition(p).path.cost === minEntryCost,
      )

      return {
        ...p,
        from: entries,
      }
    }),
  )

  return matrix
}
