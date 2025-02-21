import React, { useEffect } from 'react';
import Home from '../../../../../design-library/templates/home/home';

const HomePage = ({ loggedIn, isLogged, info, getInfo, signOut, registerUser }) => {
  
  useEffect(() => {
    isLogged?.();
  }, [isLogged]);

  const signupUser = async (data) => {
    console.log('signup', data);
    await registerUser(data);
  }

  return (
    <Home
      loggedIn={loggedIn}
      bottomBarProps={{ info, getInfo }}
      accountMenuProps={{ signOut }}
      loginFormSignupFormProps={{ onSubmit: signupUser }}
    />
  );
};

export default HomePage;