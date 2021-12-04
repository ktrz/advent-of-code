import { input } from './input2'

interface PositionWithAim {
  horizontal: number
  depth: number
  aim: number
}

const modifyPositionWithAim =
  (
    key: keyof PositionWithAim,
    change: number | ((current: PositionWithAim) => number),
  ) =>
  (position: PositionWithAim) => ({
    ...position,
    [key]:
      position[key] +
      (typeof change === 'function' ? change(position) : change),
  })

const parseInstructionWithAim = (
  instruction: string,
  value: number,
): Array<(x: PositionWithAim) => PositionWithAim> => {
  switch (instruction) {
    case 'forward':
      return [
        modifyPositionWithAim('horizontal', value),
        modifyPositionWithAim('depth', ({ aim }) => aim * value),
      ]
    case 'down':
      return [modifyPositionWithAim('aim', value)]
    case 'up':
      return [modifyPositionWithAim('aim', -value)]
    default:
      return [(x) => x]
  }
}

const readInstruction = (instruction: string) => instruction.split(' ')

const initialState = { horizontal: 0, depth: 0, aim: 0 }
const solution = input
  .trim()
  .split('\n')
  .map(readInstruction)
  .map(([instruction, value]) => [instruction, +value] as [string, number])
  .map(([instruction, value]) => parseInstructionWithAim(instruction, value))
  .reduce((acc, val) => acc.concat(val), [])
  .reduce((result, fn) => fn(result), initialState)

console.log(solution.horizontal * solution.depth)
