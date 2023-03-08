import { flow, pipe } from 'fp-ts/function'
import * as E from 'fp-ts/Either'

const makeNumberError = new Error('Value is not type of number of parsable to number.')

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
