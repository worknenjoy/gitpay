import React from 'react';
import PublicBase from '../../src/components/design-library/templates/base/public-base/public-base';

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