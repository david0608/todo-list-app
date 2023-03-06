import { isTodoItemSortKey } from './todo-item-sort-key';

describe('number', () => {
  const todoItemSortKeys = ['priority', 'created_at', 'updated_at'];
  const nonTodoItemSortKeys = [
    'title',
    true,
    false,
    BigInt(Number.MAX_VALUE),
    Symbol(1),
    {},
    [],
    null,
    undefined,
  ];

  describe('isTodoItemSortKey', () => {
    const test = (tobe: boolean) => (v: unknown) => {
      expect(isTodoItemSortKey(v)).toBe(tobe);
    };

    it('should return true if v is todo-item-sort-key.', () => {
      todoItemSortKeys.forEach(test(true));
    });

    it('should return false if v is not todo-item-sort-key', () => {
      nonTodoItemSortKeys.forEach(test(false));
    });
  });
});
