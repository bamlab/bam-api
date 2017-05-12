/**
 * Get the connections between Book and other model
 *
 * @flow
 */

const BamerLoader = require('../../business/bamer');
const BookLoader = require('../../business/book');

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
  Query: {
    allBooks(root: {}, _: {}, ctx: ContextType) {
      return BookLoader.loadAll(ctx);
    },
    book(root: {}, args: { id: string }, ctx: ContextType) {
      return BookLoader.load(ctx, args.id);
    },
  },
};
