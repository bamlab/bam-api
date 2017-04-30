/**
 * @description: this file defines the graphql schema
 *
 * @flow
 */

const {
  makeExecutableSchema,
  addResolveFunctionsToSchema,
  addMockFunctionsToSchema,
  attachConnectorsToContext
} = require('graphql-tools');

// import the types from the type directory
const typeDefs = require('./typeDefs');

// create a schema
const resolvers = require('./resolvers');
const schema = makeExecutableSchema({ typeDefs, resolvers });

// add mocks to the schema, preserving the existing resolvers (none for the time beeing)
// const mocks = require('./mocks');
// addMockFunctionsToSchema({ schema, mocks, preserveResolvers: true });

module.exports = schema;
