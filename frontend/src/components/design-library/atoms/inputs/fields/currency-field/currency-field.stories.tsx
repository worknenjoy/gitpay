import React from 'react'
import CurrencyField from './currency-field'

export default {
  title: 'Design Library/Atoms/Inputs/Fields/CurrencyField',
  component: CurrencyField
}

const Template = (args) => <CurrencyField {...args} />

export const Default = Template.bind({})
Default.args = {
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

export const Disabled = Template.bind({})
Disabled.args = {
  label: 'Amount',
  placeholder: 'Enter amount',
  value: '50.00',
  disabled: true,
  onChange: (value) => console.log('Currency value changed:', value)
}
