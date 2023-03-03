import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString, IsOptional, MaxLength } from 'class-validator';
import { Priority } from '../../../common/types';
import { ToArrayOfPriority, ToBoolean } from '../../../common/transformers';
import { IsArrayOfPriority } from '../../../common/validators';

export class ListTodoItemDto {
  @ApiProperty({
    description: 'Text used to search on todo item title.',
    maxLength: 64,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(64)
  search?: string;

  @ApiProperty({
    description:
      "A ',' separated string representing priority values used to filter todo items.",
    required: false,
  })
  @ToArrayOfPriority()
  @IsOptional()
  @IsArrayOfPriority()
  priority?: Priority[];

  @ApiProperty({
    description: 'The done status used to filter todo items.',
    required: false,
  })
  @ToBoolean()
  @IsOptional()
  @IsBoolean()
  done?: boolean;
}
