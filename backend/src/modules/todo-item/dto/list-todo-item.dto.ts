import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString, IsOptional, MaxLength } from 'class-validator';
import { Priority } from '../../../common/types/priority';
import { TodoItemSortKey } from '../../../common/types/todo-item-sort-key';
import { ToArrayOfPriority, ToBoolean } from '../../../common/transformers';
import {
  IsArrayOfPriority,
  IsTodoItemSortKey,
} from '../../../common/validators';

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

  @ApiProperty({
    description:
      "The key used to sort todo items. Key can be 'priority', 'created_at' or 'updated_at'",
    required: false,
  })
  @IsOptional()
  @IsTodoItemSortKey()
  sortKey?: TodoItemSortKey;

  @ApiProperty({
    description:
      'Indicate that if the list order of todo items should be reversed.',
    required: false,
  })
  @ToBoolean()
  @IsOptional()
  @IsBoolean()
  reverse?: boolean;
}
