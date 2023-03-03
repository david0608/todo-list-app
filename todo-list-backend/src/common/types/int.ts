import { pipe, flow } from 'fp-ts/function';
import { Option, some, none, chain as Ochain } from 'fp-ts/Option';
import {
  Either,
  right,
  left,
  isRight,
  chain as Echain,
  fromOption as EfromOption,
  toUnion as EtoUnion,
} from 'fp-ts/Either';
import { makeNumber } from './number';

interface IntBrand {
  readonly Int: unique symbol;
}

export type Int = number & IntBrand;

// Int type guard.
export function isInt(v: unknown): v is Int {
  return Number.isInteger(v);
}

// Check if the value an integer within a including range.
export const isIntRangeIncluding: (
  l: Int,
  u: Int,
) => (v: unknown) => boolean = (l, u) =>
  flow(
    checkInt,
    Echain((i) => (l <= i && i <= u ? right(i) : left(i))),
    isRight,
  );

// Try to narrow the type of a value to Int without parsing it.
export function checkInt<T>(n: T): Either<T, Int> {
  return isInt(n) ? right(n) : left(n);
}

// Parse a value into Int.
export function makeInt(v: unknown): Option<Int> {
  return pipe(
    v,
    makeNumber,
    Ochain((n) => (isInt(n) ? some(n) : none)),
  );
}

// Parse a value into Int. Return original value if failed.
export function tryMakeInt<T>(v: T): Either<T, Int> {
  return pipe(
    v,
    makeInt,
    EfromOption(() => v),
  );
}

// Parse a value into Int. Unwrap result without checking.
export function makeIntUncheck<T>(v: T): Int | T {
  return pipe(v, tryMakeInt, EtoUnion);
}
