import React from 'react';
import { CardColumns, Card } from 'react-bootstrap'
import Column from './Column';
import { DragDropContext } from 'react-beautiful-dnd';

const columns = [
  {
    id: 0,
    name: 'Random'
  },
  {
    id: 1,
    name: 'Todo'
  },
  {
    id: 2,
    name: 'WIP'
  },
  {
    id: 3,
    name: 'Done'
  },
];

const Columns = ({ db, tasks }) => {

  tasks.forEach(t => {
    delete t._data["_deleted"];
    delete t._data["_revisions"];
  })

  const columnsWithTasks = columns.map(c => {
    const columnTasks = tasks.filter(t => c.id === t.column_id);
    return {
      ...c,
      tasks: columnTasks
    };
  });

  const reorderTasks = (source, destination, draggableId) => {
    const destinationColumnTasks = columnsWithTasks.find(c => c.id == destination.droppableId).tasks;
    let newRank;
    if (destination.index === 0) {
      if (destinationColumnTasks.length) {
        newRank = destinationColumnTasks[0].column_rank - 1;
      } else {
        newRank = 1;
      }
    } else if (destination.index === destinationColumnTasks.length - 1) {
      newRank = destinationColumnTasks[destinationColumnTasks.length - 1].column_rank + 1;
    } else {
      newRank = (destinationColumnTasks[destination.index].column_rank + destinationColumnTasks[destination.index - 1].column_rank) / 2;
    }

    db.trello.find({
      id: {
        $eq: draggableId
      }
    }).update({
      $set: {
        column_rank: newRank,
        column_id: parseInt(destination.droppableId, 10)
      }
    })
  }

  const moveTasks = (source, destination, draggableId) => {
    const destinationColumnTasks = columnsWithTasks.find(c => c.id == destination.droppableId).tasks;
    let newRank;
    if (destination.index === 0) {
      if (destinationColumnTasks.length) {
        newRank = destinationColumnTasks[0].column_rank - 1;
      } else {
        newRank = 1;
      }
    } else if (destination.index === destinationColumnTasks.length) {
      newRank = destinationColumnTasks[destinationColumnTasks.length - 1].column_rank + 1;
    } else {
      newRank = (destinationColumnTasks[destination.index].column_rank + destinationColumnTasks[destination.index - 1].column_rank) / 2;
    }

    db.trello.find({
      id: {
        $eq: draggableId
      }
    }).update({
      $set: {
        column_rank: newRank,
        column_id: parseInt(destination.droppableId, 10)
      }
    })
  }

  const handleDragEnd = result => {
    const { source, destination, draggableId } = result;
    if (!destination || !source) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    if (destination.droppableId === source.droppableId)  {
      if (destination.index !== source.index) {
        reorderTasks(source, destination, draggableId);
      }
    } else {
      moveTasks(source, destination, draggableId);
    }
  }

  return (
    <DragDropContext
      onDragEnd={handleDragEnd}
    >
    {
      columnsWithTasks.map(c => {
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