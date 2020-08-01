import React, { Component } from 'react'
import PropTypes from 'prop-types'

import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Grid,
  Typography,
  withStyles
} from '@material-ui/core'

import { injectIntl, FormattedMessage } from 'react-intl'

import {
  MainTitle
} from './components/CommonStyles'

const styles = theme => ({
  layout: {
    width: 'auto',
    marginLeft: theme.spacing(3),
    marginRight: theme.spacing(3),
    marginBottom: theme.spacing(6),
    marginTop: theme.spacing(2),
    [theme.breakpoints.up(900 + theme.spacing(3) * 2)]: {
      width: 900,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  heroContent: {
    maxWidth: 600,
    margin: '0 auto',
    padding: `0 0 ${theme.spacing(4)}px`,
  },
  heroDesc: {
    paddingTop: theme.spacing(2)
  },
  cardHeader: {
    backgroundColor: theme.palette.primary.light,
  },
  cardPricing: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'baseline',
    marginBottom: theme.spacing(2),
  },
  cardActions: {
    [theme.breakpoints.up('sm')]: {
      paddingBottom: theme.spacing(2),
    },
  }
})

const tiers = [
  {
    title: 'Open source',
    subheader: 'For open source projects',
    price: '8%',
    description: [
      'Public projects on Github or Bitbucket',
      'Development community willing to solve your issues',
      '8% fee for each transaction'
    ],
    buttonText: 'Sign up',
    buttonVariant: 'contained',
    link: 'https://gitpay.me/#/login'
  },
  {
    title: 'Private',
    subheader: 'For private projects',
    price: '18%',
    description: [
      'Private projects on Github or Bitbucket',
      'Development community willing to solve your issues',
      '18% fee for each transaction'
    ],
    buttonText: 'Contact us',
    buttonVariant: 'contained',
    link: 'https://goo.gl/forms/eSpHlrtXGJ1v3Syv2'
  },
  {
    title: 'Support',
    subheader: 'Our Support to complete your tasks',
    price: '30%',
    description: [
      'We manage your projects on Github or Bitbucket',
      'Code review',
      '30% fee for each transaction'
    ],
    buttonText: 'Contact us',
    buttonVariant: 'contained',
    link: 'https://goo.gl/forms/eSpHlrtXGJ1v3Syv2'
  },
]

class Pricing extends Component {
  render () {
    const { classes } = this.props

    return (
      <div className={ classes.layout }>
        { /* Hero unit */ }
        <div className={ classes.heroContent }>
          <MainTitle>
            <Typography variant='h5' gutterBottom>
              <FormattedMessage id='welcome.pricing.title' defaultMessage='Princing' />
            </Typography>
          </MainTitle>
          <Typography variant='body1' align='center' color='textSecondary' className={ classes.heroDesc }>
            <FormattedMessage id='welcome.pricing.description' defaultMessage='Check our options to boost your company deliveries that can fit with your needs' />
          </Typography>
        </div>
        { /* End hero unit */ }
        <Grid container spacing={ 5 } alignItems='flex-end'>
          { tiers.map(tier => (
            // Enterprise card is full width at sm breakpoint
            <Grid item key={ tier.title } xs={ 12 } sm={ tier.title === 'Enterprise' ? 12 : 6 } md={ 4 }>
              <Card>
                <CardHeader
                  title={ tier.title }
                  subheader={ tier.subheader }
                  titleTypographyProps={ { align: 'center' } }
                  subheaderTypographyProps={ { align: 'center' } }
                  className={ classes.cardHeader }
                />
                <CardContent>
                  <div className={ classes.cardPricing }>
                    <Typography variant='h5' color='textPrimary'>
                      <small>Fee</small> { tier.price }
                    </Typography>
                    <Typography variant='body1' color='textSecondary'>
                      <FormattedMessage id='welcome.pricing.month' defaultMessage=' / issue' />
                    </Typography>
                  </div>
                  { tier.description.map(line => (
                    <Typography variant='body1' align='center' key={ line }>
                      { line }
                    </Typography>
                  )) }
                </CardContent>
                <CardActions className={ classes.cardActions }>
                  <Button component='a' href={ tier.link } fullWidth variant={ tier.buttonVariant } color='primary'>
                    { tier.buttonText }
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          )) }
        </Grid>
      </div>
    )
  }
}

Pricing.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default injectIntl(withStyles(styles)(Pricing))
