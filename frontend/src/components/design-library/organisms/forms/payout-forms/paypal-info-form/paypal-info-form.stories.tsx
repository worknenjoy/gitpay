import React from 'react'
import PaypalInfoForm from './paypal-info-form'

export default {
  title: 'Design Library/Organisms/Forms/PayoutForms/PaypalInfoForm',
  component: PaypalInfoForm
}

const Template = (args) => <PaypalInfoForm {...args} />

export const Default = Template.bind({})
Default.args = {
  user: {
    data: {
      paypal_id: 'paypal-active@test.com',
      email: 'test@test.com',
      country: 'US'
    },
    completed: true,
    error: {}
  },
  updateUser: (id, data) => {
    console.log(`User ${id} updated with data:`, data)
  }
}

export const NotActive = Template.bind({})
NotActive.args = {
  user: {
    data: {
      paypal_id: null,
      email: 'test@worknenjoy.com',
      country: 'US'
    },
    completed: true,
    error: {}
  },
  updateUser: (id, data) => {
    console.log(`User ${id} updated with data:`, data)
  }
}

export const Loading = Template.bind({})
Loading.args = {
  user: {
    data: null,
    completed: false,
    error: {}
  },
  updateUser: (id, data) => {
    console.log(`User ${id} updated with data:`, data)
  }
}
