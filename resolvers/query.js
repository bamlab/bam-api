/**
 * Root resolvers for query type
 */
module.exports = {
  Query: {
    allBooks(root, _, context) {
      return context.book.getAll();
    },
    book(root, args, context) {
      return context.book.getById(args.id);
    },
    allBammers(root, _, context) {
      return context.bammer.getAll();
    },
    bammer(root, args, context) {
      return context.bammer.getById(args.id);
    }
  }
};
