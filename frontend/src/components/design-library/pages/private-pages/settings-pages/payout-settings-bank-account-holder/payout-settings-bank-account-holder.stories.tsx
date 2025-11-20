import React from 'react'
import {
  withProfileTemplate,
  withProfilePayoutSettingsBankAccountTemplate
} from '../../../../../../../.storybook/decorators/withPrivateTemplate'
import PayoutSettingsBankAccountHolder from './payout-settings-bank-account-holder'

export default {
  title: 'Design Library/Pages/Private/PayoutSettingsBankAccountHolder',
  component: PayoutSettingsBankAccountHolder,
  decorators: [withProfilePayoutSettingsBankAccountTemplate, withProfileTemplate]
}

const Template = (args) => <PayoutSettingsBankAccountHolder {...args} />

export const Default = Template.bind({})
Default.args = {
  profileHeaderProps: {
    title: 'Payout Settings',
    subtitle: 'Manage your payout settings and preferences.'
  },
  user: {
    completed: true,
    data: {
      id: '1',
      name: 'John Doe',
      account_id: '123456789',
      Types: [{ name: 'contributor' }, { name: 'maintainer' }, { name: 'funding' }]
    },
    country: 'us'
  },
  account: {
    completed: true,
    data: {
      id: '123456789',
      name: 'John Doe',
      account_id: '123456789',
      address: {
        address_line1: '123 Main St',
        address_line2: 'Apt 4B',
        city: 'New York',
        state: 'NY',
        zip_code: '10001',
        country: 'us'
      }
    },
    country: 'us'
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
  profileHeaderProps: {
    title: 'Payout Settings',
    subtitle: 'Manage your payout settings and preferences.'
  },
  user: {
    completed: false,
    data: {}
  },
  account: {
    completed: false,
    data: {}
  }
}
