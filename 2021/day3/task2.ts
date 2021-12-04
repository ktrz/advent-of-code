import { input } from "./input2";

type Bucket = [number, number];
type Buckets = Bucket[];

const getInputNumbers = (str: string) =>
  str
    .trim()
    .split("\n")
    .map((line) => line.split("").map((v) => +v));

getInputNumbers(input) // ?

const calculateBitsFrequency = (numbers: number[][]) =>
  numbers.reduce((buckets: Buckets, line) => {
    line.forEach((digit, index) => {
      buckets[index] = buckets[index] || [0, 0];
      buckets[index][digit]++;
    });
    return buckets;
  }, []);

const inputNumbers = getInputNumbers(input);

const calculateRating = (
  numbers: number[][],
  fitFunction: (freq: [number, number]) => number
) =>
  parseInt(
    inputNumbers[0]
      .reduce((numbers, _, index) => {
        const bit = calculateBitsFrequency(numbers).map(fitFunction)[index];
        return numbers.length > 1
          ? numbers.filter((num) => num[index] === bit)
          : numbers;
      }, numbers)[0]
      .join(""),
    2
  );

const oxygenGeneratorRating = calculateRating(inputNumbers, ([d1, d2]) =>
  d1 > d2 ? 0 : 1
); // ?

const coScrubberRating = calculateRating(inputNumbers, ([d1, d2]) =>
d1 <= d2 ? 0 : 1
);

const solution = oxygenGeneratorRating * coScrubberRating;

console.log(solution);

//1007985
