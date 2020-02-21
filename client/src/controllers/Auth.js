import React from 'react';
import { isUserLoggedIn, logout, auth } from '../utils/auth';
import Navbar from '../components/Navbar';
import { tryInternet } from '../utils/offline'
import * as DBUtils from '../utils/database';
import { getPersistedUserInfo, clearPersistedUserInfo } from '../utils/ls'

let currentOnlineStatus = window.navigator.onLine;

const AuthWrapper = ({children}) => {

  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [db, setDb] = React.useState();
  const [userInfo, setUserInfo] = React.useState(null);
  const [gqlReplicator ,setgqlReplicator] = React.useState(null);
  const [isOnline, setIsOnline] = React.useState(false);

  React.useEffect(() => {
    if (isLoggedIn) {
      DBUtils.createDatabase().then(database => {
        setDb(database);
        const graphqlReplicator = new DBUtils.GraphQLReplicator(database);
        setgqlReplicator(graphqlReplicator);
      });
    }
  }, [isLoggedIn])

  React.useEffect(() => {
    if (isLoggedIn && gqlReplicator && window.navigator.onLine) {
      gqlReplicator.restart(auth)
    }
  }, [isLoggedIn, gqlReplicator])

  const setSession = async () => {
    setIsLoading(true);
    const onlineStatus = await tryInternet();
    setIsLoggedIn(onlineStatus);
    if (onlineStatus) {
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
    } else {
      setIsLoading(false);
    }
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