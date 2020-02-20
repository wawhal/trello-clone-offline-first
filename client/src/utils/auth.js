import OneGraphAuth from 'onegraph-auth';
import { ONEGRAPH_APP_ID, AUTH_PROVIDER } from '../constants';

export const auth = new OneGraphAuth({
  appId: ONEGRAPH_APP_ID,
});

export const isUserLoggedIn = async () => auth.isLoggedIn(AUTH_PROVIDER);

export const login = async () => {
  return auth.login(AUTH_PROVIDER);
};

export const logout =  async () => auth.logout(AUTH_PROVIDER);
