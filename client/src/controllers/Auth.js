import React from 'react';
import { isUserLoggedIn, logout } from '../utils/auth';
import Navbar from '../components/Navbar';
import { pollOnlineStatus, setOnlineStatus } from '../utils/offline'
import * as DBUtils from '../utils/database';

const AuthWrapper = ({children}) => {

  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isOnline, setIsOnline] = React.useState(false);
  const [db, setDb] = React.useState();

  React.useEffect(() => {
    DBUtils.createDatabase().then(database => {
      setDb(database);
    });
  }, [])


  const setSession = () => {
    setIsLoading(true);
    // isUserLoggedIn()
    // .then(loggedIn => {
    //   setIsLoggedIn(loggedIn);
    // })
    // .catch(() => {
    //   setIsLoggedIn(false);
    // })
    // .finally(() => {
    //   setIsLoading(false);
    // })
    setIsLoggedIn(true);
    setIsLoading(false);
  }

  React.useEffect(() => {
    const callback = (newStatus) => {
      setIsOnline(newStatus);
    };
    setOnlineStatus(isOnline, callback);
    pollOnlineStatus(isOnline, callback);
    // eslint-disable-next-line
  }, [])

  React.useEffect(() => {
    if (isOnline) {
      setSession();
    }
  }, [isOnline])

  const childrenProps = {
    auth: {
      isAuthLoading: isLoading,
      isLoggedIn: isLoggedIn,
      logout,
    },
    db
  };

  const childrenWithProps = React.Children.map(
    children,
    child => React.cloneElement(
      child,
      childrenProps   
    )
  );

  return (
    <div className="layout">
      <Navbar {...childrenProps} />
      {childrenWithProps}
    </div>
  );
}

export default AuthWrapper;