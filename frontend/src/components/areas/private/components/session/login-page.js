import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Link, Redirect, useParams, useHistory } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'
import { Card, CardContent, Typography, Dialog } from '@mui/material'
import { styled as muiStyled } from '@mui/material/styles'
import Background from 'images/login_bg.png'

import TermsOfService from './terms-of-service'
import PrivacyPolicy from './privacy-policy'
import CookiePolicy from './cookie-policy'
import LoginFormSignin from 'design-library/molecules/form-section/login-form/login-form-signin/login-form-signin'
import LoginFormSignup from 'design-library/molecules/form-section/login-form/login-form-signup/login-form-signup'
import LoginFormReset from 'design-library/molecules/form-section/login-form/login-form-reset/login-form-reset'
import LoginFormForgot from 'design-library/molecules/form-section/login-form/login-form-forgot/login-form-forgot'

const Container = muiStyled('div')(() => ({
  width: '100%',
  height: '100%',
  overflow: 'visible',
  flex: 1,
  margin: 0,
  padding: 0,
  display: 'flex',
  justifyContent: 'center',
  backgroundImage: `url(${Background})`,
  backgroundSize: '100% 100%',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
}))

const StyledCard = muiStyled(Card)(() => ({
  minWidth: 420,
  marginTop: 40,
  opacity: 0.8,
  overflow: 'visible',
}))

const StyledCardContent = muiStyled(CardContent)(() => ({
  textAlign: 'center',
  position: 'relative',
}))

const Content = styled.div`
  margin-top: 10px;
`

import logo from 'images/logo-complete.png'

const LoginPage = ({
  addNotification,
  searchUser,
  user,
  roles,
  fetchRoles,
  registerUser,
  forgotPassword,
  resetPassword,
}) => {
  const history = useHistory()
  const { mode: modeParam, token, status } = useParams()

  const [mode, setMode] = useState(modeParam ? 'signin' : token ? 'reset' : 'signin')
  const [openDialog, setOpenDialog] = useState(false)
  const [dialogType, setDialogType] = useState(null)

  useEffect(() => {
    if (status === 'invalid') {
      addNotification && addNotification('user.invalid')
    }

    searchUser && searchUser({ recover_password_token: token })
  }, [status, token, addNotification, searchUser])

  useEffect(() => {
    fetchRoles()
  }, [])

  useEffect(() => {
    history.location.pathname === '/signin' && setMode('signin')
    history.location.pathname === '/signup' && setMode('signup')
    history.location.pathname === '/reset-password/:token' && setMode('reset')
  }, [history])

  const handleOpenDialog = (e, type) => {
    e.preventDefault()
    setDialogType(type)
    setOpenDialog(true)
  }

  const closeDialog = () => {
    setOpenDialog(false)
    setDialogType(null)
  }

  const handleSignup = async (data) => {
    await registerUser(data)
    setMode('signin')
  }

  const renderDialog = () => {
    if (dialogType === 'cookie') {
      return <CookiePolicy extraStyles={false} />
    }
    if (dialogType === 'privacy') {
      return <PrivacyPolicy extraStyles={false} />
    }
    if (dialogType === 'terms') {
      return <TermsOfService />
    }
  }

  if (mode === 'reset' && !token && !user?.id) {
    return <Redirect to="/signin" />
  }

  return (
    <Container>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <StyledCard>
          <StyledCardContent>
            <Link to="/#">
              <img src={logo} width={140} alt="Logo" />
            </Link>
            <Content>
              <Typography variant="h6" style={{ fontWeight: 'bold' }} gutterBottom>
                <FormattedMessage
                  id="account.login.title.welcome"
                  defaultMessage="Welcome to Gitpay!"
                />
              </Typography>
              {mode === 'signin' ||
                (mode === 'singup' && (
                  <Typography style={{ marginBottom: 20 }} variant="body2" gutterBottom noWrap>
                    <FormattedMessage
                      id="account.login.connect.form"
                      defaultMessage="Connect or signup with your account"
                    />
                  </Typography>
                ))}
              {mode === 'reset' && (
                <>
                  <Typography variant="h6" style={{ fontWeight: 'bold' }} gutterBottom>
                    <FormattedMessage
                      id="account.login.title"
                      defaultMessage="Recover your password"
                    />
                  </Typography>
                  <Typography style={{ marginBottom: 20 }} variant="body1" gutterBottom noWrap>
                    <FormattedMessage
                      id="account.login.connect.form.reset"
                      defaultMessage="To reset your password, type the new password and confirm"
                    />
                  </Typography>
                </>
              )}
              {mode === 'forgot' && (
                <>
                  <Typography variant="h6" style={{ fontWeight: 'bold' }} gutterBottom>
                    <FormattedMessage
                      id="account.login.title"
                      defaultMessage="Recover your password"
                    />
                  </Typography>
                  <Typography style={{ marginBottom: 20 }} variant="body1" gutterBottom noWrap>
                    <FormattedMessage
                      id="account.login.connect.form.forgot"
                      defaultMessage="To recover your password, type the email address you used to register and we will send you a link to reset it."
                    />
                  </Typography>
                </>
              )}

              {mode === 'signin' && (
                <LoginFormSignin
                  onSignup={() => setMode('signup')}
                  onForgot={() => setMode('forgot')}
                  noCancelButton
                />
              )}
              {mode === 'signup' && (
                <LoginFormSignup
                  onSignin={() => setMode('signin')}
                  onForgotPassword={() => setMode('reset')}
                  onSubmit={handleSignup}
                  roles={roles}
                  fetchRoles={fetchRoles}
                  addNotification={addNotification}
                  noCancelButton
                />
              )}
              {mode === 'reset' && (
                <LoginFormReset
                  onSignin={() => setMode('signin')}
                  onClose={() => setMode('signin')}
                  onReset={resetPassword}
                  noCancelButton
                />
              )}
              {mode === 'forgot' && (
                <LoginFormForgot
                  onSignin={() => setMode('signin')}
                  onClose={() => setMode('signin')}
                  onSubmit={forgotPassword}
                  onCancelButton={() => setMode('signin')}
                />
              )}
            </Content>
          </StyledCardContent>
        </StyledCard>
        <div style={{ marginTop: 10, textAlign: 'center' }}>
          <Typography variant="caption" color="default" gutterBottom noWrap component="span">
            <FormattedMessage
              id="account.login.connect.bottom"
              defaultMessage="© 2023 Gitpay - All rights reserved"
            />
            <Link
              to="#"
              color="inherit"
              onClick={(e) => handleOpenDialog(e, 'cookie')}
              style={{ display: 'inline-block', margin: '0 5px' }}
            >
              <FormattedMessage id="legal.cookie.label" defaultMessage="Cookie Preferences" />
            </Link>
            |
            <Link
              to="#"
              color="inherit"
              onClick={(e) => handleOpenDialog(e, 'privacy')}
              style={{ display: 'inline-block', margin: '0 5px' }}
            >
              <FormattedMessage id="legal.prviacy.label" defaultMessage="Privacy" />
            </Link>
            |
            <Link
              to="#"
              color="inherit"
              onClick={(e) => handleOpenDialog(e, 'terms')}
              style={{ display: 'inline-block', margin: '0 5px' }}
            >
              <FormattedMessage id="legal.terms.label" defaultMessage="Terms" />
            </Link>
          </Typography>
          <Dialog onClose={closeDialog} open={openDialog}>
            <div style={{ padding: '10px 20px' }}>{renderDialog()}</div>
          </Dialog>
        </div>
      </div>
    </Container>
  )
}

export default LoginPage
