import { wsScheme } from './utils/url'

export const ONEGRAPH_APP_ID = process.env.REACT_APP_ONEGRAPH_APP_ID;
export const AUTH_PROVIDER = "github";
export const GRAPHQL_ENGINE_ENDPOINT = process.env.REACT_APP_GRAPHQL_ENGINE_ENDPOINT;
export const GRAPHQL_ENGINE_ENDPOINT_WS = wsScheme(GRAPHQL_ENGINE_ENDPOINT);
export const ONLINE = window.navigator.onLine;
export const RXDB_PASSWORD = process.env.RXDB_PASSWORD || 'mypassword';