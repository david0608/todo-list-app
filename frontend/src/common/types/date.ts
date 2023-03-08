import { pipe } from 'fp-ts/function'
import * as E from 'fp-ts/Either'

const makeDateError = new Error('Value is not parsable to Date.')

export function makeDate(v: unknown): E.Either<Error, Date> {
  return pipe(
    Date.parse(v as any),
    (n) => isNaN(n) ? E.left(makeDateError) : E.right(new Date(n)),
  )
}
