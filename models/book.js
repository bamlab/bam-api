/**
 * @description: this file contains the query builder to access the Book table
 *
 * @flow
 */

const db = require('../connectors/db');

class BookModel {
  /**
   * Get Book by id
   * 
   * @static
   * @memberOf BookModel
   */
  static async getById(id: string): Promise<BookType> {
    return await db.select().table('Book').where('id', id);
  }
  /**
   * Get Books that one bammer is currently borrowing
   * 
   * @static
   * @memberOf BookModel
   */
  static async getByBorrowerId(id: string): Promise<Array<BookType>> {
    return await db.select().table('Book').where('bammerBorrowingId', id);
  }
  /**
   * Get every books
   * 
   * @static
   * @memberOf BookModel
   */
  static async getAll(): Promise<Array<BookType>> {
    return await db.select().table('Book');
  }
  /**
   * Get the corresponding list of bammer of a given list of uuid
   *
   * Used for batching in dataloader
   * 
   * @static
   * @memberOf BammerModel
   */
  static async getByListofIds(ids: Array<string>): Promise<Array<BookType | Error>> {
    return await db.select().table('Book').whereIn('id', ids);
  }
}

module.exports = BookModel;
