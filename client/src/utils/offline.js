import { isUserLoggedIn } from './auth'

export const pollOnlineStatus = (isOnline, callback) => {
  setInterval(() => setOnlineStatus(isOnline, callback), 1000);
};

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

export const syncDatabase = () => {};

export const clearDatabase = () => {};

