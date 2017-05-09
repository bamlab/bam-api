/**
 * @description: this file contains the Bammer buisness object, in the context of a given http request
 *
 * This file will handle batching and caching, as well a http authentication, scoping and so on
 *
 * @flow
 */
const DataLoader = require('dataloader');
const BammerModel = require('../models/bammer');

class Bammer {
  id: $PropertyType<BammerType, 'id'>;
  firstName: $PropertyType<BammerType, 'firstName'>;
  lastName: $PropertyType<BammerType, 'lastName'>;
  role: $PropertyType<BammerType, 'role'>;
  name: $PropertyType<BammerType, 'name'>;
  email: $PropertyType<BammerType, 'email'>;
  constructor(data: BammerType, viewer: { id?: string }) {
    this.id = data.id;
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.role = data.role;

    // handle the deprecated properties here
    this.name = [data.firstName, data.lastName].join(' ');

    if (viewer.id === data.id) {
      this.email = data.email;
    }
  }
  // get the loaders for the request, in order to batch and cach the db calls
  static getLoaders() {
    const primeLoaders = (bammers: Array<BammerType>) => {
      for (let bammer of bammers) {
        byId.prime(bammer.id, bammer);
      }
    };
    // $FlowFixMe bug with commonjs version, shoudl be fixed if we go to ES6
    const byId = new DataLoader(ids => BammerModel.getByListofIds(ids));
    return {
      byId,
      primeLoaders
    };
  }
  static async load({ user: viewer, dataloaders }, id) {
    // return null if no id is given
    if (!id) return null;
    // return null if no id is given
    const data = await dataloaders.bammer.byId.load(id);
    if (!data) return null;

    return new Bammer(data, viewer);
  }
  static async loadAll({ user: viewer, isBammer, dataloaders }) {
    if (!isBammer) throw new Error('Must be connected with a bam email address to use the service');

    const data = await BammerModel.getAll();
    dataloaders.bammer.primeLoaders(data);
    return data.map(row => new Bammer(row, viewer));
  }
}

module.exports = Bammer;
