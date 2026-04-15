import React from 'react'
import { Search, Code, Verified, Paid } from '@mui/icons-material'
import { FormattedMessage, useIntl } from 'react-intl'

import SectionHero from 'design-library/molecules/heroes/section-hero/section-hero'
import StepsHero from 'design-library/molecules/heroes/steps-hero/steps-hero'
import CallToActionHero from 'design-library/molecules/heroes/call-to-action-hero/call-to-action-hero'

import CollectionFlatWorks from 'images/collections/collection-flat-works.svg'

const BountiesPublicPage = () => {
  const intl = useIntl()

  const bountySteps = [
    {
      number: '1',
      title: intl.formatMessage({
        id: 'bountiesPublicPage.steps.step1.title',
        defaultMessage: 'Pick a funded issue'
      }),
      description: intl.formatMessage({
        id: 'bountiesPublicPage.steps.step1.description',
        defaultMessage:
          'Find work that matches your skills, review the bounty, and decide what you want to solve.'
      }),
      numberColor: '#bdd5cb'
    },
    {
      number: '2',
      title: intl.formatMessage({
        id: 'bountiesPublicPage.steps.step2.title',
        defaultMessage: 'Submit your pull request'
      }),
      description: intl.formatMessage({
        id: 'bountiesPublicPage.steps.step2.description',
        defaultMessage:
          'Build the solution, collaborate with maintainers, and deliver your work through the repository workflow.'
      }),
      numberColor: '#73b89a'
    },
    {
      number: '3',
      title: intl.formatMessage({
        id: 'bountiesPublicPage.steps.step3.title',
        defaultMessage: 'Claim your payout'
      }),
      description: intl.formatMessage({
        id: 'bountiesPublicPage.steps.step3.description',
        defaultMessage:
          'When the pull request is merged, Gitpay connects the accepted work to the bounty payment.'
      }),
      numberColor: '#008d5d'
    }
  ]

  return (
    <>
      <SectionHero
        title={
          <FormattedMessage
            id="bountiesPublicPage.title"
            defaultMessage="Earn from Work on Gitpay"
          />
        }
        image={CollectionFlatWorks}
        content={
          <FormattedMessage
            id="bountiesPublicPage.content"
            defaultMessage="Browse funded issues, deliver solutions through pull requests, and get paid when your work is accepted. Gitpay gives contributors a clearer path from picked task to payout."
          />
        }
      />
      <StepsHero
        title={intl.formatMessage({
          id: 'bountiesPublicPage.steps.title',
          defaultMessage: 'How does it work?'
        })}
        steps={bountySteps}
        contrast
      />
      <SectionHero
        title={
          <FormattedMessage
            id="bountiesPublicPage.bestFit.title"
            defaultMessage="Why Gitpay for contributors?"
          />
        }
        content={
          <FormattedMessage
            id="bountiesPublicPage.bestFit.content"
            defaultMessage="Gitpay works well for developers who want flexible paid work, visible delivery, and payouts connected to accepted code."
          />
        }
        animation="/lottie/developer-main.lottie"
        items={[
          {
            icon: <Search />,
            primaryText: (
              <FormattedMessage
                id="bountiesPublicPage.bestFit.item.primary.choose"
                defaultMessage="Choose work that fits you"
              />
            ),
            secondaryText: (
              <FormattedMessage
                id="bountiesPublicPage.bestFit.item.secondary.choose"
                defaultMessage="Browse bounties and pick issues aligned with your skills and availability."
              />
            )
          },
          {
            icon: <Code />,
            primaryText: (
              <FormattedMessage
                id="bountiesPublicPage.bestFit.item.primary.delivery"
                defaultMessage="Build through Git workflows"
              />
            ),
            secondaryText: (
              <FormattedMessage
                id="bountiesPublicPage.bestFit.item.secondary.delivery"
                defaultMessage="Your delivery stays connected to commits, pull requests, and review history."
              />
            )
          },
          {
            icon: <Verified />,
            primaryText: (
              <FormattedMessage
                id="bountiesPublicPage.bestFit.item.primary.rules"
                defaultMessage="Know how payment is earned"
              />
            ),
            secondaryText: (
              <FormattedMessage
                id="bountiesPublicPage.bestFit.item.secondary.rules"
                defaultMessage="The reward is tied to accepted work, so expectations stay visible from the start."
              />
            )
          },
          {
            icon: <Paid />,
            primaryText: (
              <FormattedMessage
                id="bountiesPublicPage.bestFit.item.primary.paid"
                defaultMessage="Get paid for shipped work"
              />
            ),
            secondaryText: (
              <FormattedMessage
                id="bountiesPublicPage.bestFit.item.secondary.paid"
                defaultMessage="Turn merged contributions into payouts through Gitpay."
              />
            )
          }
        ]}
      />
      <CallToActionHero
        withContrast={true}
        title={
          <FormattedMessage
            id="bountiesPublicPage.callToAction.title"
            defaultMessage="Start earning from delivered work on Gitpay"
          />
        }
        actions={[
          {
            label: (
              <FormattedMessage
                id="bountiesPublicPage.callToAction.signup"
                defaultMessage="Signup as contributor"
              />
            ),
            link: '/#/signup/contributor',
            variant: 'contained',
            color: 'primary',
            size: 'large'
          },
          {
            label: (
              <FormattedMessage
                id="bountiesPublicPage.callToAction.explore"
                defaultMessage="Explore issues"
              />
            ),
            link: '/#/explore/issues',
            variant: 'outlined',
            color: 'primary',
            size: 'large'
          }
        ]}
      />
    </>
  )
}

export default BountiesPublicPage
