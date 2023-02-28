import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTodoItemTable1677516154269 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
        CREATE TABLE IF NOT EXISTS todo_item (
          id            UUID DEFAULT uuid_generate_v1(),
          title         VARCHAR(64) NOT NULL,
          detail        VARCHAR(256),
          priority      INTEGER NOT NULL,
          done          BOOLEAN NOT NULL DEFAULT FALSE,
          created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          PRIMARY KEY (id)
        );
        `,
    );

    await queryRunner.query(
      `
        CREATE OR REPLACE FUNCTION trigger_set_update_timestamp()
        RETURNS TRIGGER AS
        $$
          BEGIN
            NEW.updated_at = NOW();
            RETURN NEW;
          END;
        $$ LANGUAGE plpgsql;
      `,
    );

    await queryRunner.query(
      `
        CREATE TRIGGER set_update_timestamp
        BEFORE UPDATE ON todo_item
        FOR EACH ROW
        EXECUTE PROCEDURE trigger_set_update_timestamp();
      `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
        DROP TRIGGER set_update_timestamp ON todo_item;
        `,
    );
    await queryRunner.query(
      `
        DROP FUNCTION trigger_set_update_timestamp;
        `,
    );
    await queryRunner.query(
      `
        DROP TABLE IF EXISTS todo_item;
        `,
    );
  }
}
