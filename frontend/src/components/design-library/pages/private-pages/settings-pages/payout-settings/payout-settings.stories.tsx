import React from 'react'
import { withProfileTemplate } from '../../../../../../../.storybook/decorators/withPrivateTemplate'
import PayoutSettings from './payout-settings'

export default {
  title: 'Design Library/Pages/Private/PayoutSettings',
  component: PayoutSettings,
  decorators: [withProfileTemplate]
}

const Template = (args) => <PayoutSettings {...args} />

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
      Types: [{ name: 'contributor' }, { name: 'maintainer' }, { name: 'funding' }]
    }
  }
}
