import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('word_book_items', (table) => {
    table.string('id').primary();
    table.string('word_book_id').references('id').inTable('word_books').notNullable();
    table.string('word_id').references('id').inTable('words').notNullable();
    table.integer('position').notNullable();
    table.unique(['word_book_id', 'word_id']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('word_book_items');
}
