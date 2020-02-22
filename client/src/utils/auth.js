import OneGraphAuth from 'onegraph-auth';
import { ONEGRAPH_APP_ID, AUTH_PROVIDER } from '../constants';
import jwtDecode from 'jwt-decode'
import { persistUserInfo, clearPersistedUserInfo } from './ls';
import { clearDatabase } from './database'
import { insertUser } from './graphql'

const SESSION_VAR_USER_ID = 'x-hasura-user-id';
const SESSION_VAR_USERNAME = 'x-hasura-username';
const SESSION_VAR_AVATAR = 'x-hasura-avatar';

export const auth = new OneGraphAuth({
  appId: ONEGRAPH_APP_ID,
});

export const isUserLoggedIn = async () => auth.isLoggedIn(AUTH_PROVIDER);

export const getUserInfoFromToken = (token) => {
  const decoded = jwtDecode(token);
  const hasuraVars = decoded['https://hasura.io/jwt/claims']
  const userInfo = {
    userId: hasuraVars[SESSION_VAR_USER_ID],
    avatar: hasuraVars[SESSION_VAR_AVATAR] || hasuraVars['x-hasura-x-hasura-avatar'],
    username: hasuraVars[SESSION_VAR_USERNAME] || hasuraVars['x-hasura-x-hasura-username'],
  };
  return userInfo;
};

export const login = async () => {
  auth.login(AUTH_PROVIDER).then(sessionInfo => {
    const idToken = sessionInfo.token.accessToken;
    insertUser({ authorization: 'Bearer ' + idToken})
    persistUserInfo(getUserInfoFromToken(idToken));
    window.location.replace(window.location.href);
  }).catch(e => {
    console.error('unable to login');
  })
};

export const logout =  async () => {
  auth.logout(AUTH_PROVIDER).then(() => {
    clearPersistedUserInfo();
    Promise.all([clearDatabase()]).then(() => {
      window.location.replace(window.location.href);
    }).catch((e) => {
      throw e
    })
  }).catch(e => {
    console.error(e);
    alert('unable to logout');
  });
}
