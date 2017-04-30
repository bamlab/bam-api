/**
 * Assemble the resolvers together
 *
 * @flow
 */

const bammerResolver = require('./bammer');
const bookResolver = require('./book');
const queryResolver = require('./query');

module.exports = Object.assign({}, queryResolver, bammerResolver, bookResolver);
