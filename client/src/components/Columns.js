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

const Columns = ({ db, tasks }) => {

  const columnsWithTodos = columns.map(c => {
    const columnTasks = tasks.filter(t => c.id === t.column_id);
    return {
      ...c,
      tasks: columnTasks
    };
  });

  const reorderTasks = (taskId, source, destination) => {
    if (destination.index == source.index) return;
    const movedTask = tasks.find(t => t.id == taskId);
    delete movedTask._data["_deleted"]
    delete movedTask._data["_revisions"]
    movedTask.update({
      $set: {
        column_rank: destination.index
      }
    }).then(() => {
      if (destination.index < source.index) {
        db.trello.find({
          $and: [{
            column_id: {
              $eq: parseInt(destination.droppableId, 10)
            }
          }, {
            column_rank: {
              $gte: destination.index
            }        
          }, {
            column_rank: {
              $lt: source.index
            }        
          }]
        }).update({
          $inc: {
            column_rank: 1
          }
        })
      } else {
        db.trello.find({
          $and: [{
            column_id: {
              $eq: parseInt(destination.droppableId, 10)
            }
          }, {
            column_rank: {
              $gt: source.index
            }        
          }, {
            column_rank: {
              $lte: source.index
            }        
          }]
        }).update({
          $inc: {
            column_rank: -1
          }
        })
      }
    }).catch((e) => {
      console.error('could not update', e);
    });;
  };

  const moveTasks = (taskId, source, destination) => {
    const movedTask = tasks.find(t => t.id == taskId);
    movedTask.update({
      $set: {
        column_rank: destination.index,
        column_id: parseInt(destination.droppableId, 10)
      }
    }).then(() => {
      db.trello.find({
        $and: [{
          column_id: {
            $eq: parseInt(destination.droppableId, 10)
          }
        }, {
          column_rank: {
            $gte: destination.index
          }        
        }]
      }).update({
        $inc: {
          column_rank: 1
        }
      });
    }).catch(e => {
      console.error(e);
    });

  }

  console.log(tasks.map(t => ({
    id: t.id,
    column_id: t.column_id,
    column_rank: t.column_rank
  })))

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