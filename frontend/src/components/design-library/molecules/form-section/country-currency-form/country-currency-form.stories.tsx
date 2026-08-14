import React from 'react'
import CountryCurrencyForm from './country-currency-form'

export default {
  title: 'Design Library/Molecules/FormSection/CountryCurrencyForm',
  component: CountryCurrencyForm
}

const Template = (args) => <CountryCurrencyForm {...args} />

export const Default = Template.bind({})
Default.args = {
  country: 'US',
  countries: {
    completed: true,
    data: {
      default_currency: 'usd',
      supported_bank_account_currencies: {
        usd: 'usd',
        eur: 'eur',
        gbp: 'gbp',
        jpy: 'jpy',
        aud: 'aud'
      }
    }
  }
}

// Whop doesn't have a live Country Spec API like Stripe's — its `default_currency` is derived
// server-side from the user's country (see `currencyForCountry` in
// src/utils/currency/currency-map.ts) and returned by `GET /user/account/countries` in the same
// shape Stripe uses. The component itself doesn't know or care which provider produced the data.
export const WhopDerivedCurrency = Template.bind({})
WhopDerivedCurrency.args = {
  country: 'BR',
  countries: {
    completed: true,
    data: {
      default_currency: 'brl',
      supported_bank_account_currencies: {
        brl: 'brl'
      }
    }
  }
}
