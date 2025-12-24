import React from 'react'
import { Skeleton } from '@mui/material'
import { TaskHeaderContainer } from './issue-header.styles'
import BreadcrumbPlaceholder from '../../breadcrumbs/breadcrumb/breadcrumb.placeholder'
import IssueLabelsListPlaceholder from '../../lists/issue-labels-list/issue-labels.placeholder'

const IssueHeaderPlaceholder = () => {
  return (
    <TaskHeaderContainer>
      <BreadcrumbPlaceholder />
      <Skeleton variant="text" animation="wave" sx={{ mt: 2 }} />
      <Skeleton variant="text" animation="wave" sx={{ mb: 2, width: '40%' }} />
      <IssueLabelsListPlaceholder />
    </TaskHeaderContainer>
  )
}

export default IssueHeaderPlaceholder
