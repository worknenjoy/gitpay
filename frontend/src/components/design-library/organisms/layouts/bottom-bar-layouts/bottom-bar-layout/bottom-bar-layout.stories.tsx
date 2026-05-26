import React from 'react'
import Bottom from './bottom-bar-layout'

export default {
  title: 'Design Library/Organisms/Layouts/BottomBar/BottomBar',
  component: Bottom
}

const Template = (args) => <Bottom {...args} />

export const Default = Template.bind({})
Default.args = {
  getInfo: () => {},
  info: {
    completed: true,
    data: {
      tasks: 200,
      bounties: 85000,
      users: 5000,
      paymentRequestPaymentsCount: 5621,
      totalPaidForPaymentRequests: 40000,
      userCountriesCount: 42
    }
  }
}

export const Loading = Template.bind({})
Loading.args = {
  getInfo: () => {},
  info: {
    completed: false,
    data: {}
  }
}
