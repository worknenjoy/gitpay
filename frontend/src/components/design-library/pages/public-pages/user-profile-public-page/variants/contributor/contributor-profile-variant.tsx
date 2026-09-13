import React from 'react'
import { Language as WebsiteIcon, GitHub as GitHubIcon } from '@mui/icons-material'
import ProfileHeader from 'design-library/molecules/headers/profile-header/profile-header'
import { CountedTabItem } from 'design-library/molecules/tabs/counted-tab-list/counted-tab-list'
import { PaymentLink } from 'design-library/molecules/lists/payment-links-list/payment-links-list'
import { BountyRow } from 'design-library/molecules/tables/bounties-table/bounties-table'
import { PullRequestRow } from 'design-library/molecules/tables/pull-requests-table/pull-requests-table'
import { Shell } from './contributor-profile-variant.styles'
import { countryDisplay } from './country-display'
import ContributorProfileBody from './contributor-profile-body'

// The profile's identity fields (username, name, website, country, profile_url,
// picture_url) already exist on the real `User` model — this type reuses those
// names so `user.data` can be passed straight through. `role` comes from the
// same User's `Types` association (picking the entry named 'contributor').
export type ContributorProfileData = {
  username: string
  name: string
  website?: string
  country?: string
  profile_url?: string
  picture_url?: string
  verified?: boolean
  role?: { name: string; tone?: 'orange' | 'teal' | 'yellow' }
  identity?: string[]
  availability?: { label: string; active?: boolean }[]
  skills?: string[]
  paymentLinks?: PaymentLink[]
  bountyTabs?: CountedTabItem[]
}

export type ContributorProfileVariantProps = {
  profile: ContributorProfileData
  /** Bounties/issues list — same `{data, completed}` shape as the rest of the
   * app's task tables, so it can be fed directly from the `tasks` prop already
   * used elsewhere on this page. */
  bounties: { data: BountyRow[]; completed: boolean }
  /** The user's submitted pull requests (TaskSolutions), for the "Pull requests" sub-tab. */
  pullRequests: { data: PullRequestRow[]; completed: boolean }
  completed?: boolean
  defaultTab?: 'services' | 'bounties'
  onPayLink?: (link: PaymentLink) => void
  onViewBounty?: (bounty: BountyRow) => void
  onBountyTabChange?: (value: string) => void
  /** Canonical, shareable profile link (the friendly /users/:id-:username/ form).
   * Falls back to the current URL when not supplied (e.g. in Storybook). */
  shareUrl?: string
}

export const headerLinks = (profile: {
  website?: string
  profile_url?: string
  username: string
}) => {
  const links: { label: string; href: string; icon: React.ReactNode }[] = []
  if (profile.website) {
    links.push({
      label: profile.website.replace(/^https?:\/\//, ''),
      href: profile.website,
      icon: <WebsiteIcon fontSize="small" />
    })
  }
  if (profile.profile_url) {
    links.push({
      label: profile.username,
      href: profile.profile_url,
      icon: <GitHubIcon fontSize="small" />
    })
  }
  return links
}

const ContributorProfileVariant = ({
  profile,
  bounties,
  pullRequests,
  completed = true,
  defaultTab = 'services',
  onPayLink,
  onViewBounty,
  onBountyTabChange,
  shareUrl
}: ContributorProfileVariantProps) => (
  <Shell maxWidth="lg">
    <ProfileHeader
      profileType="contributor"
      username={profile.username}
      name={profile.name}
      pictureUrl={profile.picture_url}
      verified={profile.verified}
      country={countryDisplay(profile.country)}
      links={headerLinks(profile)}
      role={profile.role}
      identity={profile.identity}
      availability={profile.availability}
      shareUrl={shareUrl ?? (typeof window !== 'undefined' ? window.location.href : '')}
    />

    <ContributorProfileBody
      profile={profile}
      bounties={bounties}
      pullRequests={pullRequests}
      completed={completed}
      defaultTab={defaultTab}
      onPayLink={onPayLink}
      onViewBounty={onViewBounty}
      onBountyTabChange={onBountyTabChange}
    />
  </Shell>
)

export default ContributorProfileVariant
