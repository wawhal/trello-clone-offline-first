import React from 'react';
import Columns from '../components/Columns';
import Spinner from '../components/Spinner';

const subs = [];

const Board = ({auth, db}) => {

  const [tasks, setTasks] = React.useState(null);

  const getTodos = () => {
    if (!db) {
      return;
    }
    const sub = db.trello
      .find()
      .sort({id: 1}).$.subscribe(tasks => {
        if (!tasks) {
            return;
        }
        setTasks(tasks);
    });
    subs.push(sub);
  }

  const startInterval = (t_) => {
    setTimeout(() => {
    }, 1000)
  }

  React.useEffect(() => {
    getTodos();
    startInterval(tasks);
  }, []);

  if (!tasks) {
    return <Spinner />
  }

  return (
    <div className="display-flex-raw">
      <Columns tasks={tasks} />
    </div>
  );

};

export default Board;