import { input } from './input2'
import { add } from 'ramda'

const solution = (solutionInput: string) => {
  return solutionInput
    .trim()
    .split('\n')
    .map((line) => {
      return line
        .split(' | ')[1]
        .split(' ')
        .map((s) => {
          s.length
          switch (s.length) {
            case 2:
              return 1
            case 4:
              return 4
            case 3:
              return 7
            case 7:
              return 8
            default:
              return 0
          }
        })
        .filter((v) => v > 0).length
    })
    .reduce(add, 0)
}

console.log(solution(input))
