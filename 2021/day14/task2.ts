import { input } from './input2'
import { invert, last, pipe, range } from 'ramda'
import { isTruthy, toNumber } from '../../utils'

type CountMap = Record<string, bigint>

const solution = pipe(
  (inputValue) => inputValue.trim().split('\n\n'),
  ([initialState, templates]: string[]) => ({
    initialState,
    templates: templates
      .split('\n')
      .map((template) => template.split(' -> '))
      .map(([pair, insert]) => ({ pair, insert })),
  }),
  ({ initialState, templates }) => {
    const initialArr = initialState.split('')
    const initialPairs = initialArr
      .map((v, index, arr) => {
        return index < arr.length - 1 ? v + arr[index + 1] : ''
      })
      .filter(isTruthy)
      .reduce((groupCounts, group) => {
        return {
          ...groupCounts,
          [group]: (groupCounts[group] || 0n) + 1n,
        }
      }, {} as CountMap)

    const templateMap = templates.reduce(
      (templateMap, { pair, insert }) => ({
        ...templateMap,
        [pair]: [pair[0] + insert, insert + pair[1]] as [string, string],
      }),
      {} as Record<string, [string, string]>,
    )

    const templateCountMap = range(0, 40).reduce((result: CountMap) => {
      return Object.entries(result)
        .map(([pair, count]) =>
          templateMap[pair]
            ? templateMap[pair].map((template) => ({
                count,
                template,
              }))
            : [
                {
                  count,
                  template: pair,
                },
              ],
        )
        .flat()
        .reduce(
          (res, { count, template }) => ({
            ...res,
            [template]: (res[template] || 0n) + count,
          }),
          {} as CountMap,
        )
    }, initialPairs)

    return { templateCountMap, initialState }
  },
)

const { templateCountMap, initialState } = solution(input)
const cMap = Object.entries(templateCountMap)
  .map(([template, count]) =>
    template.split('').map((char) => ({ char, count })),
  )
  .flat()
  .reduce(
    (countMap: CountMap, { count, char }) => ({
      ...countMap,
      [char]: (countMap[char] || 0n) + count,
    }),
    {} as CountMap,
  )

cMap[initialState[0]] += 1n
cMap[last(initialState)] += 1n

const inverterMap = invert(cMap)

const max = Math.max(...Object.keys(inverterMap).map(toNumber))
const min = Math.min(...Object.keys(inverterMap).map(toNumber))

console.log((max - min) / 2)
