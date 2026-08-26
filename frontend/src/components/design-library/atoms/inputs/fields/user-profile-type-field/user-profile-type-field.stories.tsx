import React from 'react'
import UserProfileTypeField from './user-profile-type-field'

export default {
  title: 'Design Library/Atoms/Inputs/Fields/UserProfileTypeField',
  component: UserProfileTypeField
}

const Template = (args) => <UserProfileTypeField {...args} />

export const Default = Template.bind({})
Default.args = {
  profileTypes: {
    completed: true,
    data: [
      { id: '1', name: 'contributor', label: 'Contributor' },
      { id: '2', name: 'maintainer', label: 'Maintainer' },
      { id: '3', name: 'sponsor', label: 'Sponsor' }
    ],
    error: false
  }
}
