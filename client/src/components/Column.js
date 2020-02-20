import React from 'react';
import { Card } from 'react-bootstrap'

const Column = ({
  tasks,
  id,
  name
}) => {
  return (
    <div className="column margin-right">
      <div className="display-flex-centre">
      <h4 style={{textAlign: 'center'}}>{name}</h4>
      </div>
      {
        tasks.map(task => {
          return (
            <Card>
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
            </Card>
          );
        })
      }
    </div>
  );
};

export default Column;