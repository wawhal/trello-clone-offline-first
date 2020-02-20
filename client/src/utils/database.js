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

const batchSize = 5;
const pullQueryBuilder = (userId) => {
    return (doc) => {
        if (!doc) {
            doc = {
                id: '',
                updated_at: new Date(0).toUTCString()
            };
        }

        const query = `{
            todos(
                where: {
                    _or: [
                        {updatedAt: {_gt: "${doc.updatedAt}"}},
                        {
                            updatedAt: {_eq: "${doc.updatedAt}"},
                            id: {_gt: "${doc.id}"}
                        }
                    ],
                    userId: {_eq: "${userId}"} 
                },
                limit: ${batchSize},
                order_by: [{column_rank: asc}, {id: asc}]
            ) {
                id
                text
                isCompleted
                deleted
                createdAt
                updatedAt
                userId
            }
        }`;
        return {
            query,
            variables: {}
        };
    };
};

const pushQueryBuilder = doc => {
    const query = `
      mutation InsertTasks($todo: [task_insert_input!]!) {
        insert_task(
          objects: $todo,
          on_conflict: {
            constraint: todos_pkey,
            update_columns: [column_id, column_rank]
          }
        ) {
          returning {
            id
          }
        }
      }
    `;
    const variables = {
        todo: doc
    };

    return {
        query,
        variables
    };
};

export class GraphQLReplicator {
    constructor(db) {
        this.db = db;
        this.replicationState = null;
        this.subscriptionClient = null;      
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
        const replicationState = this.db.todos.syncGraphQL({
           url: GRAPHQL_ENGINE_ENDPOINT,
           headers: {
               'Authorization': `Bearer ${auth.idToken}`
           },
           push: {
               batchSize,
               queryBuilder: pushQueryBuilder
           },
           pull: {
               queryBuilder: pullQueryBuilder(auth.userId)
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
        const endpointUrl = GRAPHQL_ENGINE_ENDPOINT_WS;
        const wsClient = new SubscriptionClient(endpointUrl, {
            reconnect: true,
            connectionParams: {
                headers: {
                    'Authorization': `Bearer ${auth.idToken}`
                }
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
    
        const query = `
        subscription {
          task {
            id
             updated_at 
          }
        }
        `;
    
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