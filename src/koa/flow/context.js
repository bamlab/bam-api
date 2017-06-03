/* eslint-disable no-undef */
import DataLoader from 'dataloader';

declare type ContextType = {
  dataloaders: {
    book: { byId: DataLoader, primeLoaders: Function },
    bamer: { byId: DataLoader, primeLoaders: Function },
  },
  state: { user?: { email: string } },
};
