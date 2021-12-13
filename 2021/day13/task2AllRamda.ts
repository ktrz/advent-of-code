import { input } from './input2'
import { bendBoard, getFoldInstructions, inputToBoard } from './utils-ramda'
import { pipe } from 'ramda'
import { Board, FoldInstruction } from './types'

const extractSubInputs = (inputData: string) => inputData.trim().split('\n\n')

const parseSubInputs = ([boardInput, foldInput]: string[]) =>
  [inputToBoard(boardInput), getFoldInstructions(foldInput)] as [
    Board,
    FoldInstruction[],
  ]

const foldBoard = ([board, foldInstructions]: [Board, FoldInstruction[]]) =>
  foldInstructions.reduce(
    (board, foldInstruction) => bendBoard(foldInstruction, board),
    board,
  )

const printBoard = (board: Board) =>
  board.map((line) => line.join('')).join('\n')

const solution = pipe(extractSubInputs, parseSubInputs, foldBoard, printBoard)

console.log(solution(input))
