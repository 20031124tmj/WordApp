import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('user_word_progress', (table) => {
    table.string('id').primary();
    table.string('user_id').references('id').inTable('users').notNullable();
    table.string('word_id').references('id').inTable('words').notNullable();
    table.string('word_book_id').references('id').inTable('word_books').notNullable();
    table.float('ease_factor').defaultTo(2.5);
    table.integer('interval').defaultTo(0);
    table.integer('repetitions').defaultTo(0);
    table.timestamp('next_review').nullable();
    table.timestamp('last_review').nullable();
    table.string('status', 20).defaultTo('new');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.unique(['user_id', 'word_id', 'word_book_id']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('user_word_progress');
}
