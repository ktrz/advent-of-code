import { input } from './input1'
import { add, range, subtract } from 'ramda'
import { toNumber } from '../../utils'

const arithmeticSequenceSum = (from: number, to: number) =>
  ((from + to) / 2) * (Math.abs(from - to) + 1)

const costToAlignTo = (value: number) => (currentNumbers: number[]) =>
  currentNumbers
    .map(subtract(value))
    .map(Math.abs)
    .map((n) => arithmeticSequenceSum(0, n))
    .reduce(add)

const solution = (solutionInput: string) => {
  const numbers = solutionInput.trim().split(',').map(toNumber)
  const costsToAlign = range(0, Math.max(...numbers)).map((n) =>
    costToAlignTo(n)(numbers),
  )
  return Math.min(...costsToAlign)
}

console.log(solution(input))
