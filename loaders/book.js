/**
 * @description: this file contains the Book buisness object, in the context of a given http request
 *
 * This file will handle batching and caching, as well a http authentication, scoping and so on
 *
 * @flow
 */
const DataLoader = require('dataloader');
const BookModel = require('../models/book');

class Book {
  id: $PropertyType<BookType, 'id'>;
  name: $PropertyType<BookType, 'name'>;
  author: $PropertyType<BookType, 'author'>;
  constructor(data: BookType, viewer: {}) {
    this.id = data.id;
    this.name = data.name;
    this.author = data.author;
  }
  // get the loader for the request, in order to batch and cach the db calls
  static getLoader() {
    // $FlowFixMe
    return new DataLoader(ids => BokkModel.getByListofIds(ids));
  }
  static async load({ user: viewer, dataloaders }, id) {
    // return null if no id is given
    if (!id) return null;
    // return null if no id is given
    const data = await dataloaders.book.load(id);
    if (!data) return null;

    return new Book(data, viewer);
  }
  static async loadAll({ user: viewer, dataloaders }) {
    return (await BookModel.getAll()).map(row => {
      dataloaders.book.prime(row.id, row);
      return new Book(row, viewer);
    });
  }
  static clearCache({ dataloaders }, id) {
    return dataloaders.BammerLoader.clear(id.toString());
  }
}

module.exports = Book;
