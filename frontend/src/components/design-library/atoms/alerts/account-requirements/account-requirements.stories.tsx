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
      requirements: {
        currently_due: ['external_account']
      }
    },
    completed: true
  },
  onClick: () => {}
}

export const LoadingState = Template.bind({})
LoadingState.args = {
  user: {
    account_id: 1
  },
  account: {
    data: {
      requirements: {
        currently_due: ['external_account']
      }
    },
    completed: false
  },
  onClick: () => {}
}
