import React from 'react'
import { Typography } from '@mui/material'
import CheckoutCard from './checkout-card'

export default {
  title: 'Design Library/Molecules/Checkout/CheckoutCard',
  component: CheckoutCard
}

const Template = (args) => <CheckoutCard {...args} />

export const Default = Template.bind({})
Default.args = {
  title: 'Confirm your payment',
  subtitle: 'Choose how much you want to pay before continuing.',
  children: <Typography>Card body content</Typography>
}

export const WithoutSubtitle = Template.bind({})
WithoutSubtitle.args = {
  title: 'Complete your payment',
  children: <Typography>Card body content</Typography>
}
