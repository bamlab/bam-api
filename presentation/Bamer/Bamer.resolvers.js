/**
 * Resolver for the connection between Bamer and other model
 *
 * @flow
 */

const BookLoader = require('../../business/book');
const BamerLoader = require('../../business/bamer');

module.exports = {
  Bamer: {
    /**
     * Resolve the connection of the books currently borrowed by one bamer
     * 
     * @param {Bamer} bamer 
     * @param {Context} ctx 
     * @returns 
     */
    booksCurrentlyBorrowed(bamer: BamerDBType, _: {}, ctx: ContextType) {
      return BookLoader.loadByBorrowing(ctx, bamer.id);
    },
  },
  Query: {
    allBamers(root: {}, _: {}, ctx: ContextType) {
      return BamerLoader.loadAll(ctx);
    },
    bamer(root: {}, args: { id: string }, ctx: ContextType) {
      return BamerLoader.load(ctx, args.id);
    },
  },
};
