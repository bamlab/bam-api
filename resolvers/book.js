/**
 * Get the connections between Book and other model
 *
 * @flow
 */

const BammerLoader = require('../loaders/bammer');

module.exports = {
  Book: {
    /**
     * Resolve the connection of the bammer currently borrowing one book
     * 
     * @returns 
     */
    currentlyBorrowedBy(book: BookType, _: {}, ctx: ContextType) {
      return BammerLoader.load(ctx, book.bammerBorrowingId);
    }
  }
};
