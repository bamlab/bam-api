/**
 * @description: this file contains the query builder to access the Book table
 *
 * @flow
 */

import db from '..';

class BookModel {
  /**
   * Get Book by id
   * 
   * @static
   * @memberOf BookModel
   */
  static async getById(id: string): Promise<BookDBType> {
    return await db.first().table('Book').where('id', id);
  }
  /**
   * Get Books that one bamer is currently borrowing
   * 
   * @static
   * @memberOf BookModel
   */
  static async getByBorrowerId(id: string): Promise<Array<BookDBType>> {
    return await db.select().table('Book').where('bamerBorrowingId', id);
  }
  /**
   * Get every books
   * 
   * @static
   * @memberOf BookModel
   */
  static async getAll(): Promise<Array<BookDBType>> {
    return await db.select().table('Book');
  }
  /**
   * Get the corresponding list of bamer of a given list of uuid
   *
   * Used for batching in dataloader
   * 
   * @static
   * @memberOf BamerModel
   */
  static async getByListofIds(ids: Array<string>): Promise<Array<?BookDBType | Error>> {
    return await db.select().table('Book').whereIn('id', ids);
  }
}

export default BookModel;
