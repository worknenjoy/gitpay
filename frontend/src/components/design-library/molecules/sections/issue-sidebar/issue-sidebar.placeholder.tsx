import React from 'react'
import { Skeleton } from '@mui/material'
import FactsStrip from 'design-library/molecules/sections/facts-strip/facts-strip'
import IssueSidebarCardBasePlaceholder from 'design-library/molecules/cards/issue-cards/issue-sidebar-card-base/issue-sidebar-card-base.placeholder'
import { SidebarRoot } from './issue-sidebar.styles'

const IssueSidebarPlaceholder = ({ contained = false }: { contained?: boolean }) => (
  <SidebarRoot contained={contained} aria-busy="true" aria-label="Issue sidebar loading">
    <div className="share-bar-wrap">
      <Skeleton variant="rounded" width={260} height={40} sx={{ borderRadius: 999 }} />
    </div>
    <FactsStrip
      completed={false}
      facts={[
        { label: <Skeleton width={40} />, value: null },
        { label: <Skeleton width={60} />, value: null },
        { label: <Skeleton width={50} />, value: null }
      ]}
    />
    <IssueSidebarCardBasePlaceholder />
    <IssueSidebarCardBasePlaceholder />
  </SidebarRoot>
)

export default IssueSidebarPlaceholder
