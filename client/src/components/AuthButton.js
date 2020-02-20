import React from 'react';
import { login, logout } from '../utils/auth'
import { Button } from 'react-bootstrap';
import Spinner from './Spinner';

const AuthButton = ({ auth }) => {

  const getAuthButtonContent = () => {
    if (auth.isLoggedIn) {
      return 'Logout';
    }
    return 'Login';
  };

  const [error, setError] = React.useState(null);
  const [buttonContent, setButtonContent] = React.useState(getAuthButtonContent());

  React.useEffect(() => {
    setButtonContent(getAuthButtonContent());
    // eslint-disable-next-line
  }, [auth])

  const loginAndRefresh = () => {
    login()
    .then(() => {
      window.location.replace(window.location.href);
    })
    .catch(err => {
      console.error(error);
      setError(error)
    })
  };

  const logoutAndRefresh = () => {
    logout()
    .then(() => {
      window.location.replace(window.location.href);
    })
    .catch(err => {
      console.error(err);
      alert('Unexpected', 'Could not logout');
    })
  }

  const onClick = auth.isLoggedIn ? logoutAndRefresh : loginAndRefresh;

  return (
    <Button
      disabled={auth.isAuthLoading}
      onClick={onClick}
    >
      {buttonContent}
    </Button>
  )

}

export default AuthButton;