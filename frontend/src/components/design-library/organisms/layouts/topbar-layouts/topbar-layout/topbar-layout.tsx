import React, { useState, useEffect } from 'react'

import {
  Bar,
  Container,
  LeftSide,
  RightSide,
  Logo,
  StyledButton,
  OnlyDesktop,
  OnlyMobile,
  MenuMobile,
  IconHamburger
} from './TopbarStyles'
import logo from 'images/gitpay-logo.png'

import TopbarMenu from './topbar-menu'
import SignupSignin from '../../../forms/signup-forms/signup-signin/signup-signin'
import ImportIssue from '../../../forms/issue-forms/import-issue/import-issue'
import AccountSettings from '../../../../molecules/trigger-buttons/account-settings/account-settings'
import { AccountWrapper } from './import-issue-dialog.styles'

const Topbar = ({
  user,
  accountMenuProps,
  loginFormSignupFormProps,
  loginFormForgotFormProps,
  importIssuesProps
}) => {
  const [isActive, setIsActive] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const handleClickMenuMobile = () => {
    setIsActive(!isActive)
  }

  useEffect(() => {
    const isLoggedIn = user?.logged
    setIsLoggedIn(isLoggedIn)
  }, [user])

  return (
    <Bar>
      <Container>
        <LeftSide isActive={isActive}>
          <div>
            <StyledButton href="/">
              <Logo src={logo} />
            </StyledButton>
          </div>
          <OnlyDesktop style={{ marginTop: 12, marginLeft: 20 }}>
            <TopbarMenu />
          </OnlyDesktop>
          <MenuMobile onClick={handleClickMenuMobile} variant="text" size="small">
            <IconHamburger isActive={isActive} />
          </MenuMobile>
        </LeftSide>
        <RightSide isActive={isActive}>
          <OnlyMobile>
            <TopbarMenu onClick={handleClickMenuMobile} />
          </OnlyMobile>
          {isLoggedIn ? (
            <AccountWrapper>
              <ImportIssue onImport={importIssuesProps.onImport} />
              <AccountSettings user={user} accountMenuProps={accountMenuProps} />
            </AccountWrapper>
          ) : (
            <>
              <SignupSignin
                loginFormSignupFormProps={loginFormSignupFormProps}
                loginFormForgotFormProps={loginFormForgotFormProps}
              />
              {/* 
              <div>
                <LanguageSwitcher
                  completed={ true }
                  onSwitchLang={ () => {} }
                  user={ {} }
                  userCurrentLanguage={ 'en' }
                />
              </div>
              */}
            </>
          )}
        </RightSide>
      </Container>
    </Bar>
  )
}

export default Topbar
