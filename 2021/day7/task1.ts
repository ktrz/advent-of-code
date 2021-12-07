import { input } from './input2'
import { add, range, subtract } from 'ramda'
import { toNumber } from '../../utils'

const costToAlignTo = (value: number) => (currentNumbers: number[]) =>
  currentNumbers.map(subtract(value)).map(Math.abs).reduce(add)

const solution = (solutionInput: string) => {
  const numbers = solutionInput.trim().split(',').map(toNumber)
  return Math.min(
    ...range(0, Math.max(...numbers)).map((n) => costToAlignTo(n)(numbers)),
  )
}

console.log(solution(input))
