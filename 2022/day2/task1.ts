import { input } from './input2'

const choices = {
  Rock: 'Rock',
  Paper: 'Paper',
  Scissors: 'Scissors',
} as const

type Choices = typeof choices
type ChoicesKeys = keyof Choices
type ChoicesValues = Choices[ChoicesKeys]

const choicesValue: Record<ChoicesValues, number> = {
  Rock: 1,
  Paper: 2,
  Scissors: 3,
}

const elfSymbolToChoiceMap: Record<'A' | 'B' | 'C', ChoicesValues> = {
  A: choices.Rock,
  B: choices.Paper,
  C: choices.Scissors,
}

const mySymbolToChoiceMap: Record<'X' | 'Y' | 'Z', ChoicesValues> = {
  X: choices.Rock,
  Y: choices.Paper,
  Z: choices.Scissors,
}

const winMap: Record<ChoicesValues, ChoicesValues> = {
  [choices.Rock]: choices.Scissors,
  [choices.Paper]: choices.Rock,
  [choices.Scissors]: choices.Paper,
}

function isElfSymbol(elfSymbol: string): elfSymbol is 'A' | 'B' | 'C' {
  return (['A', 'B', 'C'] as const).includes(elfSymbol as any)
}

function isMySymbol(mySymbol: string): mySymbol is 'X' | 'Y' | 'Z' {
  return (['X', 'Y', 'Z'] as const).includes(mySymbol as any)
}

const solution = (inputValue: string) => {
  return inputValue
    .trim()
    .split('\n')
    .map((line) => {
      const values = line.split(' ')
      const [elfSymbol, mySymbol] = values
      if (!isElfSymbol(elfSymbol)) {
        throw new Error(`invalid input for elf: ${elfSymbol}`)
      }
      if (!isMySymbol(mySymbol)) {
        throw new Error(`invalid input for me: ${mySymbol}`)
      }
      return [elfSymbol, mySymbol] as const
    })
    .map(([elfSymbol, mySymbol]) => ({
      elf: elfSymbolToChoiceMap[elfSymbol],
      my: mySymbolToChoiceMap[mySymbol],
    }))
    .reduce((score, { elf, my }) => {
      const choiceScore = choicesValue[my]
      const outcomeScore = winMap[my] === elf ? 6 : my === elf ? 3 : 0
      
      const newScore = choiceScore + outcomeScore
      return score + newScore
    },0)
}
console.log(solution(input)) // ?
