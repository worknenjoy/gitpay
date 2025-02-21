import React, { useEffect } from 'react';
import About from '../../../../../design-library/templates/about/about';

const WelcomePage = ({ loggedIn, isLogged, info, getInfo, signOut }) => {

  useEffect(() => {
    isLogged?.();
  }, [isLogged]);

  return (
    <About loggedIn={loggedIn} bottomBarProps={{ info, getInfo }} accountMenuProps={{ signOut }} />
  );
}

export default WelcomePage;