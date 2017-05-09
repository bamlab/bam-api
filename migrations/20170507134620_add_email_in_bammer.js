exports.up = function(knex, Promise) {
  return knex.schema.table('Bammer', table => {
    table.string('email');
    table.unique('email');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('Bammer', table => {
    table.dropUnique('email');
    table.dropColumn('email');
  });
};
