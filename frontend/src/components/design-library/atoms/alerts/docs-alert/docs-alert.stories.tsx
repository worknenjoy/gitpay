import React from 'react'

import DocsAlert from './docs-alert'

export default {
  title: 'Design Library/Atoms/Alerts/DocsAlert',
  component: DocsAlert
}

const Template = (args) => <DocsAlert {...args} />

export const Primary = Template.bind({})
Primary.args = {
  text: 'New to Whop payouts?',
  docsUrl: 'https://docs.gitpay.me/docs/en/whop-payout-setup/',
  linkLabel: 'Read the guide'
}
