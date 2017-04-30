/**
 * @description: this file contains the connection to the database
 */

const config = require('config');
module.exports = require('knex')(config.get('Database'));
