declare type Context = {
  book: {
    getById: (id: String) => Promise<Book>,
    getAll: () => Promise<Array<Book>>,
    getByBorrowerId: (id: String) => Promise<Book>
  },
  bammer: {
    getById: (id: String) => Promise<Bammer>,
    getAll: () => Promise<Array<Bammer>>
  }
};
