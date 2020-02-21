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

  if (!window.navigator.onLine) {
    return null;
  }

  const onClick = auth.isLoggedIn ? logout : login;

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