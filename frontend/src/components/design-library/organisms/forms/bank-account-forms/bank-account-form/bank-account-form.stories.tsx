import React from 'react'
import BankAccountForm from './bank-account-form'

export default {
  title: 'Design Library/Organisms/Forms/BankAccountForms/BankAccountForm',
  component: BankAccountForm,
}

const Template = (args) => <BankAccountForm {...args} />

export const Default = Template.bind({})
Default.args = {
  user: {
    completed: true,
    data: {
      country: 'US',
    },
  },
  bankAccount: {
    completed: true,
    data: {},
  },
  countries: {
    completed: true,
    data: {
      default_currency: 'USD',
      supported_bank_account_currencies: {
        USD: 'United States Dollar',
        EUR: 'Euro',
        GBP: 'British Pound Sterling',
      },
    },
  },
}

export const PreFilled = Template.bind({})
PreFilled.args = {
  user: {
    completed: true,
    data: {
      country: 'US',
    },
  },
  bankAccount: {
    completed: true,
    data: {
      routing_number: '123456',
      account_number: '123456789',
      account_type: 'individual',
      id: '123456',
      currency: 'USD',
    },
  },
  countries: {
    completed: true,
    data: {
      default_currency: 'USD',
      supported_bank_account_currencies: {
        USD: 'United States Dollar',
        EUR: 'Euro',
        GBP: 'British Pound Sterling',
      },
    },
  },
}

export const Austria = Template.bind({})
Austria.args = {
  user: {
    completed: true,
    data: {
      country: 'AT',
    },
  },
  bankAccount: {
    completed: true,
    data: {},
  },
  countries: {
    completed: true,
    data: {
      default_currency: 'EUR',
      supported_bank_account_currencies: {
        EUR: 'Euro',
        USD: 'United States Dollar',
        GBP: 'British Pound Sterling',
      },
    },
  },
}

export const Brazil = Template.bind({})
Brazil.args = {
  user: {
    completed: true,
    data: {
      country: 'BR',
    },
  },
  bankAccount: {
    completed: true,
    data: {},
  },
  countries: {
    completed: true,
    data: {
      default_currency: 'BRL',
      supported_bank_account_currencies: {
        BRL: 'Brazilian Real',
        USD: 'United States Dollar',
        EUR: 'Euro',
        GBP: 'British Pound Sterling',
      },
    },
  },
}

export const Error = Template.bind({})
Error.args = {
  user: {
    completed: true,
    data: {
      country: 'AT',
    },
  },
  bankAccount: {
    completed: true,
    data: {},
    error: {
      raw: {
        message: 'An error occurred while fetching bank account details.',
      },
      params: 'external[account]',
    },
  },
  countries: {
    completed: true,
    data: {
      default_currency: 'EUR',
      supported_bank_account_currencies: {
        EUR: 'Euro',
        USD: 'United States Dollar',
        GBP: 'British Pound Sterling',
      },
    },
  },
}

export const Loading = Template.bind({})
Loading.args = {
  user: {
    completed: false,
    data: {},
  },
  bankAccount: {
    completed: false,
    data: {},
  },
  countries: {
    completed: false,
    data: {},
  },
}
