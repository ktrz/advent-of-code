import { input } from './input2'
import { sum, toNumber } from '../../utils'
import { range } from 'ramda'

type State = { [n: number]: number }
type LanternFishEntry = [number, number]

const lanternFishEntries = (state: State): LanternFishEntry[] =>
  Object.entries(state).map(([k, v]) => [+k, v])

const addLanternFishToState = (state: State, val: number) => ({
  ...state,
  [val]: (state[val] || 0) + 1,
})

const reproduce = ([key, value]: LanternFishEntry): State =>
  +key > 0 ? { [+key - 1]: value } : { [6]: value, [8]: value }

const addLanternFish = (state: State, [key, value]: LanternFishEntry) => {
  state[+key] = state[+key] || 0
  state[+key] += value
  return state
}

const mergeStates = (state: State, value: State): State =>
  lanternFishEntries(value).reduce(addLanternFish, state)

const newDay = (state: State): State => {
  return lanternFishEntries(state).map(reproduce).reduce(mergeStates, {})
}

const initialState = input
  .trim()
  .split(',')
  .map(toNumber)
  .reduce(addLanternFishToState, {})

const solution = range(0, 256).reduce(newDay, initialState)

console.log(Object.values(solution).reduce(sum))
