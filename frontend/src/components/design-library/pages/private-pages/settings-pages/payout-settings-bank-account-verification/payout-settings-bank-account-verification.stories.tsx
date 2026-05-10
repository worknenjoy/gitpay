import React from 'react'
import {
  withProfileTemplate,
  withProfilePayoutSettingsTemplate
} from '../../../../../../../.storybook/decorators/withPrivateTemplate'
import PayoutSettingsBankAccountVerification from './payout-settings-bank-account-verification'

export default {
  title: 'Design Library/Pages/Private/PayoutSettingsBankAccountVerification',
  component: PayoutSettingsBankAccountVerification,
  decorators: [withProfilePayoutSettingsTemplate, withProfileTemplate]
}

const Template = (args) => <PayoutSettingsBankAccountVerification {...args} />

const baseUser = {
  completed: true,
  data: {
    id: '1',
    name: 'John Doe',
    account_id: '123456789',
    Types: [{ name: 'contributor' }, { name: 'maintainer' }]
  }
}

const baseAccount = {
  completed: true,
  data: {
    country: 'US',
    requirements: {}
  }
}

export const ActionRequired = Template.bind({})
ActionRequired.args = {
  user: baseUser,
  account: {
    ...baseAccount,
    data: {
      ...baseAccount.data,
      requirements: {
        currently_due: [
          'individual.verification.document',
          'individual.id_number'
        ],
        eventually_due: []
      }
    }
  },
  onCompleteVerification: () => {}
}

export const Verified = Template.bind({})
Verified.args = {
  user: baseUser,
  account: {
    ...baseAccount,
    data: {
      ...baseAccount.data,
      requirements: {
        currently_due: [],
        eventually_due: []
      }
    }
  },
  onCompleteVerification: () => {}
}

export const UpcomingRequirements = Template.bind({})
UpcomingRequirements.args = {
  user: baseUser,
  account: {
    ...baseAccount,
    data: {
      ...baseAccount.data,
      requirements: {
        currently_due: [],
        eventually_due: [
          'individual.id_number',
          'business_profile.url'
        ],
        current_deadline: Math.floor(new Date('2026-06-30').getTime() / 1000)
      }
    }
  },
  onCompleteVerification: () => {}
}

export const Loading = Template.bind({})
Loading.args = {
  user: { completed: false, data: {} },
  account: {
    completed: false,
    data: {}
  },
  completed: false,
  onCompleteVerification: () => {}
}
