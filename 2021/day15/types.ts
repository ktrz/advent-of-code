import { Point } from '../../utils'

export interface GraphPath {
  from: Point | null
  cost: number
}

export interface GraphPoint {
  point: Point
  weight: number
  path: GraphPath
  from?: Point[]
}
