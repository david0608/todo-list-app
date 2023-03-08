import * as E from 'fp-ts/Either'

export function makeString(v: unknown): E.Either<Error, string> {
  return E.right(String(v))
}
