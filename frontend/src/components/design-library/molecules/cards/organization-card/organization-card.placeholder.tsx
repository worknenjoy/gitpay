import React from 'react'
import { Box, CardContent, Divider, Grid, Skeleton } from '@mui/material'
import { RootCard, StatsItem } from './organization-card.styles'

const OrganizationCardPlaceholder: React.FC = () => {
  return (
    <RootCard>
      <CardContent>
        <Box display="flex" justifyContent="center" mb={3}>
          <Skeleton variant="circular" width={40} height={40} />
        </Box>

        {/* Title */}
        <Box mb={0.5}>
          <Skeleton variant="text" width="60%" style={{ margin: '0 auto' }} />
        </Box>

        {/* Subtitle "by ..." */}
        <Box mb={1}>
          <Skeleton variant="text" width="40%" style={{ margin: '0 auto' }} />
        </Box>

        {/* Description */}
        <Box>
          <Skeleton variant="text" width="80%" style={{ margin: '0 auto' }} />
          <Skeleton variant="text" width="70%" style={{ margin: '0 auto' }} />
        </Box>
      </CardContent>

      <Box flexGrow={1} />
      <Divider />

      {/* Projects */}
      <Box p={2}>
        <Grid container justifyContent="space-between" spacing={2}>
          <StatsItem>
            <Skeleton variant="text" width={80} style={{ marginLeft: 16, marginBottom: 10 }} />
          </StatsItem>
          <StatsItem style={{ flexWrap: 'wrap' }}>
            <Box display="flex" flexWrap="wrap">
              {[110, 130, 95].map((w, i) => (
                <Skeleton
                  key={i}
                  variant="rounded"
                  width={w}
                  height={32}
                  style={{ borderRadius: 16, marginLeft: 10, marginBottom: 10 }}
                />
              ))}
            </Box>
          </StatsItem>
        </Grid>
      </Box>
    </RootCard>
  )
}

export default OrganizationCardPlaceholder
