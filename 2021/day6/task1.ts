import { input } from './input2'
import { toNumber } from '../../utils'
import { range } from 'ramda'

const initialState = input.trim().split(',').map(toNumber)

const newDay = (state: number[]): number[] =>
  state.map((n) => (n > 0 ? [n - 1] : [6, 8])).flat()

const solution = range(0, 80).reduce(newDay, initialState)

console.log(solution.length)
