import { input } from './input2'
import { last } from 'ramda'
import { isTruthy, keyValuesS, sum } from '../../utils'

const points: Record<string, number> = {
  ')': 3,
  ']': 57,
  '}': 1197,
  '>': 25137,
}

const solution = (data: string) =>
  data
    .trim()
    .split('\n')
    .map(getCorruptedChar)
    .filter(isTruthy)
    .map((c) => points[c])
    .reduce(sum)

const getCorruptedChar = (line: string): string => {
  const buffer = []
  const openingChars = '([{<'
  const closingChars = ')]}>'
  const opening = keyValuesS(openingChars, closingChars)
  const closing = keyValuesS(closingChars, openingChars)
  for (let i = 0; i < line.length; i++) {
    const c = line[i]
    if (opening[c]) {
      buffer.push(c)
    } else if (last(buffer) === closing[c]) {
      buffer.pop()
    } else {
      return c
    }
  }
  return ''
}

console.log(solution(input))
