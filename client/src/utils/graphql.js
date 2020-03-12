import { GRAPHQL_ENGINE_ENDPOINT } from '../constants'

const query = `
mutation {
  insert_user (objects:{}, ) {
    returning {
      avatar
      id
      username
    }
  }
}
`

export const insertUser = (headers) => {
  return fetch(
    GRAPHQL_ENGINE_ENDPOINT,
    {
      method: 'POST',
      body: JSON.stringify({
        query
      }),
      headers
    }
  ).then(() => {
    console.log('Inserted user in database');
    return Promise.resolve();
  }).catch(() => {
    console.log('Could not insert user in database');
    return Promise.reject();
  });
};