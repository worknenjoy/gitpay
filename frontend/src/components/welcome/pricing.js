import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Button from 'material-ui/Button'
import Card from 'material-ui/Card'
import CardActions from 'material-ui/Card/CardActions'
import CardContent from 'material-ui/Card/CardContent'
import CardHeader from 'material-ui/Card/CardHeader'
import Grid from 'material-ui/Grid'
import Typography from 'material-ui/Typography'
import { withStyles } from 'material-ui/styles'
import { injectIntl, FormattedMessage } from 'react-intl'

import {
  MainTitle
} from './components/CommonStyles'

const styles = theme => ({
  layout: {
    width: 'auto',
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    marginBottom: theme.spacing.unit * 6,
    marginTop: theme.spacing.unit * 2,
    [theme.breakpoints.up(900 + theme.spacing.unit * 3 * 2)]: {
      width: 900,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  heroContent: {
    maxWidth: 600,
    margin: '0 auto',
    padding: `0 0 ${theme.spacing.unit * 4}px`,
  },
  heroDesc: {
    paddingTop: theme.spacing.unit * 2
  },
  cardHeader: {
    backgroundColor: theme.palette.primary.light,
  },
  cardPricing: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'baseline',
    marginBottom: theme.spacing.unit * 2,
  },
  cardActions: {
    [theme.breakpoints.up('sm')]: {
      paddingBottom: theme.spacing.unit * 2,
    },
  }
})

const tiers = [
  {
    title: 'Free',
    subheader: 'For personal and tech geeks companies',
    price: '0',
    description: ['Unlimited tasks', 'Development community', '12% fee for each transaction', 'Pay on demmand'],
    buttonText: 'Sign up for free',
    buttonVariant: 'raised',
    link: 'https://gitpay.me/#/login'
  },
  {
    title: 'Open Source',
    subheader: 'An Open Source project using git with our support and review',
    price: '200',
    description: [
      'We manage your issues',
      'Advice on pricing for tasks',
      '8% fee for each transaction',
      'Code review',
      'Email support',
    ],
    buttonText: 'Contact us',
    buttonVariant: 'raised',
    link: 'https://goo.gl/forms/eSpHlrtXGJ1v3Syv2'
  },
  {
    title: 'Enterprise',
    subheader: 'For private projects',
    price: '400',
    description: [
      'We manage your issues',
      'Advice on pricing for tasks',
      '10% fee for each transaction',
      'Code review',
      'Email support'
    ],
    buttonText: 'Contact us',
    buttonVariant: 'raised',
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
            <Typography variant='headline' gutterBottom>
              <FormattedMessage id='welcome.pricing.title' defaultMessage='Princing' />
            </Typography>
          </MainTitle>
          <Typography variant='body1' align='center' color='textSecondary' className={ classes.heroDesc }>
            <FormattedMessage id='welcome.pricing.description' defaultMessage='Check our options to boost your company deliveries that can fit with your needs' />
          </Typography>
        </div>
        { /* End hero unit */ }
        <Grid container spacing={ 40 } alignItems='flex-end'>
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
                    <Typography variant='headline' color='textPrimary'>
                      <small>US$</small> { tier.price }
                    </Typography>
                    <Typography variant='subheading' color='textSecondary'>
                      <FormattedMessage id='welcome.pricing.month' defaultMessage='/mo' />
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
