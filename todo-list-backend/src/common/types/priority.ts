import { flow } from 'fp-ts/function'
import * as O from 'fp-ts/Option'
import * as E from 'fp-ts/Either'
import { optionParseIntRangeIncluding } from '../utils'

export enum Priority {
  Critical = 1,
  Normal = 2,
  Low = 3,
}

type NOT_PRIORITY = "NOT_PRIORITY" 

const NOT_PRIORITY: NOT_PRIORITY = "NOT_PRIORITY"

export function isPriority(v: any): v is Priority {
  return v === Priority.Critical
    || v === Priority.Normal
    || v === Priority.Low
}

export const eitherPriority: <T>(v: T) => E.Either<T, Priority> =
  (v) => isPriority(v) ? E.right(v as Priority) : E.left(v)

export const optionParsePriority: (v: any) => O.Option<Priority> =
  flow(
    optionParseIntRangeIncluding(Priority.Critical, Priority.Low),
    O.chain(
      flow(
        eitherPriority,
        O.fromEither,
      )
    )
  )

export const parsePriority: (v: any) => Priority | NOT_PRIORITY =
  flow(
    optionParsePriority,
    O.getOrElse<Priority | NOT_PRIORITY>(() => NOT_PRIORITY)
  )
