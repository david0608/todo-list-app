import { pipe } from 'fp-ts/function'
import * as E from 'fp-ts/Either'
import { makeNumber } from './number'

export type Priority = 1 | 2 | 3

const makePriorityError = new Error('Value is not parsable to Priority.')

export function makePriority(v: unknown): E.Either<Error, Priority> {
  return pipe(
    makeNumber(v),
    E.match(
      () => E.left(makePriorityError),
      (n) => [1, 2, 3].includes(n) ? E.right(n as Priority) : E.left(makePriorityError),
    )
  )
}
