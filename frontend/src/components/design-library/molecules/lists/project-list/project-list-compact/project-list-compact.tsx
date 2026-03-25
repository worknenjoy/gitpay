import React from 'react'
import { Box, Chip, Divider, Typography } from '@mui/material'
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined'
import BugReportOutlinedIcon from '@mui/icons-material/BugReportOutlined'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import ProjectCardCompact from 'design-library/molecules/cards/project-card/project-card-compact'
import ProjectListCompactPlaceholder from './project-list-compact.placeholder'

const projectBounties = (tasks) =>
  tasks.map((t) => (t.value ? t.value : 0)).reduce((a, b) => parseInt(a) + parseInt(b), 0)

const sortProjects = (data) =>
  data
    .filter((p) => p.Tasks.some((t) => t.status === 'open'))
    .sort((a, b) => projectBounties(b.Tasks) - projectBounties(a.Tasks))

export default function ProjectListCompact({ projects }) {
  const { data, completed } = projects

  if (!completed) return <ProjectListCompactPlaceholder />

  const sorted = sortProjects(data)
  const totalOpen = data.reduce((sum, p) => sum + p.Tasks.filter((t) => t.status === 'open').length, 0)
  const totalBounties = data.reduce((sum, p) => sum + projectBounties(p.Tasks), 0)

  return (
    <Box mt={3}>
      <Box display="flex" alignItems="center" gap={1} flexWrap="wrap" mb={2}>
        <Chip
          icon={<FolderOutlinedIcon />}
          label={`${data.length} project${data.length !== 1 ? 's' : ''}`}
          size="small"
          variant="outlined"
        />
        <Chip
          icon={<BugReportOutlinedIcon />}
          label={totalOpen > 0 ? `${totalOpen} open issue${totalOpen !== 1 ? 's' : ''}` : 'no open issues'}
          size="small"
          variant="outlined"
          color={totalOpen > 0 ? 'warning' : 'default'}
        />
        {totalBounties > 0 && (
          <Chip
            icon={<AttachMoneyIcon />}
            label={`$${totalBounties} in bounties`}
            size="small"
            variant="outlined"
            color="success"
          />
        )}
      </Box>
      <Divider sx={{ mb: 2 }} />
      <Box display="flex" flexWrap="wrap" gap={1}>
        {sorted.map((project) => (
          <ProjectCardCompact key={project.id} project={project} size="large" />
        ))}
      </Box>
    </Box>
  )
}
