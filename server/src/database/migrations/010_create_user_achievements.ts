import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('user_achievements', (table) => {
    table.string('id').primary();
    table.string('user_id').references('id').inTable('users').notNullable();
    table.string('achievement_id').references('id').inTable('achievements').notNullable();
    table.timestamp('unlocked_at').defaultTo(knex.fn.now());
    table.unique(['user_id', 'achievement_id']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('user_achievements');
}
