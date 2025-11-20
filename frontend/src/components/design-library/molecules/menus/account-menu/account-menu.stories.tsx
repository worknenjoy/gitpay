import React, { useState } from 'react'
import AccountMenu from './account-menu'

export default {
  title: 'Design Library/Molecules/Menus/AccountMenu',
  component: AccountMenu,
}

const Template = (args) => {
  const [open, setOpen] = useState(false)

  return (
    <div>
      <button onClick={() => setOpen(!open)}>
        {open ? 'Close Account Menu' : 'Open Account Menu'}
      </button>
      <AccountMenu {...args} open={open} handleClose={() => setOpen(false)} />
    </div>
  )
}

export const Default = Template.bind({})
Default.args = {
  // Add default args here if needed
  user: {
    completed: true,
    data: {
      email: 'user@test.com',
      username: 'Test User',
      picture_url: 'https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50',
      Types: [
        {
          id: 1,
          name: 'contributor',
        },
        {
          id: 2,
          name: 'maintainer',
        },
        {
          id: 3,
          name: 'funding',
        },
      ],
    },
  },
}
