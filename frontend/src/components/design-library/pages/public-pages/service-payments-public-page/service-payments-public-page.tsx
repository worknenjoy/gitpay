import React from 'react'

import { ReceiptLong, Link, Construction, AccountBalanceWallet } from '@mui/icons-material'

import SectionHero from 'design-library/molecules/heroes/section-hero/section-hero'
import CallToActionHero from 'design-library/molecules/heroes/call-to-action-hero/call-to-action-hero'

const ServicePaymentsPublicPage = () => {
  return (
    <>
      <SectionHero
        title="Service Payments on Gitpay"
        animation="/lottie/payment-transfer.lottie"
        content="Receive payments for delivered work with a simple request flow built for service providers."
      />
      <SectionHero
        contrast
        title="How it works"
        animation="/lottie/bank-transfer.lottie"
        items={[
          {
            icon: <ReceiptLong />,
            primaryText: 'Create a payment request',
            secondaryText:
              'Define the value and context of delivered work in a structured request flow.'
          },
          {
            icon: <Link />,
            primaryText: 'Share a payment link with your client',
            secondaryText:
              'Send a single payment link to speed up approvals and reduce back-and-forth.'
          },
          {
            icon: <Construction />,
            primaryText: 'Deliver the work',
            secondaryText:
              'Execution can remain tied to repositories, files, and milestones agreed with the client.'
          },
          {
            icon: <AccountBalanceWallet />,
            primaryText: 'Receive payouts directly to your bank account',
            secondaryText:
              'After confirmation, Gitpay routes the payout through the configured transfer flow.'
          }
        ]}
      />
      <SectionHero
        title="Best fit"
        animation="/lottie/freelancer-working.lottie"
        content="Great for developers, consultants, freelancers, and service providers who want a straightforward way to request payment."
      />
      <CallToActionHero
        withContrast={false}
        title="Get started with Service Payments on Gitpay"
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
