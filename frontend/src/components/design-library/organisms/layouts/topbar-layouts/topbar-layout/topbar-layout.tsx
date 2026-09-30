import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'

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
import ImportPullRequest from '../../../../../../containers/payment/import-pull-request'
import ImportIssueDialog from './import-issue-dialog'
import AccountSettings from '../../../../molecules/trigger-buttons/account-settings/account-settings'
import { AccountWrapper } from './import-issue-dialog.styles'

const Topbar = ({
  user,
  accountMenuProps,
  loginFormSignupFormProps,
  loginFormForgotFormProps,
  importIssuesProps
}) => {
  const history = useHistory()
  const [isActive, setIsActive] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [openAddIssue, setOpenAddIssue] = useState(false)

  const handleClickMenuMobile = () => {
    setIsActive(!isActive)
  }

  useEffect(() => {
    const isLoggedIn = user?.logged
    setIsLoggedIn(isLoggedIn)
  }, [user])

  const handleCreateTask = async (data) => {
    await importIssuesProps.onImport(data)
    setOpenAddIssue(false)
  }

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
              <ImportPullRequest
                onImportIssueClick={() => setOpenAddIssue(true)}
                onViewPaymentRequests={() => history.push('/profile/payment-requests')}
              />
              <ImportIssueDialog
                open={openAddIssue}
                onClose={() => setOpenAddIssue(false)}
                onCreate={handleCreateTask}
                user={user}
              />
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
