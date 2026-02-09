import React from 'react'

import { Button, Card, CardActions, CardContent, CardHeader, Grid, Typography } from '@mui/material'

import { FormattedMessage, useIntl } from 'react-intl'
import { Layout, HeroContent, CardPricing } from './pricing-public-page.styles'
import HeroTitle from 'design-library/atoms/typography/hero-title/hero-title'

interface Tier {
  titleId: string
  subheaderId: string
  price: string
  descriptionIds: string[]
  link?: string
  buttonTextId: string
  buttonVariant?: 'text' | 'outlined' | 'contained'
}

const tiersMaintainers: Tier[] = [
  {
    titleId: 'welcome.pricing.opensource.title',
    subheaderId: 'welcome.pricing.opensource.subheader',
    price: '8%',
    descriptionIds: [
      'welcome.pricing.opensource.description1',
      'welcome.pricing.opensource.description2',
      'welcome.pricing.opensource.description3',
      'welcome.pricing.opensource.description4'
    ],
    link: 'https://gitpay.me/#/signin',
    buttonTextId: 'welcome.pricing.opensource.button',
    buttonVariant: 'text'
  },
  {
    titleId: 'welcome.pricing.private.title',
    subheaderId: 'welcome.pricing.private.subheader',
    price: '18%',
    descriptionIds: [
      'welcome.pricing.private.description1',
      'welcome.pricing.private.description2',
      'welcome.pricing.private.description3'
    ],
    link: 'https://gitpay.me/#/signin',
    buttonTextId: 'welcome.pricing.private.button',
    buttonVariant: 'text'
  }
]

const tiersContributors: Tier[] = [
  {
    titleId: 'welcome.pricing.contributors.title',
    subheaderId: 'welcome.pricing.contributors.subheader',
    price: '8%',
    descriptionIds: [
      'welcome.pricing.contributors.description1',
      'welcome.pricing.contributors.description2',
      'welcome.pricing.contributors.description3',
      'welcome.pricing.contributors.description4'
    ],
    link: 'https://gitpay.me/#/signin',
    buttonTextId: 'welcome.pricing.contributors.button',
    buttonVariant: 'text'
  }
]

function PricingPublicPage() {
  const intl = useIntl()
  
  return (
    <Layout>
      <React.Fragment>
        <HeroContent>
          <HeroTitle>
            <FormattedMessage
              id="welcome.pricing.maintainers.title"
              defaultMessage="Our pricing model"
            />
          </HeroTitle>
        </HeroContent>
        <Grid container spacing={0} justifyContent="center">
          <Grid size={{ xs: 12, sm: 12 }}>
            <Card style={{ marginBottom: 20 }}>
              <CardHeader
                title={
                  <FormattedMessage
                    id="welcome.pricing.maintainers.title"
                    defaultMessage="Our pricing model"
                  />
                }
                subheader={
                  <FormattedMessage
                    id="welcome.pricing.maintainers.subtitle"
                    defaultMessage="For project maintainers"
                  />
                }
                sx={{
                  backgroundColor: (theme) => theme.palette.primary.light,
                  textAlign: 'center'
                }}
              />
              <CardContent>
                <Grid container spacing={2} justifyContent="center">
                  {tiersMaintainers.map((tier) => (
                    <Grid key={tier.titleId} size={{ xs: 12, sm: 6, md: 6 }}>
                      <Card style={{ marginBottom: 20 }}>
                        <CardHeader
                          title={intl.formatMessage({ id: tier.titleId })}
                          subheader={intl.formatMessage({ id: tier.subheaderId })}
                          sx={{
                            backgroundColor: (theme) => theme.palette.primary.light,
                            textAlign: 'center'
                          }}
                        />
                        <CardContent>
                          <CardPricing>
                            <Typography variant="h5" color="textPrimary">
                              <small><FormattedMessage id="welcome.pricing.opensource.fee" defaultMessage="Fee" /></small> {tier.price}
                            </Typography>
                            <Typography variant="body1" color="textSecondary">
                              <FormattedMessage
                                id="welcome.pricing.month"
                                defaultMessage=" / issue"
                              />
                            </Typography>
                          </CardPricing>
                          {tier.descriptionIds.map((descId, i) => (
                            <Typography variant="body1" align="center" key={descId}>
                              {intl.formatMessage({ id: descId })}
                            </Typography>
                          ))}
                        </CardContent>
                        {tier.link && (
                          <CardActions sx={{ pb: { sm: 2 } }}>
                            <Button
                              component="a"
                              href={tier.link}
                              fullWidth
                              variant={tier.buttonVariant}
                              color="primary"
                            >
                              {intl.formatMessage({ id: tier.buttonTextId })}
                            </Button>
                          </CardActions>
                        )}
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        <Grid container spacing={2} justifyContent="center">
          {tiersContributors.map((tier) => (
            <Grid
              key={tier.titleId}
              size={{ xs: 12, sm: intl.formatMessage({ id: tier.titleId }) === 'Enterprise' ? 12 : 6, md: 12 }}
            >
              <Card>
                <CardHeader
                  title={intl.formatMessage({ id: tier.titleId })}
                  subheader={intl.formatMessage({ id: tier.subheaderId })}
                  sx={{
                    backgroundColor: (theme) => theme.palette.primary.light,
                    textAlign: 'center'
                  }}
                />
                <CardContent>
                  <CardPricing>
                    <Typography variant="h5" color="textPrimary">
                      <small><FormattedMessage id="welcome.pricing.opensource.fee" defaultMessage="Fee" /></small> {tier.price}
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                      <FormattedMessage id="welcome.pricing.month" defaultMessage=" / issue" />
                    </Typography>
                  </CardPricing>
                  {tier.descriptionIds.map((descId, i) => (
                    <Typography
                      gutterBottom
                      variant={tier.descriptionIds.length - 1 === i ? 'caption' : 'body1'}
                      align="center"
                      key={descId}
                    >
                      {intl.formatMessage({ id: descId })}
                    </Typography>
                  ))}
                </CardContent>
                {tier.link && (
                  <CardActions sx={{ pb: { sm: 2 } }}>
                    <Button
                      component="a"
                      href={tier.link}
                      fullWidth
                      variant={tier.buttonVariant}
                      color="primary"
                    >
                      {intl.formatMessage({ id: tier.buttonTextId })}
                    </Button>
                  </CardActions>
                )}
              </Card>
            </Grid>
          ))}
        </Grid>
      </React.Fragment>
    </Layout>
  )
}

export default PricingPublicPage
