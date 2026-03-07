import React from 'react'

import { Paid, Code, MergeType, Verified } from '@mui/icons-material'

import SectionHero from 'design-library/molecules/heroes/section-hero/section-hero'
import CallToActionHero from 'design-library/molecules/heroes/call-to-action-hero/call-to-action-hero'

const OpenSourcePublicPage = () => {
  return (
    <>
      <SectionHero
        title="Open Source on Gitpay"
        animation="/lottie/developer-main.lottie"
        content="We always loved open source, and we are open source since the beginning. We are building Gitpay to be the best way to fund open source work, and we are excited to share it with the world. Whether you are a maintainer looking for funding, a sponsor looking to support projects, or a contributor looking for paid opportunities, Gitpay is here to help you succeed."
      />
      <SectionHero
        contrast
        title="How it works"
        animation="/lottie/how-it-works.lottie"
        items={[
          {
            icon: <Paid />,
            primaryText: 'Sponsors fund issues',
            secondaryText:
              'Funding is attached directly to issues so contributors know what work is rewarded.'
          },
          {
            icon: <Code />,
            primaryText: 'Contributors pick issues to solve',
            secondaryText:
              'Developers choose tasks that match their skills and submit implementation work.'
          },
          {
            icon: <MergeType />,
            primaryText: 'Work is delivered through pull requests',
            secondaryText:
              'Delivery is tied to repository activity, making progress and completion transparent.'
          },
          {
            icon: <Verified />,
            primaryText: 'Gitpay handles payouts once PRs are merged',
            secondaryText:
              'After validation through the merge flow, funds are released according to the task terms.'
          }
        ]}
      />
      <SectionHero
        title="Best fit"
        animation="/lottie/coworking.lottie"
        items={[
          {
            icon: <Code />,
            primaryText: 'Maintainers with active issue backlogs',
            secondaryText:
              'Ideal when you need contributors to pick up scoped issues with clear funding attached.'
          },
          {
            icon: <Paid />,
            primaryText: 'Sponsors funding outcomes, not just repos',
            secondaryText:
              'Great for individuals or organizations that want to support specific deliverables and track impact.'
          },
          {
            icon: <MergeType />,
            primaryText: 'Contributor communities working through pull requests',
            secondaryText:
              'Works best when delivery, review, and acceptance already happen through Git workflows.'
          },
          {
            icon: <Verified />,
            primaryText: 'Teams that require transparent payout conditions',
            secondaryText:
              'A strong fit when payment should follow verified merges and documented completion criteria.'
          }
        ]}
      />
      <CallToActionHero
        withContrast={false}
        title="Get started with Open Source on Gitpay"
        actions={[
          {
            label: 'Signup as maintainer',
            link: '/#/signup/maintainer',
            variant: 'contained',
            color: 'primary',
            size: 'large'
          },
          {
            label: 'Signup as sponsor',
            link: '/#/signup/sponsor',
            variant: 'outlined',
            color: 'primary',
            size: 'large'
          },
          {
            label: 'Signup as contributor',
            link: '/#/signup/contributor',
            variant: 'text',
            color: 'primary',
            size: 'large'
          }
        ]}
      />
    </>
  )
}

export default OpenSourcePublicPage
