import React from 'react'
import { Box, Card, CardContent, Divider, Skeleton } from '@mui/material'

const OrganizationCardPlaceholder: React.FC = () => (
  <Card variant='outlined' sx={{ borderRadius: 2, display: 'flex', flexDirection: 'column' }}>
    <CardContent sx={{ pb: 1.5 }}>
      <Box display='flex' justifyContent='space-between' alignItems='center' mb={1}>
        <Box display='flex' alignItems='center' gap={0.75}>
          <Skeleton variant='circular' width={20} height={20} />
          <Skeleton variant='text' width={60} height={18} />
          <Skeleton variant='text' width={8} height={18} />
          <Skeleton variant='text' width={90} height={18} />
        </Box>
        <Skeleton variant='rounded' width={70} height={22} sx={{ borderRadius: 4 }} />
      </Box>

      <Skeleton variant='text' width='95%' />
      <Skeleton variant='text' width='70%' />
    </CardContent>

    <Box flexGrow={1} />
    <Divider />

    <Box px={2} py={1.25} display='flex' justifyContent='space-between' alignItems='center'>
      <Box display='flex' gap={2}>
        <Skeleton variant='text' width={80} height={16} />
        <Skeleton variant='text' width={70} height={16} />
      </Box>
      <Skeleton variant='text' width={110} height={16} />
    </Box>
  </Card>
)

export default OrganizationCardPlaceholder
