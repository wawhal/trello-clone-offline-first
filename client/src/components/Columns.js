import React from 'react';
import { CardColumns, Card } from 'react-bootstrap'
import Column from './Column';

const columns = [
  {
    id: 0,
    name: 'Todo'
  },
  {
    id: 1,
    name: 'WIP'
  },
  {
    id: 2,
    name: 'Done'
  },
];

const Columns = ({ tasks }) => {


  const columnsWithTodos = columns.map(c => {
    return {
      ...c,
      tasks: tasks.filter(t => t.column_id === c.id)
    };
  });

  return columnsWithTodos.map(c => {
    return (
      <div className="wd400">
      <Column
        {...c}
      />
      </div>
    )
  })
}

export default Columns;