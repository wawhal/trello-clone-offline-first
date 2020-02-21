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
  const decoded = jwtDecode("eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IkwxMkg0eEVfQ1g0MFcyWTVMR0kyQnI0UlVxRSJ9.eyJpc3MiOiJPbmVHcmFwaCIsImF1ZCI6Imh0dHBzOi8vc2VydmUub25lZ3JhcGguY29tL2Rhc2hib2FyZC9hcHAvZmRkYmJhYTUtNDAxOC00NGIyLTgyNGUtMjk1OGE5MGM2ZDYwIiwiaWF0IjoxNTgyMjI2OTk1LCJleHAiOjE1ODM0MzY1OTUsImh0dHBzOi8vb25lZ3JhcGguY29tL2p3dC9jbGFpbXMiOnsiYWNjZXNzX3Rva2VuIjoiWG80OUpxcFJwczMxTmt4WWcxcmc1OTl5eHg2QndibTEzekktaGF6MV9OZyJ9LCJodHRwczovL2hhc3VyYS5pby9qd3QvY2xhaW1zIjp7IngtaGFzdXJhLXVzZXItaWQiOiIyNzI3NDg2OSIsIngtaGFzdXJhLWRlZmF1bHQtcm9sZSI6InVzZXIiLCJ4LWhhc3VyYS1hbGxvd2VkLXJvbGVzIjpbInVzZXIiXSwieC1oYXN1cmEteC1oYXN1cmEtYXZhdGFyIjoiaHR0cHM6Ly9hdmF0YXJzMS5naXRodWJ1c2VyY29udGVudC5jb20vdS8yNzI3NDg2OT92PTQiLCJ4LWhhc3VyYS14LWhhc3VyYS11c2VybmFtZSI6Indhd2hhbCJ9fQ.C8wogmRcmHKs5ab8EBjUsTutDWIT-9SZncHjmaF3FTlpqcaMLZqLIIcOcDzD4lOU3gvz9Rpw4XKJhAJLn1D6pFZEvC7CjK7lc793czpUizkUZimR6qX8GQCs_s66uqI3wnEYOlNrEAj3BydiXuCxwHksX85TeICZW1Gm0wPpQWRCI1AccA1PPATTsqmn2BIdCJKbbzYLLCGJ7IHqe2sNRN2kWDTwagtq8TVcjIe7YdslJOdYdhV86WQfwP2pWTUqCyDcoJ9tOGuyChnOpZ6ELOosjOZjSQgWabe1dM8wPfRj3GxWI2MupUePLK4iZxkM2rE7oPWhz5vwMW1oi11stA");
  console.log(decoded);
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
    console.log(sessionInfo);
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
    clearDatabase();
    window.location.replace(window.location.href);
  }).catch(e => {
    console.error(e);
    alert('unable to logout');
  });
}
