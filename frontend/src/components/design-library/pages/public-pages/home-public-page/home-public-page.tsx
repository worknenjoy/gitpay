import React from 'react'

import { Work, CardMembership, AttachMoney, TaskAlt } from '@mui/icons-material'

import { useIntl, FormattedMessage } from 'react-intl'
import { useHistory } from 'react-router-dom'

import MainHero from 'design-library/molecules/heroes/main-hero/main-hero'
import CardsHero from 'design-library/molecules/heroes/cards-hero/cards-hero'
import SecondaryHero from 'design-library/molecules/heroes/secondary-hero/secondary-hero'
import CallToActionHero from 'design-library/molecules/heroes/call-to-action-hero/call-to-action-hero'
import bountyImage from 'images/roles/bounty.png'
import notificationsImage from 'images/roles/notifications.png'
import paymentCycleImage from 'images/roles/payment-cycle.png'
import sharingImage from 'images/roles/sharing.png'

const Home = () => {
  const history = useHistory()
  // using styled components from home.styles
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
            defaultMessage="Built around Git as the infrastructure for collaboration, Gitpay connects payments directly to the work being done. Fund issues, reward approved pull requests, or request payment for services delivered through repositories and tracked files. Gitpay provides a transparent way to fund work, verify delivery, and distribute payments."
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
        withContrast
        title={
          <FormattedMessage
            id="welcome.roles.hero.title"
            defaultMessage="Choose your role and get started"
          />
        }
        description={
          <FormattedMessage
            id="welcome.roles.hero.description"
            defaultMessage="Each role has a different journey. Pick the one that fits you best."
          />
        }
        cards={[
          {
            type: 'maintainer',
            title: (
              <FormattedMessage
                id="welcome.roles.hero.maintainer.title"
                defaultMessage="Maintainer"
              />
            ),
            description: (
              <FormattedMessage
                id="welcome.roles.hero.maintainer.description"
                defaultMessage="Import issues from your repository, organize work, and pay bounties when tasks are completed."
              />
            ),
            image: notificationsImage,
            actionLabel: (
              <FormattedMessage
                id="welcome.roles.hero.maintainer.action"
                defaultMessage="Signup as maintainer"
              />
            ),
            onAction: () => history.push('/signup/maintainer')
          },
          {
            type: 'contributor',
            title: (
              <FormattedMessage
                id="welcome.roles.hero.contributor.title"
                defaultMessage="Contributor"
              />
            ),
            description: (
              <FormattedMessage
                id="welcome.roles.hero.contributor.description"
                defaultMessage="Find tasks, submit pull requests, and get rewarded for solving issues."
              />
            ),
            image: bountyImage,
            actionLabel: (
              <FormattedMessage
                id="welcome.roles.hero.contributor.action"
                defaultMessage="Signup as contributor"
              />
            ),
            onAction: () => history.push('/signup/contributor')
          },
          {
            type: 'sponsor',
            title: (
              <FormattedMessage id="welcome.roles.hero.sponsor.title" defaultMessage="Sponsor" />
            ),
            description: (
              <FormattedMessage
                id="welcome.roles.hero.sponsor.description"
                defaultMessage="Fund bounties for open-source issues and support the work you want to see shipped."
              />
            ),
            image: sharingImage,
            actionLabel: (
              <FormattedMessage
                id="welcome.roles.hero.sponsor.action"
                defaultMessage="Signup as sponsor"
              />
            ),
            onAction: () => history.push('/signup/funding')
          },
          {
            type: 'service-provider',
            title: (
              <FormattedMessage
                id="welcome.roles.hero.serviceProvider.title"
                defaultMessage="Service Provider"
              />
            ),
            description: (
              <FormattedMessage
                id="welcome.roles.hero.serviceProvider.description"
                defaultMessage="Deliver specialized services and use payment requests to receive funds through Gitpay."
              />
            ),
            image: paymentCycleImage,
            actionLabel: (
              <FormattedMessage
                id="welcome.roles.hero.serviceProvider.action"
                defaultMessage="Signup as service provider"
              />
            ),
            onAction: () => history.push('/signup/service-provider')
          }
        ]}
      />
      <CardsHero
        withContrast={false}
        title="What is Gitpay for"
        cards={[
          {
            type: 'open-source',
            title: '🧩 Open Source',
            description: (
              <>
                Fund and solve issues in public repositories.
                <br />
                Sponsors fund issues
                <br />
                Contributors pick issues to solve
                <br />
                Work is delivered through pull requests
                <br />
                Gitpay handles payouts once the PR is merged
              </>
            ),
            image: notificationsImage,
            actionLabel: 'Explore open source',
            onAction: () => history.push('/use-cases/open-source')
          },
          {
            type: 'private-projects',
            title: '🔒 Private Projects',
            description: (
              <>
                Fund work inside private repositories or internal projects.
                <br />
                Companies fund tasks or features
                <br />
                Developers submit work through pull requests
                <br />
                Maintainers verify delivery by merging the PR
                <br />
                Gitpay releases the payment automatically
                <br />
                This works well for contract work, agencies, and on-demand development services.
              </>
            ),
            image: sharingImage,
            actionLabel: 'Explore private projects',
            onAction: () => history.push('/use-cases/private-projects')
          },
          {
            type: 'service-payments',
            title: '💼 Service Payments',
            description: (
              <>
                Receive payments for delivered work.
                <br />
                Create a payment request
                <br />
                Share a payment link with your client
                <br />
                Deliver the work
                <br />
                Receive payouts directly to your bank account
                <br />
                This works for developers, consultants, freelancers, and service providers who want a simple way to request payment.
              </>
            ),
            image: paymentCycleImage,
            actionLabel: 'Explore service payments',
            onAction: () => history.push('/use-cases/service-payments')
          }
        ]}
      />
      <SecondaryHero
        withContrast
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
                defaultMessage="Fund work through issues"
              />
            ),
            secondaryText: (
              <FormattedMessage
                id="welcome.secondary.hero.item0.secondary"
                defaultMessage="Import an issue from a Git repository and attach a bounty. Maintainers or sponsors can fund the work, creating a clear reward for contributors who solve it."
              />
            )
          },
          {
            icon: <TaskAlt color="primary" />,
            primaryText: (
              <FormattedMessage
                id="welcome.secondary.hero.item1.primary"
                defaultMessage="Contributors deliver the work"
              />
            ),
            secondaryText: (
              <FormattedMessage
                id="welcome.secondary.hero.item1.secondary"
                defaultMessage="Developers pick issues they want to solve and submit their solution through a pull request. Once the PR is reviewed and merged, the work is considered delivered."
              />
            )
          },
          {
            icon: <CardMembership color="primary" />,
            primaryText: (
              <FormattedMessage
                id="welcome.secondary.hero.item2.primary"
                defaultMessage="Payment is released"
              />
            ),
            secondaryText: (
              <FormattedMessage
                id="welcome.secondary.hero.item2.secondary"
                defaultMessage="When the solution is verified, Gitpay releases the payout to the contributor's account."
              />
            )
          },
          {
            icon: <Work color="primary" />,
            primaryText: (
              <FormattedMessage
                id="welcome.secondary.hero.item3.primary"
                defaultMessage="Or request payment for delivered work"
              />
            ),
            secondaryText: (
              <FormattedMessage
                id="welcome.secondary.hero.item3.secondary"
                defaultMessage="Gitpay also supports direct payment requests. Service providers or contributors can request payment for work delivered through repositories, files, or Git-based collaboration."
              />
            )
          }
        ]}
      />
      <CallToActionHero
        withContrast={false}
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
