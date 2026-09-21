import React from 'react'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import CodeIcon from '@mui/icons-material/Code'
import AssignmentIcon from '@mui/icons-material/Assignment'
import LinkIcon from '@mui/icons-material/Link'
import FavoriteIcon from '@mui/icons-material/Favorite'
import PaymentsIcon from '@mui/icons-material/Payments'
import RolePill from 'design-library/atoms/badges/role-pill/role-pill'
import { withProfileTemplate } from '../../../../../../../.storybook/decorators/withPrivateTemplate'
import DashboardOverview from './dashboard-overview'

const meta = {
  title: 'Design Library/Pages/Private/DashboardPages/DashboardOverview',
  component: DashboardOverview,
  decorators: [withProfileTemplate]
}

export default meta

const Template = (args) => <DashboardOverview {...args} />

export const Default = Template.bind({})
Default.args = {
  user: { completed: true, data: { id: '1', name: 'John Doe' } },
  onNavigateToRole: (key) => alert(`Open ${key} view clicked`),
  roleBadges: [
    <RolePill key="contributor" name="Contributor" tone="orange" />,
    <RolePill key="maintainer" name="Maintainer" tone="teal" />,
    <RolePill key="provider" name="Service provider" tone="yellow" />,
    <RolePill key="funding" name="Funding" tone="pink" />
  ],
  roleCount: 4,
  stats: [
    {
      icon: <AttachMoneyIcon fontSize="small" />,
      label: 'Money in',
      currency: '$',
      value: '4,354.20',
      note: 'earned and received, all time'
    },
    {
      icon: <ShoppingCartIcon fontSize="small" />,
      label: 'Money out',
      currency: '$',
      value: '29,093.20',
      note: 'funding and bounties paid'
    },
    {
      icon: <AccessTimeIcon fontSize="small" />,
      label: 'Awaiting payout',
      currency: '$',
      value: '64.81',
      note: 'next run 14 Sep'
    },
    {
      icon: <AccountBalanceWalletIcon fontSize="small" />,
      label: 'Wallet balance',
      currency: '$',
      value: '0.00',
      note: '1 wallet created'
    }
  ],
  roleSections: [
    {
      key: 'contributor',
      icon: <CodeIcon fontSize="small" />,
      label: 'Contributor',
      sub: '$4,293.20 earned · 2 issues open',
      linkText: 'Open contributor view',
      panelTitle: 'Work items',
      panelSubtitle: 'Issues you are working on',
      panelFooter: 'See all your issues',
      items: [
        {
          meta: ['worknenjoy/gitpay', '#1284', 'assigned 4 days ago'],
          title: 'Payment request expiry is ignored when the link is reopened',
          chip: { label: 'Open', tone: 'success' },
          currency: '$',
          amount: '180.00'
        },
        {
          meta: ['worknenjoy/gitpay', '#1279', 'assigned 9 days ago'],
          title: 'Add Whop payout provider to the payout settings screen',
          chip: { label: 'Open', tone: 'success' },
          currency: '$',
          amount: '240.00'
        }
      ]
    },
    {
      key: 'maintainer',
      icon: <AssignmentIcon fontSize="small" />,
      label: 'Maintainer',
      sub: '$4,293.20 paid · 39 projects in 4 organizations',
      linkText: 'Open maintainer view',
      panelTitle: 'Open issues',
      panelSubtitle: 'Funded issues and who is on them',
      panelFooter: 'See all your issues',
      items: [
        {
          meta: ['worknenjoy/gitpay', '#1284', 'alexanmtz assigned'],
          title: 'Payment request expiry is ignored when the link is reopened',
          chip: { label: 'Open', tone: 'success' },
          currency: '$',
          amount: '180.00'
        },
        {
          meta: ['worknenjoy/gitpay', '#1279', 'PR #1301 open'],
          title: 'Add Whop payout provider to the payout settings screen',
          chip: { label: 'Open', tone: 'success' },
          currency: '$',
          amount: '240.00'
        }
      ]
    },
    {
      key: 'provider',
      icon: <LinkIcon fontSize="small" />,
      label: 'Service provider',
      sub: '$61.00 revenue · 3 payment links, 2 active',
      linkText: 'Open provider view',
      panelTitle: 'Payment links',
      panelSubtitle: '5 links created · 4 payments settled',
      panelFooter: 'See all your payment links',
      items: [
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
        }
      ]
    },
    {
      key: 'funding',
      icon: <FavoriteIcon fontSize="small" />,
      label: 'Funding',
      sub: '$24,800 funded across 10 projects',
      linkText: 'Open funding view',
      panelTitle: 'Recent payments',
      panelSubtitle: '42 payments processed · $24,800 funded',
      panelFooter: 'See all your payments',
      items: [
        {
          meta: ['card', 'worknenjoy/gitpay'],
          title: 'Gitpay core development, monthly',
          chip: { label: 'Paid', tone: 'success' },
          currency: '$',
          amount: '600.00',
          when: '12 Sep'
        },
        {
          meta: ['card', 'nodejs/node'],
          title: 'Node.js maintenance fund, monthly',
          chip: { label: 'Paid', tone: 'success' },
          currency: '$',
          amount: '400.00',
          when: '12 Sep'
        }
      ]
    }
  ],
  checklistProgress: { completed: 3, total: 4 },
  checklistItems: [
    { label: 'Account created', state: 'checked' },
    { label: 'GitHub account connected', state: 'checked' },
    { label: 'First issue claimed', state: 'checked' },
    { label: 'Payout account connected', state: 'empty' }
  ],
  claims: [
    {
      items: [
        { label: 'For bounties', value: '$32.42' },
        { label: 'For payment requests', value: '$32.39' },
        { label: 'Total', value: '$64.81', variant: 'emphasis' }
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
  wallet: [
    {
      items: [
        { label: 'Balance', value: '$0.00' },
        { label: 'Spend from wallet', value: '$3,180.00' },
        { label: 'Pending', value: '$240.00' }
      ]
    }
  ],
  onViewClaimsClick: () => alert('See your claims clicked'),
  onViewPayoutsSummaryClick: () => alert('See all payouts clicked'),
  onManageWalletClick: () => alert('Manage wallet clicked')
}

export const Loading = Template.bind({})
Loading.args = {
  user: { completed: true, data: { id: '1', name: 'John Doe' } },
  completed: false,
  roleBadges: Default.args.roleBadges,
  roleCount: 4,
  stats: Default.args.stats,
  roleSections: Default.args.roleSections.map((section) => ({ ...section, items: [] })),
  checklistProgress: { completed: 0, total: 4 },
  checklistItems: Default.args.checklistItems,
  claims: [],
  payoutsSummary: [],
  wallet: []
}

export const Empty = Template.bind({})
Empty.args = {
  user: { completed: true, data: { id: '1', name: 'John Doe' } },
  onNavigateToRole: (key) => alert(`Open ${key} view clicked`),
  roleBadges: Default.args.roleBadges,
  roleCount: 4,
  stats: [
    {
      icon: <AttachMoneyIcon fontSize="small" />,
      label: 'Money in',
      currency: '$',
      value: '0.00',
      note: 'nothing earned or received yet'
    },
    {
      icon: <ShoppingCartIcon fontSize="small" />,
      label: 'Money out',
      currency: '$',
      value: '0.00',
      note: 'no funding or bounties paid yet'
    },
    {
      icon: <AccessTimeIcon fontSize="small" />,
      label: 'Awaiting payout',
      currency: '$',
      value: '0.00',
      note: 'nothing in the queue'
    },
    {
      icon: <AccountBalanceWalletIcon fontSize="small" />,
      label: 'Wallet balance',
      currency: '$',
      value: '0.00',
      note: 'no wallet created'
    }
  ],
  roleSections: [
    {
      key: 'contributor',
      icon: <CodeIcon fontSize="small" />,
      label: 'Contributor',
      sub: '$0.00 earned · 0 issues open',
      linkText: 'Open contributor view',
      panelTitle: 'Work items',
      panelSubtitle: 'Issues you are working on',
      items: [],
      emptyIcon: <CodeIcon fontSize="small" />,
      emptyText: 'No issues yet. Claim an issue from Explore and it shows up here.',
      emptyActionText: 'Explore issues',
      onEmptyActionClick: () => alert('Explore issues clicked')
    },
    {
      key: 'maintainer',
      icon: <AssignmentIcon fontSize="small" />,
      label: 'Maintainer',
      sub: '$0.00 paid · 0 projects',
      linkText: 'Open maintainer view',
      panelTitle: 'Open issues',
      panelSubtitle: 'Funded issues and who is on them',
      items: [],
      emptyIcon: <AssignmentIcon fontSize="small" />,
      emptyText: 'No open issues yet. Fund an issue and it shows up here.',
      emptyActionText: 'Fund an issue',
      onEmptyActionClick: () => alert('Fund an issue clicked')
    },
    {
      key: 'provider',
      icon: <LinkIcon fontSize="small" />,
      label: 'Service provider',
      sub: '$0.00 revenue · 0 payment links',
      linkText: 'Open provider view',
      panelTitle: 'Payment links',
      panelSubtitle: 'Links you share with clients to get paid',
      items: [],
      emptyIcon: <LinkIcon fontSize="small" />,
      emptyText: 'No payment links yet. Create one to start getting paid.',
      emptyActionText: 'Create a payment link',
      onEmptyActionClick: () => alert('Create a payment link clicked')
    },
    {
      key: 'funding',
      icon: <FavoriteIcon fontSize="small" />,
      label: 'Funding',
      sub: '$0.00 funded · 0 projects',
      linkText: 'Open funding view',
      panelTitle: 'Recent payments',
      panelSubtitle: 'Sponsorships and bounties paid from your funding',
      items: [],
      emptyIcon: <PaymentsIcon fontSize="small" />,
      emptyText: 'No payments yet. Sponsor a project or fund a bounty and it shows up here.',
      emptyActionText: 'Sponsor a project',
      onEmptyActionClick: () => alert('Sponsor a project clicked')
    }
  ],
  checklistProgress: { completed: 1, total: 4 },
  checklistItems: [
    { label: 'Account created', state: 'checked' },
    { label: 'GitHub account connected', state: 'empty' },
    { label: 'First issue claimed', state: 'empty' },
    { label: 'Payout account connected', state: 'empty' }
  ]
  // claims, payoutsSummary, and wallet omitted: nothing to show yet
}
