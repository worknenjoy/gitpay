import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Grid, CardContent, Typography, Alert } from '@mui/material'

import HeroTitle from 'design-library/atoms/typography/hero-title/hero-title'
import CallToActionHero from 'design-library/molecules/heroes/call-to-action-hero/call-to-action-hero'
import {
  Layout,
  HeroContent,
  CountryCard,
  CountryName,
  CurrencyLabel
} from './countries-public-page.styles'
import { countryCurrencies } from '../../../../areas/private/shared/country-codes'
import {
  getSupportedCountryCodes,
  getSupportedCountriesCount
} from '../../../../areas/private/shared/provider-country-codes'
import CountryFlagImage from '../../../../areas/private/shared/country-flag-image'

const getCurrencyForCountry = (countryCode: string): string => {
  const match = countryCurrencies.find((c) => c.countries.includes(countryCode))
  return match ? match.code : ''
}

function CountriesPublicPage() {
  const countryCodes = getSupportedCountryCodes()
  const paymentProvider = process.env.PAYMENT_PROVIDER || 'stripe'

  return (
    <>
      <Layout>
        <HeroContent>
          <HeroTitle>
            <FormattedMessage id="countries.hero.title" defaultMessage="Supported Countries" />
          </HeroTitle>
          <Typography variant="subtitle1" color="textSecondary" gutterBottom>
            <FormattedMessage
              id="countries.hero.subtitle"
              defaultMessage="Receive payments in your local currency from anywhere in the world"
            />
          </Typography>
          <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
            <FormattedMessage
              id="countries.hero.count"
              defaultMessage="{count} supported countries"
              values={{ count: getSupportedCountriesCount() }}
            />
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 0.5 }}>
            <FormattedMessage
              id="countries.hero.provider"
              defaultMessage="Payout countries for {provider}"
              values={{
                provider: paymentProvider === 'whop' ? 'Whop' : 'Stripe'
              }}
            />
          </Typography>
        </HeroContent>

        <Alert severity="info" sx={{ mb: 3 }}>
          <FormattedMessage
            id="countryPicker.info"
            defaultMessage="If your country is not listed, please contact us at contact@gitpay.me"
          />
        </Alert>

        <Grid container spacing={2} sx={{ mt: 2 }}>
          {countryCodes.map((item) => {
            const currency = getCurrencyForCountry(item.code)

            return (
              <Grid key={item.code} size={{ xs: 6, sm: 4, md: 3, lg: 2 }}>
                <CountryCard elevation={1}>
                  <CardContent
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      p: 1.5,
                      '&:last-child': { pb: 1.5 }
                    }}
                  >
                    <CountryFlagImage
                      image={item.image}
                      alt={item.country}
                      width={56}
                      style={{ marginBottom: 8, borderRadius: 2 }}
                    />
                    <CountryName>{item.country}</CountryName>
                    {currency && <CurrencyLabel>{currency}</CurrencyLabel>}
                  </CardContent>
                </CountryCard>
              </Grid>
            )
          })}
        </Grid>
      </Layout>
      <CallToActionHero
        title={
          <FormattedMessage
            id="countries.cta.title"
            defaultMessage="Ready to receive payments in your country?"
          />
        }
        actions={[
          {
            label: <FormattedMessage id="countries.cta.signup" defaultMessage="Sign up for free" />,
            link: '/#/signup',
            variant: 'contained',
            color: 'primary'
          },
          {
            label: <FormattedMessage id="countries.cta.learn" defaultMessage="Learn more" />,
            link: '/#/welcome',
            variant: 'outlined',
            color: 'secondary'
          }
        ]}
      />
    </>
  )
}

export default CountriesPublicPage
