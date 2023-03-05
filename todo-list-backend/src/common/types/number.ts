import { pipe, flow } from 'fp-ts/function';
import { Option, fromEither as OfromEither } from 'fp-ts/Option';
import {
  Either,
  right,
  left,
  fromOption as EfromOption,
  toUnion as EtoUnion,
  orElse as EorElse,
  chain as Echain,
} from 'fp-ts/Either';
import { isString } from './string';

// number type guard.
export function isNumber(v: unknown): v is number {
  return typeof v === 'number';
}

// Parse a value into number.
export function makeNumber(v: unknown): Option<number> {
  return pipe(
    isNumber(v) ? right(v) : left(v),
    EorElse(
      flow(
        (v) => (isString(v) ? right(Number(v)) : left(v)),
        Echain((n) => (isNaN(n) ? left(n) : right(n))),
      ),
    ),
    OfromEither,
  );
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
