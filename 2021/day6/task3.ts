import { input } from './input2'
import { toNumber } from '../../utils'
import { add, range } from 'ramda'

const initialRemainingLifetime = 10000

type State = { [n: number]: { [remainingLifetime: number]: number } }
type LanternFishEntry = {
  internalClock: number
  remainingLifetime: number
  count: number
}

const lanternFishEntries = (state: State): LanternFishEntry[] =>
  Object.entries(state)
    .map(([internalClock, v]) =>
      Object.entries(v).map(
        ([remaininigLifetime, count]) =>
          ({
            internalClock: +internalClock,
            remainingLifetime: +remaininigLifetime,
            count,
          } as LanternFishEntry),
      ),
    )
    .flat()

const addLanternFishToState =
  (remainingLifetime: number) => (state: State, val: number) => {
    const changedEntry = state[val] || {}
    changedEntry[remainingLifetime] = (changedEntry[remainingLifetime] || 0) + 1

    return {
      ...state,
      [val]: changedEntry,
    }
  }

const reproduce = ({
                     internalClock,
                     remainingLifetime,
                     count,
                   }: LanternFishEntry): LanternFishEntry[] => {
  return (
    +internalClock > 0
      ? [
        {
          internalClock: internalClock - 1,
          remainingLifetime: remainingLifetime - 1,
          count,
        },
      ]
      : [
        {
          internalClock: 6,
          remainingLifetime: remainingLifetime - 1,
          count,
        },
        {
          internalClock: 8,
          remainingLifetime: initialRemainingLifetime,
          count,
        },
      ]
  ).filter(({ remainingLifetime }) => remainingLifetime >= 0)
}

const addLanternFish = (
  state: State,
  { internalClock, remainingLifetime, count }: LanternFishEntry,
) => {
  const changedState = state[internalClock] || {}
  changedState[remainingLifetime] = changedState[remainingLifetime] || 0
  changedState[remainingLifetime] += count
  return {
    ...state,
    [internalClock]: changedState,
  }
}

const newDay = (state: State) => {
  return lanternFishEntries(state)
    .map(reproduce)
    .flat()
    .reduce(addLanternFish, {})
}

const initialState = input
  .trim()
  .split(',')
  .map(toNumber)
  .reduce(addLanternFishToState(initialRemainingLifetime), {})

const solution = range(0, 80).reduce(newDay, initialState)

solution

console.log(
  lanternFishEntries(solution)
    .map(({ count }) => count)
    .reduce(add, 0),
)
