export interface BasePacketInfo {
  version: number
  type: number
}

export interface LiteralValue extends BasePacketInfo {
  packetType: 'Literal'
  value: number
}

export interface OperatorTypeZero extends BasePacketInfo {
  packetType: 'OperatorZero'
  subPackets: any[]
}

export interface OperatorTypeOne extends BasePacketInfo {
  packetType: 'OperatorOne'
  subPackets: any[]
}

export type Operator = OperatorTypeZero | OperatorTypeOne
export type Packet = LiteralValue | Operator
