import Checklist from './checklist'

const meta = {
  title: 'Design Library/Molecules/DataDisplay/Checklist',
  component: Checklist
}

export default meta

const items = [
  {
    key: 'identity_document',
    title: 'Identity document',
    description: 'Government-issued ID and a selfie, uploaded on Whop',
    status: 'required' as const
  },
  {
    key: 'payout_method',
    title: 'Payout method',
    description: 'Add a bank account, debit card or USDC wallet on Whop',
    status: 'required' as const
  },
  {
    key: 'company_profile',
    title: 'Company profile',
    description: 'Name, country and contact email confirmed',
    status: 'done' as const
  },
  {
    key: 'gitpay_connection',
    title: 'Gitpay connection',
    description: 'Connected since 9 Aug 2026 · route alexandre-magno',
    status: 'done' as const
  }
]

export const RequirementsDue = {
  args: {
    title: 'Requirements & compliance',
    subtitle: 'What Whop still needs from you, and what it has already accepted.',
    action: { label: 'Resolve on Whop', href: '#' },
    items
  }
}

export const AllDone = {
  args: {
    title: 'Requirements & compliance',
    items: items.map((i) => ({ ...i, status: 'done' as const }))
  }
}

export const Loading = {
  args: { title: 'Requirements & compliance', items, completed: false }
}
