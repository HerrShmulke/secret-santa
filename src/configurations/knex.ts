import knex from 'knex';

export const knexInstance = knex({
  client: 'sqlite',
  connection: {
    filename: "./db.sqlite"
  },
  useNullAsDefault: true
});