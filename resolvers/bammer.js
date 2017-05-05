/**
 * Resolver for the connection between Bammer and other model
 *
 * @flow
 */

const BookLoader = require('../loaders/book');
module.exports = {
  Bammer: {
    /**
     * Resolve the connection of the books currently borrowed by one bammer
     * 
     * @param {Bammer} bammer 
     * @param {Context} ctx 
     * @returns 
     */
    booksCurrentlyBorrowed(bammer: BammerType, _: {}, ctx: ContextType) {
      return BookLoader.loadByBorrowing(ctx, bammer.id);
    }
  }
};
