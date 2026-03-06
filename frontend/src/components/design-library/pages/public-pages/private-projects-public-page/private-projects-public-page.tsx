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
        content="Fund work inside private repositories or internal projects while keeping delivery and payment connected."
      />
      <SectionHero
        contrast
        title="How it works"
        animation="/lottie/project-development.lottie"
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
        content="This workflow is ideal for contract work, agencies, and on-demand development services that need clear proof of delivery."
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
