import { input } from './input2'
import { pipe } from 'ramda'
import { getPacket, sumVersions, toHexadecimal } from './utils'

const solution = pipe(toHexadecimal, getPacket, sumVersions)

console.log(solution(input))
