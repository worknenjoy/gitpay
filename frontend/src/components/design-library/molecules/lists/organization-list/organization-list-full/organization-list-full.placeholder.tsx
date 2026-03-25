import React from 'react'
import { Box, Divider, Grid, Skeleton } from '@mui/material'
import { Root } from './organization-list-full.styles'
import OrganizationCardPlaceholder from 'design-library/molecules/cards/organization-card/organization-card.placeholder'

type Props = {
  items?: number
  showPagination?: boolean
}

const OrganizationListFullPlaceholder: React.FC<Props> = ({
  items = 12,
  showPagination = true
}) => {
  return (
    <Root maxWidth={false}>
      <Box mt={3} mb={2} display="flex" gap={1}>
        <Skeleton variant="rounded" width={120} height={24} sx={{ borderRadius: 4 }} />
        <Skeleton variant="rounded" width={100} height={24} sx={{ borderRadius: 4 }} />
        <Skeleton variant="rounded" width={130} height={24} sx={{ borderRadius: 4 }} />
        <Skeleton variant="rounded" width={140} height={24} sx={{ borderRadius: 4 }} />
      </Box>
      <Divider sx={{ mb: 1 }} />
      <Box mt={3} mb={3}>
        <Grid container spacing={3}>
          {Array.from({ length: items }).map((_, idx) => (
            <Grid key={idx} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <OrganizationCardPlaceholder />
            </Grid>
          ))}
        </Grid>
      </Box>
      {showPagination && (
        <Box mt={3} mb={3} display="flex" justifyContent="center">
          <Skeleton variant="rounded" width={220} height={32} />
        </Box>
      )}
    </Root>
  )
}

export default OrganizationListFullPlaceholder
