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
