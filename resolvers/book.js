/**
 * Get the connections between Book and other model
 *
 * @flow
 */
module.exports = {
  Book: {
    /**
     * Resolve the connection of the bammer currently borrowing one book
     * 
     * @returns 
     */
    currentlyBorrowedBy(book: Book, _: {}, ctx: Context) {
      return ctx.bammer.getById(book.bammerBorrowingId);
    }
  }
};
