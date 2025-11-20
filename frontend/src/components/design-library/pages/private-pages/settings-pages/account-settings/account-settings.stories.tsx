import React from 'react'
import { withProfileTemplate } from '../../../../../../../.storybook/decorators/withPrivateTemplate'
import AccountSettings from './account-settings'

export default {
  title: 'Design Library/Pages/Private/AccountSettings',
  component: AccountSettings,
  decorators: [withProfileTemplate],
}

const Template = (args) => <AccountSettings {...args} />

export const Default = Template.bind({})
Default.args = {
  user: {
    completed: true,
    data: {
      id: '1',
      name: 'John Doe',
      Types: [{ name: 'contributor' }, { name: 'maintainer' }, { name: 'funding' }],
    },
  },
}
