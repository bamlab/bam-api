exports.up = function(knex, Promise) {
  return knex.schema.createTableIfNotExists('Book', function(table) {
    table.uuid('id').primary();
    table.string('name');
    table.string('author');
    table.uuid('bammerBorrowingId').references('id').inTable('Bammer');
    table.timestamps();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('Book');
};
