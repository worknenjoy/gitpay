import React from 'react'
import SummaryCard from './summary-card'

const meta = {
  title: 'Design Library/Molecules/Cards/SummaryCard',
  component: SummaryCard
}

export default meta

const Template = (args) => <SummaryCard {...args} />

export const Claims = Template.bind({})
Claims.args = {
  title: 'Claims',
  sections: [
    {
      items: [
        { label: 'For bounties', value: '$32.42' },
        { label: 'For payment requests', value: '$5' },
        { label: 'Total', value: '$64.81', variant: 'emphasis' }
      ]
    }
  ],
  note: 'A claim is processed when your work is claimed and then it goes to payout and send to your account based on your payout preferences.',
  cta: 'See your claims'
}

export const Payouts = Template.bind({})
Payouts.args = {
  title: 'Payouts',
  sections: [
    {
      items: [
        { label: 'Paid out', value: '$51.94' },
        { label: 'In transit', value: '$9.06' },
        { label: 'Total', value: '$1.83', variant: 'emphasis' }
      ]
    }
  ],
  note: 'These payouts will be sent to your connected account.',
  cta: 'See all payouts'
}

export const PaymentBreakdown = Template.bind({})
PaymentBreakdown.args = {
  title: 'Breakdown',
  sections: [
    {
      items: [
        { label: 'Customer paid', value: '$120.00' },
        { label: 'Fees', value: '-$3.60', variant: 'negative' },
        { label: 'Net amount', value: '$116.40', variant: 'emphasis' }
      ]
    }
  ]
}

export const Loading = Template.bind({})
Loading.args = {
  title: 'Claims',
  sections: [],
  completed: false
}
