import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import InputBox from './InsertBox';

const Column = ({
  tasks,
  id,
  name,
  db
}) => {

  const sortedTasks = tasks.sort((t1, t2) => {
    if (t1.column_rank > t2.column_rank) return 1;
    return -1;
  });

  const removeTask = (id) => {
    db.trello.find({
      id: {
        $eq: id
      }
    }).update({
      $set: {
        is_deleted: true,
        updated_at: new Date().toISOString(),
      }
    });
  };

  return (
    <div className="column margin-right" key={id}>
      <div className="display-flex-centre">
        <h4 style={{textAlign: 'center'}}>{name}</h4>
      </div>
      <Droppable
        droppableId={id.toString()}
        ignoreContainerClipping
      >
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            className="ht1000"
          >
              {
                sortedTasks.map((task, i) => {
                  return (
                    <Draggable
                      key={task.id}
                      draggableId={task.id.toString()}
                      index={i}
                    >
                      {
                        (provided, snapshot) => (
                          <div
                            className="card margin-bottom-mid"
                            key={task.id}
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <Card.Body>
                              <Card.Text>
                                {task.title}
                              </Card.Text>
                            </Card.Body>
                            <Card.Footer>
                              <div className="display-flex space-between">
                                <small className="text-muted">Created by {task.user.username}</small>
                                <button className="btn btn-danger remove-button" onClick={() => removeTask(task.id)}>
                                  Remove
                                </button>
                              </div>
                            </Card.Footer>
                          </div>
                         )
                      }
                    </Draggable>
                  );
                })
              }
          <InputBox db={db} column_id={id} columnTasks={tasks}/>
          </div>
      )}
      </Droppable>
    </div>
  );
};

export default Column;