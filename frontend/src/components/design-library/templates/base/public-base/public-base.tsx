import React from 'react'
import { styled } from '@mui/material/styles'
import TopBar from '../../../organisms/layouts/topbar-layouts/topbar-layout/topbar-layout'
import Bottom from '../../../organisms/layouts/bottom-bar-layouts/bottom-bar-layout/bottom-bar-layout'

const Root = styled('div')(({ theme }) => ({
  flexGrow: 1,
  marginTop: 0,
}))

type PublicBaseProps = {
  children: React.ReactNode
  user?: any
  bottomBarProps?: any
  accountMenuProps?: any
  loginFormSignupFormProps?: any
  loginFormForgotFormProps?: any
  importIssuesProps?: any
}

const PublicBase = ({
  children,
  user,
  bottomBarProps,
  accountMenuProps,
  loginFormSignupFormProps,
  loginFormForgotFormProps,
  importIssuesProps,
}: PublicBaseProps) => {
  return (
    <Root>
      <TopBar
        user={user}
        accountMenuProps={accountMenuProps}
        loginFormSignupFormProps={loginFormSignupFormProps}
        loginFormForgotFormProps={loginFormForgotFormProps}
        importIssuesProps={importIssuesProps}
      />
      {children}
      <Bottom {...bottomBarProps} />
    </Root>
  )
}

export default PublicBase
