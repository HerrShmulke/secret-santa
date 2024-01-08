import { inject, injectable } from "inversify";
import { GLOBAL_TYPES } from "../../../constants/global-types";
import { Migration } from "../migration";
import { Knex } from "knex";
import { ONE_TIME_CODE_TABLE_NAME } from "./one-time-code-migration.interfaces";

@injectable()
export class OneTimeCodeMigration extends Migration {
  constructor(
    @inject(GLOBAL_TYPES.KNEX) private knex: Knex
  ) {
    super();
  }
  
  protected isTableExists(): Promise<boolean> {
    return this.knex.schema.hasTable(ONE_TIME_CODE_TABLE_NAME);
  }

  protected createTable(): Promise<void> {
    return this.knex.schema.createTable(ONE_TIME_CODE_TABLE_NAME, (table) => {
      table.increments('id').unique().primary();
      table.integer('person_id').notNullable().unsigned().references('id').inTable('persons');
      table.string('code').notNullable();
      table.dateTime('expiration_time').notNullable();
    });
  }
}