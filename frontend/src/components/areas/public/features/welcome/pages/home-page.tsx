import React, { useEffect } from 'react';
import Home from '../../../../../design-library/templates/home/home';

const HomePage = ({ loggedIn, isLogged, info, getInfo, signOut }) => {
  
  useEffect(() => {
    isLogged?.();
  }, [isLogged]);

  return (
    <Home
      loggedIn={loggedIn}
      bottomBarProps={{ info, getInfo }}
      accountMenuProps={{ signOut }}
    />
  );
};

export default HomePage;