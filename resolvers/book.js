/**
 * Get the connections between Book and other model
 */
module.exports = {
  Book: {
    /**
     * Resolve the connection of the bammer currently borrowing one book
     * 
     * @param {Book} book
     * @param {Context} ctx 
     * @returns 
     */
    currentlyBorrowedBy(book, _, ctx) {
      return ctx.bammer.getById(book.bammerBorrowingId);
    }
  }
};
