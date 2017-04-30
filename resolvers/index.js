/**
 * 
 */
const bammerResolver = require('./bammer');
const queryResolver = require('./query');

module.exports = Object.assign({}, queryResolver, bammerResolver);
