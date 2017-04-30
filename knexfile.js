/**
 * @description: this file is used by knex cli for migration / seed
 *
 * @flow
 */

// remove flow type
require('flow-remove-types/register');
// in our case, it is just the database config
const config = require('config');
module.exports = config.get('Database');
