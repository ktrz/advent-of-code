import { input } from './input2'
import { toNumber } from '../../utils'
import { range } from 'ramda'

function calculateBoard(inputString: string) {
  const lines = inputString.trim().split('\n')

  const board = []
  for (let i = 0; i < lines.length; i++) {
    const boardLine = lines[i].split('').map(toNumber)
    board.push(boardLine)
  }

  return board
}

function increaseEnergyLevels(board: number[][]) {
  for (let i = 0; i < board.length; i++) {
    const line = board[i]
    for (let j = 0; j < line.length; j++) {
      board[i][j]++
    }
  }
}

function increaseNeighbourEnergyLevels(
  i: number,
  j: number,
  board: number[][],
  flashed: Set<string>,
) {
  for (let x = i - 1; x <= i + 1; x++) {
    for (let y = j - 1; y <= j + 1; y++) {
      if (x < 0 || x >= board.length) {
        continue
      }
      if (y < 0 || y >= board[x].length) {
        continue
      }
      if (x === i && y === j) {
        continue
      }
      if (flashed.has([x, y].join(','))) {
        continue
      }

      board[x][y]++
    }
  }
}

function flashOctopus(
  i: number,
  j: number,
  board: number[][],
  flashed: Set<string>,
) {
  flashesCount++
  increaseNeighbourEnergyLevels(i, j, board, flashed)
}

function calculateNextStep(board: number[][]) {
  increaseEnergyLevels(board)
  const toFlash = []
  const flashed = new Set<string>()

  let hasNewFlashes = true
  let lastFlashed = 0
  while (hasNewFlashes) {
    hasNewFlashes = false
    for (let i = 0; i < board.length; i++) {
      const line = board[i]
      for (let j = 0; j < line.length; j++) {
        if (board[i][j] > 9 && !flashed.has([i, j].join(','))) {
          hasNewFlashes = true
          toFlash.push({ x: i, y: j })
        }
      }
    }
    for (let i = lastFlashed; i < toFlash.length; i++) {
      const { x, y } = toFlash[i]
      flashOctopus(x, y, board, flashed)
      flashed.add([x, y].join(','))
      lastFlashed++
    }
  }

  flashed.forEach((str) => {
    const [x, y] = str.split(',').map(toNumber)
    board[x][y] = 0
  })
}

let flashesCount = 0

function solution(inputString: string) {
  const board = calculateBoard(inputString)
  range(0, 100).forEach(() => {
    calculateNextStep(board)
  })

  return board
}

function printBoard(board: number[][]) {
  console.log()
  console.log(board.map((line) => line.join('')).join('\n'))
}

printBoard(solution(input))

console.log(flashesCount)
