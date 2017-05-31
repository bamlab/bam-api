/* eslint-disable no-undef */
const DataLoader = require('dataloader').default;

declare type ContextType = {
  dataloaders: {
    book: { byId: DataLoader, primeLoaders: Function },
    bamer: { byId: DataLoader, primeLoaders: Function },
  },
  state: { user?: { email: string } },
};
