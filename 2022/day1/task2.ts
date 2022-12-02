import { input } from './input2'
import { add, sort } from 'ramda'

const solution = (inputValue: string) => {
  const elfCaloriesInventory = inputValue
    .trim()
    .split('\n\n')
    .map((elfInventory) =>
      elfInventory
        .split('\n')
        .map((v) => parseInt(v, 10))
        .reduce(add),
    )

  return sort((a, b) => a - b, elfCaloriesInventory)
    .slice(-3)
    .reduce(add)
}
console.log(solution(input)) // ?
