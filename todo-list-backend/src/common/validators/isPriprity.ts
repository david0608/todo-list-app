import { ValidationOptions, buildMessage, ValidateBy } from 'class-validator'
import { isPriority } from '../types/priority'

export function IsPriority(validationOptions?: ValidationOptions) {
  return ValidateBy(
    {
      name: 'isPriority',
      validator: {
        validate: isPriority,
        defaultMessage: buildMessage(eachPrefix => eachPrefix + '$property must be Priority enum', validationOptions),
      },
    },
    validationOptions,
  )
}
