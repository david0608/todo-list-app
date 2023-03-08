export * from './boolean'
export * from './date'
export * from './number'
export * from './priority'
export * from './string'
export * from './todoItem'

import { Priority } from './priority'

export type SortKey = 'priority' | 'created_at' | 'updated_at'

export type FilterOptions = {
  search: string,
  priority: Priority | null,
  done: boolean | null,
  sortKey: SortKey,
  reverse: boolean,
}
