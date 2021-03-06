import { input } from './input2'
import { textToMatrix, toNumber } from '../../utils'
import { last } from 'ramda'
import { repeatMatrix } from './utils'
import { GraphPoint } from './types'
import { dijkstra } from './dijkstra'

const solution = (inputValue: string) => {
  const matrix = textToMatrix(
    inputValue,
    (v, point): GraphPoint => ({
      weight: toNumber(v),
      point,
      path: {
        cost: Infinity,
        from: null,
      },
    }),
  )

  return dijkstra(repeatMatrix(matrix, 5))
}

{
  const resMatrix = solution(input)
  // visualizeSolution(resMatrix)
  const resLine = last(last(resMatrix)!)!
  console.log(resLine.path.cost) // ?
}
