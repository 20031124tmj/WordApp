import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('social_shares', (table) => {
    table.string('id').primary();
    table.string('user_id').references('id').inTable('users').notNullable();
    table.string('type', 50).notNullable();
    table.json('content').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('social_shares');
}
