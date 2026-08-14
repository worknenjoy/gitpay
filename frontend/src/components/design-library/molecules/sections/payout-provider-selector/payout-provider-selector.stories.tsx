import PayoutProviderSelector from './payout-provider-selector'

const meta = {
  title: 'Design Library/Molecules/Sections/PayoutProviderSelector',
  component: PayoutProviderSelector,
  args: {
    onCreateAccount: async () => alert('create whop account'),
    onAccessStripe: () => alert('go to stripe tab'),
    onAccessPaypal: () => alert('go to paypal tab')
  }
}

export default meta

export const NewUser = {
  args: {}
}

export const LegacyStripeUser = {
  args: { hasStripeAccount: true }
}

export const LegacyPaypalUser = {
  args: { hasPaypalAccount: true }
}

export const Loading = {
  args: { completed: false }
}
