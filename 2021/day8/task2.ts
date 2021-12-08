import { input } from './input2'
import { toNumber } from '../../utils'
import { add } from 'ramda'

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

const ONE = 'cf'
const MIDDLE_DASH = 'd'
const DIFF_FOUR_AND_ONE = 'bd'

const containsStr = (valueString: string, searchString: string) =>
  searchString.split('').every((char) => valueString.includes(char))

const getPossibleValues = (value: string) => {
  return Object.entries(defaultMapping)
    .filter(([key]) => key.length === value.length)
    .map(([_, value]) => value)
}

const diffStrings = (from: string, to: string) =>
  to
    .split('')
    .filter((c) => !from.split('').includes(c))
    .join('')

const calculateDMappingIfPossible = (mapping: Record<string, string>) => {
  if (!mapping[MIDDLE_DASH] && mapping[2] && (mapping[2] || mapping[3])) {
    const [b, d] = mapping[DIFF_FOUR_AND_ONE].split('')
    const value = mapping[2] || mapping[3]
    mapping[MIDDLE_DASH] = value.includes(b) ? b : d
  }
}

const deduceMapping = (trainingData: string) => {
  const possibleValues = trainingData.split(' ').map((value) => ({
    pattern: value,
    values: getPossibleValues(value),
  }))

  const basicMapping = possibleValues
    .filter(({ values }) => values.length === 1)
    .reduce<Record<number, string>>(
      (res, { values: [v], pattern }) => ({
        ...res,
        [v]: pattern,
      }),
      {},
    )

  const mapping: Record<string, string> = {
    a: diffStrings(basicMapping[1], basicMapping[7]),
    cf: basicMapping[1],
    bd: diffStrings(basicMapping[1], basicMapping[4]),
    eg: diffStrings(basicMapping[4] + basicMapping[7], basicMapping[8]),
  }

  trainingData
    .split(' ')
    .map((value) => ({
      key: value,
      values: getPossibleValues(value),
    }))
    .forEach(({ key }) => {
      calculateDMappingIfPossible(mapping)
      if (key.length === 5) {
        if (containsStr(key, mapping[ONE])) {
          mapping[3] = key
        } else if (containsStr(key, mapping[DIFF_FOUR_AND_ONE])) {
          mapping[5] = key
        } else {
          mapping[2] = key
        }
      }
    })

  return mapping
}

const solution = (solutionInput: string) =>
  solutionInput
    .trim()
    .split('\n')
    .map((line) => {
      const [trainingData, inputData] = line.split(' | ')
      const mapping = deduceMapping(trainingData)

      return inputData
        .split(' ')
        .map((value) => ({
          key: value,
          values: getPossibleValues(value),
        }))
        .map(({ key, values }) => {
          switch (key.length) {
            case 5:
              if (containsStr(key, mapping[ONE])) {
                return 3
              } else {
                if (containsStr(key, mapping[DIFF_FOUR_AND_ONE])) {
                                return 5
                              } else {
                                return 2
                              }
              }
            case 6: {
              calculateDMappingIfPossible(mapping)
              if (mapping[MIDDLE_DASH]) {
                if (!containsStr(key, mapping[MIDDLE_DASH])) {
                  return 0
                } else if (containsStr(key, mapping[ONE])) {
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

console.log(solution(input))
