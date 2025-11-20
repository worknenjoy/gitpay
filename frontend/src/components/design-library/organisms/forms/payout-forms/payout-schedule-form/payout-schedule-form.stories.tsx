import React from 'react'
import PayoutScheduleForm from './payout-schedule-form'

export default {
  title: 'Design Library/Organisms/Forms/PayoutForms/PayoutScheduleForm',
  component: PayoutScheduleForm
}

const Template = (args) => <PayoutScheduleForm {...args} />

export const Default = Template.bind({})
Default.args = {
  // Add default props here if needed
}
