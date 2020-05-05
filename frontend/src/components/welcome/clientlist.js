import React, { Component } from 'react'
import PropTypes from 'prop-types'

import {
  Card,
  Grid,
  Typography,
  withStyles
} from '@material-ui/core'

import { injectIntl, FormattedMessage } from 'react-intl'

import {
  MainTitle,
  ResponsiveImage
} from './components/CommonStyles'

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

const clientimg1 = require('../../images/clients/client1.png')
const clientimg2 = require('../../images/clients/client2.png')
const clientimg3 = require('../../images/clients/client3.png')

const clients = [
  {
    title: 'Grafana',
    img: clientimg1,
    link: 'https://grafana.com/'
  },
  {
    title: 'Retro Share',
    img: clientimg2,
    link: 'https://retroshare.cc/'
  },
  {
    title: 'Vagrant',
    img: clientimg3,
    link: 'https://www.vagrantup.com/'
  },
]
class Clientlist extends Component {
  render () {
    const { classes } = this.props

    return (
      <div className={ classes.layout }>
        <div className={ classes.heroContent }>
          <MainTitle style={ { width: 'auto' } }>
            <Typography variant='h5' gutterBottom>
              <FormattedMessage id='welcome.clientlist.title' defaultMessage='Who is using Gitpay' />
            </Typography>
          </MainTitle>
        </div>
        <Grid container spacing={ 50 } alignItems='center' justify='center'>
          { clients.map(client => (
            <Grid item key={ client.title } xs={ 12 } sm={ 6 } md={ 4 } lg={ 3 } xl={ 2 }>
              <Card style={ { boxShadow: 'none' } }>
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
