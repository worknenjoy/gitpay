import React, { Component } from 'react'
import PropTypes from 'prop-types'

import {
  Card,
  Grid,
  Typography,
  withStyles
} from '@mui/material'

import { injectIntl, FormattedMessage } from 'react-intl'

import {
  MainTitle,
  ResponsiveImage
} from '../components/CommonStyles'

const styles = theme => ({
  layout: {
    width: 'auto',
    marginBottom: theme.spacing.unit * 6,
    marginTop: theme.spacing.unit * 2,
    [theme.breakpoints.up(900 + theme.spacing.unit * 3 * 2)]: {
      width: '100%'
    },
    textAlign: 'center'
  },
  heroContent: {
    maxWidth: 600,
    margin: '0 auto',
    padding: `0 0 ${theme.spacing.unit * 4}px`,
  }
})

const clientimg1 = require('images/clients/electron-logo.png')
const clientimg2 = require('images/clients/etherpad-logo.png')
const clientimg3 = require('images/clients/sitespeedio-logo.png')

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
    const { classes } = this.props

    return (
      <div className={ classes.layout }>
        <div className={ classes.heroContent }>
          <MainTitle style={ { width: 'auto' } }>
            <Typography variant='h6' gutterBottom>
              <FormattedMessage id='welcome.clientlist.main.title' defaultMessage='Companies solving issues with Gitpay' />
            </Typography>
          </MainTitle>
        </div>
        <Grid container spacing={ 50 } alignItems='center' justify='center'>
          { clients.map(client => (
            <Grid key={ client.title } xs={ 12 } sm={ 6 } md={ 4 } lg={ 3 } xl={ 2 }>
              <Card style={ { boxShadow: 'none', backgroundColor: 'transparent' } }>
                <a href={ client.link }><ResponsiveImage src={ client.img } /></a>
              </Card>
            </Grid>
          )) }
        </Grid>
      </div>
    )
  }
}

Clientlist.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default injectIntl(withStyles(styles)(Clientlist))
