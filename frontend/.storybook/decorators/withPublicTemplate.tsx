import React from 'react';
import PublicBase from 'design-library/templates/base/public-base/public-base';
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