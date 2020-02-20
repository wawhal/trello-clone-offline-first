import React from 'react';
import { isUserLoggedIn, logout } from '../utils/auth';
import Navbar from '../components/Navbar';
import { setOnlineStatus } from '../utils/offline'
import * as DBUtils from '../utils/database';
import { getPersistedUserInfo, clearPersistedUserInfo } from '../utils/ls'

let currentOnlineStatus = window.navigator.onLine;

const AuthWrapper = ({children}) => {

  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [db, setDb] = React.useState();
  const [userInfo, setUserInfo] = React.useState(null);

  React.useEffect(() => {
    if (isLoggedIn) {
      DBUtils.createDatabase().then(database => {
        setDb(database);
      });
    }
  }, [isLoggedIn])

  const setSession = () => {
    setIsLoading(true);
    isUserLoggedIn()
    .then(loggedIn => {
      if (loggedIn) {
        const userInfo = getPersistedUserInfo();
        if (!userInfo) {
          return logout()
        } else {
          setUserInfo(userInfo);
        }
      }
      setIsLoggedIn(loggedIn);
    })
    .catch(() => {
      setIsLoggedIn(false);
    })
    .finally(() => {
      setIsLoading(false);
    })
  }

  const handleOnlineStatusChange = (x) => {
    console.log(x);
  }

  React.useEffect(() => {
    setSession()
  }, [])

  React.useEffect(() => {
    console.log(window.navigator.onLine);
  }, [window.navigator.onLine])

  const childrenProps = {
    auth: {
      isAuthLoading: isLoading,
      isLoggedIn: isLoggedIn,
      logout: logout,
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