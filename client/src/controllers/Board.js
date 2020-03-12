import React from 'react';
import Columns from '../components/Columns';
import Spinner from '../components/Spinner';

const subs = [];

const Board = ({auth, db}) => {

  const [tasks, setTasks] = React.useState(null);

  const getTasks = () => {
    if (!db) {
      return;
    }
    const sub = db.trello
      .find({
        is_deleted: {
          $ne: true
        }
      })
      .$.subscribe(tasks => {
        if (!tasks) {
          return;
        }
        setTasks(tasks);
    });
    subs.push(sub);
  }

  React.useEffect(() => {
    getTasks ();
  }, [db]);


  if (!tasks) {
    return <Spinner />
  }

  return (
    <div className="display-flex-raw">
      <Columns tasks={tasks} db={db}/>
    </div>
  );

};

export default Board;