const DataLoader = require('dataloader').default;

declare type ContextType = {
  models: {
    book: {
      getById: (id: string) => Promise<BookType>,
      getAll: () => Promise<Array<BookType>>,
      getByBorrowerId: (id: string) => Promise<BookType>
    },
    bammer: {
      getById: (id: string) => Promise<BammerType>,
      getAll: () => Promise<Array<BammerType>>
    }
  },
  dataloaders: {
    book: DataLoader,
    bammer: DataLoader
  }
};
