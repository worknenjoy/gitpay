import React from 'react'

import { Button, Card, CardActions, CardContent, CardHeader, Grid, Typography } from '@mui/material'
import { FormattedMessage } from 'react-intl'
import { Layout, HeroContent, CardPricing } from './pricing-public-page.styles'
import HeroTitle from 'design-library/atoms/typography/hero-title/hero-title'
import usePricingTiers from '../../../../../hooks/use-pricing-tiers'

function PricingPublicPage() {
  const { tiersMaintainers, tiersContributors } = usePricingTiers()

  return (
    <Layout>
      <React.Fragment>
        <HeroContent>
          <HeroTitle>
            <FormattedMessage id="welcome.pricing.maintainers.title" defaultMessage="Our pricing model" />
          </HeroTitle>
        </HeroContent>

        <Grid container spacing={0} justifyContent="center">
          <Grid size={{ xs: 12, sm: 12 }}>
            <Card style={{ marginBottom: 20 }}>
              <CardHeader
                title={<FormattedMessage id="welcome.pricing.maintainers.title" defaultMessage="Our pricing model" />}
                subheader={<FormattedMessage id="welcome.pricing.maintainers.subtitle" defaultMessage="For project maintainers" />}
                sx={{
                  backgroundColor: (theme) => theme.palette.primary.light,
                  textAlign: 'center'
                }}
              />
              <CardContent>
                <Grid container spacing={2} justifyContent="center">
                  {tiersMaintainers.map((tier) => (
                    <Grid key={tier.id} size={{ xs: 12, sm: 6, md: 6 }}>
                      <Card style={{ marginBottom: 20 }}>
                        <CardHeader
                          title={tier.title}
                          subheader={tier.subheader}
                          sx={{
                            backgroundColor: (theme) => theme.palette.primary.light,
                            textAlign: 'center'
                          }}
                        />
                        <CardContent>
                          <CardPricing>
                            <Typography variant="h5" color="textPrimary">
                              <small>
                                <FormattedMessage id="welcome.pricing.opensource.fee" defaultMessage="Fee" />
                              </small>{' '}
                              {tier.price}
                            </Typography>
                            <Typography variant="body1" color="textSecondary">
                              <FormattedMessage id="welcome.pricing.month" defaultMessage=" / issue" />
                            </Typography>
                          </CardPricing>

                          {tier.description.map((desc, idx) => (
                            <Typography variant="body1" align="center" key={idx}>
                              {desc}
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
                              {tier.buttonText}
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
            <Grid key={tier.id} size={{ xs: 12, sm: 6, md: 12 }}>
              <Card>
                <CardHeader
                  title={tier.title}
                  subheader={tier.subheader}
                  sx={{
                    backgroundColor: (theme) => theme.palette.primary.light,
                    textAlign: 'center'
                  }}
                />
                <CardContent>
                  <CardPricing>
                    <Typography variant="h5" color="textPrimary">
                      <small>
                        <FormattedMessage id="welcome.pricing.opensource.fee" defaultMessage="Fee" />
                      </small>{' '}
                      {tier.price}
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                      <FormattedMessage id="welcome.pricing.month" defaultMessage=" / issue" />
                    </Typography>
                  </CardPricing>

                  {tier.description.map((desc, i) => (
                    <Typography
                      gutterBottom
                      variant={tier.description.length - 1 === i ? 'caption' : 'body1'}
                      align="center"
                      key={i}
                    >
                      {desc}
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
                      {tier.buttonText}
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
