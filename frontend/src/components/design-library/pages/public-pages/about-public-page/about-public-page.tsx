import React from 'react'


import { AccountBalanceWallet, Work, Apps, Assignment, GroupWork, AttachMoney } from '@mui/icons-material'
import { FormattedMessage } from 'react-intl'

import SectionHero from 'design-library/molecules/heroes/section-hero/section-hero'

const About = () => {

  return (
    <>
      <SectionHero
        title={<FormattedMessage id="aboutSectionHeroTitle" defaultMessage="About Us" />}
        animation='/lottie/mission.lottie'
        content={<FormattedMessage
          id="aboutSectionHeroContent"
          defaultMessage="At Gitpay, our mission is to empower open-source developers and maintainers by providing a platform that connects them with sponsors and contributors. We believe in the power of collaboration and the importance of rewarding those who contribute to the open-source ecosystem."
        />}
      />
      <SectionHero
        contrast
        title={<FormattedMessage id="aboutSectionHeroTitle2" defaultMessage="Our vision" />}
        animation='/lottie/startup-life.lottie'
        content={<FormattedMessage
          id="aboutSectionHeroContent2"
          defaultMessage="Building a sustainable open-source economy where collaboration and contribution are fairly rewarded."
        />}
        items={[
          {
            icon: <GroupWork />,
            primaryText: <FormattedMessage id="aboutSectionHeroItem4Primary" defaultMessage="Open-source work is valued and financially supported." />,
            secondaryText: <FormattedMessage id="aboutSectionHeroItem4Secondary" defaultMessage="We aim to make open source sustainable by ensuring developers are compensated for their time and expertise." />
          },
          {
            icon: <Assignment />,
            primaryText: <FormattedMessage id="aboutSectionHeroItem5Primary" defaultMessage="Maintainers can grow their projects with community help." />,
            secondaryText: <FormattedMessage id="aboutSectionHeroItem5Secondary" defaultMessage="Gitpay allows maintainers to import issues and bring in contributors, accelerating development and reducing maintenance overhead." />
          },
          {
            icon: <Work />,
            primaryText: <FormattedMessage id="aboutSectionHeroItem6Primary" defaultMessage="Developers are recognized and rewarded for solving real problems." />,
            secondaryText: <FormattedMessage id="aboutSectionHeroItem6Secondary" defaultMessage="Every contribution counts — from bug fixes to new features — and each completed task earns transparent rewards." />
          },
          {
            icon: <AttachMoney />,
            primaryText: <FormattedMessage id="aboutSectionHeroItem3Primary" defaultMessage="Sponsors see measurable impact from every contribution they fund." />,
            secondaryText: <FormattedMessage id="aboutSectionHeroItem3Secondary" defaultMessage="Companies and individuals can fund issues that directly improve the tools and frameworks they rely on." />
          }
        ]}
      />
      <SectionHero
        title={<FormattedMessage id="aboutSectionHeroTitle3" defaultMessage="Our values" />}
        animation='/lottie/coworking.lottie'
        content={<FormattedMessage
          id="aboutSectionHeroContent3"
          defaultMessage="The principles that guide how we build, collaborate, and support the open-source community."
        />}
        items={[
          {
            icon: <AccountBalanceWallet />,
            primaryText: <FormattedMessage id="aboutSectionHeroItem7Primary" defaultMessage="Transparency" />,
            secondaryText: <FormattedMessage id="aboutSectionHeroItem7Secondary" defaultMessage="We believe in open collaboration and clear communication. Every transaction, bounty, and decision is visible to all participants." />
          },
          {
            icon: <Apps />,
            primaryText: <FormattedMessage id="aboutSectionHeroItem8Primary" defaultMessage="Fairness" />,
            secondaryText: <FormattedMessage id="aboutSectionHeroItem8Secondary" defaultMessage="Everyone involved — maintainers, contributors, and sponsors — deserves equal respect and clear terms for participation and reward." />
          },
          {
            icon: <Work />,
            primaryText: <FormattedMessage id="aboutSectionHeroItem9Primary" defaultMessage="Community" />,
            secondaryText: <FormattedMessage id="aboutSectionHeroItem9Secondary" defaultMessage="Gitpay thrives on collaboration. We encourage diverse voices, shared learning, and collective ownership of better software." />
          },
          {
            icon: <Assignment />,
            primaryText: <FormattedMessage id="aboutSectionHeroItem10Primary" defaultMessage="Impact" />,
            secondaryText: <FormattedMessage id="aboutSectionHeroItem10Secondary" defaultMessage="Every issue solved, every bounty completed, and every sponsorship funded brings open source one step closer to sustainability." />
          },
          {
            icon: <AttachMoney />,
            primaryText: <FormattedMessage id="aboutSectionHeroItem11Primary" defaultMessage="Trust" />,
            secondaryText: <FormattedMessage id="aboutSectionHeroItem11Secondary" defaultMessage="We handle every payment, agreement, and collaboration with reliability and integrity, ensuring confidence for all sides of the ecosystem." />
          }
        ]}
      />
    </>
  )
}
export default About
