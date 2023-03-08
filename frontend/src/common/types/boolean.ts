import * as E from 'fp-ts/Either'

const makeBooleanError = new Error('Value is not type of boolean.')

export function makeBoolean(v: unknown): E.Either<Error, boolean> {
  return typeof v === 'boolean' ? E.right(v) : E.left(makeBooleanError)
}
