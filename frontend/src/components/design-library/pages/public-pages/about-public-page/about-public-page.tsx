import React from 'react'

import {
  AccountBalanceWallet,
  Work,
  Apps,
  Assignment,
  GroupWork,
  AttachMoney
} from '@mui/icons-material'
import { FormattedMessage } from 'react-intl'

import SectionHero from 'design-library/molecules/heroes/section-hero/section-hero'

const About = () => {
  return (
    <>
      <SectionHero
        title={<FormattedMessage id="aboutSectionHeroTitle" defaultMessage="About Us" />}
        animation="/lottie/mission.lottie"
        content={
          <FormattedMessage
            id="aboutSectionHeroContent"
            defaultMessage="Gitpay connects payments to real deliverables. Issues can be funded with bounties, pull requests can unlock rewards, and service providers can request payments for work delivered through repositories and tracked files. The result is a more transparent and reliable way to fund and pay for digital work."
          />
        }
      />
      <SectionHero
        contrast
        title={<FormattedMessage id="aboutSectionHeroTitle2" defaultMessage="Our vision" />}
        animation="/lottie/startup-life.lottie"
        content={
          <FormattedMessage
            id="aboutSectionHeroContent2"
            defaultMessage="Building a collaborative digital economy where delivered work is verifiable and payments are connected to real outcomes."
          />
        }
        items={[
          {
            icon: <GroupWork />,
            primaryText: (
              <FormattedMessage
                id="aboutSectionHeroItem4Primary"
                defaultMessage="Work is funded with clear expectations."
              />
            ),
            secondaryText: (
              <FormattedMessage
                id="aboutSectionHeroItem4Secondary"
                defaultMessage="Define scope, attach funding, and connect payouts to what needs to be delivered."
              />
            )
          },
          {
            icon: <Assignment />,
            primaryText: (
              <FormattedMessage
                id="aboutSectionHeroItem5Primary"
                defaultMessage="Teams can organize delivery through repositories."
              />
            ),
            secondaryText: (
              <FormattedMessage
                id="aboutSectionHeroItem5Secondary"
                defaultMessage="Import and track issues, coordinate contributors and service providers, and keep execution tied to versioned work."
              />
            )
          },
          {
            icon: <Work />,
            primaryText: (
              <FormattedMessage
                id="aboutSectionHeroItem6Primary"
                defaultMessage="Contributors and specialists are rewarded for delivered results."
              />
            ),
            secondaryText: (
              <FormattedMessage
                id="aboutSectionHeroItem6Secondary"
                defaultMessage="From pull requests to scoped services, completed work can be verified and paid with transparent rules."
              />
            )
          },
          {
            icon: <AttachMoney />,
            primaryText: (
              <FormattedMessage
                id="aboutSectionHeroItem3Primary"
                defaultMessage="Funders and clients see measurable delivery from every payment."
              />
            ),
            secondaryText: (
              <FormattedMessage
                id="aboutSectionHeroItem3Secondary"
                defaultMessage="Every funded task is linked to tracked work, helping teams verify progress before payout."
              />
            )
          }
        ]}
      />
      <SectionHero
        title={<FormattedMessage id="aboutSectionHeroTitle3" defaultMessage="Our values" />}
        animation="/lottie/coworking.lottie"
        content={
          <FormattedMessage
            id="aboutSectionHeroContent3"
            defaultMessage="The principles that guide how we build, collaborate, and move money through work-centered flows."
          />
        }
        items={[
          {
            icon: <AccountBalanceWallet />,
            primaryText: (
              <FormattedMessage id="aboutSectionHeroItem7Primary" defaultMessage="Transparency" />
            ),
            secondaryText: (
              <FormattedMessage
                id="aboutSectionHeroItem7Secondary"
                defaultMessage="We believe in clear collaboration and communication. Tasks, funding, and payouts stay visible to participants with the right context."
              />
            )
          },
          {
            icon: <Apps />,
            primaryText: (
              <FormattedMessage id="aboutSectionHeroItem8Primary" defaultMessage="Fairness" />
            ),
            secondaryText: (
              <FormattedMessage
                id="aboutSectionHeroItem8Secondary"
                defaultMessage="Everyone involved — teams, contributors, service providers, and funders — gets clear terms for participation, delivery, and payment."
              />
            )
          },
          {
            icon: <Work />,
            primaryText: (
              <FormattedMessage id="aboutSectionHeroItem9Primary" defaultMessage="Collaboration" />
            ),
            secondaryText: (
              <FormattedMessage
                id="aboutSectionHeroItem9Secondary"
                defaultMessage="Gitpay is built for collaborative execution across repositories, teams, and independent professionals working toward shared outcomes."
              />
            )
          },
          {
            icon: <Assignment />,
            primaryText: (
              <FormattedMessage id="aboutSectionHeroItem10Primary" defaultMessage="Impact" />
            ),
            secondaryText: (
              <FormattedMessage
                id="aboutSectionHeroItem10Secondary"
                defaultMessage="Every task completed and every payout processed helps teams deliver faster with accountability and trust."
              />
            )
          },
          {
            icon: <AttachMoney />,
            primaryText: (
              <FormattedMessage id="aboutSectionHeroItem11Primary" defaultMessage="Trust" />
            ),
            secondaryText: (
              <FormattedMessage
                id="aboutSectionHeroItem11Secondary"
                defaultMessage="We handle every payment, agreement, and collaboration with reliability and integrity, ensuring confidence for all sides of the ecosystem."
              />
            )
          }
        ]}
      />
    </>
  )
}
export default About
