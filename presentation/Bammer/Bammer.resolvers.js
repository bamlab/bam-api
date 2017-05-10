/**
 * Resolver for the connection between Bammer and other model
 *
 * @flow
 */

const BookLoader = require('../../business/book');
const BammerLoader = require('../../business/bammer');

module.exports = {
  Bammer: {
    /**
     * Resolve the connection of the books currently borrowed by one bammer
     * 
     * @param {Bammer} bammer 
     * @param {Context} ctx 
     * @returns 
     */
    booksCurrentlyBorrowed(bammer: BammerDBType, _: {}, ctx: ContextType) {
      return BookLoader.loadByBorrowing(ctx, bammer.id);
    },
  },
  Query: {
    allBammers(root: {}, _: {}, ctx: ContextType) {
      return BammerLoader.loadAll(ctx);
    },
    bammer(root: {}, args: { id: string }, ctx: ContextType) {
      return BammerLoader.load(ctx, args.id);
    },
  },
};
