/**
 * Get the connections between Book and other model
 *
 * @flow
 */

const BammerLoader = require('../../business/bammer');
const BookLoader = require('../../business/book');

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
  Query: {
    allBooks(root: {}, _: {}, ctx: ContextType) {
      return BookLoader.loadAll(ctx);
    },
    book(root: {}, args: { id: string }, ctx: ContextType) {
      return BookLoader.load(ctx, args.id);
    },
  },
};
