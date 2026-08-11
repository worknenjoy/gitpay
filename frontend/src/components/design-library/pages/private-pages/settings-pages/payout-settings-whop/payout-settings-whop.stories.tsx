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
    onCompleteVerification: () => alert('verify on whop'),
    onManageOnWhop: () => alert('manage on whop'),
    onDisconnect: () => alert('disconnect')
  }
}

export default meta

export const PayoutsActive = {
  render: (args: any) => {
    const account = {
      completed: true,
      data: {
        ...baseData,
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
    return (
      <PayoutSettingsWhop {...args} account={account}>
        <WhopIdentityPanel account={account} onManageOnWhop={args.onManageOnWhop} />
      </PayoutSettingsWhop>
    )
  }
}

export const VerificationRequired = {
  render: (args: any) => {
    const account = {
      completed: true,
      data: {
        ...baseData,
        active: false,
        identity: { ...baseData.identity, identityCheck: 'unverified', taxForm: null },
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
