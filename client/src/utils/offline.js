import { isUserLoggedIn } from './auth'
import { GRAPHQL_ENGINE_ENDPOINT } from '../constants'
import React from 'react';

export const setOnlineStatus = (isOnline, callback) => {
  const status = window.navigator.onLine;
  if (isOnline !== status) {
    if (!isOnline && status) {
      isUserLoggedIn()
      .then(loggedIn => {
        if (loggedIn) {
          // sync
        } else {
          // clear and push to '/'
        }
      })
      .catch(e => {
        console.error(e); 
      })
      .finally(() => {
        callback(status);
      })
    } else {
      callback(status)
    }
  }
}

export const tryInternet = () => {
  return fetch(GRAPHQL_ENGINE_ENDPOINT.replace('graphql', 'version'))
    .then(() => true)
    .catch(() => false);
};

export const syncDatabase = () => {};

export const clearDatabase = () => {};

