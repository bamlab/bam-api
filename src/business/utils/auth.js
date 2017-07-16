// @flow
import * as queryBuilders from '../../db/queryBuilders';
import { SevenBoom } from 'graphql-apollo-errors';

export const ROLES = {
  ANONYMOUS: 'ANONYMOUS',
  NOT_REGISTRED: 'NOT_REGISTRED',
  BAMER: 'BAMER',
};

export default async function getViewerAndRoles(
  requestUser: any
): Promise<{| user: ?BamerDBType, roles: Array<string> |}> {
  // if there is no user (ie req.state.user is falsy), return no user and anonymous role
  if (!requestUser) {
    return {
      user: null,
      roles: [ROLES.ANONYMOUS],
    };
  }
  const user: ?BamerDBType = await queryBuilders.bamer.getByEmail(requestUser.email);
  if (!user) {
    return {
      user: null,
      roles: [ROLES.NOT_REGISTRED],
    };
  }
  return {
    user,
    roles: getRolesByEmail(user.email),
  };
}

export function getRolesByEmail(email: string): Array<string> {
  let roles = [];
  const isBammerEmail = /^\w+@bam\.tech$/;
  if (isBammerEmail.test(email)) {
    roles.push(ROLES.BAMER);
  }
  return roles;
}

export function assertIsBamer(user: BamerDBType, roles: Array<string>) {
  if (roles.includes(ROLES.NOT_REGISTRED)) {
    throw new SevenBoom.unauthorized(
      `Please connect to use this functionality`,
      {},
      'ANONYMOUS_DISALOWED'
    );
  }
  if (roles.includes(ROLES.NOT_REGISTRED)) {
    throw new SevenBoom.notFound(
      `User with email ${user.email} is unregistred : please perform a registration mutation`,
      { email: user.email },
      'REGISTRED_USER_NOT_FOUND'
    );
  }
  if (!roles.includes(ROLES.BAMER)) {
    throw new SevenBoom.forbidden('User should be a bamer', {}, 'FORBIDEN');
  }
}
