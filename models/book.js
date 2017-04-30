/**
 * @description: this file contains the query builder to access the Book table
 */

const db = require('../connectors/db');

class BookModel {
  /**
   * Get Book by id
   * 
   * @static
   * @param {String} id
   * @returns 
   * 
   * @memberOf BookModel
   */
  static async getById(id) {
    return await db.select().table('Book').where('id', id);
  }
  /**
   * Get Books that one bammer is currently borrowing
   * 
   * @static
   * @param {String} id 
   * @returns 
   * 
   * @memberOf BookModel
   */
  static async getByBorrowerId(id) {
    return await db.select().table('Book').where('bammerBorrowingId', id);
  }
  /**
   * Get every books
   * 
   * @static
   * @returns 
   * 
   * @memberOf BookModel
   */
  static async getAll() {
    return await db.select().table('Book');
  }
}

module.exports = BookModel;
