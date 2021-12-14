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
  ({ initialState, templates }) => ({
    initialState,
    initialPairs: initialState
      .split('')
      .map((v, index, arr) =>
        index < arr.length - 1 ? v + arr[index + 1] : '',
      )
      .filter(isTruthy)
      .reduce(
        (groupCounts, group) => ({
          ...groupCounts,
          [group]: (groupCounts[group] || 0n) + 1n,
        }),
        {} as CountMap,
      ),
    templateMap: templates.reduce(
      (templateMap, { pair, insert }) => ({
        ...templateMap,
        [pair]: [pair[0] + insert, insert + pair[1]] as [string, string],
      }),
      {} as Record<string, [string, string]>,
    ),
  }),
  ({ initialPairs, templateMap, initialState }) => ({
    initialState,
    templateCountMap: range(0, 40).reduce(
      (result: CountMap) =>
        Object.entries(result)
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
          ),
      initialPairs,
    ),
  }),
  ({ templateCountMap, initialState }) => ({ templateCountMap, initialState }),
  ({ templateCountMap, initialState }) =>
    Object.entries(templateCountMap)
      .map(([template, count]) =>
        template.split('').map((char) => ({ char, count })),
      )
      .flat()
      .reduce(
        (countMap: CountMap, { count, char }) => ({
          ...countMap,
          [char]: (countMap[char] || 0n) + count,
        }),
        {
          [initialState[0]]: 1n,
          [last(initialState)]: 1n,
        },
      ),
  (charCountMap) => invert(charCountMap),
  (invertedCharMap) => Object.keys(invertedCharMap).map(toNumber),
  (counts) => (Math.max(...counts) - Math.min(...counts)) / 2,
)

console.log(solution(input)) // ?
