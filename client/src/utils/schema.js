export const trelloSchema  = {
  'title': 'trello schema',
  'description': 'todo schema',
  'version': 0,
  'type': 'object',
  'properties': {
    'id': {
      'type': 'string',
      'primary': true
    },
    'title': {
      'type': 'string'
    },
    'column_id': {
      'type': 'number'
    },
    'created_at': {
      'type': 'string',
      'format': 'date-time',
    },
    'user_id': {
      'type': 'string'
    },
    'column_rank': {
      'type': 'number'
    }
  },
  'required': ['id', 'title', 'column_id', 'created_at', 'user_id', 'column_rank'],
   additionalProperties: true
};