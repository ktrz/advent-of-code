import { isTruthy, sum, toNumber } from '../../utils'
import { input } from './input1'
import { input2 } from './input2'

const calculateDiffs = (v: number, i: number, arr: number[]) =>
  i === 0 ? 0 : v - arr[i - 1]
const isIncrease = (v: number) => v > 0

const solution1 = input
  .trim()
  .split('\n')
  .map(toNumber)
  .map(calculateDiffs)
  .filter(isIncrease).length

const groupBy3 = (v: number, i: number, arr: number[]) =>
  i < arr.length - 2 ? [v, arr[i + 1], arr[i + 2]] : null
const sumGroups = (vals: number[]) => vals.reduce(sum)

const solution2 = input2
  .trim()
  .split('\n')
  .map(toNumber)
  .map(groupBy3)
  .filter(isTruthy)
  .map(sumGroups)
  .map(calculateDiffs)
  .filter(isIncrease).length

// .map(line => line.trim().split(/[ ]+/))
// .map(([ value, ...groups ]) => ({
//     value: +value, groups
// }))
// .map(({ value, groups }) => groups.map(group => ({
//     group,
//     value
// })))
// .reduce((acc, val) => acc.concat(val), []) // ?
// .reduce((prev, { group, value }) => {
//     return {
//         ...prev,
//         [group]: [ ...(prev[group] || []), value ]
//     }
// }, {} as any))
// .map(vals => vals.reduce(sum))
// .map((v, i, arr) => i === 0
//     ? 0
//     : v - arr[i - 1])
// .filter(v => v > 0).length

solution2
