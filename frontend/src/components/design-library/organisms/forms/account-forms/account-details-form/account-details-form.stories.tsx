import React from 'react'
import AccountDetailsForm from './account-details-form'

export default {
  title: 'Design Library/Organisms/Forms/AccountForms/AccountDetailsForm',
  component: AccountDetailsForm
}

const Template = (args) => <AccountDetailsForm {...args} />

export const Default = Template.bind({})
Default.args = {
  account: {
    completed: true,
    data: {
      first_name: 'John',
      last_name: 'Doe',
      email: 'test@gmail.com',
      phone: '+1234567890',
      address: {
        address_line1: '123 Main St',
        address_line2: 'Apt 4B',
        city: 'New York',
        state: 'NY',
        zip_code: '10001',
        country: 'US'
      },
      accepted_terms: {
        accepted: false,
        acceptance_date: 0,
        country: 'us'
      },
      country: 'US'
    },
    error: {}
  },
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
    },
    error: {}
  }
}

export const Error = Template.bind({})
Error.args = {
  account: {
    completed: true,
    data: {
      country: 'US'
    },
    error: {
      raw: {
        message: 'An error occurred while fetching account details.'
      },
      params: 'individual[address][city]'
    }
  },
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

export const Loading = Template.bind({})
Loading.args = {
  account: {
    completed: false,
    data: {},
    error: {}
  },
  countries: {
    completed: false,
    data: {},
    error: {}
  }
}
