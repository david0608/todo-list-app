import { flow, pipe } from 'fp-ts/function'
import * as O from 'fp-ts/Option'
import * as E from 'fp-ts/Either'
import * as R from 'fp-ts/Record'

const makeNumberError = new Error('Value is not type of number of parsable to number.')

export function isNumber(v: unknown): v is number {
  return typeof v === 'number'
}

export function makeNumber(v: unknown): E.Either<Error, number> {
  return pipe(
    typeof v === 'number' ? E.right(v) : E.left(v),
    E.orElse(
      flow(
        (v) => (typeof v === 'string' ? E.right(Number(v)) : E.left(makeNumberError)),
        E.chain((n) => (isNaN(n) ? E.left(makeNumberError) : E.right(n))),
      ),
    ),
  );
}

export const lookupNumber: (key: string) => (v: unknown) => O.Option<number> =
  (key) => (v) => pipe(
    O.fromNullable(v),
    O.chain(R.lookup(key)),
    O.chain(v => isNumber(v) ? O.some(v) : O.none),
  )
