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
import SignupSignin from '../../../organisms/forms/signup-signin/signup-signin'
import ImportIssue from '../../../organisms/forms/import-issue/import-issue'
import AccountSettings from '../../../molecules/trigger-buttons/account-settings/account-settings'

const Topbar = ({
  loggedIn,
  accountMenuProps,
  loginFormSignupFormProps,
  loginFormForgotFormProps,
  importIssuesProps
}) => {
  const [isActive, setIsActive] = useState(false)
  const [ isLoggedIn, setIsLoggedIn ] = useState(false)

  const handleClickMenuMobile = () => {
    setIsActive(!isActive)
  }

  useEffect(() => {
    const isLoggedIn = loggedIn?.logged
    setIsLoggedIn(isLoggedIn)
  }, [loggedIn])

  return (
    <Bar>
      <Container>
        <LeftSide isActive={ isActive }>
         <div>
            <StyledButton href='/'>
              <Logo src={ logo } />
            </StyledButton>
          </div>
          <OnlyDesktop style={ { marginTop: 12, marginLeft: 20 } }>
            <TopbarMenu />
          </OnlyDesktop>
           <MenuMobile
              onClick={ handleClickMenuMobile }
              variant='text'
              size='small'
            >
              <IconHamburger isActive={ isActive } />
            </MenuMobile>
        </LeftSide>
        <RightSide isActive={ isActive }>
          <OnlyMobile>
            <TopbarMenu />
          </OnlyMobile>
          { isLoggedIn ? (
            <>
              <AccountSettings loggedIn={ loggedIn } accountMenuProps={accountMenuProps} />
              <ImportIssue {...importIssuesProps} />
            </>
          ) : (
            <div style={ { display: 'flex', justifyContent: 'space-around', marginRight: 20 } }>
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
            </div>
          )}
        </RightSide>
      </Container>
    </Bar>
  )
};

export default Topbar;