import React, { useState } from 'react'
import { defineMessages, useIntl } from 'react-intl'
import SectionDivider from 'design-library/molecules/content/section-divider/section-divider'
import BountiesTable, {
  BountyRow
} from 'design-library/molecules/tables/bounties-table/bounties-table'
import BountyDetailsDrawer from 'design-library/molecules/drawers/bounty-details-drawer/bounty-details-drawer'

// The funded-bounties table on its own, without the profile header — reused
// as-is both by the standalone Funding page and by the Funding tab of the
// combined multi-role profile.
export type FundingProfileBodyProps = {
  bounties: { data: BountyRow[]; completed: boolean }
  onViewBounty?: (bounty: BountyRow) => void
}

const messages = defineMessages({
  bountiesFundedTitle: {
    id: 'profile.funding.bountiesFundedTitle',
    defaultMessage: 'Bounties funded'
  }
})

const FundingProfileBody = ({ bounties, onViewBounty }: FundingProfileBodyProps) => {
  const intl = useIntl()
  const [selectedBounty, setSelectedBounty] = useState<BountyRow | undefined>()

  const handleViewBounty = (bounty: BountyRow) => {
    setSelectedBounty(bounty)
    onViewBounty?.(bounty)
  }

  return (
    <>
      <SectionDivider label={intl.formatMessage(messages.bountiesFundedTitle)} />
      <BountiesTable issues={bounties} onViewDetails={handleViewBounty} />

      <BountyDetailsDrawer
        open={!!selectedBounty}
        onClose={() => setSelectedBounty(undefined)}
        bounty={selectedBounty}
      />
    </>
  )
}

export default FundingProfileBody
