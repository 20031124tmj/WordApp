import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('check_ins', (table) => {
    table.string('id').primary();
    table.string('user_id').references('id').inTable('users').notNullable();
    table.string('check_in_date').notNullable();
    table.integer('words_learned').defaultTo(0);
    table.integer('words_reviewed').defaultTo(0);
    table.integer('streak_days').defaultTo(1);
    table.unique(['user_id', 'check_in_date']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('check_ins');
}
