/**
 * Devlopment fixtures
 */
const uuidV4 = require('uuid/v4');

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return Promise.all([
    knex('Bammer').del().then(function() {
      // Insert three Bammer
      return knex('Bammer').insert([
        { id: 'd906656b-2b4f-4afe-bcd5-34c7d50ab035', firstName: 'Marek', lastName: 'Kalnik' },
        { id: 'ce53da3a-da7d-4893-a2a1-b48ffdbb4644', firstName: 'Tycho', lastName: 'Tatitscheff' },
        { id: 'ed09776a-6c35-4527-9c1f-d333ac9f8abf', firstName: 'Florian', lastName: 'Rival' }
      ]);
    })
  ]);
};
