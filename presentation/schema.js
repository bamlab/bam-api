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

const queryRegex = /type PartialQuery\w+ {\n([\s\S]*?)\n}/m;
const mutationRegex = /type PartialMutation\w+ {\n([\s\S]*?)\n}/m;

const typeDefs = [];
const queries = [];
const mutations = [];
let resolvers = {};

// loop over types and import the contents
glob.sync('**/*.type.gql', { cwd: __dirname }).forEach(filename => {
  const filePath = path.join(__dirname, filename);
  const fileContent = fs.readFileSync(filePath, { encoding: 'utf8' });
  typeDefs.push(fileContent);
});

// loop over schemas and import the contents
glob.sync('**/*.schema.gql', { cwd: __dirname }).forEach(filename => {
  const filePath = path.join(__dirname, filename);
  const fileContent = fs.readFileSync(filePath, { encoding: 'utf8' });
  const queriesResults = fileContent.match(queryRegex);
  const mutationsResults = fileContent.match(mutationRegex);
  if (queriesResults && queriesResults[1]) {
    queries.push(queriesResults[1]);
  }
  if (mutationsResults && mutationsResults[1]) {
    mutations.push(mutationsResults[1]);
  }
});

// Loop over resolvers and import the contents
glob.sync('**/*.resolvers.js', { cwd: __dirname }).forEach(filename => {
  const filePath = path.join(__dirname, filename);
  // $FlowFixMe
  const resolversResults = require(filePath);
  resolvers = deepAssign(resolvers, resolversResults);
});

// Create schema types
let root = `
  type Query {
  ${queries.join('\n')}
  }
`;

if (mutations.length) {
  root += `
    type Mutation {
    ${mutations.join('\n')}
    }
  `;
}

typeDefs.push(root);

// create a schema
const schema = makeExecutableSchema({ typeDefs, resolvers });

// add mocks to the schema, preserving the existing resolvers (none for the time beeing)
// const mocks = require('./mocks');
// addMockFunctionsToSchema({ schema, mocks, preserveResolvers: true });

module.exports = schema;
