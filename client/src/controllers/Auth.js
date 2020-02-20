import React from 'react';
import { isUserLoggedIn, logout } from '../utils/auth';
import Navbar from '../components/Navbar';
import { pollOnlineStatus, setOnlineStatus } from '../utils/offline'

const AuthWrapper = ({children}) => {

  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isOnline, setIsOnline] = React.useState(false);

  const setSession = () => {
    setIsLoading(true);
    isUserLoggedIn()
    .then(loggedIn => {
      setIsLoggedIn(loggedIn);
    })
    .catch(() => {
      setIsLoggedIn(false);
    })
    .finally(() => {
      setIsLoading(false);
    })
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

  const authProps = {
    auth: {
      isAuthLoading: isLoading,
      isLoggedIn: isLoggedIn,
      logout,
    }
  };

  const childrenWithProps = React.Children.map(
    children,
    child => React.cloneElement(
      child,
      authProps   
    )
  );

  return (
    <div className="layout">
      <Navbar {...authProps} />
      {childrenWithProps}
    </div>
  );
}

export default AuthWrapper;