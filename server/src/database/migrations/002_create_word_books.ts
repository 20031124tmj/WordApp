import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('word_books', (table) => {
    table.string('id').primary();
    table.string('name', 200).notNullable();
    table.text('description').nullable();
    table.string('language_pair', 20).notNullable().defaultTo('en-zh');
    table.boolean('is_official').defaultTo(false);
    table.integer('word_count').defaultTo(0);
    table.string('cover_url', 500).nullable();
    table.string('created_by').references('id').inTable('users').nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('word_books');
}
