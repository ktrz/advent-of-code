import { input } from './input2'
import { toNumber } from '../../utils'
import { add } from 'ramda'

const containsStr = (check: string, str: string) =>
  str.split('').every((char) => check.includes(char))

const solution = (solutionInput: string) => {
  return solutionInput
    .trim()
    .split('\n')
    .map((line) => {
      const [trainingData, inputData] = line.split(' | ')
      const mapping = deduceMapping(trainingData)

      return inputData
        .split(' ')
        .map((s) => {
          return {
            key: sortStringWithMapping(s),
            values: Object.entries(defaultMapping)
              .filter(([key]) => key.length === s.length)
              .map(([_, value]) => value),
          }
        })
        .map(({ key, values }) => {
          switch (key.length) {
            case 5:
              if (containsStr(key, mapping['cf'])) {
                return 3
              } else if (containsStr(key, mapping['bd'])) {
                return 5
              } else {
                return 2
              }
            case 6: {
              calculateDMappingIfPossible(mapping)
              if (mapping['d']) {
                if (!containsStr(key, mapping['d'])) {
                  return 0
                } else if (containsStr(key, mapping['cf'])) {
                  return 9
                } else {
                  return 6
                }
              }
              return -1
            }
            default: {
              return values[0]
            }
          }
        })
        .join('')
    })
    .map(toNumber)
    .reduce(add, 0)
}

const defaultMapping = {
  abcefg: 0,
  cf: 1,
  acdeg: 2,
  acdfg: 3,
  bcdf: 4,
  abdfg: 5,
  abdefg: 6,
  acf: 7,
  abcdefg: 8,
  abcdfg: 9,
}

const sortStrMap: Record<string, number> = {
  a: 1,
  b: 2,
  d: 3,
  c: 4,
  f: 5,
  e: 7,
  g: 7,
}

const sortString = (str: string) => str.split('').sort().join('')
const sortStringWithMapping = (str: string) =>
  str
    .split('')
    .sort((a, b) => sortStrMap[a] - sortStrMap[b])
    .join('')

const diffStrings = (from: string, to: string) =>
  to
    .split('')
    .filter((c) => !from.split('').includes(c))
    .join('')

function calculateDMappingIfPossible(mapping: Record<string, string>) {
  if (!mapping['d'] && mapping[2] && (mapping[2] || mapping[3])) {
    const [b, d] = mapping['bd'].split('')
    const value = mapping[2] || mapping[3]
    mapping['d'] = value.includes(b) ? b : d
  }
}

const deduceMapping = (line: string) => {
  const possibleValues = line.split(' ').map((s) => {
    return {
      pattern: sortString(s),
      values: Object.entries(defaultMapping)
        .filter(([key]) => key.length === s.length)
        .map(([_, value]) => value),
    }
  })

  const basicMapping = possibleValues
    .filter(({ values }) => values.length === 1)
    .reduce<Record<number, string>>((res, { values: [v], pattern }) => {
      return {
        ...res,
        [v]: pattern,
      }
    }, {})

  const mapping: Record<string, string> = {
    a: sortStringWithMapping(diffStrings(basicMapping[1], basicMapping[7])), // ?
    cf: sortStringWithMapping(basicMapping[1]),
    bd: sortStringWithMapping(diffStrings(basicMapping[1], basicMapping[4])), // ?
    eg: sortStringWithMapping(
      diffStrings(basicMapping[4] + basicMapping[7], basicMapping[8]),
    ),
  }

  line
    .split(' ')
    .map((s) => ({
      key: sortStringWithMapping(s),
      values: Object.entries(defaultMapping)
        .filter(([key]) => key.length === s.length)
        .map(([_, value]) => value),
    }))
    .forEach(({ key }) => {
      calculateDMappingIfPossible(mapping)
      if (key.length === 5) {
        if (containsStr(key, mapping['cf'])) {
          mapping[3] = key
        } else if (containsStr(key, mapping['bd'])) {
          mapping[5] = key
        } else {
          mapping[2] = key
        }
      }
    })

  return mapping
}
console.log(solution(input))
