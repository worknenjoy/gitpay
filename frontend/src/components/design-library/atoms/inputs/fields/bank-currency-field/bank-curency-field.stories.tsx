import React from 'react'
import BankCurrencyField from './bank-currency-field'

export default {
  title: 'Design Library/Atoms/Inputs/Fields/BankCurrencyField',
  component: BankCurrencyField
}

const Template = (args) => <BankCurrencyField {...args} />

export const Default = Template.bind({})
Default.args = {
  countries: {
    completed: true,
    data: {
      default_currency: 'USD',
      supported_bank_account_currencies: {
        USD: 'United States Dollar',
        EUR: 'Euro',
        GBP: 'British Pound Sterling'
      }
    }
  },
  disabled: false,
  onChange: (e) => console.log(e.target.value)
}

export const Loading = Template.bind({})
Loading.args = {
  countries: {
    completed: false,
    data: {
      default_currency: 'USD',
      supported_bank_account_currencies: {
        USD: 'United States Dollar',
        EUR: 'Euro',
        GBP: 'British Pound Sterling'
      }
    }
  },
  disabled: true,
  onChange: (e) => console.log(e.target.value)
}
