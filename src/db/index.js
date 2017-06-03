/**
 * @description: this file contains the connection to the database
 *
 * @flow
 */

import config from 'config';
import knex from 'knex';
export default knex(config.get('Database'));
