import { input } from './input2'
import { last } from 'ramda'
import { isTruthy, keyValuesS } from '../../utils'

const points: Record<string, number> = {
  ')': 1,
  ']': 2,
  '}': 3,
  '>': 4,
}

const solution = (data: string) => {
  const points = data
    .trim()
    .split('\n')
    .map(getLineCompletion)
    .filter(isTruthy)
    .map((c) => c.split(''))
    .map((complement) => calculatePoints(complement))
    .sort((a, b) => a - b)
  const middleIndex = (points.length - 1) / 2
  return points[middleIndex]
}

const getLineCompletion = (line: string): string => {
  const buffer = []
  const openingChars = '([{<'
  const closingChars = ')]}>'
  const opening = keyValuesS(openingChars, closingChars)
  const closing = keyValuesS(closingChars, openingChars)
  for (let c of line.split('')) {
    if (opening[c]) {
      buffer.push(c)
    } else if (last(buffer) === closing[c]) {
      buffer.pop()
    } else {
      return ''
    }
  }
  return buffer
    .reverse()
    .map((c) => opening[c])
    .join('')
}

const calculatePoints = (complement: string[]): number =>
  complement.reduce((score, v) => {
    return score * 5 + points[v]
  }, 0)

console.log(solution(input))
