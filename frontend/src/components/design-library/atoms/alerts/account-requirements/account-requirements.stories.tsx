import React from 'react'

import AccountRequirements from './account-requirements'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design Library/Atoms/Alerts/AccountRequirements',
  component: AccountRequirements
}

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template = (args) => <AccountRequirements {...args} />

export const Primary = Template.bind({})
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
  user: {
    account_id: 1
  },
  account: {
    data: {
      id: 'acct_1',
      provider: 'stripe',
      active: false,
      requirements: {
        currently_due: ['external_account']
      }
    },
    completed: true
  },
  onClick: () => {}
}

export const ActiveAccount = Template.bind({})
ActiveAccount.args = {
  user: {
    account_id: 'acct_1'
  },
  account: {
    data: {
      id: 'acct_1',
      provider: 'stripe',
      active: true
    },
    completed: true
  },
  onClick: () => {}
}

export const WhopVerificationRequired = Template.bind({})
WhopVerificationRequired.args = {
  user: {
    whop_account_id: 'biz_1'
  },
  account: {
    data: {
      id: 'biz_1',
      provider: 'whop',
      active: false
    },
    completed: true
  },
  forceShow: true,
  onClick: () => console.log('open Whop verification link')
}

export const LoadingState = Template.bind({})
LoadingState.args = {
  user: {
    account_id: 1
  },
  account: {
    data: {
      id: 'acct_1',
      provider: 'stripe',
      active: false,
      requirements: {
        currently_due: ['external_account']
      }
    },
    completed: false
  },
  onClick: () => {}
}
