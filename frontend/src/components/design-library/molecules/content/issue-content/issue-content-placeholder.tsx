import React from 'react'
import { Skeleton, Stack } from '@mui/material'

const IssueContentPlaceholder = () => {
  return (
    <Stack spacing={2}>
      <Skeleton variant="text" width="100%" />
      <Skeleton variant="text" width="100%" />
      <Skeleton variant="text" width="100%" />
      <Skeleton variant="text" width="100%" />
    </Stack>
  )
}
export default IssueContentPlaceholder
