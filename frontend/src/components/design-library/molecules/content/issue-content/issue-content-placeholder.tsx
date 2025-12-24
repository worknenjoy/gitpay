import React from 'react'
import { Container, Skeleton } from '@mui/material'
import IssueHeaderPlaceholder from 'design-library/molecules/headers/issue-header/issue-header.placeholder'

const IssueContentPlaceholder = () => {
  return (
    <Container fixed maxWidth="md" sx={{ mt: 2 }}>
      <IssueHeaderPlaceholder />
      <Skeleton variant="text" width="100%" />
      <Skeleton variant="text" width="100%" />
      <Skeleton variant="text" width="100%" />
      <Skeleton variant="text" width="100%" />
    </Container>
  )
}
export default IssueContentPlaceholder
