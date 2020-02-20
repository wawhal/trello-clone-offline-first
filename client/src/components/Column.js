import React from 'react';
import * as Card from './Card'
import { Droppable, Draggable } from 'react-beautiful-dnd';

const Column = ({
  tasks,
  id,
  name,
}) => {

  const sortedTasks = tasks.sort((t1, t2) => {
    if (t1 > t2) return 1;
    return -1;
  });

  return (
    <div className="column margin-right" key={id}>
      <div className="display-flex-centre">
        <h4 style={{textAlign: 'center'}}>{name}</h4>
      </div>
      <Droppable
        droppableId={id.toString()}
      >
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
          >
              {
                sortedTasks.map((task, i) => {
                  return (
                    <Draggable
                      key={task.id}
                      draggableId={task.id.toString()}
                      index={task.index}
                    >
                      {
                        (provided, snapshot) => (
                          <div
                            className="card"
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
                                <small className="text-muted">Last updated at {task.updated_at}</small>
                                <small className="text-muted">Created by {task.user_id}</small>
                              </div>
                            </Card.Footer>
                          </div>
                         )
                      }
                    </Draggable>
                  );
                })
              }
          </div>
      )}
      </Droppable>
    </div>
  );
};

export default Column;