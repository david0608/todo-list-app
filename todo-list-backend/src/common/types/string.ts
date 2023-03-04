import { Either, right, left } from 'fp-ts/Either'

// string type guard.
export function isString(v: unknown): v is string {
  return typeof v === 'string'
}

// Try to narrow the type of a value to string without parsing it.
export function checkString<T>(v: T): Either<T, string> {
  return isString(v) ? right(v) : left(v)
}
