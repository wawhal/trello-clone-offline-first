import React from 'react';
import AuthWrapper from './controllers/Auth'
import Landing from './controllers/Landing';
import { tryInternet } from './utils/offline'
import './App.css';

function App() {
  const [isOnline, setIsOnline] = React.useState(true);
  React.useEffect(() => {
    tryInternet().then(status => {
      setIsOnline(status);
    })
  })
  return (
    <AuthWrapper isOnline={isOnline}>
      <Landing />
    </AuthWrapper>
  );
}

export default App;
