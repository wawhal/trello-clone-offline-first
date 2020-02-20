import React from 'react';
import Board from './Board';
import Spinner from '../components/Spinner';

const Landing = ({ auth, db }) => {

  if (auth.isAuthLoading) {
    return (
      <div className="display-flex-centre flex-direction-column">
        <Spinner />
      </div>
    );
  }

  if (auth.isLoggedIn) {
    return <Board auth={auth} db={db} />;
  }

  return (
    <div className="display-flex-centre flex-direction-column">
      <h1 className="margin-bottom">Trello Clone</h1>
      <h4>Please login to continue</h4>
    </div>
  );

};

export default Landing;