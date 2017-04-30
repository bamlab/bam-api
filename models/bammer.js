/**
 * @description: this file contains the query builder to access the Bammer table
 *
 * @flow
 */

const db = require('../connectors/db');

class BammerModel {
  /**
   * Get a bammer by the uuid
   * 
   * @static
   * @memberOf BammerModel
   */
  static async getById(id: String): Promise<Bammer> {
    return await db.select().table('Bammer').where('id', id);
  }
  /**
   * Get every bammer
   * 
   * @static
   * @memberOf BammerModel
   */
  static async getAll(): Promise<Array<Bammer>> {
    return await db.select().table('Bammer');
  }
}

module.exports = BammerModel;
