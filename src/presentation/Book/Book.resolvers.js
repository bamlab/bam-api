/**
 * Get the connections between Book and other model
 *
 * @flow
 */

import BamerLoader from '../../business/bamer';

export default {
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
