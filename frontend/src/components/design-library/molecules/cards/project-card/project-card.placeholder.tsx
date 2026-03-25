import React from 'react'
import { CardContent, Divider, Skeleton, Box } from '@mui/material'
import { RootCard } from './project-card.styles'

export default function ProjectCardPlaceholder() {
  return (
    <RootCard>
      <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', pt: 4, pb: 2 }}>
        <Skeleton variant="circular" width={80} height={80} sx={{ mb: 2 }} />

        <Skeleton variant="text" width="55%" height={28} sx={{ mb: 0.5 }} />
        <Skeleton variant="text" width="40%" height={20} sx={{ mb: 1 }} />

        <Skeleton variant="text" width="90%" />
        <Skeleton variant="text" width="80%" />
        <Skeleton variant="text" width="70%" sx={{ mb: 2 }} />

        <Box display="flex" gap={1.5} mt={1}>
          <Skeleton variant="circular" width={26} height={26} />
          <Skeleton variant="circular" width={26} height={26} />
        </Box>
      </CardContent>

      <Box flexGrow={1} />
      <Divider />

      <Box p={2}>
        <Skeleton variant="rounded" width="100%" height={36} sx={{ borderRadius: 6 }} />
      </Box>
    </RootCard>
  )
}
