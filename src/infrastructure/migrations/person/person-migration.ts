import { inject, injectable } from "inversify";
import { Knex } from "knex";
import { GLOBAL_TYPES } from "../../../constants/global-types";
import { Migration } from "../migration";
import { IPersonMigration, PERSON_TABLE_NAME } from "./person-migration.interfaces";

@injectable()
export class PersonMigration extends Migration implements IPersonMigration {
  constructor(
    @inject(GLOBAL_TYPES.KNEX) private knex: Knex
  ) {
    super();
  }

  protected createTable(): Promise<void> {
    return this.knex.schema.createTable(PERSON_TABLE_NAME, (table) => {
      table.increments('id').unique().primary();
      table.string('name');
      table.string('email').notNullable().unique();
      table.text('gift');
      table.timestamps(true, true);
    });
  }

  protected isTableExists(): Promise<boolean> {
    return this.knex.schema.hasTable(PERSON_TABLE_NAME);
  }
}