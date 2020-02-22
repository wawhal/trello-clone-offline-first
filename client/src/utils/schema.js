export const trelloSchema  = {
  'title': 'trello schema',
  'description': 'todo schema',
  'version': 7,
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
    'updated_at': {
      'type': 'string',
      'format': 'date-time'
    },
    'user': {
      'type': 'object',
      'properties': {
        'id': {
          'type': 'string'
        },
        'username': {
          'type': 'string'
        },
        'avatar': {
          'type': 'string'
        }
      }
    },
    'user_id': {
      'type': 'string'
    },
    'column_rank': {
      'type': 'number'
    }
  },
  'required': ['id', 'title', 'column_id', 'created_at', 'user_id', 'column_rank', 'updated_at'],
   additionalProperties: true
};