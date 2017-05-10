/**
 * Get the connections between Book and other model
 *
 * @flow
 */

const BammerLoader = require('../../business/bammer');

module.exports = {
  Book: {
    /**
     * Resolve the connection of the bammer currently borrowing one book
     * 
     * @returns 
     */
    currentlyBorrowedBy(book: BookDBType, _: {}, ctx: ContextType) {
      return BammerLoader.load(ctx, book.bammerBorrowingId);
    },
  },
};
