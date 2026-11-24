import React from 'react'
import { Skeleton } from '@mui/material'
import { Card, Head, Body } from './issue-sidebar-card-base.styles'

const IssueSidebarCardBasePlaceholder = () => (
  <Card>
    <Head>
      <Skeleton variant="text" width={90} />
      <Skeleton variant="text" width={70} />
    </Head>
    <Body>
      <Skeleton variant="text" width="60%" height={36} />
      <Skeleton variant="rounded" height={48} />
      <Skeleton variant="rounded" height={36} />
    </Body>
  </Card>
)

export default IssueSidebarCardBasePlaceholder
