exports.up = function(knex) {
  return knex.schema.table('Bamer', table => {
    table.string('email');
    table.unique('email');
  });
};

exports.down = function(knex) {
  return knex.schema.table('Bamer', table => {
    table.dropUnique('email');
    table.dropColumn('email');
  });
};
