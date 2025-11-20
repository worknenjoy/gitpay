import React from 'react'
import { Skeleton, Stack } from '@mui/material'

const IssueContentPlaceholder = () => {
  return (
    <Stack spacing={2}>
      <Skeleton variant="rectangular" height={32} width="100%" />
      <Skeleton variant="rectangular" height={32} width="100%" />
      <Skeleton variant="rectangular" height={32} width="100%" />
      <Skeleton variant="rectangular" height={32} width="100%" />
    </Stack>
  )
}
export default IssueContentPlaceholder
