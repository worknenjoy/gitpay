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
            defaultMessage="The payment platform for work delivered."
          />
        }
        description={
          <FormattedMessage
            id="welcome.hero.main.description"
            defaultMessage="Fund issues, reward merged pull requests, or get paid directly. Gitpay gives you a transparent flow to manage work and payments end to end."
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
        title={
          <FormattedMessage
            id="welcome.usecases.title"
            defaultMessage="Payment flows for work delivered"
          />
        }
        description={
          <FormattedMessage
            id="welcome.usecases.description"
            defaultMessage="Whether you want to charge customers, fund open source work, or get paid for your contributions, Gitpay has a clear flow to manage payments tied to real work."
          />
        }
        cards={[
          {
            type: 'service-payments',
            title: (
              <FormattedMessage
                id="welcome.usecases.payment.title"
                defaultMessage="Charge Customers"
              />
            ),
            description: (
              <FormattedMessage
                id="welcome.usecases.payment.description"
                defaultMessage="Send a payment link and get paid directly"
              />
            ),
            descriptionListIcon: <TaskAlt fontSize="small" />,
            descriptionList: [
              {
                text: (
                  <FormattedMessage
                    id="welcome.usecases.payment.item1"
                    defaultMessage="Get paid by clients anywhere — no setup required on their side."
                  />
                )
              },
              {
                text: (
                  <FormattedMessage
                    id="welcome.usecases.payment.item2"
                    defaultMessage="Setup payout schedules and get daily, weekly or monthly payouts directly on your account."
                  />
                )
              },
              {
                text: (
                  <FormattedMessage
                    id="welcome.usecases.payment.item6"
                    defaultMessage="This works for developers, consultants, freelancers, and service providers who want a simple way to request payment."
                  />
                )
              }
            ],
            image: paymentCycleImage,
            actionLabel: (
              <FormattedMessage id="welcome.usecases.payment.action" defaultMessage="Learn more" />
            ),
            onAction: () => history.push('/use-cases/service-payments')
          },
          {
            type: 'open-source',
            title: <FormattedMessage id="welcome.usecases.fund.title" defaultMessage="Fund work" />,
            description: (
              <FormattedMessage
                id="welcome.usecases.fund.description"
                defaultMessage="Attach bounties and get work done."
              />
            ),
            descriptionListIcon: <TaskAlt fontSize="small" />,
            descriptionList: [
              {
                text: (
                  <FormattedMessage
                    id="welcome.usecases.fund.item1"
                    defaultMessage="Attach bounties and get work done."
                  />
                )
              },
              {
                text: (
                  <FormattedMessage
                    id="welcome.usecases.fund.item2"
                    defaultMessage="Let contributors pick tasks and submit pull requests."
                  />
                )
              },
              {
                text: (
                  <FormattedMessage
                    id="welcome.usecases.fund.item3"
                    defaultMessage="Contributor claim bounty when the work is merged."
                  />
                )
              }
            ],
            image: notificationsImage,
            actionLabel: (
              <FormattedMessage id="welcome.usecases.fund.action" defaultMessage="Learn more" />
            ),
            onAction: () => history.push('/use-cases/fund-work')
          },
          {
            type: 'earn-from-work',
            title: (
              <FormattedMessage
                id="welcome.usecases.bounties.title"
                defaultMessage="Earn from work"
              />
            ),
            description: (
              <FormattedMessage
                id="welcome.usecases.bounties.description"
                defaultMessage="Get paid for work delivered on Git repositories."
              />
            ),
            descriptionListIcon: <TaskAlt fontSize="small" />,
            descriptionList: [
              {
                text: (
                  <FormattedMessage
                    id="welcome.usecases.bounties.item1"
                    defaultMessage="Browse issues and work on what you like."
                  />
                )
              },
              {
                text: (
                  <FormattedMessage
                    id="welcome.usecases.bounties.item2"
                    defaultMessage="Submit pull requests and get your work accepted."
                  />
                )
              },
              {
                text: (
                  <FormattedMessage
                    id="welcome.usecases.bounties.item3"
                    defaultMessage="Claim the bounty and receive payment through Gitpay in your bank account."
                  />
                )
              }
            ],
            image: sharingImage,
            actionLabel: (
              <FormattedMessage id="welcome.usecases.bounties.action" defaultMessage="Learn more" />
            ),
            onAction: () => history.push('/use-cases/bounties')
          }
        ]}
      />
      <SecondaryHero
        withContrast={false}
        animation="/lottie/how-it-works.lottie"
        title={intl.formatMessage({
          id: 'welcome.secondary.hero.title',
          defaultMessage: 'Why people use Gitpay'
        })}
        items={[
          {
            icon: <AttachMoney color="primary" />,
            primaryText: (
              <FormattedMessage
                id="welcome.secondary.hero.item0.primary"
                defaultMessage="Get paid by anyone, anywhere"
              />
            ),
            secondaryText: (
              <FormattedMessage
                id="welcome.secondary.hero.item0.secondary"
                defaultMessage="Send a simple payment link and get paid by clients worldwide — no setup required on their side and no back-and-forth about how to pay."
              />
            )
          },
          {
            icon: <TaskAlt color="primary" />,
            primaryText: (
              <FormattedMessage
                id="welcome.secondary.hero.item1.primary"
                defaultMessage="Payments tied to real work"
              />
            ),
            secondaryText: (
              <FormattedMessage
                id="welcome.secondary.hero.item1.secondary"
                defaultMessage="Fund issues, reward merged pull requests, and ensure payouts follow actual delivery — not promises or manual tracking."
              />
            )
          },
          {
            icon: <CardMembership color="primary" />,
            primaryText: (
              <FormattedMessage
                id="welcome.secondary.hero.item2.primary"
                defaultMessage="No friction, no manual work"
              />
            ),
            secondaryText: (
              <FormattedMessage
                id="welcome.secondary.hero.item2.secondary"
                defaultMessage="Connects payments directly to the work being done."
              />
            )
          },
          {
            icon: <Work color="primary" />,
            primaryText: (
              <FormattedMessage
                id="welcome.secondary.hero.item3.primary"
                defaultMessage="One flow for all your work"
              />
            ),
            secondaryText: (
              <FormattedMessage
                id="welcome.secondary.hero.item3.secondary"
                defaultMessage="From open source contributions to private projects and client payments, manage everything in one place with a clear, transparent flow."
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
            defaultMessage="Start getting paid or fund work today."
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
