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
import SignupSignin from '../../organisms/signup-signin/signup-signin'
import ImportIssue from '../../organisms/import-issue/import-issue'
import AccountSettings from '../../organisms/account-settings/account-settings'
import LanguageSwitcher from '../../molecules/language-switcher/language-switcher'

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
          <OnlyDesktop style={ { display: 'flex', justifyContent: 'space-around', alignSelf: 'center', marginRight: 20 } }>
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
        <RightSide>
          <OnlyMobile>
            <MenuMobile>
              <TopbarMenu />
            </MenuMobile>
          </OnlyMobile>
          { isLoggedIn ? (
            <AccountSettings loggedIn={ loggedIn } accountMenuProps={accountMenuProps} />
          ) : (
            <>
              <div style={ { display: 'flex', justifyContent: 'space-around', alignSelf: 'center', marginRight: 20 } }>
                <div style={{marginTop: 6}}>
                  <SignupSignin
                    loginFormSignupFormProps={loginFormSignupFormProps}
                    loginFormForgotFormProps={loginFormForgotFormProps}
                  />
                </div>
                <div>
                  <LanguageSwitcher
                    completed={ true }
                    onSwitchLang={ () => {} }
                    user={ {} }
                    userCurrentLanguage={ 'en' }
                  />
                </div>
              </div>
            </>
          )}
          <ImportIssue {...importIssuesProps} />
        </RightSide>
      </Container>
    </Bar>
  )
};

export default Topbar;