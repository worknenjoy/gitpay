import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Grid, CardContent, Typography, Alert } from '@mui/material'

import HeroTitle from 'design-library/atoms/typography/hero-title/hero-title'
import CallToActionHero from 'design-library/molecules/heroes/call-to-action-hero/call-to-action-hero'
import {
  Layout,
  HeroContent,
  CountryCard,
  FlagImage,
  CountryName,
  CurrencyLabel
} from './countries-public-page.styles'
import { countryCodes, countryCurrencies } from '../../../../areas/private/shared/country-codes'

const getCurrencyForCountry = (countryCode: string): string => {
  const match = countryCurrencies.find((c) => c.countries.includes(countryCode))
  return match ? match.code : ''
}

function CountriesPublicPage() {
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
              values={{ count: countryCodes.length }}
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
            const imageModule = require(`images/countries/${item.image}.png`)
            const flagSrc = imageModule.default || imageModule
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
                    <FlagImage src={flagSrc} alt={item.country} />
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
