/**
 * Get the root mutation
 *
 * @flow
 */

const BamerLoader = require('../../business/bamer');

module.exports = {
  Mutation: {
    /**
     * Resolve the connection of the bamer currently borrowing one book
     * 
     * @returns 
     */
    registerMyself(root: {}, args: { bamer: any }, ctx: ContextType) {
      console.log(args);
      return BamerLoader.register(ctx, args.bamer);
    },
  },
};
