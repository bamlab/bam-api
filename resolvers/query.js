/**
 * Root resolvers for query type
 *
 * @flow
 */

module.exports = {
  Query: {
    allBooks(root: {}, _: {}, ctx: ContextType) {
      return ctx.models.book.getAll();
    },
    book(root: {}, args: { id: string }, ctx: ContextType) {
      return ctx.dataloaders.book.load(args.id);
    },
    allBammers(root: {}, _: {}, ctx: ContextType) {
      return ctx.models.bammer.getAll();
    },
    bammer(root: {}, args: { id: string }, ctx: ContextType) {
      return ctx.dataloaders.bammer.load(args.id);
    }
  }
};
