import { input } from './input2'
import { add, applyTo, curry, divide, multiply, range, subtract } from 'ramda'
import { toNumber } from '../../utils'

const sequenceLength = (from: number, to: number) =>
  add(1, Math.abs(subtract(from, to)))
const arithmeticSequenceSum = curry((from: number, to: number) =>
  multiply(divide(add(from, to), 2), sequenceLength(from, to)),
)

const costToAlignTo = (value: number) => (currentNumbers: number[]) =>
  currentNumbers
    .map(subtract(value))
    .map(Math.abs)
    .map(arithmeticSequenceSum(0) as (to: number) => number)
    .reduce(add)

const solution = (solutionInput: string) =>
  applyTo(solutionInput.trim().split(',').map(toNumber))((numbers) =>
    Math.min(
      ...range(0, Math.max(...numbers)).map((n) => costToAlignTo(n)(numbers)),
    ),
  )

console.log(solution(input))
