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

export const WhopConnectedCompany = Template.bind({})
WhopConnectedCompany.args = {
  profileHeaderProps: {
    title: 'Payout Settings',
    subtitle: 'Manage your payout settings and preferences.'
  },
  user: {
    completed: true,
    data: {
      id: '1',
      name: 'Jane Doe',
      email: 'jane@example.com',
      whop_account_id: 'biz_whop_123',
      Types: [{ name: 'provider' }]
    }
  },
  account: {
    completed: true,
    data: {
      id: 'biz_whop_123',
      provider: 'whop',
      active: true,
      title: 'Jane Consulting LLC',
      country: 'US',
      email: 'jane@example.com',
      verified: true,
      created_at: '2026-03-01T12:00:00.000Z',
      route: 'jane-consulting',
      url: 'https://whop.com/jane-consulting',
      capabilities: { transfers: 'active' },
      balances: { available: 120.5, pending: 40, reserve: 0 }
    }
  },
  countries: {
    completed: true,
    data: {
      provider: 'whop',
      countries: [{ country: 'United States', code: 'US' }]
    }
  },
  onCompleteVerification: () => console.log('fetch Whop verification link')
}
