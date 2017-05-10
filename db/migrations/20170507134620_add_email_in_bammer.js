exports.up = function(knex) {
  return knex.schema.table('Bammer', table => {
    table.string('email');
    table.unique('email');
  });
};

exports.down = function(knex) {
  return knex.schema.table('Bammer', table => {
    table.dropUnique('email');
    table.dropColumn('email');
  });
};
