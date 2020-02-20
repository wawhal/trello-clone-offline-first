import React from 'react';
import { Card } from 'react-bootstrap';
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
            className="ht1000"
          >
              {
                sortedTasks.map((task, i) => {
                  return (
                    <Draggable
                      key={task.id}
                      draggableId={task.id.toString()}
                      index={task.column_rank}
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
          <InputBox db={db} column_id={id} columnTasks={tasks}/>
          </div>
      )}
      </Droppable>
    </div>
  );
};

export default Column;