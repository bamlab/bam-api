/**
 * Root resolvers for query type
 *
 * @flow
 */

module.exports = {
  Query: {
    allBooks(root: {}, _: {}, ctx: Context) {
      return ctx.book.getAll();
    },
    book(root: {}, args: { id: String }, ctx: Context) {
      return ctx.book.getById(args.id);
    },
    allBammers(root: {}, _: {}, ctx: Context) {
      return ctx.bammer.getAll();
    },
    bammer(root: {}, args: { id: String }, ctx: Context) {
      return ctx.bammer.getById(args.id);
    }
  }
};
