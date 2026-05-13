import type { Knex } from 'knex';
import path from 'path';

module.exports = {
  development: {
    client: 'better-sqlite3',
    connection: { filename: path.join(__dirname, 'data', 'wordmaster.db') },
    useNullAsDefault: true,
    migrations: {
      directory: './src/database/migrations',
      extension: 'ts',
    },
    seeds: {
      directory: './src/database/seeds',
    },
  },
} as Knex.Config;
