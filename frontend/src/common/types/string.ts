import { pipe } from 'fp-ts/function'
import * as O from 'fp-ts/Option'
import * as E from 'fp-ts/Either'
import * as R from 'fp-ts/Record'

export function isString(v: unknown): v is string {
  return typeof v === 'string'
}

export function isArrayOfSring(av: unknown): av is string[] {
  return Array.isArray(av) && !av.some((v) => !isString(v))
}

export function makeString(v: unknown): E.Either<Error, string> {
  return E.right(String(v))
}

export const lookupString: (key: string) => (v: unknown) => O.Option<string> =
  (key) => (v) => pipe(
    O.fromNullable(v),
    O.chain(R.lookup(key)),
    O.chain(v => isString(v) ? O.some(v) : O.none),
  )

export const lookupArrayOfString: (key: string) => (v: unknown) => O.Option<string[]> =
  (key) => (v) => pipe(
    O.fromNullable(v),
    O.chain(R.lookup(key)),
    O.chain(v => isArrayOfSring(v) ? O.some(v) : O.none),
  )
