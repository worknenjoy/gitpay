import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { Card, Grid, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'

import { injectIntl, FormattedMessage } from 'react-intl'

import {
  MainTitle,
  ResponsiveImage
} from '../components/CommonStyles'

const Layout = styled('div')(({ theme }) => ({
  width: 'auto',
  marginBottom: theme.spacing(6),
  marginTop: theme.spacing(2),
  [theme.breakpoints.up(900 + theme.spacing(3) * 2)]: {
    width: '100%'
  },
  textAlign: 'center'
}))

const HeroContent = styled('div')(({ theme }) => ({
  maxWidth: 600,
  margin: '0 auto',
  padding: `0 0 ${theme.spacing(4)}px`,
}))

import clientimg1 from 'images/clients/electron-logo.png'
import clientimg2 from 'images/clients/etherpad-logo.png'
import clientimg3 from 'images/clients/sitespeedio-logo.png'

const clients = [
  {
    title: 'Electron',
    img: clientimg1,
    link: 'https://www.electron.build/'
  },
  {
    title: 'Etherpad',
    img: clientimg2,
    link: 'https://etherpad.org/'
  },
  {
    title: 'Sitespeed.io',
    img: clientimg3,
    link: 'https://sitespeed.io'
  },
]
class Clientlist extends Component {
  render () {
  const { } = this.props

    return (
      <Layout>
        <HeroContent>
          <MainTitle style={ { width: 'auto' } }>
            <Typography variant='h6' gutterBottom>
              <FormattedMessage id='welcome.clientlist.main.title' defaultMessage='Companies solving issues with Gitpay' />
            </Typography>
          </MainTitle>
        </HeroContent>
        <Grid container spacing={ 50 } alignItems='center' justify='center'>
          { clients.map(client => (
            <Grid key={ client.title } size={{ xs: 12, sm: 6, md: 4, lg: 3, xl: 2 }}>
              <Card style={ { boxShadow: 'none', backgroundColor: 'transparent' } }>
                <a href={ client.link }><ResponsiveImage src={ client.img } /></a>
              </Card>
            </Grid>
          )) }
        </Grid>
      </Layout>
    )
  }
}

Clientlist.propTypes = {}

export default injectIntl(Clientlist)
