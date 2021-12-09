import { input } from './input2'
import { toNumber } from '../../utils'
import { range } from 'ramda'
import * as colors from 'colors'

const printBoard = (board: number[][], lowPoints: [number, number][]) => {
  console.log(
    board
      .map((line, i) => {
        return line
          .map((v, j) => {
            return lowPoints.filter(([x, y]) => x === i && y === j).length
              ? colors.bgMagenta.black(String(board[i][j]))
              : String(board[i][j])
          })
          .join(' ')
      })
      .join('\n'),
  )
}

const isLowPoint = (x: number, y: number, map: number[][]): boolean => {
  const xCheck = range(x - 1, x + 2).filter((v) => v >= 0 && v < map.length)
  const yCheck = range(y - 1, y + 2).filter((v) => v >= 0 && v < map[x].length)
  const currValue = map[x][y]
  return xCheck.every((xAdjacent) =>
    yCheck.every(
      (yAdjacent) =>
        (x === xAdjacent && y === yAdjacent) ||
        currValue < map[xAdjacent][yAdjacent],
    ),
  )
}

const solution = (solutionInput: string) => {
  const map = solutionInput
    .trim()
    .split('\n')
    .map((line) => line.split('').map(toNumber))

  let sum = 0
  const lowPoints = [] as [number, number][]
  for (let i = 0; i < map.length; i++) {
    const line = map[i]
    for (let j = 0; j < line.length; j++) {
      if (isLowPoint(i, j, map)) {
        lowPoints.push([i, j])

        sum += map[i][j] + 1
      }
    }
  }
  lowPoints
  return { map, sum, lowPoints }
}

const { map, sum, lowPoints } = solution(input)
console.log(sum)

printBoard(map, lowPoints)
console.log()
