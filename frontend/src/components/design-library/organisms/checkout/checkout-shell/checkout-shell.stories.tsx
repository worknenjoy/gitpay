import React from 'react'
import { Typography } from '@mui/material'
import CheckoutShell from './checkout-shell'

export default {
  title: 'Design Library/Organisms/Checkout/CheckoutShell',
  component: CheckoutShell
}

const Template = (args) => <CheckoutShell {...args} />

export const Default = Template.bind({})
Default.args = {
  children: <Typography>Page content goes here</Typography>
}

export const Wide = Template.bind({})
Wide.args = {
  maxWidth: 900,
  children: <Typography>Wide two-column content goes here</Typography>
}
