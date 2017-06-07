
exports.up = function(knex, Promise) {
  return knex.schema.createTable('favorites', (table)=>{
    table.increments("id").primary();
    table.integer('book_id').notNullable();
    table.foreign('book_id').references('books.id').onDelete('CASCADE');
    table.integer('user_id').notNullable();
    table.foreign('user_id').references('users.id').onDelete('CASCADE');
    table.timestamps(true, true);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('favorites');
};
