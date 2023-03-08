import { pipe } from 'fp-ts/function'
import * as O from 'fp-ts/Option'
import * as E from 'fp-ts/Either'
import * as R from 'fp-ts/Record'

type MakeFn<T> = (v: unknown) => E.Either<Error, T>

export const lookupAndMake: <T>(mfn: MakeFn<T>) => (k: string) => (r: unknown) => E.Either<Error, T> =
  (mfn) => (k) => (r) => pipe(
    r as Record<string, unknown>,
    R.lookup(k),
    O.match(
      () => E.left(new Error('Key not exists.')),
      mfn,
    )
)

export const lookupAndMakeOptional: <T>(mfn: MakeFn<T>) => (k: string) => (r: unknown) => E.Either<Error, T | undefined> =
  (mfn) => (k) => (r) => pipe(
    r as Record<string, unknown>,
    R.lookup(k),
    O.toUndefined,
    (v) => v === undefined || v === null ? E.right(undefined) : mfn(v),
)

const makeArrayError = new Error('Value is not an array.')

export const makeArray: <T>(mfn: MakeFn<T>) => (v: unknown) => E.Either<Error, readonly T[]> =
  (mfn) => (v) => pipe(
    Array.isArray(v) ? E.right(v) : E.left(makeArrayError),
    E.chain(E.traverseArray(mfn)),
)
