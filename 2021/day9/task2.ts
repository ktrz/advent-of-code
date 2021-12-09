import { input } from './input2'
import { isTruthy, mul, toNumber } from '../../utils'
import { range } from 'ramda'
import { Basin, Board, Point } from './types'


const isLowPoint = (x: number, y: number, board: Board): boolean => {
  const xCheck = range(x - 1, x + 2).filter((v) => v >= 0 && v < board.length)
  const yCheck = range(y - 1, y + 2).filter(
    (v) => v >= 0 && v < board[x].length,
  )
  const currValue = board[x][y]
  return xCheck.every((xAdjacent) =>
    yCheck.every(
      (yAdjacent) =>
        (x === xAdjacent && y === yAdjacent) ||
        currValue < board[xAdjacent][yAdjacent],
    ),
  )
}

const findLowPoints = (solutionInput: string) => {
  const board = solutionInput
    .trim()
    .split('\n')
    .map((line) => line.split('').map(toNumber))

  let sum = 0
  const lowPoints = [] as [number, number][]
  for (let i = 0; i < board.length; i++) {
    const line = board[i]
    for (let j = 0; j < line.length; j++) {
      if (isLowPoint(i, j, board)) {
        lowPoints.push([i, j])

        sum += board[i][j] + 1
      }
    }
  }
  return { board, sum, lowPoints }
}

const getAdjacentPoints = (board: Board, [x, y]: Point): Point[] => {
  const xRange = range(x - 1, x + 2).filter((v) => v >= 0 && v < board.length)
  const yRange = range(y - 1, y + 2).filter(
    (v) => v >= 0 && v < board[x].length,
  )

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
}

const isSlope = (board: Board, pStart: Point, pEnd: Point): boolean => {
  const valueEnd = board[pEnd[0]][pEnd[1]]
  const valueStart = board[pStart[0]][pStart[1]]
  const slopeValue = valueEnd - valueStart
  return valueEnd < 9 && slopeValue > 0
}

function extracted(
  board: number[][],
  points: Point[],
  lowPoints: Point[],
): Point[] {
  const pointsSet = new Set(points.map((p) => p.join(',')))
  const adjacentPoints = points
    .map((point) =>
      getAdjacentPoints(board, point)
        .filter((adjacent) => !pointsSet.has(adjacent.join(',')))
        .filter((p) => isSlope(board, point, p)),
    )
    .flat()

  // console.log()
  // printBoard(board, lowPoints, [[...adjacentPoints]])

  // for (let j = 0; j < 100000000; j++) {
  //   Math.random()
  // }

  const morePoints = adjacentPoints.length
    ? extracted(board, [...points, ...adjacentPoints], lowPoints)
    : []
  return [...points, ...adjacentPoints, ...morePoints]
}

const solution = (board: Board, lowPoints: Point[]): Basin[] => {
  const basins = lowPoints
    .map((point) => {
      return extracted(board, [point], lowPoints)
    })
    .map((basin) => {
      return Array.from(new Set(basin.map((point) => point.join(',')))).map(
        (str) => str.split(',').map(toNumber) as Point,
      )
    })

  return basins.sort((b1, b2) => b2.length - b1.length) //.slice(0, 3) // ?
}

const { board, lowPoints } = findLowPoints(input)

const basins = solution(board, lowPoints)
console.log(
  basins
    .slice(0, 3)
    .map((b) => b.length)
    .reduce(mul),
)

// printBoard(board, lowPoints, basins)
// printBoard2(board, lowPoints, basins, basins.slice(0, 3))
