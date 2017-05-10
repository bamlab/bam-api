const DataLoader = require('dataloader').default;

declare type ContextType = {
  dataloaders: {
    book: { byId: DataLoader, primeLoaders: Function },
    bammer: { byId: DataLoader, primeLoaders: Function }
  },
  state: { user?: { email: string } }
};
