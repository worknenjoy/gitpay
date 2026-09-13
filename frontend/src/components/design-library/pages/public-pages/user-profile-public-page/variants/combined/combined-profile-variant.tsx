import React, { useState } from 'react'
import { defineMessages, useIntl } from 'react-intl'
import ProfileHeader from 'design-library/molecules/headers/profile-header/profile-header'
import SegmentedSwitcher from 'design-library/molecules/switchers/segmented-switcher/segmented-switcher'
import SectionDivider from 'design-library/molecules/content/section-divider/section-divider'
import PaymentLinksList, {
  PaymentLink
} from 'design-library/molecules/lists/payment-links-list/payment-links-list'
import BountiesTable, {
  BountyRow
} from 'design-library/molecules/tables/bounties-table/bounties-table'
import ProjectListFull from 'design-library/molecules/lists/project-list/project-list-full/project-list-full'
import { PullRequestRow } from 'design-library/molecules/tables/pull-requests-table/pull-requests-table'
import BountyDetailsDrawer from 'design-library/molecules/drawers/bounty-details-drawer/bounty-details-drawer'
import ContributorProfileBody from '../contributor/contributor-profile-body'
import {
  ContributorProfileData,
  headerLinks as contributorHeaderLinks
} from '../contributor/contributor-profile-variant'
import { countryDisplay } from '../contributor/country-display'
import ServiceProviderProfileBody from '../provider/service-provider-profile-body'
import { ServiceProviderProfileData } from '../provider/service-provider-profile-variant'
import MaintainerProfileBody from '../maintainer/maintainer-profile-body'
import { MaintainerProfileData } from '../maintainer/maintainer-profile-variant'
import FundingProfileBody from '../funding/funding-profile-body'
import { FundingProfileData } from '../funding/funding-profile-variant'
import { Shell, SwitcherRow } from './combined-profile-variant.styles'

export type CombinedProfileView = 'overview' | 'contributor' | 'maintainer' | 'provider' | 'funding'

export type CombinedProfileVariantProps = {
  contributorProfile?: ContributorProfileData
  maintainerProfile?: MaintainerProfileData
  providerProfile?: ServiceProviderProfileData
  fundingProfile?: FundingProfileData
  bounties: { data: BountyRow[]; completed: boolean }
  pullRequests: { data: PullRequestRow[]; completed: boolean }
  maintainerProjects?: { data: any[]; completed: boolean }
  maintainerOpenBounties?: { data: BountyRow[]; completed: boolean }
  fundingBounties?: { data: BountyRow[]; completed: boolean }
  completed?: boolean
  defaultView?: CombinedProfileView
  onPayLink?: (link: PaymentLink) => void
  onViewBounty?: (bounty: BountyRow) => void
  onBountyTabChange?: (value: string) => void
  shareUrl?: string
}

const messages = defineMessages({
  overviewTab: { id: 'profile.combined.overviewTab', defaultMessage: 'Overview' },
  contributorTab: { id: 'profile.combined.contributorTab', defaultMessage: 'Contributor' },
  maintainerTab: { id: 'profile.combined.maintainerTab', defaultMessage: 'Maintainer' },
  providerTab: { id: 'profile.combined.providerTab', defaultMessage: 'Service provider' },
  fundingTab: { id: 'profile.combined.fundingTab', defaultMessage: 'Funding' },
  recentBountiesTitle: {
    id: 'profile.combined.recentBountiesTitle',
    defaultMessage: 'Contributor · recent bounties'
  },
  projectsTitle: {
    id: 'profile.combined.projectsTitle',
    defaultMessage: 'Maintainer · projects'
  },
  paymentLinksTitle: {
    id: 'profile.combined.paymentLinksTitle',
    defaultMessage: 'Service provider · payment links'
  },
  fundedBountiesTitle: {
    id: 'profile.combined.fundedBountiesTitle',
    defaultMessage: 'Funding · bounties funded'
  }
})

// How many rows/links/cards the Overview tab previews from each role — a
// glance, not the full list (that's what the per-role tabs are for).
const OVERVIEW_PREVIEW_COUNT = 3

