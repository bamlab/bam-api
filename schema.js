/**
 * @description: this file defines the graphql schema
 */
const { makeExecutableSchema, addMockFunctionsToSchema } = require('graphql-tools');

// import the types from the type directory
const typeDefs = require('./typeDefs');

// create a schema
const schema = makeExecutableSchema({ typeDefs });

// add mocks to the schema
addMockFunctionsToSchema({ schema });

module.exports = schema;
