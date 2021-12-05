export const toNumber = (v: string) => +v

export const sum = (a: number, b: number) => a + b

export const isTruthy = <T>(x: T): x is NonNullable<T> => !!x

export const pluck =
  <O, K extends keyof O>(key: K) =>
  (obj: O): O[K] =>
    obj[key]

export const not =
  <F extends (...args: any[]) => boolean>(fn: F) =>
  (...args: any[]) =>
    !fn(...args)
