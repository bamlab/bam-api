/**
 * @description: this file contains the query builder to access the Bamer table
 *
 * @flow
 */

import db from '..';

class BamerModel {
  /**
   * Get a bamer by the uuid
   * 
   * @static
   * @memberOf BamerModel
   */
  static async getById(id: string): Promise<BamerDBType> {
    return await db.first().table('Bamer').where('id', id);
  }
  /**
   * Get a bamer by email
   *
   * Used for authentication
   *
   * @static
   * @memberOf BamerModel
   */
  static async getByEmail(email: string): Promise<BamerDBType> {
    return await db.first().table('Bamer').where('email', email);
  }
  /**
   * Get every bamer
   * 
   * @static
   * @memberOf BamerModel
   */
  static async getAll(): Promise<Array<BamerDBType>> {
    return await db.select().table('Bamer');
  }
  /**
   * Get the corresponding list of bamer of a given list of uuid
   *
   * Used for batching in dataloader
   * 
   * @static
   * @memberOf BamerModel
   */
  static async getByListofIds(ids: Array<string>): Promise<Array<BamerDBType | Error>> {
    return await db.select().table('Bamer').whereIn('id', ids);
  }
  /**
   * Create a new bammer
   *
   * Used for batching in dataloader
   * 
   * @static
   * @memberOf BamerModel
   */
  static async createAndReturn({ firstName, lastName, email, role }): Promise<?BamerDBType> {
    const [id] = await db
      .table('Bamer')
      .returning('id')
      .insert({ firstName, lastName, email, role });
    return await this.getById(id);
  }
}

module.exports = BamerModel;
