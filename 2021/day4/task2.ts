import { input } from "./input1";

const toNumber = (v: string) => +v;

const sum = (a: number, b: number) => a + b;

const changeIf =
  <E>(predicate: (el: E) => boolean, modify: (el: E) => E) =>
  (el: E) =>
    predicate(el) ? modify(el) : el;

const modify =
  <E>(modification: Partial<E>) =>
  (el: E): E => ({
    ...el,
    ...modification,
  });

const pluck =
  <O, K extends keyof O>(key: K) =>
  (obj: O): O[K] =>
    obj[key];

const equals =
  <V>(v: V) =>
  (w: V) =>
    v === w;

const not =
  <F extends (...args: any[]) => boolean>(fn: F) =>
  (...args) =>
    !fn(...args);

type Board = { nr: number; position: [number, number]; marked: boolean }[];
const checkBoard = (board: Board) => {
  const { col, row } = board.reduce(
    ({ col, row }, { position: [posCol, posRow], marked }) => {
      col[posCol] = col[posCol] || 0;
      row[posRow] = row[posRow] || 0;
      col[posCol] += marked ? 1 : 0;
      row[posRow] += marked ? 1 : 0;
      return {
        col,
        row,
      };
    },
    {
      col: [],
      row: [],
    }
  );
  return col.some(equals(5)) || row.some(equals(5));
};

const convertBoardStringToBoard = (board: string) =>
  board
    .trim()
    .split("\n")
    .map((boardLine, i) =>
      boardLine
        .split(" ")
        .filter(not(equals("")))
        .map(toNumber)
        .map((n, j) => ({
          nr: n,
          position: [i, j] as [number, number],
          marked: false,
        }))
    )
    .reduce((acc, val) => acc.concat(val), []);

const markBoard = (nr: number) => (board: Board) =>
  board.map(
    changeIf((el) => el.nr === nr, modify<Board[number]>({ marked: true }))
  );

const calculateScore = (board: Board) =>
  board
    .filter(not(pluck<Board[number], "marked">("marked")))
    .map(pluck("nr"))
    .reduce(sum, 0);

const getSolution = (inputString: string) => {
  let [numsLine, ...rest] = inputString.trim().split("\n\n");

  const nums = numsLine.split(",").map(toNumber);

  const boards = rest.map(convertBoardStringToBoard);

  let firstNum = 0;
  let lastNum = 0;
  let firstBoards: Board[];
  let lastBoards = boards;
  let currentBoards = boards;

  for (let n of nums) {
    currentBoards = currentBoards.map(markBoard(n));
    if (currentBoards.some(checkBoard)) {
      const winningBoards = currentBoards.filter(checkBoard);
      firstNum = firstNum || n;
      lastNum = n;
      firstBoards = firstBoards || winningBoards;
      lastBoards = winningBoards;
    }
    currentBoards = currentBoards.filter(not(checkBoard));
  }

  return {
    firstScore: firstBoards.map(calculateScore)[0] * firstNum,
    lastScore: lastBoards.map(calculateScore)[0] * lastNum,
  };
};

console.log(getSolution(input));
