import React from 'react'
import { FormattedMessage } from 'react-intl'
import {
  Payments,
  Shield,
  Checklist,
  Code
} from '@mui/icons-material'

import SectionHero from 'design-library/molecules/heroes/section-hero/section-hero'
import StepsHero from 'design-library/molecules/heroes/steps-hero/steps-hero'
import CallToActionHero from 'design-library/molecules/heroes/call-to-action-hero/call-to-action-hero'

import CollectionFlatBuild from 'images/collections/collection-flat-build.svg'

const servicePaymentSteps = [
  {
    number: '1',
    title: 'Create a payment request',
    description: 'Describe your service, set the amount, and generate a secure payment link in seconds',
    numberColor: '#bdd5cb'
  },
  {
    number: '2',
    title: 'Share with your customer',
    description: 'Send the link — your client pays via secure Stripe checkout, no account needed',
    numberColor: '#73b89a'
  },
  {
    number: '3',
    title: 'Deliver and get paid',
    description: 'Confirm delivery and receive your payout directly to your bank account',
    numberColor: '#008d5d'
  }
]

const ServicePaymentsPublicPage = () => {
  return (
    <>
      <SectionHero
        title={
          <FormattedMessage
            id="servicePaymentsPublicPage.title"
            defaultMessage="Service Payments on Gitpay"
          />
        }
        image={CollectionFlatBuild}
        content={
          <FormattedMessage
            id="servicePaymentsPublicPage.content"
            defaultMessage="Get paid for your work requests to your customers deliveries in one place. Gitpay's Service Payments streamline the process of requesting, delivering, and receiving payments for services directly through our platform."
          />
        }
      />
      <StepsHero
        title="How does it work?"
        steps={servicePaymentSteps}
        contrast
      />
      <SectionHero
        title={
          <FormattedMessage
            id="servicePaymentsPublicPage.bestFit.title"
            defaultMessage="Why Gitpay for service providers?"
          />
        }
        content={
          <FormattedMessage
            id="servicePaymentsPublicPage.bestFit.content"
            defaultMessage="Gitpay works well for service providers who sell services or digital deliverables."
          />
        }
        animation="/lottie/coworking.lottie"
        items={[
          {
            icon: <Payments />,
            primaryText: (
              <FormattedMessage
                id="servicePaymentsPublicPage.bestFit.item.primary.freelancers"
                defaultMessage="Accept payments easily"
              />
            ),
            secondaryText: (
              <FormattedMessage
                id="servicePaymentsPublicPage.bestFit.item.secondary.freelancers"
                defaultMessage="Send a simple payment link to your clients."
              />
            )
          },
          {
            icon: <Shield />,
            primaryText: (
              <FormattedMessage
                id="servicePaymentsPublicPage.bestFit.item.primary.clientWork"
                defaultMessage="Reduce disputes"
              />
            ),
            secondaryText: (
              <FormattedMessage
                id="servicePaymentsPublicPage.bestFit.item.secondary.clientWork"
                defaultMessage="Keep a clear record of payments and delivery."
              />
            )
          },
          {
            icon: <Checklist />,
            primaryText: (
              <FormattedMessage
                id="servicePaymentsPublicPage.bestFit.item.primary.projectBased"
                defaultMessage="Stay organized"
              />
            ),
            secondaryText: (
              <FormattedMessage
                id="servicePaymentsPublicPage.bestFit.item.secondary.projectBased"
                defaultMessage="Track payments and payouts in one place."
              />
            )
          },
          {
            icon: <Code />,
            primaryText: (
              <FormattedMessage
                id="servicePaymentsPublicPage.bestFit.item.primary.providers"
                defaultMessage="Built for digital work"
              />
            ),
            secondaryText: (
              <FormattedMessage
                id="servicePaymentsPublicPage.bestFit.item.secondary.providers"
                defaultMessage="Gitpay is designed for service providers delivering digital services."
              />
            )
          }
        ]}
      />
      <CallToActionHero
        withContrast={true}
        title={
          <FormattedMessage
            id="servicePaymentsPublicPage.callToAction.title"
            defaultMessage="Start receiving payments for delivered services on Gitpay"
          />
        }
        actions={[
          {
            label: (
              <FormattedMessage
                id="servicePaymentsPublicPage.callToAction.signup"
                defaultMessage="Signup as service provider"
              />
            ),
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