const CombinedProfileVariant = ({
  contributorProfile,
  maintainerProfile,
  providerProfile,
  fundingProfile,
  bounties,
  pullRequests,
  maintainerProjects,
  maintainerOpenBounties,
  fundingBounties,
  completed = true,
  defaultView = 'overview',
  onPayLink,
  onViewBounty,
  onBountyTabChange,
  shareUrl
}: CombinedProfileVariantProps) => {
  const intl = useIntl()
  const [view, setView] = useState<CombinedProfileView>(defaultView)
  const [selectedBounty, setSelectedBounty] = useState<BountyRow | undefined>()

  const handleViewBounty = (bounty: BountyRow) => {
    setSelectedBounty(bounty)
    onViewBounty?.(bounty)
  }

  // Shared identity fields are the same real User row regardless of role —
  // pick whichever profile is present first to read them from.
  const primaryProfile =
    contributorProfile ?? maintainerProfile ?? providerProfile ?? fundingProfile
  if (!primaryProfile) return null

  const headerAvailability = contributorProfile?.availability ?? maintainerProfile?.availability
  const headerStats = maintainerProfile?.stats ?? fundingProfile?.stats

  const switcherOptions = [
    { value: 'overview' as const, label: intl.formatMessage(messages.overviewTab) },
    ...(contributorProfile
      ? [{ value: 'contributor' as const, label: intl.formatMessage(messages.contributorTab) }]
      : []),
    ...(maintainerProfile
      ? [{ value: 'maintainer' as const, label: intl.formatMessage(messages.maintainerTab) }]
      : []),
    ...(providerProfile
      ? [{ value: 'provider' as const, label: intl.formatMessage(messages.providerTab) }]
      : []),
    ...(fundingProfile
      ? [{ value: 'funding' as const, label: intl.formatMessage(messages.fundingTab) }]
      : [])
  ]

  return (
    <Shell maxWidth="lg">
      <ProfileHeader
        profileType="contributor"
        username={primaryProfile.username}
        name={primaryProfile.name}
        pictureUrl={primaryProfile.picture_url}
        verified={primaryProfile.verified}
        country={countryDisplay(primaryProfile.country)}
        links={contributorHeaderLinks(primaryProfile)}
        roles={
          [
            contributorProfile?.role,
            maintainerProfile?.role,
            providerProfile?.role,
            fundingProfile?.role
          ].filter(Boolean) as { name: string; tone?: 'orange' | 'teal' | 'yellow' | 'pink' }[]
        }
        identity={primaryProfile.identity}
        availability={headerAvailability}
        stats={headerStats}
        shareUrl={shareUrl ?? (typeof window !== 'undefined' ? window.location.href : '')}
      />

      <SwitcherRow>
        <SegmentedSwitcher
          value={view}
          onChange={(value) => setView(value as CombinedProfileView)}
          options={switcherOptions}
        />
      </SwitcherRow>

      {view === 'overview' && (
        <>
          {contributorProfile && (
            <>
              <SectionDivider label={intl.formatMessage(messages.recentBountiesTitle)} />
              <BountiesTable
                issues={{
                  data: bounties.data.slice(0, OVERVIEW_PREVIEW_COUNT),
                  completed: bounties.completed
                }}
                onViewDetails={handleViewBounty}
              />
            </>
          )}

          {maintainerProfile && (
            <>
              <SectionDivider label={intl.formatMessage(messages.projectsTitle)} />
              <ProjectListFull
                projects={{
                  data: (maintainerProjects?.data ?? []).slice(0, OVERVIEW_PREVIEW_COUNT),
                  completed: maintainerProjects?.completed ?? true
                }}
              />
            </>
          )}

          {providerProfile && (
            <>
              <SectionDivider label={intl.formatMessage(messages.paymentLinksTitle)} />
              <PaymentLinksList
                links={(providerProfile.paymentLinks ?? []).slice(0, OVERVIEW_PREVIEW_COUNT)}
                completed={completed}
                onPay={(link) => onPayLink?.(link)}
              />
            </>
          )}

          {fundingProfile && (
            <>
              <SectionDivider label={intl.formatMessage(messages.fundedBountiesTitle)} />
              <BountiesTable
                issues={{
                  data: (fundingBounties?.data ?? []).slice(0, OVERVIEW_PREVIEW_COUNT),
                  completed: fundingBounties?.completed ?? true
                }}
                onViewDetails={handleViewBounty}
              />
            </>
          )}
        </>
      )}

      {view === 'contributor' && contributorProfile && (
        <ContributorProfileBody
          profile={contributorProfile}
          bounties={bounties}
          pullRequests={pullRequests}
          completed={completed}
          onPayLink={onPayLink}
          onViewBounty={onViewBounty}
          onBountyTabChange={onBountyTabChange}
        />
      )}

      {view === 'maintainer' && maintainerProfile && (
        <MaintainerProfileBody
          projects={maintainerProjects ?? { data: [], completed: true }}
          openBounties={maintainerOpenBounties ?? { data: [], completed: true }}
          onViewBounty={onViewBounty}
        />
      )}

      {view === 'provider' && providerProfile && (
        <ServiceProviderProfileBody
          paymentLinks={providerProfile.paymentLinks}
          completed={completed}
          onPayLink={onPayLink}
        />
      )}

      {view === 'funding' && fundingProfile && (
        <FundingProfileBody
          bounties={fundingBounties ?? { data: [], completed: true }}
          onViewBounty={onViewBounty}
        />
      )}

      <BountyDetailsDrawer
        open={!!selectedBounty}
        onClose={() => setSelectedBounty(undefined)}
        bounty={selectedBounty}
      />
    </Shell>
  )
}

export default CombinedProfileVariant
