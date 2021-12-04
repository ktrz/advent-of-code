import { input } from './input1'

interface Position {
    horizontal: number,
    depth: number
}



const modifyPosition = (key: keyof Position, change: number) => (position: Position) => ({
    ...position,
    [key]: position[key] + change
})

const parseInstruction = (instruction: string, value: number): (x: Position) => Position => {
    switch (instruction) {
        case 'forward':
            return modifyPosition('horizontal', value)
        case 'down':
            return modifyPosition('depth', value)
        case 'up':
            return modifyPosition('depth', -value)
        default:
            return x => x
    }
}

const readInstruction = (instruction: string) => instruction.split(' ');

const initialState1 = { horizontal: 0, depth: 0 };
const solution = input.trim().split('\n')
    .map(readInstruction)
    .map(([ instruction, value ]) => [ instruction, +value ] as [ string, number ])
    .map(([ instruction, value ]) => parseInstruction(instruction, value))
    .reduce((state, instructionFn) => instructionFn(state), initialState1)

solution
solution.horizontal * solution.depth // ?

