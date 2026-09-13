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
import { Shell, SwitcherRow } from './combined-profile-variant.styles'

export type CombinedProfileView = 'overview' | 'contributor' | 'provider'

export type CombinedProfileVariantProps = {
  contributorProfile: ContributorProfileData
  providerProfile: ServiceProviderProfileData
  bounties: { data: BountyRow[]; completed: boolean }
  pullRequests: { data: PullRequestRow[]; completed: boolean }
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
  providerTab: { id: 'profile.combined.providerTab', defaultMessage: 'Service provider' },
  recentBountiesTitle: {
    id: 'profile.combined.recentBountiesTitle',
    defaultMessage: 'Contributor · recent bounties'
  },
  paymentLinksTitle: {
    id: 'profile.combined.paymentLinksTitle',
    defaultMessage: 'Service provider · payment links'
  }
})

// How many rows/links the Overview tab previews from each role — a glance,
// not the full list (that's what the Contributor/Service provider tabs are for).
const OVERVIEW_PREVIEW_COUNT = 3

const CombinedProfileVariant = ({
  contributorProfile,
  providerProfile,
  bounties,
  pullRequests,
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

  return (
    <Shell maxWidth="lg">
      <ProfileHeader
        profileType="contributor"
        username={contributorProfile.username}
        name={contributorProfile.name}
        pictureUrl={contributorProfile.picture_url}
        verified={contributorProfile.verified}
        country={countryDisplay(contributorProfile.country)}
        links={contributorHeaderLinks(contributorProfile)}
        roles={
          [contributorProfile.role, providerProfile.role].filter(Boolean) as {
            name: string
            tone?: 'orange' | 'teal' | 'yellow'
          }[]
        }
        identity={contributorProfile.identity}
        availability={contributorProfile.availability}
        shareUrl={shareUrl ?? (typeof window !== 'undefined' ? window.location.href : '')}
      />

      <SwitcherRow>
        <SegmentedSwitcher
          value={view}
          onChange={(value) => setView(value as CombinedProfileView)}
          options={[
            { value: 'overview', label: intl.formatMessage(messages.overviewTab) },
            { value: 'contributor', label: intl.formatMessage(messages.contributorTab) },
            { value: 'provider', label: intl.formatMessage(messages.providerTab) }
          ]}
        />
      </SwitcherRow>

      {view === 'overview' && (
        <>
          <SectionDivider label={intl.formatMessage(messages.recentBountiesTitle)} />
          <BountiesTable
            issues={{
              data: bounties.data.slice(0, OVERVIEW_PREVIEW_COUNT),
              completed: bounties.completed
            }}
            onViewDetails={handleViewBounty}
          />

          <SectionDivider label={intl.formatMessage(messages.paymentLinksTitle)} />
          <PaymentLinksList
            links={(providerProfile.paymentLinks ?? []).slice(0, OVERVIEW_PREVIEW_COUNT)}
            completed={completed}
            onPay={(link) => onPayLink?.(link)}
          />
        </>
      )}

      {view === 'contributor' && (
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

      {view === 'provider' && (
        <ServiceProviderProfileBody
          paymentLinks={providerProfile.paymentLinks}
          completed={completed}
          onPayLink={onPayLink}
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
