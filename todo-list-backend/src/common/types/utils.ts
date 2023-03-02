import { flow } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import * as E from 'fp-ts/Either';

export function optionParseInt(v: any): O.Option<number> {
  const n = parseInt(v);
  return isNaN(n) ? O.none : O.some(n);
}

export const isNumberRangeIncluding: (
  l: number,
  u: number,
) => (v: any) => boolean = (l, u) => (v) => {
  if (typeof v !== 'number') return false;
  return l <= v && v <= u;
};

export const eitherNumberRangeIncluding: <T>(
  l: number,
  u: number,
) => (v: T) => E.Either<T, number> = (l, u) => (v) =>
  isNumberRangeIncluding(l, u)(v) ? E.right(v as number) : E.left(v);

export const optionParseIntRangeIncluding: (
  l: number,
  u: number,
) => (v: any) => O.Option<number> = (l, u) =>
  flow(
    optionParseInt,
    O.chain(flow(eitherNumberRangeIncluding(l, u), O.fromEither)),
  );
