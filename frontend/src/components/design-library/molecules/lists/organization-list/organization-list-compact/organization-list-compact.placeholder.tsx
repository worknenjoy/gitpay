import React from 'react'
import { Box, Divider, Skeleton } from '@mui/material'

const OrganizationListCompactPlaceholder = () => (
  <Box mt={3}>
    <Box display="flex" gap={1} mb={2}>
      <Skeleton variant="rounded" width={120} height={24} sx={{ borderRadius: 4 }} />
      <Skeleton variant="rounded" width={90} height={24} sx={{ borderRadius: 4 }} />
    </Box>
    <Divider sx={{ mb: 2 }} />
    <Box display="flex" flexWrap="wrap" gap={1}>
      {[110, 85, 130, 95, 75].map((w, i) => (
        <Skeleton key={i} variant="rounded" width={w} height={48} sx={{ borderRadius: 4 }} />
      ))}
    </Box>
  </Box>
)

export default OrganizationListCompactPlaceholder
