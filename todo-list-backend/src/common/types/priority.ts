import { pipe } from 'fp-ts/function';
import { Option, some, none, chain as Ochain } from 'fp-ts/Option';
import {
  Either,
  fromOption as EfromOption,
  toUnion as EtoUnion,
} from 'fp-ts/Either';
import { Int, makeInt, isIntRangeIncluding } from './int';

interface PriorityBrand {
  readonly Priority: unique symbol;
}

export type Priority = Int & PriorityBrand;

export const Critical: Priority = 1 as Priority;
export const Normal: Priority = 2 as Priority;
export const Low: Priority = 3 as Priority;

export const PriorityEnum = [Critical, Normal, Low] as const;

// Priority type guard.
export function isPriority(v: unknown): v is Priority {
  return pipe(v, isIntRangeIncluding(Critical, Low));
}

// Priority[] type guard.
export function isArrayOfPriority(av: unknown[]): av is Priority[] {
  return !av.some((v) => !isPriority(v));
}

// Parse a value into Priority.
export function makePriority(v: unknown): Option<Priority> {
  return pipe(
    v,
    makeInt,
    Ochain((i) =>
      isIntRangeIncluding(Critical, Low)(i) ? some(i as Priority) : none,
    ),
  );
}

// Parse a value into Priority. Return original value if failed.
export function tryMakePriority<T>(v: T): Either<T, Priority> {
  return pipe(
    v,
    makePriority,
    EfromOption(() => v),
  );
}

// Parse a value into Priority. Unwrap result without checking.
export function makePriorityUncheck<T>(v: T): Priority | T {
  return pipe(v, tryMakePriority, EtoUnion);
}
