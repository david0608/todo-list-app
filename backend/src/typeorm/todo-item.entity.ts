import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Priority, PriorityEnum } from '../common/types/priority';
import { Ord } from 'fp-ts/Ord';

@Entity('todo_item')
export class TodoItem {
  @ApiProperty({
    description: 'Todo item id.',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Title of the todo item.' })
  @Column({ type: 'varchar', length: 64 })
  title: string;

  @ApiProperty({ description: 'Detail of the todo item.', required: false })
  @Column({ type: 'varchar', length: 256, nullable: true })
  detail?: string;

  @ApiProperty({
    description: 'Priority of the todo item.',
    enum: PriorityEnum,
  })
  @Column({ type: 'integer' })
  priority: Priority;

  @ApiProperty({ description: 'Done status of the todo item.' })
  @Column({ type: 'boolean' })
  done: boolean;

  @ApiProperty({ description: 'Create time of the todo item.' })
  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @ApiProperty({ description: 'Last update time of the todo item.' })
  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}

export const ordTodoItemByTitle: Ord<TodoItem> = {
  equals: (first, second) => first.title === second.title,
  compare: (first, second) =>
    first.title < second.title ? -1 : first.title > second.title ? 1 : 0,
};
