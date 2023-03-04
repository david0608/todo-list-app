import { ValidationOptions, buildMessage, ValidateBy } from 'class-validator';
import { isTodoItemSortKey } from '../types/todo-item-sort-key'

export function IsTodoItemSortKey(validationOptions?: ValidationOptions) {
  return ValidateBy(
    {
      name: 'isTodoItemSortKey',
      validator: {
        validate: isTodoItemSortKey,
        defaultMessage: buildMessage(
          (eachPrefix) => eachPrefix + '$property must be TodoItemSortKey enum',
          validationOptions,
        ),
      },
    },
    validationOptions,
  );
}
