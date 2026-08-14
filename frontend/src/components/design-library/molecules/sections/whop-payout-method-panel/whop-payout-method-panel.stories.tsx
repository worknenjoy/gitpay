import WhopPayoutMethodPanel from './whop-payout-method-panel'

const meta = {
  title: 'Design Library/Molecules/Sections/WhopPayoutMethodPanel',
  component: WhopPayoutMethodPanel,
  args: { onManageOnWhop: () => alert('go to whop') }
}

export default meta

export const Empty = {
  args: { account: { completed: true, data: { payout_methods: [] } } }
}

export const WithMethod = {
  args: {
    account: {
      completed: true,
      data: {
        payout_methods: [
          { id: 'pm_1', type: 'bank_account', label: 'Test Bank', last4: '4242', default: true }
        ]
      }
    }
  }
}

export const Loading = {
  args: { account: { completed: false, data: {} } }
}
