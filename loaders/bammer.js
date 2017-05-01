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
  constructor(data: BammerType, viewer: {}) {
    this.id = data.id;
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.role = data.role;

    // handle the deprecated properties here
    this.name = [data.firstName, data.lastName].join(' ');
  }
  // get the loader for the request, in order to batch and cach the db calls
  static getLoader() {
    // $FlowFixMe
    return new DataLoader(ids => BammerModel.getByListofIds(ids));
  }
  static async load({ user: viewer, dataloaders }, id) {
    // return null if no id is given
    if (!id) return null;
    // return null if no id is given
    const data = await dataloaders.bammer.load(id);
    if (!data) return null;

    return new Bammer(data, viewer);
  }
  static async loadAll({ user: viewer, dataloaders }) {
    return (await BammerModel.getAll()).map(row => {
      dataloaders.bammer.prime(row.id, row);
      return new Bammer(row, viewer);
    });
  }
  static clearCache({ dataloaders }, id) {
    return dataloaders.bammer.clear(id.toString());
  }
}

module.exports = Bammer;
