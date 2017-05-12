exports.up = function(knex) {
  return knex.schema.createTableIfNotExists('Bamer', function(table) {
    table.uuid('id').primary();
    table.string('firstName');
    table.string('lastName');
    table.enu('role', ['DEV', 'SALE', 'GROWTH', 'ADMIN']);
    table.timestamps();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('Bamer');
};
