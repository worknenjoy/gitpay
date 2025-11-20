import React from 'react'
import DeliveryDate from './delivery-date'

export default {
  title: 'Design Library/Organisms/Forms/DateForms/DeliveryDate',
  component: DeliveryDate
}

const Template = (args) => <DeliveryDate {...args} />

export const Default = Template.bind({})
Default.args = {
  // Add default props here
  date: new Date()
}

export const WithCustomDate = Template.bind({})
WithCustomDate.args = {
  date: new Date('2023-12-25')
}
