/**
 * @description: this file contains the Bamer buisness object, in the context of a given http request
 *
 * This file will handle batching and caching, as well a http authentication, scoping and so on
 *
 * @flow
 */
const DataLoader = require('dataloader');
const BamerModel = require('../db/queryBuilders/bamer');

class Bamer {
  id: $PropertyType<BamerDBType, 'id'>;
  firstName: $PropertyType<BamerDBType, 'firstName'>;
  lastName: $PropertyType<BamerDBType, 'lastName'>;
  role: $PropertyType<BamerDBType, 'role'>;
  name: $PropertyType<BamerDBType, 'name'>;
  email: $PropertyType<BamerDBType, 'email'>;

  constructor(data: BamerDBType, viewer: { id?: string }) {
    this.id = data.id;
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.role = data.role;

    // handle the deprecated properties here

    if (viewer.id === data.id) {
      this.email = data.email;
    }
  }

  /** @deprecated */
  get name(): string {
    return [this.firstName, this.lastName].join(' ');
  }

  // get the loaders for the request, in order to batch and cach the db calls
  static getLoaders(): { byId: *, primeLoaders: * } {
    const primeLoaders = (bamers: Array<Bamer>) => {
      for (let bamer of bamers) {
        byId.prime(bamer.id, bamer);
      }
    };
    // $FlowFixMe bug with commonjs version, shoudl be fixed if we go to ES6
    const byId = new DataLoader(ids => BamerModel.getByListofIds(ids));
    return {
      byId,
      primeLoaders,
    };
  }
  static async load({ user: viewer, dataloaders }, id): Promise<?Bamer> {
    // return null if no id is given
    if (!id) return null;
    // return null if no id is given
    const data = await dataloaders.bamer.byId.load(id);
    if (!data) return null;

    return new Bamer(data, viewer);
  }
  static async loadAll({ user: viewer, isBamer, dataloaders }): Promise<Array<Bamer>> {
    if (!isBamer) throw new Error('Must be connected with a bam email address to use the service');

    const data = await BamerModel.getAll();
    dataloaders.bamer.primeLoaders(data);
    return data.map(row => new Bamer(row, viewer));
  }
  static async register({ user: viewer }, { firstName, lastName, role, email }): Promise<?Bamer> {
    if (!viewer || !viewer.email) {
      throw new Error('Must be connected with a bam email address to use the service');
    }
    let data;
    try {
      data = await BamerModel.createAndReturn({ firstName, lastName, role, email });
    } catch (e) {
      switch (true) {
        case e.code === '23505' && e.constraint === 'bamer_email_unique':
          throw new Error('Bamer already registred');
        default:
          throw new Error('Something wrong happened');
      }
    }
    if (!data) return null;

    return new Bamer(data, viewer);
  }
}

module.exports = Bamer;
