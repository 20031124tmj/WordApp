import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('learning_sessions', (table) => {
    table.string('id').primary();
    table.string('user_id').references('id').inTable('users').notNullable();
    table.string('word_book_id').references('id').inTable('word_books').notNullable();
    table.string('type', 20).notNullable();
    table.timestamp('started_at').defaultTo(knex.fn.now());
    table.timestamp('ended_at').nullable();
    table.integer('words_total').defaultTo(0);
    table.integer('words_correct').defaultTo(0);
    table.integer('words_wrong').defaultTo(0);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('learning_sessions');
}
