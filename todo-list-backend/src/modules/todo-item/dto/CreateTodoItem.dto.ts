import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import { Priority, PriorityEnum } from '../../../common/types';
import { ToPriority } from '../../../common/transformers';
import { IsPriority } from '../../../common/validators';

export class CreateTodoItemDto {
  @ApiProperty({
    description: 'Title of the todo item.',
    maxLength: 64,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(64)
  title: string;

  @ApiProperty({
    description: 'Detail of the todo item.',
    maxLength: 256,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(256)
  detail?: string;

  @ApiProperty({
    description: 'Priority of the todo item.',
    enum: PriorityEnum,
  })
  @ToPriority()
  @IsNotEmpty()
  @IsPriority()
  priority: Priority;
}
