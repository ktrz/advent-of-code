import * as colors from 'colors'
import { Basin, Board, Point } from './types'

export const printBoard = (
  board: Board,
  lowPoints: Point[],
  basins: Basin[] = [[]],
) => {
  console.log(
    basins
      .map((basin) => {
        return board
          .map((line, i) => {
            return line
              .map((v, j) => {
                return lowPoints.filter(([x, y]) => x === i && y === j).length
                  ? colors.bgMagenta.black(String(board[i][j]))
                  : basin.filter(([x, y]) => x === i && y === j).length
                  ? colors.bgCyan.black(String(board[i][j]))
                  : String(board[i][j])
              })
              .join(' ')
          })
          .join('\n')
      })
      .join('\n\n'),
  )
}

export const printBoard2 = (
  board: Board,
  lowPoints: Point[],
  basins: Basin[],
  largestBasins: Basin[],
) => {
  const basin = basins.flat()
  const lBasin = largestBasins.flat()
  console.log(
    board
      .map((line, i) => {
        return line
          .map((v, j) => {
            return lowPoints.filter(([x, y]) => x === i && y === j).length
              ? colors.bgMagenta.black(String(board[i][j]))
              : lBasin.filter(([x, y]) => x === i && y === j).length
              ? colors.bgRed.white(String(board[i][j]))
              : basin.filter(([x, y]) => x === i && y === j).length
              ? colors.bgCyan.black(String(board[i][j]))
              : String(board[i][j])
          })
          .join(' ')
      })
      .join('\n'),
  )

  console.log()

  function getPredicate(i: number, j: number) {
    return ([x, y]: Point) => x === i && y === j
  }

  const printNr = (s: number) => ('000' + s).slice(-3)

  console.log(
    board
      .map((line, i) => {
        return line
          .map((v, j) => {
            return lowPoints.filter(getPredicate(i, j)).length
              ? colors.bgMagenta.black(printNr(board[i][j]))
              : lBasin.filter(getPredicate(i, j)).length
              ? colors.bgRed.white(
                  printNr(
                    largestBasins.find(
                      (b) => b.filter(getPredicate(i, j)).length,
                    )!.length,
                  ),
                )
              : basin.filter(getPredicate(i, j)).length
              ? colors.bgCyan.black(
                  printNr(
                    basins.find((b) => b.filter(getPredicate(i, j)).length)!
                      .length,
                  ),
                )
              : printNr(board[i][j])
          })
          .join(' ')
      })
      .join('\n'),
  )
}
