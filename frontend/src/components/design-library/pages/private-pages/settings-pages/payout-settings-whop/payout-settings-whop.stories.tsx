import React from 'react'
import PayoutSettingsWhop from './payout-settings-whop'
import WhopIdentityPanel from '../../../../molecules/sections/whop-identity-panel/whop-identity-panel'

const baseData = {
  id: 'biz_Wxa5ogScCxL2n3',
  title: 'Alexandre Magno',
  email: 'alexanmtz@gmail.com',
  country: 'br',
  active: true,
  identity: {
    legalName: 'Alexandre Magno',
    accountType: 'Individual',
    taxForm: 'W-8BEN',
    identityCheck: 'verified'
  }
}

const meta = {
  title: 'Design Library/Pages/Settings/PayoutSettingsWhop',
  component: PayoutSettingsWhop,
  args: {
    onManageOnWhop: () => alert('manage on whop'),
    onDisconnect: () => alert('disconnect')
  }
}

export default meta

export const PayoutsActive = {
  render: (args: any) => {
    const account = {
      completed: true,
      data: baseData
    }
    return (
      <PayoutSettingsWhop {...args} account={account}>
        <WhopIdentityPanel account={account} onManageOnWhop={args.onManageOnWhop} />
      </PayoutSettingsWhop>
    )
  }
}

export const Pending = {
  render: (args: any) => {
    const account = {
      completed: true,
      data: {
        ...baseData,
        active: false,
        identity: { ...baseData.identity, identityCheck: 'pending', taxForm: null }
      }
    }
    return (
      <PayoutSettingsWhop {...args} account={account}>
        <WhopIdentityPanel account={account} onManageOnWhop={args.onManageOnWhop} />
      </PayoutSettingsWhop>
    )
  }
}

export const Rejected = {
  render: (args: any) => {
    const account = {
      completed: true,
      data: {
        ...baseData,
        active: false,
        identity: { ...baseData.identity, identityCheck: 'unverified', taxForm: null },
        requirements: { disabled_reason: 'rejected.other' }
      }
    }
    return (
      <PayoutSettingsWhop {...args} account={account}>
        <WhopIdentityPanel account={account} onManageOnWhop={args.onManageOnWhop} />
      </PayoutSettingsWhop>
    )
  }
}

export const Loading = {
  render: (args: any) => {
    const account = { completed: false, data: {} }
    return (
      <PayoutSettingsWhop {...args} account={account}>
        <WhopIdentityPanel account={account} />
      </PayoutSettingsWhop>
    )
  }
}
