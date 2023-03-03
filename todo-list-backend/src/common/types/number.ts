import { pipe } from 'fp-ts/function';
import { Option, some, none } from 'fp-ts/Option';
import {
  Either,
  fromOption as EfromOption,
  toUnion as EtoUnion,
} from 'fp-ts/Either';

// number type guard.
export function isNumber(v: unknown): v is number {
  return typeof v === 'number';
}

// Parse a value into number.
export function makeNumber(v: unknown): Option<number> {
  if (isNumber(v)) {
    return some(v);
  } else {
    const n = Number(v);
    if (Number.isNaN(n)) {
      return none;
    } else {
      return some(n);
    }
  }
}

// Parse a value into number. Return original value if failed.
export function tryMakeNumber<T>(v: T): Either<T, number> {
  return pipe(
    v,
    makeNumber,
    EfromOption(() => v),
  );
}

// Parse a value into number. Unwrap result without checking.
export function makeNumberUncheck<T>(v: T): number | T {
  return pipe(v, tryMakeNumber, EtoUnion);
}
