import { knexInstance } from './configurations/knex';

export async function initTables() {
  const hasWishes = await knexInstance.schema.hasTable('gifts');
  const hasOneTimeCodes = await knexInstance.schema.hasTable('one_time_codes');
  const hasPairings = await knexInstance.schema.hasTable('pairings');

  if (!hasWishes) {
    await knexInstance.schema.createTable('gifts', (table) => {
      table.increments('id').unique().primary();
      table.integer('owner_id').notNullable().unsigned().references('id').inTable('persons');
      table.string('text').notNullable();
      table.timestamps(true, true);
    });
  }

  if (!hasPairings) {
    await knexInstance.schema.createTable('pairings', (table) => {
      table.increments('id').unique().primary();
      table.integer('santa_id').notNullable().unsigned().references('id').inTable('persons');
      table.integer('recipient_id').notNullable().unsigned().references('id').inTable('persons');
    });
  }

  if (!hasOneTimeCodes) {
    await knexInstance.schema.createTable('one_time_codes', (table) => {
      table.increments('id').unique().primary();
      table.integer('person_id').notNullable().unsigned().references('id').inTable('persons');
      table.string('code').notNullable();
      table.dateTime('expiration_time').notNullable();
    });
  }
}