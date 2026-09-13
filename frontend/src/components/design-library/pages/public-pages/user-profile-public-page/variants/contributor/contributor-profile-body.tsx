import React, { useState } from 'react'
import { defineMessages, useIntl } from 'react-intl'
import SegmentedSwitcher from 'design-library/molecules/switchers/segmented-switcher/segmented-switcher'
import SectionDivider from 'design-library/molecules/content/section-divider/section-divider'
import SkillsList from 'design-library/molecules/lists/skills-list/skills-list'
import CountedTabList from 'design-library/molecules/tabs/counted-tab-list/counted-tab-list'
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
import { SwitcherRow } from './contributor-profile-variant.styles'
import { ContributorProfileData } from './contributor-profile-variant'

// The Services/Bounties content on its own, without the profile header —
// reused as-is both by the standalone Contributor page and by the
// Contributor tab of the combined multi-role profile, so the two never drift
// apart into different feature sets.
export type ContributorProfileBodyProps = {
  profile: Pick<ContributorProfileData, 'skills' | 'paymentLinks' | 'bountyTabs'>
  bounties: { data: BountyRow[]; completed: boolean }
  pullRequests: { data: PullRequestRow[]; completed: boolean }
  completed?: boolean
  defaultTab?: 'services' | 'bounties'
  onPayLink?: (link: PaymentLink) => void
  onViewBounty?: (bounty: BountyRow) => void
  onBountyTabChange?: (value: string) => void
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

const ContributorProfileBody = ({
  profile,
  bounties,
  pullRequests,
  completed = true,
  defaultTab = 'services',
  onPayLink,
  onViewBounty,
  onBountyTabChange
}: ContributorProfileBodyProps) => {
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
    <>
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
    </>
  )
}

export default ContributorProfileBody
