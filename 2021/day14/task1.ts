import { input } from './input1'
import { invert, pipe, range } from 'ramda'
import { toNumber } from '../../utils'

const solution = (inputValue: string) => {
  return pipe(
    (inputValue) => inputValue.trim().split('\n\n'),
    ([initialState, templates]: string[]) => ({
      initialState,
      templates: templates
        .split('\n')
        .map((template) => template.split(' -> '))
        .map(([pair, insert]) => ({ pair, insert })),
    }),
    ({ initialState, templates }) =>
      range(0, 10).reduce((result) => {
        const resultArr = result.split('')
        const replaces = resultArr.map((v, index, arr) => {
          const match = templates.find(
            ({ pair }) => v + arr[(index + 1) % arr.length] === pair,
          )
          return match && match.insert
        })

        for (let i = replaces.length - 2; i >= 0; i--) {
          const toReplace = replaces[i]
          if (!toReplace) {
            continue
          }

          resultArr.splice(i + 1, 0, toReplace)
        }

        return resultArr.join('')
      }, initialState),
  )(inputValue)
}

console.log(
  pipe(
    (result: string) => {
      return result.split('').reduce(
        (groups, char) => ({
          ...groups,
          [char]: (groups[char] || 0) + 1,
        }),
        {} as Record<string, number>,
      )
    },
    (groups) => invert(groups),
    (groups) => ({
      max: Math.max(...Object.keys(groups).map(toNumber)),
      min: Math.min(...Object.keys(groups).map(toNumber)),
    }),
    ({ min, max }) => max - min,
  )(solution(input)),
)
