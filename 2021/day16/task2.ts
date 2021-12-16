import { input } from './input2'
import { pipe } from 'ramda'
import { calculatePacket, getPacket, toHexadecimal } from './utils'

const solution = pipe(toHexadecimal, getPacket, calculatePacket)

console.log(solution(input))
