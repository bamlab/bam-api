/**
 * Development fixtures
 *
 * @flow
 */

const uuidV4 = require('uuid/v4');
const knex = require('knex');

exports.seed = function(knex: knex, Promise: typeof Promise) {
  // Deletes ALL existing entries
  return Promise.all([
    knex('Bammer').del().then(function() {
      // Insert three Bammer
      return knex('Bammer').insert([
        { id: 'd906656b-2b4f-4afe-bcd5-34c7d50ab035', firstName: 'Marek', lastName: 'Kalnik' },
        { id: 'ce53da3a-da7d-4893-a2a1-b48ffdbb4644', firstName: 'Tycho', lastName: 'Tatitscheff' },
        { id: 'ed09776a-6c35-4527-9c1f-d333ac9f8abf', firstName: 'Florian', lastName: 'Rival' }
      ]);
    }),
    // Deletes ALL existing entries
    knex('Book').del().then(function() {
      // Insert three Books
      return knex('Book').insert([
        {
          id: '21be5479-5ed6-423a-ad6e-b78eb59eeb07',
          name: 'Refactoring',
          author: 'Martin Fowler',
          bammerBorrowingId: 'd906656b-2b4f-4afe-bcd5-34c7d50ab035'
        },
        {
          id: 'b4310c4d-2bc9-4936-9462-e8426ac51988',
          name: 'The Five Dysfunctions of a Team',
          author: 'Patrick M. Lencioni',
          bammerBorrowingId: 'ce53da3a-da7d-4893-a2a1-b48ffdbb4644'
        },
        {
          id: '66240ca5-9cc5-43ce-9633-fbf159382d34',
          name: 'Elixir in Action',
          author: 'Saša Jurić',
          bammerBorrowingId: 'ce53da3a-da7d-4893-a2a1-b48ffdbb4644'
        }
      ]);
    })
  ]);
};
