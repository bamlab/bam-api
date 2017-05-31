/**
 * @description: this file defines the graphql schema
 *
 * @flow
 */
const glob = require('glob');
const fs = require('fs');
const path = require('path');
const { makeExecutableSchema } = require('graphql-tools');
const deepAssign = require('deep-assign');

const typeDefs = [];
let resolvers = {};

// loop over types and import the contents
glob.sync('**/*.type.gql', { cwd: __dirname }).forEach(filename => {
  const filePath = path.join(__dirname, filename);
  const fileContent = fs.readFileSync(filePath, { encoding: 'utf8' });
  typeDefs.push(fileContent);
});

// Loop over resolvers and import the contents
glob.sync('**/*.resolvers.js', { cwd: __dirname }).forEach(filename => {
  const filePath = path.join(__dirname, filename);
  // $FlowFixMe
  const resolversResults = require(filePath);
  resolvers = deepAssign(resolvers, resolversResults);
});

// create a schema
const schema = makeExecutableSchema({ typeDefs, resolvers });

// add mocks to the schema, preserving the existing resolvers (none for the time beeing)
// const mocks = require('./mocks');
// addMockFunctionsToSchema({ schema, mocks, preserveResolvers: true });

module.exports = schema;
