import React from 'react';
import AuthWrapper from './controllers/Auth'
import Landing from './controllers/Landing';
import './App.css';

function App() {
  return (
    <AuthWrapper>
      <Landing />
    </AuthWrapper>
  );
}

export default App;
