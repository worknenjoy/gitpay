import WhopRequirementsPanel from './whop-requirements-panel'

const meta = {
  title: 'Design Library/Molecules/Sections/WhopRequirementsPanel',
  component: WhopRequirementsPanel,
  args: { onResolveOnWhop: () => alert('go to whop') }
}

export default meta

export const RequirementsDue = {
  args: {
    account: {
      completed: true,
      data: {
        requirements: {
          checklist: [
            { key: 'identity_document', status: 'required' },
            { key: 'payout_method', status: 'required' },
            { key: 'company_profile', status: 'done' },
            { key: 'gitpay_connection', status: 'done' }
          ]
        }
      }
    }
  }
}

export const AllDone = {
  args: {
    account: {
      completed: true,
      data: {
        requirements: {
          checklist: [
            { key: 'identity_document', status: 'done' },
            { key: 'payout_method', status: 'done' },
            { key: 'company_profile', status: 'done' },
            { key: 'gitpay_connection', status: 'done' }
          ]
        }
      }
    }
  }
}

export const Loading = {
  args: { account: { completed: false, data: { requirements: { checklist: [] } } } }
}
