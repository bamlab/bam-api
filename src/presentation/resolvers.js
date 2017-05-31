import BammerResolver from './Bamer/Bamer.resolvers';
import BookResolver from './Book/Book.resolvers';
import QueryResolver from './Query/Query.resolvers';
import MutationResolver from './Mutation/Mutation.resolvers';

export default {
  ...BammerResolver,
  ...BookResolver,
  ...QueryResolver,
  ...MutationResolver,
};
