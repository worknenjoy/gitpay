import React from 'react';
import PublicBase from 'design-library/templates/base/public-base/public-base';
import SignupSigninBase from 'design-library/templates/base/signup-signin-base/signup-signin-base';
import ExplorerPublicPage from 'design-library/pages/public-pages/explorer-public-page/explorer-public-page/explorer-public-page';

export const withPublicTemplate = (Story: any, context: any) => {
  const { user, accountMenuProps, bottomBarProps, importIssuesProps, loginFormForgotFormProps, loginFormSignupFormProps } = context.args;
  
  return (
    <PublicBase
      user={user}
      accountMenuProps={accountMenuProps}
      bottomBarProps={bottomBarProps}
      importIssuesProps={importIssuesProps}
      loginFormForgotFormProps={loginFormForgotFormProps}
      loginFormSignupFormProps={loginFormSignupFormProps}
    >
      <Story />
    </PublicBase>
  )
};

export const withPublicExplorerTemplate = (Story: any, context: any) => {
  const { user } = context.args;
  
  return ( 
    <ExplorerPublicPage>
      <Story />
    </ExplorerPublicPage>
  )
};

export const withSignupSigninBaseTemplate = (Story: any, context: any) => {
  return (
    <SignupSigninBase>
      <Story />
    </SignupSigninBase>
  )
};
