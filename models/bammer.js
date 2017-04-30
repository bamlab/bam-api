/**
 * @description: this file contains the query builder to access the Bammer table
 */

const db = require('../connectors/db');

class BammerModel {
  /**
   * Get a bammer by the uuid
   * 
   * @static
   * @param {String} id 
   * @returns 
   * 
   * @memberOf BammerModel
   */
  static async getById(id) {
    return await db.select().table('Bammer').where('id', id);
  }
  /**
   * Get every bammer
   * 
   * @static
   * @returns 
   * 
   * @memberOf BammerModel
   */
  static async getAll() {
    return await db.select().table('Bammer');
  }
}

module.exports = BammerModel;
