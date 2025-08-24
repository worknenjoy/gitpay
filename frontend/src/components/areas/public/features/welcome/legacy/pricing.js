import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { Button, Card, CardActions, CardContent, CardHeader, Grid, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'

import { injectIntl, FormattedMessage } from 'react-intl'
import TopBarContainer from '../../../../../../containers/topbar'
import Bottom from '../../../../../shared/bottom/bottom'
import {
  MainTitle
} from '../components/CommonStyles'

const Layout = styled('div')(({ theme }) => ({
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
}))

const HeroContent = styled('div')(({ theme }) => ({
  maxWidth: 600,
  margin: '0 auto',
  padding: `${theme.spacing(2)}px 0 ${theme.spacing(2)}px`,
  marginTop: theme.spacing(3),
  marginBottom: 0
}))

const CardPricing = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'baseline',
  marginBottom: theme.spacing(2),
}))

const tiersMaintainers = [
  {
    title: 'Open source',
    subheader: 'For open source projects',
    price: '8%',
    description: [
      'Public projects from Github or Bitbucket',
      'We will match your issues with our contributor skills to find the right candidate',
      '8% fee for payment with Credit Card or Paypal',
      'No fee for payments above $5000'
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
      'We support direct transfer for your bank account registered on Gitpay for credit card payments or invoice',
      'We support Paypal to receive payments when the bounty is paid using Paypal',
      '8% fee to withdraw your bounty after the Pull request is merged',
      '⚠️ Note: You will receive the payouts according to the payment method used by the maintainer, if the maintainer paid with credit card, you will receive the payout in your bank account, if the maintainer paid with Paypal, you will receive the payout in your Paypal account'
    ]
  }
]

class Pricing extends Component {
  render () {
  const { } = this.props

    return (
      <div className={ classes.root }>
        <TopBarContainer ref='intro' hide />
        <Layout>
          <React.Fragment>
            { /* Hero unit */ }
            <HeroContent>
              <MainTitle>
                <Typography variant='h5' gutterBottom>
                  <FormattedMessage id='welcome.pricing.maintainers.title' defaultMessage='Fee for maintainers' />
                </Typography>
              </MainTitle>
              <Typography variant='body1' align='center' color='textSecondary' sx={{ pt: 2 }}>
                <FormattedMessage id='welcome.pricing.description' defaultMessage='These are the fees when you pay for an issue to be solved on Gitpay' />
              </Typography>
            </HeroContent>
            { /* End hero unit */ }
            <Grid container spacing={ 5 } justifyContent='center'>
              { tiersMaintainers.map(tier => (
                // Enterprise card is full width at sm breakpoint
                <Grid key={ tier.title } size={{ xs: 12, sm: tier.title === 'Enterprise' ? 12 : 6, md: 6 }}>
                  <Card>
                    <CardHeader
                      title={ tier.title }
                      subheader={ tier.subheader }
                      titleTypographyProps={ { align: 'center' } }
                      subheaderTypographyProps={ { align: 'center' } }
                      sx={{ backgroundColor: theme => theme.palette.primary.light }}
                    />
                    <CardContent>
                      <CardPricing>
                        <Typography variant='h5' color='textPrimary'>
                          <small>Fee</small> { tier.price }
                        </Typography>
                        <Typography variant='body1' color='textSecondary'>
                          <FormattedMessage id='welcome.pricing.month' defaultMessage=' / issue' />
                        </Typography>
                      </CardPricing>
                      { tier.description.map((line, i) => (
                        <Typography variant='body1' align='center' key={ line }>
                          { line }
                        </Typography>
                      )) }
                    </CardContent>
                    { tier.link &&
                      <CardActions sx={{ pb: { sm: 2 } }}>
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
                <Grid key={ tier.title } size={{ xs: 12, sm: tier.title === 'Enterprise' ? 12 : 6, md: 12 }}>
                  <Card>
                    <CardHeader
                      title={ tier.title }
                      subheader={ tier.subheader }
                      titleTypographyProps={ { align: 'center' } }
                      subheaderTypographyProps={ { align: 'center' } }
                      sx={{ backgroundColor: theme => theme.palette.primary.light }}
                    />
                    <CardContent>
                      <CardPricing>
                        <Typography variant='h5' color='textPrimary'>
                          <small>Fee</small> { tier.price }
                        </Typography>
                        <Typography variant='body1' color='textSecondary'>
                          <FormattedMessage id='welcome.pricing.month' defaultMessage=' / issue' />
                        </Typography>
                      </CardPricing>
                      { tier.description.map((line, i) => (
                        <Typography gutterBottom variant={tier.description.length - 1 === i ? 'caption' : 'body1'} align='center' key={ line }>
                          {line}
                        </Typography>
                      )) }
                    </CardContent>
                    { tier.link &&
                      <CardActions sx={{ pb: { sm: 2 } }}>
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
        </Layout>
        <Bottom />
      </div>
    )
  }
}

Pricing.propTypes = {}

export default injectIntl(Pricing)
