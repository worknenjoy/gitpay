import React from 'react'

import { Paid, Engineering, FactCheck, TaskAlt } from '@mui/icons-material'

import SectionHero from 'design-library/molecules/heroes/section-hero/section-hero'
import CallToActionHero from 'design-library/molecules/heroes/call-to-action-hero/call-to-action-hero'

const PrivateProjectsPublicPage = () => {
  return (
    <>
      <SectionHero
        title="Private Projects on Gitpay"
        animation="/lottie/startup-life.lottie"
        content="Gitpay's Private Projects workflow is designed for teams and companies that want to fund work on private repositories. This workflow provides a secure and efficient way to manage payments for work that requires confidentiality, such as contract development, agency work, or on-demand services."
      />
      <SectionHero
        contrast
        title="How it works"
        animation="/lottie/how-it-works.lottie"
        items={[
          {
            icon: <Paid />,
            primaryText: 'Companies fund tasks or features',
            secondaryText:
              'Teams define scope and funding for private backlog items and project milestones.'
          },
          {
            icon: <Engineering />,
            primaryText: 'Developers submit work through pull requests',
            secondaryText:
              'Implementation is tracked through Git activity, preserving accountability and history.'
          },
          {
            icon: <FactCheck />,
            primaryText: 'Maintainers verify delivery by merging',
            secondaryText:
              'Completion is validated through the same code-review and merge process teams already use.'
          },
          {
            icon: <TaskAlt />,
            primaryText: 'Gitpay releases payment automatically',
            secondaryText:
              'Payouts are triggered once delivery conditions are met, reducing manual payment overhead.'
          }
        ]}
      />
      <SectionHero
        title="Best fit"
        animation="/lottie/coworking.lottie"
        items={[
          {
            icon: <Engineering />,
            primaryText: 'Engineering teams shipping confidential work',
            secondaryText:
              'Best for private repositories where security and controlled access are mandatory.'
          },
          {
            icon: <Paid />,
            primaryText: 'Companies managing milestone-based budgets',
            secondaryText:
              'Useful when each feature or task needs explicit funding and payout visibility.'
          },
          {
            icon: <FactCheck />,
            primaryText: 'Organizations that require approval gates',
            secondaryText:
              'A strong match for workflows where review and merge act as formal acceptance criteria.'
          },
          {
            icon: <TaskAlt />,
            primaryText: 'Agencies and contractors with recurring delivery',
            secondaryText:
              'Helps standardize proof-of-delivery and reduce manual payment coordination across projects.'
          }
        ]}
      />
      <CallToActionHero
        withContrast={false}
        title="Get started with Private Projects on Gitpay"
        actions={[
          {
            label: 'Signup as maintainer',
            link: '/#/signup/maintainer',
            variant: 'contained',
            color: 'primary',
            size: 'large'
          },
          {
            label: 'Signup as contributor',
            link: '/#/signup/contributor',
            variant: 'outlined',
            color: 'primary',
            size: 'large'
          }
        ]}
      />
    </>
  )
}

export default PrivateProjectsPublicPage
