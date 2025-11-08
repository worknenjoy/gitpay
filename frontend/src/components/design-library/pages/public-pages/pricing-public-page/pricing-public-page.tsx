import React from 'react'

import { Button, Card, CardActions, CardContent, CardHeader, Grid, Typography } from '@mui/material'

import { FormattedMessage } from 'react-intl'
import { Layout, HeroContent, CardPricing } from './pricing-public-page.styles'
import MainTitle from 'design-library/atoms/typography/main-title/main-title'
import { HeroTitleStyled } from 'design-library/atoms/typography/hero-title/hero-title.styles'
import HeroTitle from 'design-library/atoms/typography/hero-title/hero-title'

interface Tier {
  title: string
  subheader: string
  price: string
  description: string[]
  link?: string
  buttonText: string
  buttonVariant?: 'text' | 'outlined' | 'contained'
}

const tiersMaintainers: Tier[] = [
  {
    title: 'Open source',
    subheader: 'For open source projects',
    price: '8%',
    description: [
      'Public projects from Github or Bitbucket',
      'We will match your issues with our contributor skills to find the right candidate',
      '8% fee for payment with Credit Card or Paypal',
      'No fee for payments above $5000'
    ],
    link: 'https://gitpay.me/#/signin',
    buttonText: 'Get started',
    buttonVariant: 'text'
  },
  {
    title: 'Private',
    subheader: 'For private projects',
    price: '18%',
    description: [
      'Private projects on Github or Bitbucket',
      'We will match your issues with our contributor skills to find the right candidate',
      '18% fee for payment in Credit Card or Paypal'
    ],
    link: 'https://gitpay.me/#/signin',
    buttonText: 'Get started',
    buttonVariant: 'text'
  }
]

const tiersContributors: Tier[] = [
  {
    title: 'Fee for contributors',
    subheader: 'For contributors who solve issues, you will have a fee to receive the transfer',
    price: '8%',
    description: [
      'We support direct transfer for your bank account registered on Gitpay for credit card payments or invoice',
      'We support Paypal to receive payments when the bounty is paid using Paypal',
      '8% fee to withdraw your bounty after the Pull request is merged',
      '⚠️ Note: You will receive the payouts according to the payment method used by the maintainer, if the maintainer paid with credit card, you will receive the payout in your bank account, if the maintainer paid with Paypal, you will receive the payout in your Paypal account'
    ],
    link: 'https://gitpay.me/#/signin',
    buttonText: 'Get started',
    buttonVariant: 'text'
  }
]

function PricingPublicPage() {
  return (
    <Layout>
      <React.Fragment>
        <HeroContent>
          <HeroTitle>
            <FormattedMessage id="welcome.pricing.maintainers.title" defaultMessage="Our pricing model" />
          </HeroTitle>
        </HeroContent>
        <Grid container spacing={ 0 } justifyContent="center">
          <Grid size={{ xs: 12, sm: 12 }}>
            <Card style={{marginBottom: 20}}>
              <CardHeader
                title={<FormattedMessage id="welcome.pricing.maintainers.title" defaultMessage="Our pricing model" />}
                subheader={<FormattedMessage id="welcome.pricing.maintainers.subtitle" defaultMessage="For project maintainers" />}
                sx={{ backgroundColor: theme => theme.palette.primary.light, textAlign: 'center' }}
              />
              <CardContent>
                <Grid container spacing={ 2 } justifyContent="center">
                { tiersMaintainers.map(tier => (
                  <Grid key={ tier.title } size={{ xs: 12, sm: 6, md: 6 }}>
                    <Card style={{marginBottom: 20}}>
                      <CardHeader
                        title={ tier.title }
                        subheader={ tier.subheader }
                        sx={{ backgroundColor: theme => theme.palette.primary.light, textAlign: 'center' }}
                      />
                      <CardContent>
                        <CardPricing>
                          <Typography variant="h5" color="textPrimary">
                            <small>Fee</small> { tier.price }
                          </Typography>
                          <Typography variant="body1" color="textSecondary">
                            <FormattedMessage id="welcome.pricing.month" defaultMessage=" / issue" />
                          </Typography>
                        </CardPricing>
                        { tier.description.map((line, i) => (
                          <Typography variant="body1" align="center" key={ line }>
                            { line }
                          </Typography>
                        )) }
                      </CardContent>
                      { tier.link &&
                        <CardActions sx={{ pb: { sm: 2 } }}>
                          <Button component="a" href={ tier.link } fullWidth variant={ tier.buttonVariant } color="primary">
                            { tier.buttonText }
                          </Button>
                        </CardActions>
                      }
                    </Card>
                  </Grid>
                )) }
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        <Grid container spacing={ 2 } justifyContent="center">
          { tiersContributors.map(tier => (
            <Grid key={ tier.title } size={{ xs: 12, sm: tier.title === 'Enterprise' ? 12 : 6, md: 12 }}>
              <Card>
                <CardHeader
                  title={ tier.title }
                  subheader={ tier.subheader }
                  sx={{ backgroundColor: theme => theme.palette.primary.light, textAlign: 'center' }}
                />
                <CardContent>
                  <CardPricing>
                    <Typography variant="h5" color="textPrimary">
                      <small>Fee</small> { tier.price }
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                      <FormattedMessage id="welcome.pricing.month" defaultMessage=" / issue" />
                    </Typography>
                  </CardPricing>
                  { tier.description.map((line, i) => (
                    <Typography gutterBottom variant={tier.description.length - 1 === i ? 'caption' : 'body1'} align="center" key={ line }>
                      {line}
                    </Typography>
                  )) }
                </CardContent>
                { tier.link &&
                  <CardActions sx={{ pb: { sm: 2 } }}>
                    <Button component="a" href={ tier.link } fullWidth variant={ tier.buttonVariant } color="primary">
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
  )
}

export default PricingPublicPage
