import { ArgumentMetadata, Injectable, PipeTransform, BadRequestException } from '@nestjs/common';
import * as O from 'fp-ts/Option'
import { optionParsePriority } from '../../types/priority'

@Injectable()
export class ParsePriorityPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    const p = optionParsePriority(value)
    if (O.isSome(p)) {
      return p.value
    } else {
      throw new BadRequestException('Validation failed. (Priority enum is expected)')
    }
  }
}
