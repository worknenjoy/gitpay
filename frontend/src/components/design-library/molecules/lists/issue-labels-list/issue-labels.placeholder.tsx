import React from 'react'
import { Chip } from '@mui/material'
import { Skeleton } from '@mui/material'

const IssueLabelsListPlaceholder = () => {
  return (
    <>
      {[...Array(3)].map((_, index) => (
        <Chip
          key={index}
          style={{ marginTop: 10, marginBottom: 10, marginRight: 10 }}
          variant="outlined"
          label={<Skeleton variant="rectangular" width={64} height={10} />}
        />
      ))}
    </>
  )
}

export default IssueLabelsListPlaceholder
