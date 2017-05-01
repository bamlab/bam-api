/**
 * Root resolvers for query type
 *
 * @flow
 */
const BammerLoader = require('../loaders/bammer');
const BookLoader = require('../loaders/bammer');

module.exports = {
  Query: {
    allBooks(root: {}, _: {}, ctx: ContextType) {
      return BookLoader.loadAll(ctx);
    },
    book(root: {}, args: { id: string }, ctx: ContextType) {
      return BookLoader.load(ctx, args.id);
    },
    allBammers(root: {}, _: {}, ctx: ContextType) {
      return BammerLoader.loadAll(ctx);
    },
    bammer(root: {}, args: { id: string }, ctx: ContextType) {
      return BammerLoader.load(ctx, args.id);
    }
  }
};
