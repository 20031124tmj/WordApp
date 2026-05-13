import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('achievements', (table) => {
    table.string('id').primary();
    table.string('code', 50).unique().notNullable();
    table.string('name', 100).notNullable();
    table.text('description').notNullable();
    table.string('icon', 100).notNullable();
    table.json('condition').notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('achievements');
}
