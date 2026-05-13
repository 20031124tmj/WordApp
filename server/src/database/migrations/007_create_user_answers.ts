import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('user_answers', (table) => {
    table.string('id').primary();
    table.string('session_id').references('id').inTable('learning_sessions').notNullable();
    table.string('word_id').references('id').inTable('words').notNullable();
    table.string('user_id').references('id').inTable('users').notNullable();
    table.string('answer_type', 20).notNullable();
    table.integer('response_time_ms').nullable();
    table.boolean('is_correct').notNullable();
    table.timestamp('answered_at').defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('user_answers');
}
