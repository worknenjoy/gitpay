import React from 'react'

import { ReceiptLong, Link, Construction, AccountBalanceWallet } from '@mui/icons-material'

import SectionHero from 'design-library/molecules/heroes/section-hero/section-hero'
import CallToActionHero from 'design-library/molecules/heroes/call-to-action-hero/call-to-action-hero'

const ServicePaymentsPublicPage = () => {
  return (
    <>
      <SectionHero
        title="Service Payments on Gitpay"
        animation="/lottie/developer-team.lottie"
        content="Service Payments helps you request and receive funds for delivered work with a clear, auditable flow. Create a request, share it with your client, and keep delivery evidence connected to your repositories, files, and milestones so approval and payout are straightforward for both sides."
      />
      <SectionHero
        contrast
        title="How it works"
        animation="/lottie/how-it-works.lottie"
        items={[
          {
            icon: <ReceiptLong />,
            primaryText: 'Create a payment request',
            secondaryText:
              'Set the amount, delivery scope, and payment context so expectations are clear from the start.'
          },
          {
            icon: <Link />,
            primaryText: 'Share a payment link with your client',
            secondaryText:
              'Send one link for review and payment to reduce manual invoicing steps and back-and-forth.'
          },
          {
            icon: <Construction />,
            primaryText: 'Deliver the work',
            secondaryText:
              'Deliver using your normal workflow while keeping proof of completion tied to commits, PRs, files, or milestones.'
          },
          {
            icon: <AccountBalanceWallet />,
            primaryText: 'Receive payouts directly to your bank account',
            secondaryText:
              'After client confirmation, Gitpay processes payout through the configured transfer route.'
          }
        ]}
      />
      <SectionHero
        title="Best fit"
        animation="/lottie/coworking.lottie"
        items={[
          {
            icon: <ReceiptLong />,
            primaryText: 'Freelancers and consultants sending formal requests',
            secondaryText:
              'Great when you need a simple request flow with clear scope and payment terms per delivery.'
          },
          {
            icon: <Link />,
            primaryText: 'Client work that depends on fast approvals',
            secondaryText:
              'A good fit when sharing one payment link reduces friction and shortens payment cycles.'
          },
          {
            icon: <Construction />,
            primaryText: 'Project-based services with delivery checkpoints',
            secondaryText:
              'Ideal when completion evidence should stay connected to PRs, files, or agreed milestones.'
          },
          {
            icon: <AccountBalanceWallet />,
            primaryText: 'Providers prioritizing predictable payout flow',
            secondaryText:
              'Works well when timely transfers and traceable payment status are essential to operations.'
          }
        ]}
      />
      <CallToActionHero
        withContrast={false}
        title="Start receiving payments for delivered services on Gitpay"
        actions={[
          {
            label: 'Signup as service provider',
            link: '/#/signup/service-provider',
            variant: 'contained',
            color: 'primary',
            size: 'large'
          }
        ]}
      />
    </>
  )
}

export default ServicePaymentsPublicPage
