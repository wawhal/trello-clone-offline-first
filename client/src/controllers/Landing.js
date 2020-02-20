import React from 'react';
import Board from './Board';
import Spinner from '../components/Spinner';
import { clearPersistedUserInfo } from '../utils/ls'

const Landing = ({ auth, db }) => {

  if (auth.isAuthLoading) {
    return (
      <div className="display-flex-centre flex-direction-column">
        <Spinner />
      </div>
    );
  }

  if (auth.isLoggedIn) {
    return (
      <div className="app">
        <Board auth={auth} db={db} />
      </div>
    )
  }

  return (
    <div className="display-flex-centre flex-direction-column">
      <h1 className="margin-bottom">Trello Clone</h1>
      <h4>Please login to continue</h4>
    </div>
  );

};

export default Landing;