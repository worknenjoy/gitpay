import React from 'react'
import { FormattedMessage } from 'react-intl'
import { ReceiptLong, Link, Construction, AccountBalanceWallet, Payments, Shield, Checklist, Code } from '@mui/icons-material'

import SectionHero from 'design-library/molecules/heroes/section-hero/section-hero'
import CallToActionHero from 'design-library/molecules/heroes/call-to-action-hero/call-to-action-hero'

const ServicePaymentsPublicPage = () => {
  return (
    <>
      <SectionHero
        title={<FormattedMessage id="servicePaymentsPublicPage.title" defaultMessage="Service Payments on Gitpay" />}
        animation="/lottie/developer-team.lottie"
        content={<FormattedMessage id="servicePaymentsPublicPage.content" defaultMessage="Get paid for your work requests to your customers deliveries in one place. Gitpay's Service Payments streamline the process of requesting, delivering, and receiving payments for services directly through our platform." />}
      />
      <SectionHero
        contrast
        title={<FormattedMessage id="servicePaymentsPublicPage.howItWorks.title" defaultMessage="How it works" />}
        content={<FormattedMessage id="servicePaymentsPublicPage.howItWorks.content" defaultMessage="Service providers often face challenges in managing payment requests, tracking delivery, and ensuring timely payouts. Gitpay's Service Payments address these issues by providing a seamless platform that integrates with your existing workflow." />}
        animation="/lottie/how-it-works.lottie"
        items={[
          {
            icon: <ReceiptLong />,
            primaryText: <FormattedMessage id="servicePaymentsPublicPage.howItWorks.item.primary.createRequest" defaultMessage="Create a payment request" />,
            secondaryText:
              <FormattedMessage id="servicePaymentsPublicPage.howItWorks.item.secondary.createRequest" defaultMessage="Describe your service, define the amount, and create a payment request." />
          },
          {
            icon: <Link />,
            primaryText: <FormattedMessage id="servicePaymentsPublicPage.howItWorks.item.primary.shareLink" defaultMessage="Share a payment link with your customer" />,
            secondaryText:
              <FormattedMessage id="servicePaymentsPublicPage.howItWorks.item.secondary.shareLink" defaultMessage="The client pays using a secure checkout powered by Stripe." />
          },
          {
            icon: <Construction />,
            primaryText: <FormattedMessage id="servicePaymentsPublicPage.howItWorks.item.primary.deliverWork" defaultMessage="Deliver the work" />,
            secondaryText:
              <FormattedMessage id="servicePaymentsPublicPage.howItWorks.item.secondary.deliverWork" defaultMessage="Once payment is confirmed, Gitpay can automatically send instructions to the client on how to access the deliverable." />
          },
          {
            icon: <AccountBalanceWallet />,
            primaryText: <FormattedMessage id="servicePaymentsPublicPage.howItWorks.item.primary.receivePayouts" defaultMessage="Receive payouts directly to your bank account" />,
            secondaryText:
              <FormattedMessage id="servicePaymentsPublicPage.howItWorks.item.secondary.receivePayouts" defaultMessage="After client confirmation, Gitpay processes payout through the configured transfer route." />
          }
        ]}
      />
      <SectionHero
        title={<FormattedMessage id="servicePaymentsPublicPage.bestFit.title" defaultMessage="Why Gitpay for service providers?" />}
        content={<FormattedMessage id="servicePaymentsPublicPage.bestFit.content" defaultMessage="Gitpay works well for service providers who sell services or digital deliverables." />}
        animation="/lottie/coworking.lottie"
        items={[
          {
            icon: <Payments />,
            primaryText: <FormattedMessage id="servicePaymentsPublicPage.bestFit.item.primary.freelancers" defaultMessage="Accept payments easily" />,
            secondaryText:
              <FormattedMessage id="servicePaymentsPublicPage.bestFit.item.secondary.freelancers" defaultMessage="Send a simple payment link to your clients." />
          },
          {
            icon: <Shield />,
            primaryText: <FormattedMessage id="servicePaymentsPublicPage.bestFit.item.primary.clientWork" defaultMessage="Reduce disputes" />,
            secondaryText:
              <FormattedMessage id="servicePaymentsPublicPage.bestFit.item.secondary.clientWork" defaultMessage="Keep a clear record of payments and delivery." />
          },
          {
            icon: <Checklist />,
            primaryText: <FormattedMessage id="servicePaymentsPublicPage.bestFit.item.primary.projectBased" defaultMessage="Stay organized" />,
            secondaryText:
              <FormattedMessage id="servicePaymentsPublicPage.bestFit.item.secondary.projectBased" defaultMessage="Track payments and payouts in one place." />
          },
          {
            icon: <Code />,
            primaryText: <FormattedMessage id="servicePaymentsPublicPage.bestFit.item.primary.providers" defaultMessage="Built for digital work" />,
            secondaryText:
              <FormattedMessage id="servicePaymentsPublicPage.bestFit.item.secondary.providers" defaultMessage="Gitpay is designed for service providers delivering digital services." />
          }
        ]}
      />
      <CallToActionHero
        withContrast={false}
        title={<FormattedMessage id="servicePaymentsPublicPage.callToAction.title" defaultMessage="Start receiving payments for delivered services on Gitpay" />}
        actions={[
          {
            label: <FormattedMessage id="servicePaymentsPublicPage.callToAction.signup" defaultMessage="Signup as service provider" />,
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
