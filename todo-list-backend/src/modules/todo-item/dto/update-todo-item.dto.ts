import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString, IsOptional, MaxLength } from 'class-validator';
import { Priority, PriorityEnum } from '../../../common/types/priority';
import { ToPriority } from '../../../common/transformers';
import { IsPriority } from '../../../common/validators';

export class UpdateTodoItemDto {
  @ApiProperty({
    description: 'Text used to update todo item title.',
    maxLength: 64,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(64)
  title?: string;

  @ApiProperty({
    description: 'Text used to update todo item detail.',
    maxLength: 256,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(256)
  detail?: string;

  @ApiProperty({
    description: 'Priority enum used to update todo item priority.',
    enum: PriorityEnum,
    required: false,
  })
  @ToPriority()
  @IsOptional()
  @IsPriority()
  priority?: Priority;

  @ApiProperty({
    description: 'Boolean value used to update todo item done status.',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  done?: boolean;
}
