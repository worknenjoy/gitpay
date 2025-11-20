import React from 'react'

import { Work, CardMembership, Assignment, AttachMoney, TaskAlt } from '@mui/icons-material'

import { useIntl, FormattedMessage } from 'react-intl'
import { useHistory } from 'react-router-dom'

import MainHero from 'design-library/molecules/heroes/main-hero/main-hero'
import SecondaryHero from 'design-library/molecules/heroes/secondary-hero/secondary-hero'
import CallToActionHero from 'design-library/molecules/heroes/call-to-action-hero/call-to-action-hero'

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
            defaultMessage="Collaborate. Contribute. Get rewarded."
          />
        }
        description={
          <FormattedMessage
            id="welcome.hero.main.description"
            defaultMessage="Gitpay connects developers, maintainers, and sponsors to fund and solve open-source issues together. Maintainers can import issues and grow their projects, contributors earn bounties for solving them, and sponsors fund the work that moves open source forward."
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
      <SecondaryHero
        animation="/lottie/how-it-works.lottie"
        title={intl.formatMessage({
          id: 'welcome.secondary.hero.title',
          defaultMessage: 'How Gitpay works'
        })}
        items={[
          {
            icon: <Assignment color="primary" />,
            primaryText: (
              <FormattedMessage
                id="welcome.secondary.hero.item0.primary"
                defaultMessage="Import an issue to Gitpay"
              />
            ),
            secondaryText: (
              <FormattedMessage
                id="welcome.secondary.hero.item0.secondary"
                defaultMessage="Import an issue from a Git repository. Contributors pick issues they want to solve."
              />
            )
          },
          {
            icon: <AttachMoney color="primary" />,
            primaryText: (
              <FormattedMessage
                id="welcome.secondary.hero.item1.primary"
                defaultMessage="Maintainers or Sponsors fund the bounty"
              />
            ),
            secondaryText: (
              <FormattedMessage
                id="welcome.secondary.hero.item1.secondary"
                defaultMessage="Sponsors and maintainers fund the work. Bounties are held securely until completion."
              />
            )
          },
          {
            icon: <TaskAlt color="primary" />,
            primaryText: (
              <FormattedMessage
                id="welcome.secondary.hero.item2.primary"
                defaultMessage="Contributors submit a solution with PR"
              />
            ),
            secondaryText: (
              <FormattedMessage
                id="welcome.secondary.hero.item2.secondary"
                defaultMessage="When your PR is merged, you can submit your solution on Gitpay."
              />
            )
          },
          {
            icon: <CardMembership color="primary" />,
            primaryText: (
              <FormattedMessage
                id="welcome.secondary.hero.item3.primary"
                defaultMessage="A payout is sent to the contributor bank account"
              />
            ),
            secondaryText: (
              <FormattedMessage
                id="welcome.secondary.hero.item3.secondary"
                defaultMessage="Once the solution is verified, the payout is automatically sent to the contributor's bank account."
              />
            )
          },
          {
            icon: <Work color="primary" />,
            primaryText: (
              <FormattedMessage
                id="welcome.secondary.hero.item4.primary"
                defaultMessage="The reverse flow is also possible"
              />
            ),
            secondaryText: (
              <FormattedMessage
                id="welcome.secondary.hero.item4.secondary"
                defaultMessage="With our Payment Request system, contributors can request payment for work done directly through the platform."
              />
            )
          }
        ]}
      />
      <CallToActionHero
        title={
          <FormattedMessage
            id="welcome.cta.hero.title"
            defaultMessage="Join thousands of developers solving issues and getting paid while contributing to amazing projects."
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
