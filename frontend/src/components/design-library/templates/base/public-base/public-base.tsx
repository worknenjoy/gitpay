import React from 'react'
import { styled } from '@mui/material/styles'
import TopBar from '../../../organisms/layouts/topbar/topbar'
import Bottom from '../../../organisms/layouts/bottom-bar/bottom'

const Root = styled('div')(({ theme }) => ({
  flexGrow: 1,
  marginTop: 0
}))

type PublicBaseProps = {
  children: React.ReactNode
  loggedIn?: any,
  bottomBarProps?: any,
  accountMenuProps?: any,
  loginFormSignupFormProps?: any,
  loginFormForgotFormProps?: any,
  importIssuesProps?: any
}

const PublicBase = ({ 
  children,
  loggedIn,
  bottomBarProps,
  accountMenuProps,
  loginFormSignupFormProps,
  loginFormForgotFormProps,
  importIssuesProps
}:PublicBaseProps) => {
  return (
    <Root>
      <TopBar
        loggedIn={ loggedIn }
        accountMenuProps={ accountMenuProps }
        loginFormSignupFormProps={ loginFormSignupFormProps }
        loginFormForgotFormProps={ loginFormForgotFormProps }
        importIssuesProps={ importIssuesProps }
      />
      { children }
      <Bottom
        { ...bottomBarProps }
      />
    </Root>
  )
}

export default PublicBase
