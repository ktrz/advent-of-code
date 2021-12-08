import { input } from './input2'
import { toNumber } from '../../utils'
import { add, invert, map } from 'ramda'

const solution = (solutionInput: string) =>
  solutionInput
    .trim()
    .split('\n')
    .map((line) => line.split(' | '))
    .map(map((data) => data.split(' ')))
    .map(([trainingData, inputData]) => ({
      inputData,
      mapping: deduceMapping([...trainingData, ...inputData]),
    }))
    .map(({ inputData, mapping }) =>
      inputData
        .map((value) => ({
          key: value,
          values: getPossibleValues(value),
        }))
        .map(({ key }) => mapping[sortString(key)])
        .join(''),
    )
    .map(toNumber)
    .reduce(add, 0)

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
const DIFF_SEVEN_AND_ONE = 'a'
const DIFF_EIGHT_AND_FOUR_SEVEN = 'eg'

const sortString = (str: string) => str.split('').sort().join('')

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

const deduceMapping = (data: string[]) => {
  const basicMapping = data
    .map((value) => ({
      pattern: value,
      values: getPossibleValues(value),
    }))
    .filter(({ values }) => values.length === 1)
    .reduce<Record<number, string>>(
      (res, { values: [v], pattern }) => ({
        ...res,
        [v]: pattern,
      }),
      {},
    )

  const mapping: Record<string, string> = {
    ...basicMapping,
    [DIFF_SEVEN_AND_ONE]: diffStrings(basicMapping[1], basicMapping[7]),
    [ONE]: basicMapping[1],
    [DIFF_FOUR_AND_ONE]: diffStrings(basicMapping[1], basicMapping[4]),
    [DIFF_EIGHT_AND_FOUR_SEVEN]: diffStrings(
      basicMapping[4] + basicMapping[7],
      basicMapping[8],
    ),
  }

  data
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
      } else if (key.length === 6) {
        if (mapping[MIDDLE_DASH]) {
          if (!containsStr(key, mapping[MIDDLE_DASH])) {
            mapping[0] = key
          } else if (containsStr(key, mapping[ONE])) {
            mapping[9] = key
          } else {
            mapping[6] = key
          }
        }
      }
    })

  return Object.entries(invert(mapping))
    .map(([key, values]) => [key, values[0]])
    .map(([key, value]) => [sortString(key), sortString(value)])
    .reduce<Record<string, string>>(
      (res, [key, value]) => ({
        ...res,
        [key]: value,
      }),
      {},
    )
}

console.log(solution(input))
