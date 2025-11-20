import React from 'react'
import LoginFormSignin from './login-form'

export default {
  title: 'Design Library/Molecules/FormSection/LoginForm/LoginFormMain/LoginFormSignin',
  component: LoginFormSignin
}

const Template = (args) => <LoginFormSignin {...args} />

export const LoginSignin = Template.bind({})
LoginSignin.args = {
  // Add default props here
  mode: 'signin'
}

export const LoginSignup = Template.bind({})
LoginSignup.args = {
  // Add default props here
  mode: 'signup'
}

export const LoginForgot = Template.bind({})
LoginForgot.args = {
  // Add default props here
  mode: 'forgot'
}

export const LoginReset = Template.bind({})
LoginReset.args = {
  // Add default props here
  mode: 'reset'
}
