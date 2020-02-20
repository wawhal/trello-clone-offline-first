import RxDB from 'rxdb';
import { RXDB_PASSWORD } from '../constants'

import { trelloSchema } from './schema';

import RxDBSchemaCheckModule from 'rxdb/plugins/schema-check';
import RxDBErrorMessagesModule from 'rxdb/plugins/error-messages';
import RxDBValidateModule from 'rxdb/plugins/validate';
import RxDBReplicationGraphQL from 'rxdb/plugins/replication-graphql';

import { GRAPHQL_ENGINE_ENDPOINT, GRAPHQL_ENGINE_ENDPOINT_WS } from '../constants'
import { SubscriptionClient } from 'subscriptions-transport-ws';

RxDB.plugin(RxDBSchemaCheckModule);
RxDB.plugin(RxDBErrorMessagesModule);
RxDB.plugin(RxDBValidateModule);
RxDB.plugin(RxDBReplicationGraphQL);

RxDB.plugin(require('pouchdb-adapter-idb'));

export const createDatabase = async () => {

   const db = await RxDB.create({
      name: 'trellodb',
      adapter: 'idb',
      password: RXDB_PASSWORD,
      queryChangeDetection: true
  });

  console.log('DatabaseService: created database');
  window['db'] = db; // write to window for debugging

  try {
    await db.collection({
      name: 'trello',
      schema: trelloSchema,
      migrationStrategies: {}
    })
  } catch (e) {
    console.log('Getting error');
    console.log(e);
  }

  return db;
};

export const clearDatabase = () => {
  if (window.db) {
    const query = window.db.trello.find();
    query.remove();
  }
}