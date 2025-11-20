import React, { useState } from 'react'
import SignupDialog from './signup-dialog'

export default {
  title: 'Design Library/Molecules/Dialogs/SignupDialog',
  component: SignupDialog,
}

const Template = (args) => {
  const [open, setOpen] = useState(false)

  return (
    <div>
      <button onClick={() => setOpen(true)}>Open Dialog</button>
      <SignupDialog {...args} open={open} onClose={() => setOpen(false)} />
    </div>
  )
}

export const Signup = Template.bind({})
Signup.args = {
  open: false,
  mode: 'signup',
}

export const Login = Template.bind({})
Login.args = {
  open: false,
  mode: 'signin',
}

export const Forgot = Template.bind({})
Forgot.args = {
  open: false,
  mode: 'forgot',
}

export const Reset = Template.bind({})
Reset.args = {
  open: false,
  mode: 'reset',
}
