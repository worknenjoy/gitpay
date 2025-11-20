import React from 'react'
import {
  withProfileTemplate,
  withProfilePayoutSettingsTemplate,
} from '../../../../../../../.storybook/decorators/withPrivateTemplate'
import PayoutSettingsBankAccount from './payout-settings-bank-account'

export default {
  title: 'Design Library/Pages/Private/PayoutSettingsBankAccount',
  component: PayoutSettingsBankAccount,
  decorators: [withProfilePayoutSettingsTemplate, withProfileTemplate],
}

const Template = (args) => <PayoutSettingsBankAccount {...args} />

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
  },
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
}

export const NoAccount = Template.bind({})
NoAccount.args = {
  profileHeaderProps: {
    title: 'Payout Settings',
    subtitle: 'Manage your payout settings and preferences.',
  },
  user: {
    completed: true,
    data: {
      id: '1',
      name: 'John Doe',
      account_id: null,
      Types: [{ name: 'contributor' }, { name: 'maintainer' }, { name: 'funding' }],
    },
  },
}
