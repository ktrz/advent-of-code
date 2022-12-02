import { input } from './input2'
import { add } from 'ramda'

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

  return Math.max(...elfCaloriesInventory)
}
console.log(solution(input)) // ?
