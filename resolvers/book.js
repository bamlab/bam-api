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
    currentlyBorrowedBy(book: BookType, _: {}, ctx: ContextType) {
      return ctx.dataloaders.bammer.load(book.bammerBorrowingId);
    }
  }
};
