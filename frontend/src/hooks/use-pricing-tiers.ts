import React from 'react'
import { defineMessages, useIntl } from 'react-intl'

export interface PricingTier {
  id: string
  title: string
  subheader: string
  price: string
  description: string[]
  link?: string
  buttonText: string
  buttonVariant?: 'text' | 'outlined' | 'contained'
}

const messages = defineMessages({
  openSourceTitle: { id: 'welcome.pricing.opensource.title', defaultMessage: 'Open source' },
  openSourceSubheader: {
    id: 'welcome.pricing.opensource.subheader',
    defaultMessage: 'For open source projects'
  },
  openSourceDescription1: {
    id: 'welcome.pricing.opensource.description1',
    defaultMessage: 'Public projects from Github or Bitbucket'
  },
  openSourceDescription2: {
    id: 'welcome.pricing.opensource.description2',
    defaultMessage:
      'We will match your issues with our contributor skills to find the right candidate'
  },
  openSourceDescription3: {
    id: 'welcome.pricing.opensource.description3',
    defaultMessage: '8% fee for payment with Credit Card or Paypal'
  },
  openSourceDescription4: {
    id: 'welcome.pricing.opensource.description4',
    defaultMessage: 'No fee for payments above $5000'
  },
  openSourceButton: { id: 'welcome.pricing.opensource.button', defaultMessage: 'Get started' },

  privateTitle: { id: 'welcome.pricing.private.title', defaultMessage: 'Private' },
  privateSubheader: {
    id: 'welcome.pricing.private.subheader',
    defaultMessage: 'For private projects'
  },
  privateDescription1: {
    id: 'welcome.pricing.private.description1',
    defaultMessage: 'Private projects on Github or Bitbucket'
  },
  privateDescription2: {
    id: 'welcome.pricing.private.description2',
    defaultMessage:
      'We will match your issues with our contributor skills to find the right candidate'
  },
  privateDescription3: {
    id: 'welcome.pricing.private.description3',
    defaultMessage: '18% fee for payment in Credit Card or Paypal'
  },
  privateButton: { id: 'welcome.pricing.private.button', defaultMessage: 'Get started' },

  contributorsTitle: {
    id: 'welcome.pricing.contributors.title',
    defaultMessage: 'Fee for contributors'
  },
  contributorsSubheader: {
    id: 'welcome.pricing.contributors.subheader',
    defaultMessage: 'For contributors who solve issues, you will have a fee to receive the transfer'
  },
  contributorsDescription1: {
    id: 'welcome.pricing.contributors.description1',
    defaultMessage:
      'We support direct transfer for your bank account registered on Gitpay for credit card payments or invoice'
  },
  contributorsDescription2: {
    id: 'welcome.pricing.contributors.description2',
    defaultMessage: 'We support Paypal to receive payments when the bounty is paid using Paypal'
  },
  contributorsDescription3: {
    id: 'welcome.pricing.contributors.description3',
    defaultMessage: '8% fee to withdraw your bounty after the Pull request is merged'
  },
  contributorsDescription4: {
    id: 'welcome.pricing.contributors.description4',
    defaultMessage:
      '⚠️ Note: You will receive the payouts according to the payment method used by the maintainer, if the maintainer paid with credit card, you will receive the payout in your bank account, if the maintainer paid with Paypal, you will receive the payout in your Paypal account'
  },
  contributorsButton: { id: 'welcome.pricing.contributors.button', defaultMessage: 'Get started' }
})

const usePricingTiers = () => {
  const intl = useIntl()

  return React.useMemo(() => {
    const signinLink = 'https://gitpay.me/#/signin'

    const tiersMaintainers: PricingTier[] = [
      {
        id: 'welcome.pricing.opensource.title',
        title: intl.formatMessage(messages.openSourceTitle),
        subheader: intl.formatMessage(messages.openSourceSubheader),
        price: '8%',
        description: [
          intl.formatMessage(messages.openSourceDescription1),
          intl.formatMessage(messages.openSourceDescription2),
          intl.formatMessage(messages.openSourceDescription3),
          intl.formatMessage(messages.openSourceDescription4)
        ],
        link: signinLink,
        buttonText: intl.formatMessage(messages.openSourceButton),
        buttonVariant: 'text'
      },
      {
        id: 'welcome.pricing.private.title',
        title: intl.formatMessage(messages.privateTitle),
        subheader: intl.formatMessage(messages.privateSubheader),
        price: '18%',
        description: [
          intl.formatMessage(messages.privateDescription1),
          intl.formatMessage(messages.privateDescription2),
          intl.formatMessage(messages.privateDescription3)
        ],
        link: signinLink,
        buttonText: intl.formatMessage(messages.privateButton),
        buttonVariant: 'text'
      }
    ]

    const tiersContributors: PricingTier[] = [
      {
        id: 'welcome.pricing.contributors.title',
        title: intl.formatMessage(messages.contributorsTitle),
        subheader: intl.formatMessage(messages.contributorsSubheader),
        price: '8%',
        description: [
          intl.formatMessage(messages.contributorsDescription1),
          intl.formatMessage(messages.contributorsDescription2),
          intl.formatMessage(messages.contributorsDescription3),
          intl.formatMessage(messages.contributorsDescription4)
        ],
        link: signinLink,
        buttonText: intl.formatMessage(messages.contributorsButton),
        buttonVariant: 'text'
      }
    ]

    return { tiersMaintainers, tiersContributors }
  }, [intl])
}

export default usePricingTiers
