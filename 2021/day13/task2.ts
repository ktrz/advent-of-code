import { input } from './input2'
import { bendBoard, getFoldInstructions, inputToBoard } from './utils'

const solution = function (inputValue: string) {
  const [boardInput, foldInput] = inputValue.split('\n\n')
  const [board, foldInstructions] = [
    inputToBoard(boardInput),
    getFoldInstructions(foldInput),
  ]
  return foldInstructions.reduce((board, foldInstruction) => {
    return bendBoard(foldInstruction, board)
  }, board)
}

console.log(
  solution(input)
    .map((line) => line.join(''))
    .join('\n'),
)
