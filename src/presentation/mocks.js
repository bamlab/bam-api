/**
 * @description: this file allows to have better mocks, by using a dedicated mock library
 *
 * @flow
 */

import casual from 'casual';
import { MockList } from 'graphql-tools';

export default {
  String: () => casual.word,
  Bamer: () => {
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
    allBamers: () => new MockList([1, 15]),
  }),
};
