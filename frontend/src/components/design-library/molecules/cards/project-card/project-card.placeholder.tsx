import React from 'react'
import { CardContent, Divider, Grid, Skeleton, Box, IconButton } from '@mui/material'
import { RootCard, StatsItem } from './project-card.styles'

export default function ProjectCardPlaceholder() {
  return (
    <RootCard>
      <CardContent style={{ position: 'relative' }}>
        <IconButton aria-label="provider" style={{ position: 'absolute', right: 10, top: 10 }}>
          <Skeleton variant="circular" width={28} height={28} />
        </IconButton>

        <Box display="flex" justifyContent="center" mb={3} mt={3}>
          <Skeleton variant="circular" width={40} height={40} />
        </Box>

        <Box display="flex" justifyContent="center" mb={1}>
          <Skeleton variant="text" width="60%" />
        </Box>

        <Box display="flex" justifyContent="center" mb={2}>
          <Skeleton variant="text" width="40%" />
        </Box>

        <Box px={2}>
          <Skeleton variant="text" width="100%" />
          <Skeleton variant="text" width="90%" />
          <Skeleton variant="text" width="80%" />
        </Box>
      </CardContent>

      <Box flexGrow={1} />
      <Divider />

      <Box p={2}>
        <Grid container justifyContent="space-between" spacing={2}>
          <StatsItem>
            <Skeleton variant="text" width={140} />
          </StatsItem>
          <StatsItem>
            <Box display="flex" alignItems="center">
              <Skeleton variant="circular" width={24} height={24} />
              <Box ml={1}>
                <Skeleton variant="text" width={90} />
              </Box>
            </Box>
          </StatsItem>
        </Grid>
      </Box>
    </RootCard>
  )
}
