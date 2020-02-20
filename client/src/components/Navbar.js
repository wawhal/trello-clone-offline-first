import React from 'react';
import { Navbar, Nav } from 'react-bootstrap'
import AuthButton from './AuthButton';
import { getPersistedUserInfo } from '../utils/ls'

const NavigationBar = ({ auth }) => {

  const [userInfo, setUserInfo] = React.useState(null);

  React.useEffect(() => {
    const _userInfo = getPersistedUserInfo();
    if (_userInfo) {
      setUserInfo(_userInfo)
    }
  }, [auth]);

  const getUserInfoNav = () => {
    
    if (!userInfo) {
      return null;
    }
    return (
      <Navbar.Collapse className="justify-content-end">
        <Navbar.Text className="margin-right-mid">
          Signed in as: <i>{userInfo.username}</i> 
        </Navbar.Text>
        <img src={userInfo.avatar} className="avatar"/>
      </Navbar.Collapse>
    )
  }

  return (
    <div className="margin-bottom">
      <Navbar expand="lg">
        <Navbar.Brand>Trello Clone</Navbar.Brand>
        <Nav>
          <AuthButton auth={auth} />
        </Nav>
      {getUserInfoNav()}
      </Navbar>
    </div>
  )
};

export default NavigationBar;


