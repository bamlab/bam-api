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
  static async getById(id: string): Promise<BammerType> {
    return await db.select().table('Bammer').where('id', id);
  }
  /**
   * Get every bammer
   * 
   * @static
   * @memberOf BammerModel
   */
  static async getAll(): Promise<Array<BammerType>> {
    return await db.select().table('Bammer');
  }
  /**
   * Get the corresponding list of bammer of a given list of uuid
   *
   * Used for batching in dataloader
   * 
   * @static
   * @memberOf BammerModel
   */
  static async getByListofIds(ids: Array<string>): Promise<Array<BammerType | Error>> {
    return await db.select().table('Bammer').whereIn('id', ids);
  }
}

module.exports = BammerModel;
