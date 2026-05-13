import knex from 'knex';
import path from 'path';

export function createDb() {
  const dbPath = path.join(process.cwd(), 'data', 'wordmaster.db');

  return knex({
    client: 'better-sqlite3',
    connection: { filename: dbPath },
    useNullAsDefault: true,
    pool: { min: 1, max: 1 },
  });
}

export type Db = ReturnType<typeof createDb>;
