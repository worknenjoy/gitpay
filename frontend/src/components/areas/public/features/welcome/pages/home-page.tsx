import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Home from '../../../../../design-library/templates/home/home';

const HomePage = ({ 
  loggedIn,
  isLogged,
  info,
  getInfo,
  signOut,
  registerUser,
  forgotPassword,
  createTask,
}) => {

  const history = useHistory();

  const handleSignupUser = async (data) => {
    await registerUser(data);
  }

  const handleForgotPassword = async (data) => {
    await forgotPassword(data);
  }

  const handleImportIssue = async (data) => {
    await createTask(data, history);
  }

  useEffect(() => {
    isLogged?.();
  }, [isLogged]);

  return (
    <Home
      loggedIn={loggedIn}
      bottomBarProps={{ info, getInfo }}
      accountMenuProps={{ signOut }}
      loginFormSignupFormProps={{ onSubmit: handleSignupUser }}
      loginFormForgotFormProps={{ onSubmit: handleForgotPassword }}
      importIssuesProps={{ onImport: handleImportIssue }}
    />
  );
};

export default HomePage;