import React from 'react'
import {
  withProfileTemplate,
  withProfilePayoutSettingsBankAccountTemplate,
} from '../../../../../../../.storybook/decorators/withPrivateTemplate'
import PayoutSettingsBankAccountInfo from './payout-settings-bank-account-info'

export default {
  title: 'Design Library/Pages/Private/PayoutSettingsBankAccountInfo',
  component: PayoutSettingsBankAccountInfo,
  decorators: [withProfilePayoutSettingsBankAccountTemplate, withProfileTemplate],
}

const Template = (args) => <PayoutSettingsBankAccountInfo {...args} />

export const Default = Template.bind({})
Default.args = {
  profileHeaderProps: {
    title: 'Payout Settings',
    subtitle: 'Manage your payout settings and preferences.',
  },
  user: {
    completed: true,
    data: {
      id: '1',
      name: 'John Doe',
      account_id: '123456789',
      Types: [{ name: 'contributor' }, { name: 'maintainer' }, { name: 'funding' }],
    },
    country: 'us',
  },
  bank_account: {
    completed: true,
    data: {
      routing_number: '123456',
      account_number: '123456789',
      account_type: 'individual',
      bank_id: '123456',
      currency: 'usd',
      account_holder_name: 'John Doe',
      account_holder_type: 'individual',
    },
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
        aud: 'aud',
      },
    },
  },
  onChangeBankCode: () => {},
  onSubmit: () => {},
}

export const Loading = Template.bind({})
Loading.args = {
  profileHeaderProps: {
    title: 'Payout Settings',
    subtitle: 'Manage your payout settings and preferences.',
  },
  user: {
    completed: false,
    data: {},
  },
  account: {
    completed: false,
    data: {},
  },
  countries: {
    completed: false,
    data: {},
  },
  onChangeBankCode: () => {},
  onSubmit: () => {},
}
