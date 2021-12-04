import { toNumber } from '../../utils'
import { input } from './input1'

let solution = input.trim().split('\n\n')

const nums = solution[0].split(',').map(toNumber)
const rest = solution.slice(1)

const COL = 0
const ROW = 1
type Board = { nr: number; position: [number, number]; marked: boolean }[]
const checkBoard = (board: Board) => {
  const res = board.reduce(
    (res, el) => {
      res.col[el.position[COL]] = res.col[el.position[COL]] || 0
      res.row[el.position[ROW]] = res.row[el.position[ROW]] || 0
      res.col[el.position[COL]] += el.marked ? 1 : 0
      res.row[el.position[ROW]] += el.marked ? 1 : 0
      return res
    },
    {
      col: [],
      row: [],
    },
  )
  res //?

  return res.col.some((v) => v === 5) || res.row.some((v) => v >= 5)
}

rest[0]
const boards = rest.map((board) =>
  board //?
    .trim()
    .split('\n')
    .map((line, i) =>
      line
        .split(' ')
        .filter((v) => v !== '')
        .map(toNumber)
        .map((n, j) => ({
          nr: n,
          position: [i, j] as [number, number],
          marked: false,
        })),
    )
    .reduce((acc, val) => acc.concat(val), []),
)

const markBoard = (nr: number) => (board: Board) => {
  board
    .filter((el) => el.nr === nr)
    .forEach((el) => {
      el.marked = true
    })
}

const calculateScore = (board: Board) =>
  board
    .filter((f) => !f.marked)
    .map((f) => f.nr)
    .reduce((a, b) => a + b)

let i = 0
let lastNum
nums
for (let n of nums) {
  lastNum = n
  ++i // ?
  n
  boards.forEach(markBoard(n))

  if (boards.some(checkBoard)) {
    n
    break
  }
}

const winningBoards = boards.filter(checkBoard).map(calculateScore)

winningBoards[0] * lastNum // ?

checkBoard(boards[0])
