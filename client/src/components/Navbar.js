import React from 'react';
import { Navbar, Nav } from 'react-bootstrap'
import AuthButton from './AuthButton';

const NavigationBar = ({ auth }) => {
  return (
    <div className="margin-bottom">
      <Navbar expand="lg">
        <Navbar.Brand>Trello Clone</Navbar.Brand>
        <Nav>
          <AuthButton auth={auth} />
        </Nav>
      </Navbar>
    </div>
  )
};

export default NavigationBar;


