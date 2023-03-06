import { pipe } from 'fp-ts/function';
import { Option, fromEither as OfromEither } from 'fp-ts/Option';
import {
  Either,
  orElse as EorElse,
  fromOption as EfromOption,
  toUnion as EtoUnion,
  right,
  left,
} from 'fp-ts/Either';
import { isNumber } from './number';

// Parse a value into boolean.
export function makeBoolean(v: unknown): Option<boolean> {
  return pipe(
    left(v),
    EorElse(isTypeOfBoolean),
    EorElse(isValidString),
    EorElse(isValidNumber),
    OfromEither,
  );
}

// Parse a value into boolean. Return original value if failed.
export function tryMakeBoolean<T>(v: T): Either<T, boolean> {
  return pipe(
    v,
    makeBoolean,
    EfromOption(() => v),
  );
}

// Parse a value into boolean. Unwrap result without checking.
export function makeBooleanUncheck<T>(v: T): boolean | T {
  return pipe(v, tryMakeBoolean, EtoUnion);
}

function isTypeOfBoolean<T>(v: T): Either<T, boolean> {
  return typeof v === 'boolean' ? right(v) : left(v);
}

function isValidString<T>(v: T): Either<T, boolean> {
  if (typeof v !== 'string') return left(v);
  switch (v.toLowerCase()) {
    case 'true':
    case 't':
    case '1':
      return right(true);
    case 'false':
    case 'f':
    case '0':
      return right(false);
    default:
      return left(v);
  }
}

function isValidNumber<T>(v: T): Either<T, boolean> {
  if (!isNumber(v)) return left(v);
  if (v === 1) {
    return right(true);
  } else if (v === 0) {
    return right(false);
  } else {
    return left(v);
  }
}
