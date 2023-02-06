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
import TopBarContainer from '../../containers/topbar'
import Bottom from '../../components/bottom/bottom'
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
    padding: `${theme.spacing(2)}px 0 ${theme.spacing(2)}px`,
    marginTop: theme.spacing(3),
    marginBottom: 0
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

const tiersMaintainers = [
  {
    title: 'Open source',
    subheader: 'For open source projects',
    price: '8%',
    description: [
      'Public projects from Github or Bitbucket',
      'We will match your issues with our contributor skills to find the right candidate',
      '8% fee for payment with Credit Card or Paypal'
    ]
  },
  {
    title: 'Private',
    subheader: 'For private projects',
    price: '18%',
    description: [
      'Private projects on Github or Bitbucket',
      'We will match your issues with our contributor skills to find the right candidate',
      '18% fee for payment in Credit Card or Paypal'
    ]
  }
]

const tiersContributors = [
  {
    title: 'Fee for contributors',
    subheader: 'For contributors who solve issues, you will have a fee to receive the transfer',
    price: '8%',
    description: [
      'We support direct transfer for your bank account registered on Gitpay',
      'We support Paypal to receive the money',
      '8% fee to withdraw your bounty after the Pull request is merged'
    ]
  }
]

class Pricing extends Component {
  render () {
    const { classes } = this.props

    return (
      <div className={ classes.root }>
        <TopBarContainer ref='intro' hide />
        <div className={ classes.layout }>
          <React.Fragment>
            { /* Hero unit */ }
            <div className={ classes.heroContent }>
              <MainTitle>
                <Typography variant='h5' gutterBottom>
                  <FormattedMessage id='welcome.pricing.maintainers.title' defaultMessage='Fee for maintainers' />
                </Typography>
              </MainTitle>
              <Typography variant='body1' align='center' color='textSecondary' className={ classes.heroDesc }>
                <FormattedMessage id='welcome.pricing.description' defaultMessage='These are the fees when you pay for an issue to be solved on Gitpay' />
              </Typography>
            </div>
            { /* End hero unit */ }
            <Grid container spacing={ 5 } justifyContent='center'>
              { tiersMaintainers.map(tier => (
                // Enterprise card is full width at sm breakpoint
                <Grid item key={ tier.title } xs={ 12 } sm={ tier.title === 'Enterprise' ? 12 : 6 } md={ 6 }>
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
                    { tier.link &&
                      <CardActions className={ classes.cardActions }>
                        <Button component='a' href={ tier.link } fullWidth variant={ tier.buttonVariant } color='primary'>
                          { tier.buttonText }
                        </Button>
                      </CardActions>
                    }
                  </Card>
                </Grid>
              )) }
            </Grid>
            <Grid container spacing={ 5 } justifyContent='center'>
              { tiersContributors.map(tier => (
                // Enterprise card is full width at sm breakpoint
                <Grid item key={ tier.title } xs={ 12 } sm={ tier.title === 'Enterprise' ? 12 : 6 } md={ 12 }>
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
                    { tier.link &&
                      <CardActions className={ classes.cardActions }>
                        <Button component='a' href={ tier.link } fullWidth variant={ tier.buttonVariant } color='primary'>
                          { tier.buttonText }
                        </Button>
                      </CardActions>
                    }
                  </Card>
                </Grid>
              )) }
            </Grid>
          </React.Fragment>
        </div>
        <Bottom />
      </div>
    )
  }
}

Pricing.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default injectIntl(withStyles(styles)(Pricing))
