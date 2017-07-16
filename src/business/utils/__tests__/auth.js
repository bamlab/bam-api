jest.mock('knex');
// import knex from 'knex';
import getViewerAndRoles, { assertIsBamer, getRolesByEmail } from '../auth';

describe('auth utils (unit)', () => {
  it('assertIsBammer should throw an error', () => {
    expect(() => assertIsBamer('george@bam.tech', [])).toThrowErrorMatchingSnapshot();
    expect(() => assertIsBamer('george@bam.tech', ['ANONYMOUS'])).toThrowErrorMatchingSnapshot();
    expect(() =>
      assertIsBamer('george@bam.tech', ['NOT_REGISTRED'])
    ).toThrowErrorMatchingSnapshot();
  });
  it('return bammer roles for bammer email', () => {
    expect(getRolesByEmail('george@bam.tech')).toEqual(['BAMER']);
    expect(getRolesByEmail('george@theodo.fr')).toEqual([]);
  });
});

describe.withTestDatabase('auth utils (integration)', () => {
  it('does return the right user / roles', async () => {
    const email = 'george2@bam.tech';
    const viewerAndRoles = await getViewerAndRoles({ email });
    expect(viewerAndRoles.roles).toEqual(['BAMER']);
    expect(viewerAndRoles.user.email).toEqual('george2@bam.tech');
  });
});
