import React from 'react'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import PeopleIcon from '@mui/icons-material/People'
import LinkIcon from '@mui/icons-material/Link'
import { withProfileTemplate } from '../../../../../../../.storybook/decorators/withPrivateTemplate'
import ServiceProviderDashboard from './service-provider-dashboard'

const meta = {
  title: 'Design Library/Pages/Private/DashboardPages/ServiceProviderDashboard',
  component: ServiceProviderDashboard,
  decorators: [withProfileTemplate]
}

export default meta

const Template = (args) => <ServiceProviderDashboard {...args} />

export const Default = Template.bind({})
Default.args = {
  user: { completed: true, data: { id: '1', name: 'John Doe' } },
  stats: [
    {
      icon: <AttachMoneyIcon fontSize="small" />,
      label: 'Total revenue',
      currency: '$',
      value: '61.00',
      note: 'across 4 payments'
    },
    {
      icon: <TrendingUpIcon fontSize="small" />,
      label: 'Payments',
      currency: '$',
      value: '24.00',
      note: '2 in the last 30 days'
    },
    {
      icon: <PeopleIcon fontSize="small" />,
      label: 'Customers',
      value: '4',
      note: '80% of links converted'
    },
    {
      icon: <LinkIcon fontSize="small" />,
      label: 'Payment links',
      value: '3',
      note: '2 active'
    }
  ],
  paymentsReceived: [
    {
      meta: ['PR #1301', 'card'],
      title: 'Whop payout provider integration',
      chip: { label: 'Paid', tone: 'success' },
      currency: '$',
      amount: '24.00',
      when: '12 Sep'
    },
    {
      meta: ['PR #1284', 'card'],
      title: 'Payment request expiry fix',
      chip: { label: 'Paid', tone: 'success' },
      currency: '$',
      amount: '18.00',
      when: '8 Sep'
    },
    {
      meta: ['Invoice 004', 'pix'],
      title: 'Design review, two sessions',
      chip: { label: 'Paid', tone: 'success' },
      currency: '$',
      amount: '12.00',
      when: '1 Sep'
    },
    {
      meta: ['Invoice 003', 'card'],
      title: 'Dashboard audit',
      chip: { label: 'Paid', tone: 'success' },
      currency: '$',
      amount: '7.00',
      when: '21 Aug'
    }
  ],
  paymentLinks: [
    {
      meta: ['gitpay.me/alexanmtz/audit', 'fixed'],
      title: 'Repository audit, one repo',
      chip: { label: 'Active', tone: 'success' },
      currency: '$',
      amount: '120.00',
      when: '2 paid'
    },
    {
      meta: ['gitpay.me/alexanmtz/review', 'flexible'],
      title: 'Pay what you want, from $40',
      chip: { label: 'Active', tone: 'success' },
      currency: '$',
      amount: '40.00',
      when: '1 paid'
    },
    {
      meta: ['gitpay.me/alexanmtz/office-hours', 'fixed'],
      title: 'One hour of pairing',
      chip: { label: 'Active', tone: 'success' },
      currency: '$',
      amount: '60.00',
      when: '—'
    },
    {
      meta: ['gitpay.me/alexanmtz/sprint', 'fixed'],
      title: 'Two-week sprint retainer',
      chip: { label: 'Archived', tone: 'neutral' },
      currency: '$',
      amount: '900.00',
      when: '—'
    }
  ],
  checklistProgress: { completed: 4, total: 4 },
  checklistItems: [
    { label: 'Account created', state: 'checked' },
    { label: 'First payment link created', state: 'checked' },
    { label: 'Payout account connected', state: 'checked' },
    { label: 'First payment link paid', state: 'checked' }
  ],
  claims: [
    {
      items: [
        { label: 'For bounties', value: '$0.00' },
        { label: 'For payment requests', value: '$61.00' },
        { label: 'Total', value: '$61.00', variant: 'emphasis' }
      ]
    }
  ],
  payoutsSummary: [
    {
      items: [
        { label: 'Paid out', value: '$51.94' },
        { label: 'In transit', value: '$9.06' },
        { label: 'Total', value: '$61.00', variant: 'emphasis' }
      ]
    }
  ],
  onCreatePaymentLinkClick: () => alert('Create a payment link clicked'),
  onViewPaymentsClick: () => alert('See all your payments clicked'),
  onViewPaymentLinksClick: () => alert('See all your payment links clicked'),
  onViewClaimsClick: () => alert('See your claims clicked'),
  onViewPayoutsSummaryClick: () => alert('See all payouts clicked')
}

export const Loading = Template.bind({})
Loading.args = {
  user: { completed: true, data: { id: '1', name: 'John Doe' } },
  completed: false,
  stats: Default.args.stats,
  paymentsReceived: [],
  paymentLinks: [],
  checklistProgress: { completed: 0, total: 4 },
  checklistItems: Default.args.checklistItems,
  claims: [],
  payoutsSummary: []
}

export const Empty = Template.bind({})
Empty.args = {
  user: { completed: true, data: { id: '1', name: 'John Doe' } },
  stats: [
    {
      icon: <AttachMoneyIcon fontSize="small" />,
      label: 'Total revenue',
      currency: '$',
      value: '0.00',
      note: 'no payments yet'
    },
    {
      icon: <TrendingUpIcon fontSize="small" />,
      label: 'Payments',
      currency: '$',
      value: '0.00',
      note: 'none in the last 30 days'
    },
    {
      icon: <PeopleIcon fontSize="small" />,
      label: 'Customers',
      value: '0',
      note: 'no links converted yet'
    },
    {
      icon: <LinkIcon fontSize="small" />,
      label: 'Payment links',
      value: '0',
      note: 'none created'
    }
  ],
  paymentsReceived: [],
  paymentLinks: [],
  checklistProgress: { completed: 1, total: 4 },
  checklistItems: [
    { label: 'Account created', state: 'checked' },
    { label: 'First payment link created', state: 'empty' },
    { label: 'Payout account connected', state: 'empty' },
    { label: 'First payment link paid', state: 'empty' }
  ],
  claims: [
    {
      items: [
        { label: 'For bounties', value: '$0.00' },
        { label: 'For payment requests', value: '$0.00' },
        { label: 'Total', value: '$0.00', variant: 'emphasis' }
      ]
    }
  ],
  // banner and payoutsSummary omitted: nothing to pay out yet
  onCreatePaymentLinkClick: () => alert('Create a payment link clicked')
}
