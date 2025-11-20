import React from 'react'
import AcceptTermsField from './accept-terms-field'

export default {
  title: 'Design Library/Atoms/Inputs/Fields/AcceptTermsField',
  component: AcceptTermsField
}

const Template = (args) => <AcceptTermsField {...args} />

export const Default = Template.bind({})
Default.args = {
  accepted: false,
  acceptanceDate: 0,
  country: 'us',
  completed: true,
  onAccept: () => {},
  onReject: () => {}
}

export const Accepted = Template.bind({})
Accepted.args = {
  accepted: true,
  acceptanceDate: 1633036800, // Example timestamp
  country: 'us',
  completed: true,
  onAccept: () => {},
  onReject: () => {}
}

export const Loading = Template.bind({})
Loading.args = {
  accepted: false,
  acceptanceDate: 0,
  country: 'us',
  completed: false,
  onAccept: () => {},
  onReject: () => {}
}
