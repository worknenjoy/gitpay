import React from 'react'
import SignInButtons from './signin-buttons'

export default {
  title: 'Design Library/Atoms/Buttons/SignInButtons',
  component: SignInButtons,
}

const Template = (args) => <SignInButtons {...args} />

export const Default = Template.bind({})
Default.args = {
  // Add default props here
  onSignup: () => {},
  onSignin: () => {},
}
