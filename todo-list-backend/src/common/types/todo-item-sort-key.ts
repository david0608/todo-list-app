import { isString } from './string'

interface TodoItemSortKeyBrand {
  readonly TodoItemSortKey: unique symbol;
}

export type TodoItemSortKey = string & TodoItemSortKeyBrand;

export const Priority: TodoItemSortKey = 'priority' as TodoItemSortKey;
export const CreatedAt: TodoItemSortKey = 'created_at' as TodoItemSortKey;
export const UpdatedAt: TodoItemSortKey = 'updated_at' as TodoItemSortKey;

export const TodoItemSortKeyEnum = [Priority, CreatedAt, UpdatedAt] as const;

// TodoItemSortKey type guard.
export function isTodoItemSortKey(v: unknown): v is TodoItemSortKey {
  return isString(v) && TodoItemSortKeyEnum.includes(v as TodoItemSortKey)
}
