/**
 * @description: this file allows to have better mocks, by using a dedicated mock library
 *
 * @flow
 */

const casual = require('casual');
const { MockList } = require('graphql-tools');

module.exports = {
  String: () => casual.word,
  Bammer: () => {
    const lastName = casual.last_name;
    const firstName = casual.first_name;
    return {
      lastName,
      firstName,
      name: [firstName, lastName].join(' '),
      booksCurrentlyBorrowed: () => new MockList([0, 5]),
    };
  },
  Book: () => ({
    name: () => casual.title,
    author: () => casual.name,
  }),
  Query: () => ({
    allBammers: () => new MockList([1, 15]),
  }),
};
