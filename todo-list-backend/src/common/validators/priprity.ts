import { ValidationOptions, buildMessage, ValidateBy } from 'class-validator';
import { isPriority, isArrayOfPriority } from '../types';

export function IsPriority(validationOptions?: ValidationOptions) {
  return ValidateBy(
    {
      name: 'isPriority',
      validator: {
        validate: isPriority,
        defaultMessage: buildMessage(
          (eachPrefix) => eachPrefix + '$property must be Priority enum',
          validationOptions,
        ),
      },
    },
    validationOptions,
  );
}

export function IsArrayOfPriority(validationOptions?: ValidationOptions) {
  return ValidateBy(
    {
      name: 'isArrayOfPriority',
      validator: {
        validate: isArrayOfPriority,
        defaultMessage: buildMessage(
          (eachPrefix) =>
            eachPrefix + '$property must be array of Priority enum',
          validationOptions,
        ),
      },
    },
    validationOptions,
  );
}
