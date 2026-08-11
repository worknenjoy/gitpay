import WhopDisputesPanel from './whop-disputes-panel'

const meta = {
  title: 'Design Library/Molecules/Sections/WhopDisputesPanel',
  component: WhopDisputesPanel
}

export default meta

export const Empty = {
  args: { account: { completed: true, data: { disputes: [] } } }
}

export const WithDisputes = {
  args: {
    account: {
      completed: true,
      data: {
        disputes: [
          {
            id: 'dp_1',
            status: 'needs_response',
            reason: 'Chargeback',
            amount: 50,
            currency: 'usd',
            created_at: '2026-08-01'
          }
        ]
      }
    }
  }
}
