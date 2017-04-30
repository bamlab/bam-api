/**
 * Resolver for the connection between Bammer and other model
 */
module.exports = {
  Bammer: {
    /**
     * Resolve the connection of the books currently borrowed by one bammer
     * 
     * @param {Bammer} bammer 
     * @param {Context} ctx 
     * @returns 
     */
    booksCurrentlyBorrowed(bammer, _, ctx) {
      return ctx.book.getByBorrowerId(bammer.id);
    }
  }
};
