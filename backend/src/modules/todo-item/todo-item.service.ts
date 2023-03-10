import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TodoItem } from '../../typeorm/todo-item.entity';
import { CreatedAt } from '../../common/types/todo-item-sort-key';
import { ListTodoItemDto, CreateTodoItemDto, UpdateTodoItemDto } from './dto';

@Injectable()
export class TodoItemService {
  constructor(
    @InjectRepository(TodoItem)
    private readonly todoItemRepository: Repository<TodoItem>,
  ) {}

  async getOneById(id: string) {
    return this.todoItemRepository.findOneBy({ id });
  }

  async list(listTodoItemDto: ListTodoItemDto) {
    const { search, priority, done, sortKey, reverse } = listTodoItemDto;
    const query = this.todoItemRepository.createQueryBuilder();
    const where = query.where.bind(query);
    const andWhere = query.andWhere.bind(query);
    let nextWhere = where;
    if (search !== undefined) {
      nextWhere('LOWER(title) LIKE :search', {
        search: `%${search.toLowerCase()}%`,
      });
      nextWhere = andWhere;
    }
    if (priority !== undefined) {
      nextWhere('priority IN (:...priority)', { priority: priority });
      nextWhere = andWhere;
    }
    if (done !== undefined) {
      nextWhere('done = :done', { done: done });
    }
    if (sortKey !== undefined) {
      query.orderBy(sortKey, reverse ? 'ASC' : 'DESC');
    } else {
      query.orderBy(CreatedAt, 'DESC');
    }
    query.addOrderBy('title', 'DESC');
    return query.getMany();
  }

  async createOne(createTodoItemDto: CreateTodoItemDto) {
    return this.todoItemRepository
      .createQueryBuilder()
      .insert()
      .into(TodoItem)
      .values([createTodoItemDto])
      .returning([
        'id',
        'title',
        'detail',
        'priority',
        'done',
        'created_at',
        'updated_at',
      ])
      .execute()
      .then((res) => res.raw[0] as TodoItem);
  }

  async updateOnebyId(id: string, updateTodoItemDto: UpdateTodoItemDto) {
    if (Object.keys(updateTodoItemDto).length === 0) {
      return 1;
    } else {
      return this.todoItemRepository
        .update(id, updateTodoItemDto)
        .then((result) => result.affected);
    }
  }

  async deleteOneById(id: string) {
    return this.todoItemRepository
      .delete({ id })
      .then((result) => result.affected);
  }
}
