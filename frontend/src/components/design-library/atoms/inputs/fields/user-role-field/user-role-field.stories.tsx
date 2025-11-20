import React from 'react'
import UserRoleField from './user-role-field'

export default {
  title: 'Design Library/Atoms/Inputs/Fields/UserRoleField',
  component: UserRoleField
}

const Template = (args) => <UserRoleField {...args} />

export const Default = Template.bind({})
Default.args = {
  roles: {
    completed: true,
    data: [
      { id: '1', name: 'contributor', label: 'Contributor' },
      { id: '2', name: 'maintainer', label: 'Maintainer' },
      { id: '3', name: 'sponsor', label: 'Sponsor' }
    ],
    error: false
  }
}
