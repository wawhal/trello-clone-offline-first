export const TRELLO_CLONE_LS_ID = 'TRELLO_CLONE_METADATA';

export const persistUserInfo = (userInfo) => {
  let stringified = '{}'
  try {
    stringified = JSON.stringify(userInfo);
  } catch (_) {
  }
  window.localStorage.setItem(TRELLO_CLONE_LS_ID, stringified);
}

export const clearPersistedUserInfo = () => {
  window.localStorage.removeItem(TRELLO_CLONE_LS_ID);
}

export const getPersistedUserInfo = () => {
  const stringified = window.localStorage.getItem(TRELLO_CLONE_LS_ID);
  if (!stringified) return null;
  let userInfo;
  try {
    userInfo = JSON.parse(stringified);
    return userInfo;
  } catch (_) {
    return null;
  }
};
