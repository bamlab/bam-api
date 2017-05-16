/**
 * Get the root queries
 *
 * @flow
 */

const BamerLoader = require('../../business/bamer');
const BookLoader = require('../../business/book');

module.exports = {
  Query: {
    allBamers(root: {}, _: {}, ctx: ContextType) {
      return BamerLoader.loadAll(ctx);
    },
    bamer(root: {}, args: { id: string }, ctx: ContextType) {
      return BamerLoader.load(ctx, args.id);
    },
    allBooks(root: {}, _: {}, ctx: ContextType) {
      return BookLoader.loadAll(ctx);
    },
    book(root: {}, args: { id: string }, ctx: ContextType) {
      return BookLoader.load(ctx, args.id);
    },
  },
};
