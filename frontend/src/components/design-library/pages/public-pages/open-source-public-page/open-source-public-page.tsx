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
        content="Fund and solve issues in public repositories with a clear path from contribution to payout."
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
