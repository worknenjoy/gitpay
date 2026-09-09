import React, { useState } from 'react'
import { Language as WebsiteIcon, GitHub as GitHubIcon } from '@mui/icons-material'
import { defineMessages, useIntl } from 'react-intl'
import ProfileHeader from 'design-library/molecules/headers/profile-header/profile-header'
import SegmentedSwitcher from 'design-library/molecules/switchers/segmented-switcher/segmented-switcher'
import SectionDivider from 'design-library/molecules/content/section-divider/section-divider'
import SkillsList from 'design-library/molecules/lists/skills-list/skills-list'
import CountedTabList, {
  CountedTabItem
} from 'design-library/molecules/tabs/counted-tab-list/counted-tab-list'
import PaymentLinksList, {
  PaymentLink
} from 'design-library/molecules/lists/payment-links-list/payment-links-list'
import BountiesTable, {
  BountyRow
} from 'design-library/molecules/tables/bounties-table/bounties-table'
import PullRequestsTable, {
  PullRequestRow
} from 'design-library/molecules/tables/pull-requests-table/pull-requests-table'
import BountyDetailsDrawer from 'design-library/molecules/drawers/bounty-details-drawer/bounty-details-drawer'
import { Shell, SwitcherRow } from './contributor-profile-variant.styles'
import { countryDisplay } from './country-display'

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

const messages = defineMessages({
  servicesTab: { id: 'profile.contributor.servicesTab', defaultMessage: 'Services' },
  bountiesTab: { id: 'profile.contributor.bountiesTab', defaultMessage: 'Bounties' },
  paymentLinksTitle: {
    id: 'profile.contributor.paymentLinksTitle',
    defaultMessage: 'Payment links'
  },
  skillsTitle: { id: 'profile.contributor.skillsTitle', defaultMessage: 'Skills' },
  bountiesTitle: { id: 'profile.contributor.bountiesTitle', defaultMessage: 'Bounties' }
})

const headerLinks = (profile: ContributorProfileData) => {
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
      label: `@${profile.username}`,
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
}: ContributorProfileVariantProps) => {
  const intl = useIntl()
  const [tab, setTab] = useState<'services' | 'bounties'>(defaultTab)
  const [activeBountyTab, setActiveBountyTab] = useState(profile.bountyTabs?.[0]?.value)
  const [selectedBounty, setSelectedBounty] = useState<BountyRow | undefined>()

  const handleBountyTabChange = (value: string) => {
    setActiveBountyTab(value)
    onBountyTabChange?.(value)
  }

  const handleViewBounty = (bounty: BountyRow) => {
    setSelectedBounty(bounty)
    onViewBounty?.(bounty)
  }

  const resolvedBountyTab = activeBountyTab ?? profile.bountyTabs?.[0]?.value

  return (
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

      <SwitcherRow>
        <SegmentedSwitcher
          value={tab}
          onChange={(value) => setTab(value as 'services' | 'bounties')}
          options={[
            { value: 'services', label: intl.formatMessage(messages.servicesTab) },
            { value: 'bounties', label: intl.formatMessage(messages.bountiesTab) }
          ]}
        />
      </SwitcherRow>

      {tab === 'services' && (
        <>
          <SectionDivider label={intl.formatMessage(messages.paymentLinksTitle)} />
          <PaymentLinksList
            links={profile.paymentLinks ?? []}
            completed={completed}
            onPay={(link) => onPayLink?.(link)}
          />
        </>
      )}

      {tab === 'bounties' && (
        <>
          {profile.skills && profile.skills.length > 0 && (
            <>
              <SectionDivider label={intl.formatMessage(messages.skillsTitle)} />
              <SkillsList skills={profile.skills} />
            </>
          )}

          <SectionDivider label={intl.formatMessage(messages.bountiesTitle)} />
          {profile.bountyTabs && profile.bountyTabs.length > 0 && (
            <CountedTabList
              items={profile.bountyTabs}
              value={resolvedBountyTab ?? profile.bountyTabs[0].value}
              onChange={handleBountyTabChange}
            />
          )}
          {resolvedBountyTab === 'pull-requests' ? (
            <PullRequestsTable pullRequests={pullRequests} />
          ) : (
            <BountiesTable issues={bounties} onViewDetails={handleViewBounty} />
          )}
        </>
      )}

      <BountyDetailsDrawer
        open={!!selectedBounty}
        onClose={() => setSelectedBounty(undefined)}
        bounty={selectedBounty}
      />
    </Shell>
  )
}

export default ContributorProfileVariant
