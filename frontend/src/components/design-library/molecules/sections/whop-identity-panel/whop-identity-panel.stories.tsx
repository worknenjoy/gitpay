import WhopIdentityPanel from './whop-identity-panel'

const account = {
  completed: true,
  data: {
    id: 'biz_Wxa5ogScCxL2n3',
    title: 'Alexandre Magno',
    email: 'alexanmtz@gmail.com',
    country: 'br',
    identity: {
      legalName: 'Alexandre Magno',
      accountType: 'Individual',
      taxForm: 'W-8BEN',
      identityCheck: 'verified'
    }
  }
}

const meta = {
  title: 'Design Library/Molecules/Sections/WhopIdentityPanel',
  component: WhopIdentityPanel,
  args: { onManageOnWhop: () => alert('go to whop') }
}

export default meta

export const Verified = {
  args: { account }
}

export const Unverified = {
  args: {
    account: {
      ...account,
      data: {
        ...account.data,
        identity: { ...account.data.identity, identityCheck: 'unverified', taxForm: null }
      }
    }
  }
}

export const Loading = {
  args: { account: { completed: false, data: {} } }
}
