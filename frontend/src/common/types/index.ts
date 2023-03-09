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
  priority?: Priority,
  done?: boolean,
  sortKey: SortKey,
  reverse: boolean,
}
