import React, { useState } from 'react'
import PaymentRequestDrawer from './payment-request-drawer'

const meta = {
  title: 'Design Library/Molecules/Drawers/PaymentRequestDrawer',
  component: PaymentRequestDrawer,
  args: {
    open: true,
    amount: 100,
    title: 'Request Payment',
    description: 'Please fill out the form to request payment'
  }
}

export default meta

const Template = (args) => {
  const [open, setOpen] = useState(true)

  return <PaymentRequestDrawer {...args} open={open} onClose={() => setOpen(false)} />
}

export const Default = Template.bind({})
Default.args = {}

export const Edit = Template.bind({})
Edit.args = {
  completed: true,
  paymentRequest: {
    compelted: true,
    data: {
      id: 1,
      title: 'Website Development',
      description: 'Development of a company website',
      amount: 1500,
      currency: 'USD',
      active: true
    }
  }
}

export const Loading = Template.bind({})
Loading.args = {
  completed: false
}
