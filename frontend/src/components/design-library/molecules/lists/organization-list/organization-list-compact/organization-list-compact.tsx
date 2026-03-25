import React from 'react'
import { Box, Chip, Divider } from '@mui/material'
import CorporateFareOutlinedIcon from '@mui/icons-material/CorporateFareOutlined'
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined'
import OrganizationCardCompact from 'design-library/molecules/cards/organization-card/organization-card-compact'
import OrganizationListCompactPlaceholder from './organization-list-compact.placeholder'

export default function OrganizationListCompact({ organizations }) {
  const { data, completed } = organizations

  if (!completed) return <OrganizationListCompactPlaceholder />

  const totalProjects = data.reduce((sum, o) => sum + (o.Projects?.length ?? 0), 0)

  return (
    <Box mt={3}>
      <Box display="flex" alignItems="center" gap={1} flexWrap="wrap" mb={2}>
        <Chip
          icon={<CorporateFareOutlinedIcon />}
          label={`${data.length} organization${data.length !== 1 ? 's' : ''}`}
          size="small"
          variant="outlined"
        />
        {totalProjects > 0 && (
          <Chip
            icon={<FolderOutlinedIcon />}
            label={`${totalProjects} project${totalProjects !== 1 ? 's' : ''}`}
            size="small"
            variant="outlined"
          />
        )}
      </Box>
      <Divider sx={{ mb: 2 }} />
      <Box display="flex" flexWrap="wrap" gap={1}>
        {data.map((organization) => (
          <OrganizationCardCompact key={organization.id} organization={organization} size="large" />
        ))}
      </Box>
    </Box>
  )
}
