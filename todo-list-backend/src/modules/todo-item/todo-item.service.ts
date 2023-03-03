import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TodoItem } from '../../typeorm/todo-item.entity';
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
    const { search, priority, done } = listTodoItemDto;
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
    return query.getMany();
  }

  async createOne(createTodoItemDto: CreateTodoItemDto) {
    const newTodoItem = this.todoItemRepository.create(createTodoItemDto);
    return this.todoItemRepository.save(newTodoItem);
  }

  async updateOnebyId(id: string, updateTodoItemDto: UpdateTodoItemDto) {
    return this.todoItemRepository
      .update(id, updateTodoItemDto)
      .then((result) => result.affected);
  }

  async deleteOneById(id: string) {
    return this.todoItemRepository
      .delete({ id })
      .then((result) => result.affected);
  }
}
