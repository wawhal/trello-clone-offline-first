import React from 'react'
import { Button } from 'react-bootstrap'
import { getPersistedUserInfo } from '../utils/ls'
import uuid from 'uuid/v4';

const InputBox = ({ db, column_id, column_name, columnTasks}) => {

  const [text, setText] = React.useState('');
  const [isInserting, setIsInserting] = React.useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    const userInfo = getPersistedUserInfo();
    const insertPayload = {
      id: uuid(),
      title: text,
      column_id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      user_id: userInfo.userId,
      column_rank: columnTasks.length
    }
    setIsInserting(true)
    db.trello.insert(insertPayload).then(() => {
      setText('');
    }).catch((e) => {
      console.error(e);
      alert('Unable to insert task');
    }).finally(() =>{
      setIsInserting(false);
    })
  }

  const onChange = e => {
    setText(e.target.value);
  };

  return (
    <form onSubmit={onSubmit} disabled={isInserting}>
      <div className="display-flex margin-bottom">
        <input
          type="text"
          value={text}
          placeholder={`Add a new task`}
          onChange={onChange}
          className="form-control margin-right-mid"
        />
        <button className="btn" type="submit">
          <h3>+</h3>
        </button>
      </div>
    </form>
  );

}

export default InputBox;