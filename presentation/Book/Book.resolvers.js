/**
 * Get the connections between Book and other model
 *
 * @flow
 */

const BamerLoader = require('../../business/bamer');

module.exports = {
  Book: {
    /**
     * Resolve the connection of the bamer currently borrowing one book
     * 
     * @returns 
     */
    currentlyBorrowedBy(book: BookDBType, _: {}, ctx: ContextType) {
      return BamerLoader.load(ctx, book.bamerBorrowingId);
    },
  },
};
