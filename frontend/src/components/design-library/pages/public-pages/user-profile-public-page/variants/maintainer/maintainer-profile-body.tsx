import React, { useState } from 'react'
import { defineMessages, useIntl } from 'react-intl'
import SectionDivider from 'design-library/molecules/content/section-divider/section-divider'
import ProjectListFull from 'design-library/molecules/lists/project-list/project-list-full/project-list-full'
import BountiesTable, {
  BountyRow
} from 'design-library/molecules/tables/bounties-table/bounties-table'
import BountyDetailsDrawer from 'design-library/molecules/drawers/bounty-details-drawer/bounty-details-drawer'

// The projects grid + open-bounties table on their own, without the profile
// header — reused as-is both by the standalone Maintainer page and by the
// Maintainer tab of the combined multi-role profile.
export type MaintainerProfileBodyProps = {
  projects: { data: any[]; completed: boolean }
  openBounties: { data: BountyRow[]; completed: boolean }
  onViewBounty?: (bounty: BountyRow) => void
}

const messages = defineMessages({
  projectsTitle: { id: 'profile.maintainer.projectsTitle', defaultMessage: 'Projects' },
  openBountiesTitle: {
    id: 'profile.maintainer.openBountiesTitle',
    defaultMessage: 'Open bounties · accepting work'
  }
})

const MaintainerProfileBody = ({
  projects,
  openBounties,
  onViewBounty
}: MaintainerProfileBodyProps) => {
  const intl = useIntl()
  const [selectedBounty, setSelectedBounty] = useState<BountyRow | undefined>()

  const handleViewBounty = (bounty: BountyRow) => {
    setSelectedBounty(bounty)
    onViewBounty?.(bounty)
  }

  return (
    <>
      <SectionDivider label={intl.formatMessage(messages.projectsTitle)} />
      <ProjectListFull projects={projects} />

      <SectionDivider label={intl.formatMessage(messages.openBountiesTitle)} />
      <BountiesTable issues={openBounties} onViewDetails={handleViewBounty} />

      <BountyDetailsDrawer
        open={!!selectedBounty}
        onClose={() => setSelectedBounty(undefined)}
        bounty={selectedBounty}
      />
    </>
  )
}

export default MaintainerProfileBody
