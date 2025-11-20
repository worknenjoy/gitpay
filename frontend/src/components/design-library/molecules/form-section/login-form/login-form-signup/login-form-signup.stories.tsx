import React from 'react'
import { action } from '@storybook/addon-actions'
import LoginFormSignup from './login-form-signup'

export default {
  title: 'Design Library/Molecules/FormSection/LoginForm/LoginFormSignup',
  component: LoginFormSignup,
  controls: { expanded: true }
}

const Template = (args) => <LoginFormSignup {...args} />

export const Default = Template.bind({})
Default.args = {
  onSubmit: action('onSubmit'),
  roles: {
    completed: true,
    data: [
      { id: 1, name: 'contributor', label: 'Contributor' },
      { id: 2, name: 'sponsor', label: 'Sponsor' },
      { id: 3, name: 'maintainer', label: 'Maintainer' }
    ]
  },
  fetchRoles: () => {}
}
