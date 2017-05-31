exports.up = function(knex, Promise) {
  return knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"').then(() => {
    return Promise.all([
      knex.raw('ALTER TABLE ONLY "Bamer" ALTER COLUMN id SET DEFAULT uuid_generate_v4()'),
      knex.raw('ALTER TABLE ONLY "Book" ALTER COLUMN id SET DEFAULT uuid_generate_v4()'),
    ]);
  });
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.raw('ALTER TABLE ONLY "Bamer" ALTER COLUMN id DROP DEFAULT'),
    knex.raw('ALTER TABLE ONLY "Book" ALTER COLUMN id DROP DEFAULT'),
  ]);
};
