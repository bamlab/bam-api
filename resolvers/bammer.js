/**
 * Resolver for the connection between Bammer and other model
 *
 * @flow
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
    booksCurrentlyBorrowed(bammer: any, _: {}, ctx: Context) {
      return ctx.book.getByBorrowerId(bammer.id);
    }
  }
};
