import { zip } from 'ramda'

export const toNumber = (v: string) => +v

export const sum = (a: number, b: number) => a + b
export const mul = (a: number, b: number) => a * b

export const isTruthy = <T>(x: T): x is NonNullable<T> => !!x

export const pluck =
  <O, K extends keyof O>(key: K) =>
  (obj: O): O[K] =>
    obj[key]

export const not =
  <F extends (...args: any[]) => boolean>(fn: F) =>
  (...args: any[]) =>
    !fn(...args)

export const greaterThan = (x: number) => (y: number) => y > x

export const keyValues = <K extends string | number, V>(
  keys: K[],
  values: V[],
) =>
  zip(keys, values).reduce(
    (obj, [key, value]) => ({
      ...obj,
      [key]: value,
    }),
    {} as Record<K, V>,
  )

export const keyValuesS = (keys: string, values: string) =>
  keyValues(keys.split(''), values.split(''))
