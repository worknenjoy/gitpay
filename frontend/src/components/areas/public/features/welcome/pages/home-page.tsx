import React, { useEffect } from 'react';
import Home from '../../../../../design-library/templates/home/home';

const HomePage = ({ loggedIn, isLogged, info, getInfo, signOut, registerUser, forgotPassword }) => {
  
  useEffect(() => {
    isLogged?.();
  }, [isLogged]);

  const handleSignupUser = async (data) => {
    await registerUser(data);
  }

  const handleForgotPassword = async (data) => {
    await forgotPassword(data);
  }

  return (
    <Home
      loggedIn={loggedIn}
      bottomBarProps={{ info, getInfo }}
      accountMenuProps={{ signOut }}
      loginFormSignupFormProps={{ onSubmit: handleSignupUser }}
      loginFormForgotFormProps={{ onSubmit: handleForgotPassword }}
    />
  );
};

export default HomePage;