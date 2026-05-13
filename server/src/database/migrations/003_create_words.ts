import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('words', (table) => {
    table.string('id').primary();
    table.string('word', 200).notNullable();
    table.string('phonetic', 200).nullable();
    table.json('definitions').notNullable();
    table.string('audio_url', 500).nullable();
    table.integer('frequency_rank').nullable();
    table.string('language', 10).defaultTo('en');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('words');
}
