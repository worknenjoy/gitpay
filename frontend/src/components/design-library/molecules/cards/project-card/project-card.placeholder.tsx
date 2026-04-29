import React from 'react'
import { Box, Card, CardContent, Divider, Skeleton } from '@mui/material'

export default function ProjectCardPlaceholder() {
  return (
    <Card variant="outlined" sx={{ borderRadius: 2, display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ pb: 1.5 }}>
        {/* Header row */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Box display="flex" alignItems="center" gap={0.75}>
            <Skeleton variant="circular" width={16} height={16} />
            <Skeleton variant="text" width={60} height={18} />
            <Skeleton variant="text" width={8} height={18} />
            <Skeleton variant="text" width={80} height={18} />
          </Box>
          <Skeleton variant="rounded" width={54} height={22} sx={{ borderRadius: 4 }} />
        </Box>

        {/* Description */}
        <Skeleton variant="text" width="95%" />
        <Skeleton variant="text" width="75%" sx={{ mb: 1.5 }} />

        {/* Language chips */}
        <Box display="flex" gap={0.75}>
          <Skeleton variant="rounded" width={80} height={22} sx={{ borderRadius: 4 }} />
          <Skeleton variant="rounded" width={60} height={22} sx={{ borderRadius: 4 }} />
          <Skeleton variant="rounded" width={50} height={22} sx={{ borderRadius: 4 }} />
        </Box>
      </CardContent>

      <Box flexGrow={1} />
      <Divider />

      {/* Footer */}
      <Box px={2} py={1.25} display="flex" justifyContent="space-between" alignItems="center">
        <Box display="flex" gap={2}>
          <Skeleton variant="text" width={90} height={16} />
          <Skeleton variant="text" width={60} height={16} />
        </Box>
        <Skeleton variant="text" width={80} height={16} />
      </Box>
    </Card>
  )
}
