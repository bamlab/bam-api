/**
 * @description: this file contains the connection to the database
 *
 * @flow
 */

import config from 'config';
module.exports = require('knex')(config.get('Database'));
