import React from 'react';
import { CardColumns, Card } from 'react-bootstrap'
import Column from './Column';
import { DragDropContext } from 'react-beautiful-dnd';

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

const sampleTasks = [
  {
    id: 1,
    title: 'First task',
    user_id: '1234',
    column_id: 2,
    index: 0
  },
  {
    id: 2,
    title: 'Se3cond task',
    user_id: '0',
    column_id: 1,
    index: 1
  },
  {
    id: 3,
    title: 'Third task',
    user_id: '134',
    column_id: 1,
    index: 0
  },
  {
    id: 4,
    title: 'Fourth task',
    user_id: '1234',
    column_id: 0,
    index: 0
  },
]

const Columns = ({ db }) => {

  const [tasks, setTasks] = React.useState(sampleTasks);

  const columnsWithTodos = columns.map(c => {
    const columnTasks = tasks.filter(t => c.id === t.column_id);
    return {
      ...c,
      tasks: columnTasks
    };
  });

  const reorderTasks = (taskId, source, destination) => {
    const movedTask = tasks.find(t => t.id == taskId);
    const newTasks = [
      ...tasks.filter(t => t.id != movedTask.id),
      movedTask
    ];
    setTasks(newTasks);
  };

  const moveTasks = (taskId, source, destination) => {
    const movedTask = tasks.find(t => t.id == taskId);
    const newTasks = [
      ...tasks.filter(t => t.id != movedTask.id ),
      { ...movedTask, column_id: parseInt(destination.droppableId, 10) }
    ];
    setTasks(newTasks);

  }

  const handleDragEnd = result => {
    const { source, destination, draggableId } = result;
    if (!destination || !source) return;
    if (source.droppableId === destination.droppableId) {
      reorderTasks(draggableId, source, destination);
    } else {
      moveTasks(draggableId, source, destination);
    }
  }

  return (
    <DragDropContext
      onDragEnd={handleDragEnd}
    >
    {
      columnsWithTodos.map(c => {
        return (
          <div className="wd400" key={c.id}>
          <Column
            {...c}
            db={db}
          />
          </div>
        )
      })
    }
    </DragDropContext>
  )
}

export default Columns;