/**
 * @description: this file defines the graphql schema
 *
 * @flow
 */
import glob from 'glob';
import fs from 'fs';
import path from 'path';
import { makeExecutableSchema } from 'graphql-tools';

const typeDefs = [];

// loop over types and import the contents
glob.sync('**/*.type.gql', { cwd: __dirname }).forEach(filename => {
  const filePath = path.join(__dirname, filename);
  const fileContent = fs.readFileSync(filePath, { encoding: 'utf8' });
  typeDefs.push(fileContent);
});

import resolvers from './resolvers';

// create a schema
const schema = makeExecutableSchema({ typeDefs, resolvers });

// add mocks to the schema, preserving the existing resolvers (none for the time beeing)
// import mocks from './mocks';
// addMockFunctionsToSchema({ schema, mocks, preserveResolvers: true });

export default schema;
