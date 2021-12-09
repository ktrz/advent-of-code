import { input } from './input2'
import { isTruthy, mul, toNumber } from '../../utils'
import { range } from 'ramda'
import * as colors from 'colors'

type Board = number[][]
type LowPoint = [number, number]
type Basin = LowPoint[]

const printBoard = (board: Board, lowPoints: LowPoint[], basins: Basin[]) => {
  console.log(
    basins
      .map((basin) => {
        return board
          .map((line, i) => {
            return line
              .map((v, j) => {
                return lowPoints.filter(([x, y]) => x === i && y === j).length
                  ? colors.bgMagenta.black(String(board[i][j]))
                  : basin.filter(([x, y]) => x === i && y === j).length
                  ? colors.bgCyan.black(String(board[i][j]))
                  : String(board[i][j])
              })
              .join(' ')
          })
          .join('\n')
      })
      .join('\n\n'),
  )
}

const printBoard2 = (
  board: Board,
  lowPoints: LowPoint[],
  basins: Basin[],
  largestBasins: Basin[],
) => {
  const basin = basins.flat()
  const lBasin = largestBasins.flat()
  console.log(
    board
      .map((line, i) => {
        return line
          .map((v, j) => {
            return lowPoints.filter(([x, y]) => x === i && y === j).length
              ? colors.bgMagenta.black(String(board[i][j]))
              : lBasin.filter(([x, y]) => x === i && y === j).length
              ? colors.bgRed.white(String(board[i][j]))
              : basin.filter(([x, y]) => x === i && y === j).length
              ? colors.bgCyan.black(String(board[i][j]))
              : String(board[i][j])
          })
          .join(' ')
      })
      .join('\n'),
  )

  console.log()

  function getPredicate(i: number, j: number) {
    return ([ x, y ]: LowPoint) => x === i && y === j
  }

  const printNr = (s: number) => ('000' + s).slice(-3)

  console.log(
    board
      .map((line, i) => {
        return line
          .map((v, j) => {
            return lowPoints.filter(getPredicate(i, j)).length
              ? colors.bgMagenta.black(printNr(board[i][j]))
              : lBasin.filter(getPredicate(i, j)).length
              ? colors.bgRed.white(printNr(largestBasins.find(b => b.filter(getPredicate(i, j)).length)!.length))
              : basin.filter(getPredicate(i, j)).length
              ? colors.bgCyan.black(printNr(basins.find(b => b.filter(getPredicate(i, j)).length)!.length))
              : printNr(board[i][j])
          })
          .join(' ')
      })
      .join('\n'),
  )
}

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

const getAdjacentPoints = (board: Board, [x, y]: LowPoint): LowPoint[] => {
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
            : ([xAdjacent, yAdjacent] as LowPoint),
        )
        .filter(isTruthy),
    )
    .flat()
}

const isSlope = (board: Board, pStart: LowPoint, pEnd: LowPoint): boolean => {
  const valueEnd = board[pEnd[0]][pEnd[1]]
  const valueStart = board[pStart[0]][pStart[1]]
  const slopeValue = valueEnd - valueStart
  return valueEnd < 9 && slopeValue > 0
}

function extracted(
  board: number[][],
  points: LowPoint[],
  lowPoints: LowPoint[],
): LowPoint[] {
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

  adjacentPoints // ?
  const morePoints = adjacentPoints.length
    ? extracted(board, [...points, ...adjacentPoints], lowPoints)
    : []
  return [...points, ...adjacentPoints, ...morePoints]
}

const solution = (board: Board, lowPoints: LowPoint[]): Basin[] => {
  const basins = lowPoints
    .map((point) => {
      return extracted(board, [point], lowPoints)
    })
    .map((basin) => {
      return Array.from(new Set(basin.map((point) => point.join(',')))).map(
        (str) => str.split(',').map(toNumber) as LowPoint,
      )
    })

  return basins.sort((b1, b2) => b2.length - b1.length) //.slice(0, 3) // ?
}

const { board, sum: s, lowPoints } = findLowPoints(input)
console.log(s)

const basins = solution(board, lowPoints)
console.log(
  basins
    .slice(0, 3)
    .map((b) => b.length)
    .reduce(mul),
)

// printBoard(board, lowPoints, basins)
printBoard2(board, lowPoints, basins, basins.slice(0, 3))
console.log()
