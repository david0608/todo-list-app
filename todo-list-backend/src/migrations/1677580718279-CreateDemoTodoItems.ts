import { MigrationInterface, QueryRunner } from 'typeorm';
import { unfold } from 'fp-ts/Array';
import { countDownGenerator } from '../common/utils';

class CreateTodoItemData {
  title: string;
  detail: string;
  priority: number;

  constructor(title: string, detail: string, priority: number) {
    this.title = title;
    this.detail = detail;
    this.priority = priority;
  }

  static newByNumber(n: number): CreateTodoItemData {
    return new CreateTodoItemData(
      `Todo item ${n}`,
      `This is todo item number ${n}.`,
      (n % 3) + 1,
    );
  }
}

export class CreateDemoTodoItems1677580718279 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const data = unfold(
      100,
      countDownGenerator(CreateTodoItemData.newByNumber),
    );
    await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into('todo_item', ['title', 'detail', 'priority'])
      .values(data)
      .execute();
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
