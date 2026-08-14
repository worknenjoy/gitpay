import WhopScheduleBalancesPanel from './whop-schedule-balances-panel'

const meta = {
  title: 'Design Library/Molecules/Sections/WhopScheduleBalancesPanel',
  component: WhopScheduleBalancesPanel,
  args: { onManageOnWhop: () => alert('go to whop') }
}

export default meta

export const Default = {
  args: {
    account: {
      completed: true,
      data: { currency: 'usd', balances: { available: 120, pending: 30, reserve: 0 } }
    }
  }
}

export const Loading = {
  args: { account: { completed: false, data: {} } }
}
