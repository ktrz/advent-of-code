import { input } from './input1'

type Bucket = [number, number]
type Buckets = Bucket[]

const calculateBitsFrequency = (str: string) => {
  return str
    .trim()
    .split('\n')
    .map((line) => line.split('').map((v) => +v))
    .reduce((buckets: Buckets, line) => {
      line.forEach((digit, index) => {
        buckets[index] = buckets[index] || [0, 0]
        buckets[index][digit]++
      })
      return buckets
    }, [])
}

const freq = calculateBitsFrequency(input)

const gammaRate = parseInt(
  freq.map(([d1, d2]) => (d1 > d2 ? 0 : 1)).join(''),
  2,
)

const epsilonRate = parseInt(
  freq.map(([d1, d2]) => (d1 < d2 ? 0 : 1)).join(''),
  2,
)

gammaRate // ?
epsilonRate // ?

const solution = gammaRate * epsilonRate

console.log(solution)
