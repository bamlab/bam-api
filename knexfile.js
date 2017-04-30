/**
 * @description: this file is used by knex cli for migration / seed
 */

// in our case, it is just the database config
const config = require('config');
module.exports = config.get('Database');
