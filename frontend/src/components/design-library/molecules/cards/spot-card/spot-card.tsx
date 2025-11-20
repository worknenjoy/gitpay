import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'
import { Typography, Dialog } from '@mui/material'
import CookiePolicy from 'design-library/molecules/content/terms/cookie-policy/cookie-policy'
import PrivacyPolicy from 'design-library/molecules/content/terms/privacy-policy/privacy-policy'
import TermsOfService from 'design-library/molecules/content/terms/terms-of-service/terms-of-service'
import { StyledCard, StyledCardContent, Content } from './spot-card.styles'

import logo from 'images/logo-complete.png'

const SpotCard = ({ title, description, children }) => {
  const [openDialog, setOpenDialog] = useState(false)
  const [dialogType, setDialogType] = useState(null)

  const handleOpenDialog = (e, type) => {
    e.preventDefault()
    setDialogType(type)
    setOpenDialog(true)
  }

  const renderDialog = () => {
    if (dialogType === 'cookie') {
      return <CookiePolicy extraStyles={false} />
    }
    if (dialogType === 'privacy') {
      return <PrivacyPolicy extraStyles={false} />
    }
    if (dialogType === 'terms') {
      return <TermsOfService extraStyles={false} />
    }
  }

  const closeDialog = () => {
    setOpenDialog(false)
    setDialogType(null)
  }

  return (
    <>
      <StyledCard>
        <StyledCardContent>
          <Link to="/">
            <img src={logo} width={140} alt="Logo" />
          </Link>
          <Content>
            <Typography variant="h6" style={{ fontWeight: 'bold' }} gutterBottom>
              {title}
            </Typography>
            <Typography style={{ marginBottom: 20 }} variant="body2" gutterBottom noWrap>
              {description}
            </Typography>
            <div>{children}</div>
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
    </>
  )
}

export default SpotCard
