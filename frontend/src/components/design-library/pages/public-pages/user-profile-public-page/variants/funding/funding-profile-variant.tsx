import React from 'react'
import { Language as WebsiteIcon, GitHub as GitHubIcon } from '@mui/icons-material'
import ProfileHeader from 'design-library/molecules/headers/profile-header/profile-header'
import { BountyRow } from 'design-library/molecules/tables/bounties-table/bounties-table'
import { Shell } from './funding-profile-variant.styles'
import { countryDisplay } from '../contributor/country-display'
import FundingProfileBody from './funding-profile-body'

// Same identity fields as the other variants' data types — they mirror the
// real `User` model so `user.data` can be passed straight through. `role`
// comes from the same User's `Types` association (picking the entry named
// 'funding').
export type FundingProfileData = {
  username: string
  name: string
  website?: string
  country?: string
  profile_url?: string
  picture_url?: string
  verified?: boolean
  role?: { name: string; tone?: 'orange' | 'teal' | 'yellow' | 'pink' }
  identity?: string[]
  stats?: string[]
}

export type FundingProfileVariantProps = {
  profile: FundingProfileData
  bounties: { data: BountyRow[]; completed: boolean }
  onViewBounty?: (bounty: BountyRow) => void
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

const FundingProfileVariant = ({
  profile,
  bounties,
  onViewBounty,
  shareUrl
}: FundingProfileVariantProps) => (
  <Shell maxWidth="lg">
    <ProfileHeader
      profileType="funding"
      username={profile.username}
      name={profile.name}
      pictureUrl={profile.picture_url}
      verified={profile.verified}
      country={countryDisplay(profile.country)}
      links={headerLinks(profile)}
      role={profile.role}
      identity={profile.identity}
      stats={profile.stats}
      shareUrl={shareUrl ?? (typeof window !== 'undefined' ? window.location.href : '')}
    />

    <FundingProfileBody bounties={bounties} onViewBounty={onViewBounty} />
  </Shell>
)

export default FundingProfileVariant
