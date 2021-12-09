import { input } from './input2'
import { isTruthy, mul, toNumber } from '../../utils'
import { curry, range } from 'ramda'
import { Basin, Board, Point } from './types'

const getPointValue = curry(
  (board: Board, [x, y]: Point): number => board[x][y],
)

const isLowPoint = curry((board: Board, point: Point): boolean => {
  const pointOnBoard = getPointValue(board)
  const currValue = pointOnBoard(point)
  return getAdjacentPoints(board, point).every(
    (adjacentPoint) => currValue < pointOnBoard(adjacentPoint),
  )
})

const findLowPoints = (solutionInput: string) => {
  const board = solutionInput
    .trim()
    .split('\n')
    .map((line) => line.split('').map(toNumber))

  const isLowPointOnBoard = isLowPoint(board)
  const lowPoints = board
    .map((line, x) => line.map((v, y) => [x, y] as Point))
    .flat()
    .filter(isLowPointOnBoard)
  return {
    board,
    lowPoints,
  }
}

const getAdjacentPoints = curry((board: Board, [x, y]: Point): Point[] => {
  const xRange = range(x - 1, x + 2)
    .filter((v) => v >= 0)
    .filter((v) => v < board.length)
  const yRange = range(y - 1, y + 2)
    .filter((v) => v >= 0)
    .filter((v) => v < board[x].length)

  return xRange
    .map((xAdjacent) =>
      yRange
        .map((yAdjacent) =>
          (x === xAdjacent && y === yAdjacent) ||
          (x !== xAdjacent && y !== yAdjacent)
            ? null
            : ([xAdjacent, yAdjacent] as Point),
        )
        .filter(isTruthy),
    )
    .flat()
})

const isSlope = (board: Board, pStart: Point, pEnd: Point): boolean => {
  const [valueStart, valueEnd] = [pStart, pEnd].map((p) => board[p[0]][p[1]])
  return valueEnd < 9 && valueEnd - valueStart >= 0
}

function calculateBasin(board: number[][], points: Point[]): Point[] {
  const pointsSet = new Set(points.map((p) => p.join(',')))
  const adjacentPointsOnBoard = getAdjacentPoints(board)
  const adjacentPoints = points
    .map((point) =>
      adjacentPointsOnBoard(point)
        .filter((adjacent) => !pointsSet.has(adjacent.join(',')))
        .filter((p) => isSlope(board, point, p)),
    )
    .flat()

  const morePoints = adjacentPoints.length
    ? calculateBasin(board, [...points, ...adjacentPoints])
    : []
  return [...points, ...adjacentPoints, ...morePoints]
}

const getBasins = (board: Board, lowPoints: Point[]): Basin[] =>
  lowPoints
    .map((point) => calculateBasin(board, [point]))
    .map((basin) =>
      Array.from(new Set(basin.map((point) => point.join(',')))).map(
        (str) => str.split(',').map(toNumber) as Point,
      ),
    )

function solution(inputData: string) {
  const { board, lowPoints } = findLowPoints(inputData)
  const basins = getBasins(board, lowPoints)
  const largestBasins = basins
    .sort((b1, b2) => b2.length - b1.length)
    .slice(0, 3)

  // printBoard(board, lowPoints, basins)
  // printBoard2(board, lowPoints, basins, largestBasins)
  return largestBasins.map((b) => b.length).reduce(mul)
}

console.log(solution(input))
