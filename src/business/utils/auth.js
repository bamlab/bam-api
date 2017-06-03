// @flow
import * as queryBuilders from '../../db/queryBuilders';

export default async function getViewerAndRoles(
  requestUser: any
): Promise<{| user: ?BamerDBType, roles: Array<string> |}> {
  // if there is no user (ie req.state.user is falsy), return no user and anonymous role
  if (!requestUser) {
    return {
      user: null,
      roles: ['ANONYMOUS'],
    };
  }
  const user: ?BamerDBType = await queryBuilders.bamer.getByEmail(requestUser.email);
  if (!user) {
    return {
      user: null,
      roles: ['NOT_REGISTRED'],
    };
  }
  return {
    user,
    roles: getRolesByEmail(user.email),
  };
}

export function getRolesByEmail(email: string): Array<string> {
  let roles = [];
  if (/^\w+@bam\.tech$/.test(email)) {
    roles.push('BAMER');
  }
  return roles;
}
