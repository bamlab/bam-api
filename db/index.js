/**
 * @description: this file contains the connection to the database
 *
 * @flow
 */

const config = require('config');
module.exports = require('knex')(config.get('Database'));
