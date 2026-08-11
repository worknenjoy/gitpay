import PayoutProviderCard from './payout-provider-card'

const meta = {
  title: 'Design Library/Molecules/Cards/PayoutProviderCard',
  component: PayoutProviderCard,
  parameters: { layout: 'centered' }
}

export default meta

export const WhopRecommended = {
  args: {
    provider: 'whop',
    recommended: true,
    title: 'Set up your payout on Whop',
    description:
      'Whop is the payments and payouts platform Gitpay now uses to pay contributors. It handles identity verification, tax forms and the actual transfer to your bank, card or crypto wallet.',
    features: [
      'Payouts to 100+ countries and 30+ currencies',
      'Bank transfer, debit card or USDC',
      'Identity and tax forms handled on Whop'
    ],
    link: { label: 'See supported countries', href: '#' },
    actionLabel: 'Set up on Whop'
  }
}

export const StripeDeprecated = {
  args: {
    provider: 'stripe',
    deprecated: true,
    title: 'Set up your payout on Stripe',
    description:
      'Stripe Connect was the previous payout route on Gitpay. New accounts can no longer be created.',
    warning:
      'This integration is not available anymore. Existing Stripe accounts keep paying out until they are migrated to Whop.',
    unavailableLabel: 'Not available',
    footnote: 'Already on Stripe? Support will contact you about migrating.'
  }
}

export const StripeExistingAccount = {
  args: {
    ...StripeDeprecated.args,
    hasExistingAccount: true,
    actionLabel: 'Access existing account'
  }
}

export const PaypalDeprecated = {
  args: {
    provider: 'paypal',
    deprecated: true,
    title: 'Set up your payout on PayPal',
    description:
      'PayPal payouts are being discontinued on Gitpay and cannot be connected as a new method.',
    warning:
      'PayPal is being discontinued. In a future release you will be able to add PayPal as a payout method inside Whop.',
    unavailableLabel: 'Not available',
    footnote: 'Use Whop in the meantime — it covers the same countries.'
  }
}

export const Loading = {
  args: { ...WhopRecommended.args, completed: false }
}
