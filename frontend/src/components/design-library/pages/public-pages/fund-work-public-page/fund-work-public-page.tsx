import React from 'react'
import { Paid, TaskAlt, MergeType, Code } from '@mui/icons-material'
import { FormattedMessage, useIntl } from 'react-intl'

import SectionHero from 'design-library/molecules/heroes/section-hero/section-hero'
import StepsHero from 'design-library/molecules/heroes/steps-hero/steps-hero'
import CallToActionHero from 'design-library/molecules/heroes/call-to-action-hero/call-to-action-hero'

import CollectionFlatCommunity from 'images/collections/collection-flat-community.svg'

const FundWorkPublicPage = () => {
  const intl = useIntl()

  const fundWorkSteps = [
    {
      number: '1',
      title: intl.formatMessage({
        id: 'fundWorkPublicPage.steps.step1.title',
        defaultMessage: 'Add a bounty'
      }),
      description: intl.formatMessage({
        id: 'fundWorkPublicPage.steps.step1.description',
        defaultMessage:
          'Choose the issue or task you want completed, define the reward, and publish the funding terms.'
      }),
      numberColor: '#bdd5cb'
    },
    {
      number: '2',
      title: intl.formatMessage({
        id: 'fundWorkPublicPage.steps.step2.title',
        defaultMessage: 'Let contributors deliver'
      }),
      description: intl.formatMessage({
        id: 'fundWorkPublicPage.steps.step2.description',
        defaultMessage:
          'Developers pick the task, discuss scope, and submit the solution through a pull request.'
      }),
      numberColor: '#73b89a'
    },
    {
      number: '3',
      title: intl.formatMessage({
        id: 'fundWorkPublicPage.steps.step3.title',
        defaultMessage: 'Merge and pay'
      }),
      description: intl.formatMessage({
        id: 'fundWorkPublicPage.steps.step3.description',
        defaultMessage:
          'Once the work is accepted and merged, Gitpay connects the approved delivery to the bounty payout.'
      }),
      numberColor: '#008d5d'
    }
  ]

  return (
    <>
      <SectionHero
        title={
          <FormattedMessage id="fundWorkPublicPage.title" defaultMessage="Fund Work on Gitpay" />
        }
        image={CollectionFlatCommunity}
        content={
          <FormattedMessage
            id="fundWorkPublicPage.content"
            defaultMessage="Attach a bounty to an issue, invite contributors to deliver through pull requests, and release payment when the work is merged. Gitpay helps teams and sponsors move from funded backlog to verified delivery with a clear record of what was paid for."
          />
        }
      />
      <StepsHero
        title={intl.formatMessage({
          id: 'fundWorkPublicPage.steps.title',
          defaultMessage: 'How does it work?'
        })}
        steps={fundWorkSteps}
        contrast
      />
      <SectionHero
        title={
          <FormattedMessage
            id="fundWorkPublicPage.bestFit.title"
            defaultMessage="Why Gitpay for funding work?"
          />
        }
        content={
          <FormattedMessage
            id="fundWorkPublicPage.bestFit.content"
            defaultMessage="Gitpay works well when you want funding attached directly to concrete tasks and payouts tied to accepted delivery."
          />
        }
        animation="/lottie/coworking.lottie"
        items={[
          {
            icon: <Paid />,
            primaryText: (
              <FormattedMessage
                id="fundWorkPublicPage.bestFit.item.primary.funding"
                defaultMessage="Fund tasks with clear incentives"
              />
            ),
            secondaryText: (
              <FormattedMessage
                id="fundWorkPublicPage.bestFit.item.secondary.funding"
                defaultMessage="Make the reward visible before work starts so contributors know what is being funded."
              />
            )
          },
          {
            icon: <TaskAlt />,
            primaryText: (
              <FormattedMessage
                id="fundWorkPublicPage.bestFit.item.primary.backlog"
                defaultMessage="Turn backlog into shipped work"
              />
            ),
            secondaryText: (
              <FormattedMessage
                id="fundWorkPublicPage.bestFit.item.secondary.backlog"
                defaultMessage="Use bounties to help maintainers move priority issues forward."
              />
            )
          },
          {
            icon: <MergeType />,
            primaryText: (
              <FormattedMessage
                id="fundWorkPublicPage.bestFit.item.primary.merge"
                defaultMessage="Pay after accepted delivery"
              />
            ),
            secondaryText: (
              <FormattedMessage
                id="fundWorkPublicPage.bestFit.item.secondary.merge"
                defaultMessage="Keep payouts connected to the pull request and merge flow your team already uses."
              />
            )
          },
          {
            icon: <Code />,
            primaryText: (
              <FormattedMessage
                id="fundWorkPublicPage.bestFit.item.primary.repos"
                defaultMessage="Works across collaborative repos"
              />
            ),
            secondaryText: (
              <FormattedMessage
                id="fundWorkPublicPage.bestFit.item.secondary.repos"
                defaultMessage="A good fit for maintainers, sponsors, and teams coordinating work through Git."
              />
            )
          }
        ]}
      />
      <CallToActionHero
        withContrast={true}
        title={
          <FormattedMessage
            id="fundWorkPublicPage.callToAction.title"
            defaultMessage="Start funding work with clear delivery rules on Gitpay"
          />
        }
        actions={[
          {
            label: (
              <FormattedMessage
                id="fundWorkPublicPage.callToAction.maintainer"
                defaultMessage="Signup as maintainer"
              />
            ),
            link: '/#/signup/maintainer',
            variant: 'contained',
            color: 'primary',
            size: 'large'
          },
          {
            label: (
              <FormattedMessage
                id="fundWorkPublicPage.callToAction.sponsor"
                defaultMessage="Signup as sponsor"
              />
            ),
            link: '/#/signup/sponsor',
            variant: 'outlined',
            color: 'primary',
            size: 'large'
          }
        ]}
      />
    </>
  )
}

export default FundWorkPublicPage
