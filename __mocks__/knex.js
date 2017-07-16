/* eslint-env jest */

// shamelesly copied from https://gist.github.com/cpsubrian/b4820b475e7262251a16fb286606e4f7

import _ from 'lodash';
import path from 'path';
import fs from 'fs';
import callsites from 'callsites';
import hash from 'object-hash';
import Config from 'config';

const knex = require.requireActual('knex');

const config = Config.get('Database');
const dirs = {
  migrations: path.resolve(__dirname, '../src/db/migrations'),
  seeds: path.resolve(__dirname, '../src/db/seeds'),
};

// Track jasmine suites and specs.
let suites = [];
let specs = [];
global.jasmine.getEnv().addReporter({
  suiteStarted: suite => suites.push(suite),
  suiteDone: () => suites.pop(),
  specStarted: spec => specs.push(spec),
  specDone: () => specs.pop(),
});

// Helper to get the current spec's fullname, or in absense, the nearest
// suite.
function getSpecName() {
  let spec = _.last(specs);
  let suite = _.last(suites);
  if (spec) {
    return spec.fullName;
  } else if (suite) {
    return suite.description;
  }
  throw new Error('Not currently in a spec or a suite');
}
// Test dbs will be stored here.
const stack = [];
stack.ensure = function() {
  if (!stack.length) {
    stack.unshift(knex(config));
  }
};

// Create the knex proxy. This will treat whichever db is at the front
// of the stack as the active one.
const db = new Proxy(
  function(...args) {
    stack.ensure();
    return stack[0].apply(stack[0], args);
  },
  {
    get(target, name) {
      stack.ensure();
      if (!(name in stack[0])) {
        console.warn("Getting non-existant property '" + name + "'");
        return undefined;
      }
      return stack[0][name];
    },
    set(target, name, value) {
      stack.ensure();
      stack[0][name] = value;
      return true;
    },
  }
);

// Destroy any open databases.
afterAll(() => {
  // We need to do this after other afterAll() handlers run.
  setImmediate(() => {
    while (stack.length) {
      stack.shift().destroy();
    }
  });
});

// Mock the db.client and run tests with overridable mocks.
function withMockDatabase(tests) {
  let mocks = {
    _query: jest.fn(() => {
      return Promise.reject(new Error('Not implemented'));
    }),
    _stream: jest.fn(() => {
      return Promise.reject(new Error('Not implemented'));
    }),
    acquireConnection: jest.fn(() => Promise.resolve({})),
    releaseConnection: jest.fn(() => Promise.resolve()),
  };

  beforeAll(() => {
    stack.ensure();
    // Override prototype methods with instance properties.
    _.each(mocks, (val, key) => {
      db.client[key] = val;
    });
  });

  tests(mocks);

  afterAll(() => {
    // Remove instance properties to restore prototype versions.
    _.each(mocks, (val, key) => {
      delete db.client[key];
    });
  });
}

// Inject a real test database for the current test scenario.
function withTestDatabase(tests) {
  const name = `ac_test__${Date.now()}_${Math.floor(Math.random() * 100)}`;

  beforeAll(() => {
    return db
      .raw('CREATE DATABASE ??', [name])
      .then(() => {
        let _config = _.cloneDeep(config);
        _config.database = name;
        stack.unshift(knex(_config));
      })
      .then(() => {
        return db.migrate.latest({ directory: dirs.migrations });
      })
      .then(() => {
        return db.seed.run({ directory: dirs.seeds });
      });
  });

  tests(name);

  afterAll(() => {
    return stack.shift().destroy().then(() => {
      return db.raw('DROP DATABASE ??', [name]);
    });
  });
}

// Store snapshots created in this test run.
const snapshots = {};

// Cache query responses and mock them on subsequent test runs.
function withQuerySnapshots(_filename, tests) {
  let dir = path.resolve(path.dirname(_filename), '__fixtures__');
  let filename = path.basename(_filename) + '.queries';
  let filepath = path.join(dir, filename);
  let exists = fs.existsSync(filepath);
  let update = typeof process.env.REQUERY !== 'undefined';

  if (exists && !update) {
    let cached = require(filepath);
    withMockDatabase(mocks => {
      mocks._query.mockImplementation((conn, obj) => {
        let specName = getSpecName();
        let queryHash = hash(obj.sql);
        let querySnaps = _.get(cached, [specName, queryHash]) || [];
        let snapshot = querySnaps.shift();
        if (snapshot) {
          if (snapshot.error) {
            throw _.extend(new Error(snapshot.error.message), snapshot.error.data);
          } else {
            return Promise.resolve(_.extend({}, obj, snapshot));
          }
        } else {
          throw _.extend(new Error('Could not find snapshot for query'), { obj });
        }
      });
      tests();
    });
  } else {
    withTestDatabase(() => {
      beforeAll(() => {
        db.on('query-response', function captureSnapshot(rows, obj) {
          obj.sql = obj.sql.replace(/\$\d+/g, '?');
          let specName = getSpecName();
          let queryHash = hash(obj.sql);
          let querySnaps = _.get(snapshots, [filepath, specName, queryHash]) || [];
          let snapshot = _.cloneDeep(_.pick(obj, 'sql', 'bindings', 'response'));
          _.set(snapshots, [filepath, specName, queryHash, querySnaps.length], snapshot);
        });
        db.on('query-error', function captureSnapshot(err, obj) {
          obj.sql = obj.sql.replace(/\$\d+/g, '?');
          let specName = getSpecName();
          let queryHash = hash(obj.sql);
          let querySnaps = _.get(snapshots, [filepath, specName, queryHash]) || [];
          let snapshot = _.cloneDeep(_.pick(obj, 'sql', 'bindings'));
          snapshot.error = { message: err.message, data: err };
          _.set(snapshots, [filepath, specName, queryHash, querySnaps.length], snapshot);
        });
      });

      tests();

      afterAll(() => {
        if (_.isEmpty(snapshots[filepath])) {
          if (exists) {
            fs.unlinkSync(filepath);
            if (fs.existsSync(dir) && !fs.readdirSync(dir).length) {
              fs.rmdirSync(dir);
            }
          }
        } else {
          let obj = JSON.stringify(snapshots[filepath] || {}, null, 2);
          if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
          }
          fs.writeFileSync(filepath, `module.exports = ${obj};`);
        }
      });
    });
  }
}

// Return a string with an incrementing count appended.
const counts = {};
function appendCount(str) {
  counts[str] = counts[str] ? ++counts[str] : 0;
  return str + (counts[str] ? `(${counts[str]})` : '');
}

// Extend the global describe object.
global.describe.withMockDatabase = function(description, tests) {
  if (typeof description === 'function') {
    tests = description;
    description = 'with mock database';
  }
  describe(appendCount(description), () => {
    withMockDatabase(tests);
  });
};
global.describe.withTestDatabase = function(description, tests) {
  if (typeof description === 'function') {
    tests = description;
    description = 'with test database';
  }
  describe(appendCount(description), () => {
    withTestDatabase(tests);
  });
};
global.describe.withQuerySnapshots = function(description, tests) {
  const caller = callsites()[1];
  if (typeof description === 'function') {
    tests = description;
    description = 'with query snapshots';
  }
  describe(appendCount(description), () => {
    withQuerySnapshots(caller.getFileName(), tests);
  });
};

export default db;
