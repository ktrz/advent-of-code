import { input } from './input2'
import { curry, pipe } from 'ramda'
import { mul, sum } from '../../utils'

const toHexadecimal = (value: string): string =>
  value
    .trim()
    .split('')
    .map((n) => `0000${parseInt(n, 16).toString(2)}`.slice(-4))
    .join('')

const extractStringValue = curry(
  (value: string, count: number, start: number): [string, number] => {
    if (start + count > value.length) {
      throw new Error('out of bound')
    }
    return [value.slice(start, start + count), start + count]
  },
)

interface BasePacketInfo {
  version: number
  type: number
}

interface LiteralValue extends BasePacketInfo {
  packetType: 'Literal'
  value: number
}

interface OperatorTypeZero extends BasePacketInfo {
  packetType: 'OperatorZero'
  subPackets: any[]
}

interface OperatorTypeOne extends BasePacketInfo {
  packetType: 'OperatorOne'
  subPackets: any[]
}

type Operator = OperatorTypeZero | OperatorTypeOne
type Packet = LiteralValue | Operator

const getPacket = (stream: string) => {
  const extractString = extractStringValue(stream)
  const extractVersion = extractString(3)
  const extractType = extractString(3)
  const extractLiteral = extractString(5)
  const extractOperatorType = extractString(1)

  const [packet] = readPacket(0)

  return packet

  function readPacket(currIndex: number): [Packet, number] {
    let version: number, type: number
    ;[version, type, currIndex] = readVersionAndType(currIndex)
    switch (type) {
      case 4: {
        return readLiteral(currIndex, version, type)
      }
      default:
        return readOperator(currIndex, version, type)
    }
  }

  function readLiteral(
    index: number,
    version: number,
    type: number,
  ): [LiteralValue, number] {
    let literal = ''
    let curr = ''
    do {
      ;[curr, index] = extractLiteral(index)
      literal += curr.slice(1)
    } while (curr[0] === '1')
    const value = parseInt(literal, 2)
    return [{ packetType: 'Literal', value, version, type }, index]
  }

  function readOperator(
    index: number,
    version: number,
    type: number,
  ): [Operator, number] {
    let i: string
    ;[i, index] = extractOperatorType(index)

    switch (i) {
      case '0':
        return readOperatorZero(index, version, type)
      case '1':
        return readOperatorOne(index, version, type)
      default:
        throw Error('Unknown operator')
    }
  }

  function readSubpacketsWithLength(
    counterLength: number,
    index: number,
  ): [Packet[], number] {
    let subPacketsLengthString: string
    ;[subPacketsLengthString, index] = extractString(counterLength, index)
    const subPacketsLength = parseInt(subPacketsLengthString, 2)
    const subPacketsEnd = index + subPacketsLength
    const subPackets: Packet[] = []
    while (index < subPacketsEnd) {
      let packet: Packet
      ;[packet, index] = readPacket(index)
      subPackets.push(packet)
    }
    return [subPackets, index]
  }

  function readSubPacketsWithCount(
    counterLength: number,
    index: number,
  ): [Packet[], number] {
    let subPacketsCountString: string
    ;[subPacketsCountString, index] = extractString(counterLength, index)
    const subPacketsCount = parseInt(subPacketsCountString, 2)
    const subPackets: Packet[] = []
    for (let i = 0; i < subPacketsCount; i++) {
      let packet: Packet
      ;[packet, index] = readPacket(index)
      subPackets.push(packet)
    }
    return [subPackets, index]
  }

  function readOperatorZero(
    index: number,
    version: number,
    type: number,
  ): [OperatorTypeZero, number] {
    const [subPackets, newIndex] = readSubpacketsWithLength(15, index)

    return [
      {
        packetType: 'OperatorZero',
        version,
        type,
        subPackets,
      },
      newIndex,
    ]
  }

  function readOperatorOne(
    index: number,
    version: number,
    type: number,
  ): [OperatorTypeOne, number] {
    const [subPackets, newIndex] = readSubPacketsWithCount(11, index)

    return [
      {
        packetType: 'OperatorOne',
        version,
        type,
        subPackets,
      },
      newIndex,
    ]
  }

  function readVersionAndType(index: number): [number, number, number] {
    let v: string, t: string
    ;[v, index] = extractVersion(index)
    ;[t, index] = extractType(index)

    return [parseInt(v, 2), parseInt(t, 2), index]
  }
}

const solution = pipe(
  toHexadecimal,
  getPacket,
)

function sumVersions(packet: Packet): number {
  switch (packet.packetType) {
    case 'Literal':
      return packet.version
    default:
      return packet.version + packet.subPackets.map(sumVersions)
        .reduce(sum, 0)
  }
}

function calculatePacket(packet: Packet): number {
  switch (packet.packetType) {
    case 'Literal':
      return packet.value
    default:
      const subPacketsResult = packet.subPackets.map(calculatePacket)
      switch (packet.type) {
        case 0:
          return subPacketsResult.reduce(sum, 0)
        case 1:
          return subPacketsResult.reduce(mul, 1)
        case 2:
          return Math.min(...subPacketsResult)
        case 3:
          return Math.max(...subPacketsResult)
        case 5: {
          const [first, second] = subPacketsResult
          return first > second ? 1 : 0
        }
        case 6: {
          const [first, second] = subPacketsResult
          return first < second ? 1 : 0
        }
        case 7: {
          const [first, second] = subPacketsResult
          return first === second ? 1 : 0
        }


      }
      return packet.version + packet.subPackets.map(sumVersions)
        .reduce(sum, 0)
  }
}

const result = solution(input)
sumVersions(result) // ?
calculatePacket(result) // ?
