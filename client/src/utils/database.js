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
      migrationStrategies: {
        1: () => null,
        2: () => null,
        3: () => null,
        4: () => null,
        5: () => null,
        6: () => null,
        7: () => null,
        8: () => null,
      }
    })
  } catch (e) {
    console.log(e);
  }

  return db;
};

export const clearDatabase = () => {
  if (window.db) {
    return window.db.remove().then(() => {
      return Promise.resolve();
    }).catch((e) => {
      console.error(e);
      return Promise.reject();
    })
  } else {
    return Promise.resolve();
  }
}

export const pullQueryBuilder = (doc) => {
  if (!doc) {
      doc = {
          id: '',
          updated_at: new Date(0).toUTCString()
      };
  }

  const query = `
query (
  $updated_at: timestamptz,
  $id: String,
  $column_id: Int,
  $column_rank: numeric
) {
  task (
    where: {
      _or: [
        { updated_at: { _gt: $updated_at } },
        {
          _and: [
            { id: { _eq: $id } },
            { column_id: { _neq: $column_id } },
            { column_rank: { _neq: $column_rank } }
          ]
        }
      ]
    }
  ) {
    id
    column_id
    column_rank
    created_at
    title
    updated_at
    is_deleted
    user_id
    user {
      avatar
      id
      username
    }
  }
}

  `;
  return {
    query,
    variables: {
      updated_at: doc.updated_at,
      id: doc.id,
      column_id: doc.column_id,
      column_rank: doc.column_rank
    }
  };
};

const pushQueryBuilder = doc => {

  const query = `
    mutation ($tasks: [task_insert_input!]!) {
      insert_task(
        objects: $tasks
        on_conflict: {
          constraint: task_pkey,
          update_columns: [column_rank, column_id, updated_at, is_deleted]
        }
      ) {
        returning {
          id
          is_deleted
        }
      }
    }
  `;

  const sanitise = (obj) => {
    const objCopy = { ...obj };
    delete objCopy.created_at
    delete objCopy.user
    delete objCopy.deleted
    delete objCopy.user_id
    return objCopy;
  }

  let sanitisedDoc = {...doc};
  if (doc.constructor.name === 'Object') {
    sanitisedDoc = sanitise(sanitisedDoc);
  } else {
    sanitisedDoc = doc.map(d => {
      return sanitise(d);
    })
  }
  const variables = {
    tasks: sanitisedDoc
  };

  return {
      query,
      variables
  };
};

const batchSize = 5;

export class GraphQLReplicator {
    constructor(db) {
        this.db = db;
        this.replicationState = null;
        this.subscriptionClient = null;      
    }

    close = () => {
      if (this.subscriptionClient) {
        this.subscriptionClient.close();
      }
    }

    async restart(auth) {
        if(this.replicationState) {
            this.replicationState.cancel()
        }

        if(this.subscriptionClient) {
            this.subscriptionClient.close()
        }

        this.replicationState = await this.setupGraphQLReplication(auth)
        this.subscriptionClient = this.setupGraphQLSubscription(auth, this.replicationState)
    }

    async setupGraphQLReplication(auth) {
        const replicationState = this.db.trello.syncGraphQL({
           url: GRAPHQL_ENGINE_ENDPOINT,
           headers: auth.authHeaders(),
           push: {
               batchSize,
               queryBuilder: pushQueryBuilder
           },
           pull: {
               queryBuilder: pullQueryBuilder
           },
           live: true,
           /**
            * Because the websocket is used to inform the client
            * when something has changed,
            * we can set the liveIntervall to a high value
            */
           liveInterval: 1000 * 60 * 10, // 10 minutes
           deletedFlag: 'deleted'
       });
   
       replicationState.error$.subscribe(err => {
           console.error('replication error:');
           console.dir(err);
       });

       return replicationState;
    }
   
    setupGraphQLSubscription(auth, replicationState) {
        const wsClient = new SubscriptionClient(GRAPHQL_ENGINE_ENDPOINT_WS, {
            reconnect: true,
            connectionParams: {
                headers: auth.authHeaders()
            },
            timeout: 1000 * 60,
            onConnect: () => {
                console.log('SubscriptionClient.onConnect()');
            },
            connectionCallback: () => {
                console.log('SubscriptionClient.connectionCallback:');
            },
            reconnectionAttempts: 10000,
            inactivityTimeout: 10 * 1000,
            lazy: true
        });
    
        const query = `subscription onTodoChanged {
            task {
                id
                updated_at
            }       
        }`;
    
        const ret = wsClient.request({ query });
    
        ret.subscribe({
            next(data) {
                console.log('subscription emitted => trigger run');
                console.dir(data);
                replicationState.run();
            },
            error(error) {
                console.log('got error:');
                console.dir(error);
            }
        });
    
        return wsClient
    }    
}
