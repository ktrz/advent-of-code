import { input } from './input2'
import { sum } from '../../utils'
import { bendBoard, getFoldInstructions, inputToBoard } from './utils'

const solution = function (inputValue: string) {
  const [boardInput, foldInput] = inputValue.split('\n\n')
  const board = inputToBoard(boardInput)
  const foldInstructions = getFoldInstructions(foldInput)

  return bendBoard(foldInstructions[0], board)
    .map((line) => line.map((field) => (field === '#' ? 1 : 0)))
    .flat()
    .reduce(sum, 0)
}

console.log(solution(input))
