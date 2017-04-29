/**
 * @description: this file defines the graphql schema
 */
const { makeExecutableSchema, addMockFunctionsToSchema } = require('graphql-tools');

// import the types from the type directory
const typeDefs = require('./typeDefs');

// create a schema
const schema = makeExecutableSchema({ typeDefs });

// add mocks to the schema, preserving the existing reseolver (none for the time beeing)
const mocks = require('./mocks');
addMockFunctionsToSchema({ schema, mocks, preserveResolvers: true });

module.exports = schema;
