import { pipe } from 'fp-ts/function'
import * as E from 'fp-ts/Either'
import { sequenceS } from 'fp-ts/Apply'
import { makeBoolean } from './boolean'
import { makeString } from './string'
import { Priority, makePriority } from './priority'
import { lookupAndMake, lookupAndMakeOptional, makeArray } from './utils'

export type TodoItem = {
  id: string,
  title: string,
  detail?: string,
  priority: Priority,
  done: boolean,
  created_at: string,
  updated_at: string,
}

export function makeTodoItem(v: unknown): E.Either<Error, TodoItem> {
  return pipe(
    {
      id: lookupAndMake(makeString)('id')(v),
      title: lookupAndMake(makeString)('title')(v),
      detail: lookupAndMakeOptional(makeString)('detail')(v),
      priority: lookupAndMake(makePriority)('priority')(v),
      done: lookupAndMake(makeBoolean)('done')(v),
      created_at: lookupAndMake(makeString)('created_at')(v),
      updated_at: lookupAndMake(makeString)('updated_at')(v),
    },
    sequenceS(E.Apply),
  )
}

export function makeArrayOfTodoItem(v: unknown): E.Either<Error, TodoItem[]> {
  return makeArray(makeTodoItem)(v) as E.Either<Error, TodoItem[]>
}
