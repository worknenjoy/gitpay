import React from 'react'

import { Work, CardMembership, AttachMoney, TaskAlt } from '@mui/icons-material'

import { useIntl, FormattedMessage } from 'react-intl'
import { useHistory } from 'react-router-dom'

import MainHero from 'design-library/molecules/heroes/main-hero/main-hero'
import CardsHero from 'design-library/molecules/heroes/cards-hero/cards-hero'
import SecondaryHero from 'design-library/molecules/heroes/secondary-hero/secondary-hero'
import CallToActionHero from 'design-library/molecules/heroes/call-to-action-hero/call-to-action-hero'
import notificationsImage from 'images/roles/notifications.png'
import paymentCycleImage from 'images/roles/payment-cycle.png'
import sharingImage from 'images/roles/sharing.png'

const Home = () => {
  const history = useHistory()
  const intl = useIntl()

  return (
    <>
      <MainHero
        mainTitle={
          <FormattedMessage
            id="welcome.hero.main.title"
            defaultMessage="The payment platform for work delivered. Powered by Git"
          />
        }
        description={
          <FormattedMessage
            id="welcome.hero.main.description"
            defaultMessage="Gitpay connects payments directly to the work being done. Fund issues, reward approved pull requests, or request payment for services delivered through repositories and tracked files. Gitpay provides a transparent way to fund work, verify delivery, and distribute payments."
          />
        }
        animation={'/lottie/developer-main.lottie'}
        actions={[
          {
            label: 'Learn More',
            variant: 'outlined',
            color: 'secondary',
            onClick: () => history.push('/welcome')
          },
          {
            label: 'Get Started',
            variant: 'contained',
            color: 'primary',
            onClick: () => history.push('/signup')
          }
        ]}
      />
      <CardsHero
        withContrast={true}
        title="What is Gitpay for"
        cards={[
          {
            type: 'service-payments',
            title: '💼 Service Payments',
            descriptionListIcon: <TaskAlt fontSize="small" />,
            descriptionList: [
              {
                text: (
                  <FormattedMessage
                    id="welcome.usecases.service.item1"
                    defaultMessage="Receive payments for delivered work."
                  />
                )
              },
              {
                text: (
                  <FormattedMessage
                    id="welcome.usecases.service.item2"
                    defaultMessage="Create a payment request"
                  />
                )
              },
              {
                text: (
                  <FormattedMessage
                    id="welcome.usecases.service.item3"
                    defaultMessage="Share a payment link with your client"
                  />
                )
              },
              {
                text: (
                  <FormattedMessage
                    id="welcome.usecases.service.item4"
                    defaultMessage="Deliver the work"
                  />
                )
              },
              {
                text: (
                  <FormattedMessage
                    id="welcome.usecases.service.item5"
                    defaultMessage="Receive payouts directly to your bank account"
                  />
                )
              },
              {
                text: (
                  <FormattedMessage
                    id="welcome.usecases.service.item6"
                    defaultMessage="This works for developers, consultants, freelancers, and service providers who want a simple way to request payment."
                  />
                )
              }
            ],
            image: paymentCycleImage,
            actionLabel: 'Explore service payments',
            onAction: () => history.push('/use-cases/service-payments')
          },
          {
            type: 'open-source',
            title: '🧩 Open Source',
            descriptionListIcon: <TaskAlt fontSize="small" />,
            descriptionList: [
              {
                text: (
                  <FormattedMessage
                    id="welcome.usecases.opensource.item1"
                    defaultMessage="Fund and solve issues in public repositories."
                  />
                )
              },
              {
                text: (
                  <FormattedMessage
                    id="welcome.usecases.opensource.item2"
                    defaultMessage="Sponsors fund issues"
                  />
                )
              },
              {
                text: (
                  <FormattedMessage
                    id="welcome.usecases.opensource.item3"
                    defaultMessage="Contributors pick issues to solve"
                  />
                )
              },
              {
                text: (
                  <FormattedMessage
                    id="welcome.usecases.opensource.item4"
                    defaultMessage="Work is delivered through pull requests"
                  />
                )
              },
              {
                text: (
                  <FormattedMessage
                    id="welcome.usecases.opensource.item5"
                    defaultMessage="Gitpay handles payouts once the PR is merged"
                  />
                )
              }
            ],
            image: notificationsImage,
            actionLabel: 'Explore open source',
            onAction: () => history.push('/use-cases/open-source')
          },
          {
            type: 'private-projects',
            title: '🔒 Private Projects',
            descriptionListIcon: <TaskAlt fontSize="small" />,
            descriptionList: [
              {
                text: (
                  <FormattedMessage
                    id="welcome.usecases.private.item1"
                    defaultMessage="Fund work inside private repositories or internal projects."
                  />
                )
              },
              {
                text: (
                  <FormattedMessage
                    id="welcome.usecases.private.item2"
                    defaultMessage="Companies fund tasks or features"
                  />
                )
              },
              {
                text: (
                  <FormattedMessage
                    id="welcome.usecases.private.item3"
                    defaultMessage="Developers submit work through pull requests"
                  />
                )
              },
              {
                text: (
                  <FormattedMessage
                    id="welcome.usecases.private.item4"
                    defaultMessage="Maintainers verify delivery by merging the PR"
                  />
                )
              },
              {
                text: (
                  <FormattedMessage
                    id="welcome.usecases.private.item5"
                    defaultMessage="Gitpay releases the payment automatically"
                  />
                )
              },
              {
                text: (
                  <FormattedMessage
                    id="welcome.usecases.private.item6"
                    defaultMessage="This works well for contract work, agencies, and on-demand development services."
                  />
                )
              }
            ],
            image: sharingImage,
            actionLabel: 'Explore private projects',
            onAction: () => history.push('/use-cases/private-projects')
          }
        ]}
      />
      <SecondaryHero
        withContrast={false}
        animation="/lottie/how-it-works.lottie"
        title={intl.formatMessage({
          id: 'welcome.secondary.hero.title',
          defaultMessage: 'How Gitpay works'
        })}
        items={[
          {
            icon: <AttachMoney color="primary" />,
            primaryText: (
              <FormattedMessage
                id="welcome.secondary.hero.item0.primary"
                defaultMessage="Create and fund work agreements"
              />
            ),
            secondaryText: (
              <FormattedMessage
                id="welcome.secondary.hero.item0.secondary"
                defaultMessage="Start by creating a work agreement in Gitpay. This can be a funded issue, a feature request, or a service payment request linked to repositories, files, and deliverables."
              />
            )
          },
          {
            icon: <TaskAlt color="primary" />,
            primaryText: (
              <FormattedMessage
                id="welcome.secondary.hero.item1.primary"
                defaultMessage="Work is delivered through Git"
              />
            ),
            secondaryText: (
              <FormattedMessage
                id="welcome.secondary.hero.item1.secondary"
                defaultMessage="Contributors or service providers deliver the requested work through pull requests, commits, or shared files. Gitpay keeps delivery tied to the actual work history."
              />
            )
          },
          {
            icon: <CardMembership color="primary" />,
            primaryText: (
              <FormattedMessage
                id="welcome.secondary.hero.item2.primary"
                defaultMessage="Review, approve, and pay"
              />
            ),
            secondaryText: (
              <FormattedMessage
                id="welcome.secondary.hero.item2.secondary"
                defaultMessage="Once delivery is verified, Gitpay helps release payouts to contributors or service providers, so payment follows approved work with clear accountability."
              />
            )
          },
          {
            icon: <Work color="primary" />,
            primaryText: (
              <FormattedMessage
                id="welcome.secondary.hero.item3.primary"
                defaultMessage="Manage ongoing collaboration"
              />
            ),
            secondaryText: (
              <FormattedMessage
                id="welcome.secondary.hero.item3.secondary"
                defaultMessage="From open source tasks to private contracts, Gitpay gives maintainers, contributors, sponsors, and service providers a transparent flow to track work and payments end to end."
              />
            )
          }
        ]}
      />
      <CallToActionHero
        withContrast={true}
        title={
          <FormattedMessage
            id="welcome.cta.hero.title"
            defaultMessage="Join developers and service providers delivering work and getting paid through Git."
          />
        }
        actions={[
          {
            label: <FormattedMessage id="welcome.cta.hero.action1" defaultMessage="Start now" />,
            link: '/#/signup',
            variant: 'contained',
            color: 'primary',
            size: 'large'
          },
          {
            label: <FormattedMessage id="welcome.cta.hero.action2" defaultMessage="Learn more" />,
            link: '/#/welcome',
            variant: 'text',
            color: 'primary',
            size: 'large'
          }
        ]}
      />
    </>
  )
}

export default Home
