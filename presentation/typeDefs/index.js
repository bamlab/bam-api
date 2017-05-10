/**
 * @description: this helper concatenate all *.gql files to export an array of types
 *
 * @flow
 */

// load fs and path from node
const fs = require('fs');
const path = require('path');

// create an empty array to contains the types
const types = [];

// loop over the type directory and import the content
fs.readdirSync(__dirname).forEach(filename => {
  if (/^\w+\.gql$/.test(filename)) {
    const filePath = path.join(__dirname, filename);
    const fileContent = fs.readFileSync(filePath, { encoding: 'utf8' });
    types.push(fileContent);
  }
});

// export the array of type
module.exports = types;
