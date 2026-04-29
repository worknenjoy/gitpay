import React from 'react'
import { Box, Chip, Divider, Grid } from '@mui/material'
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined'
import BugReportOutlinedIcon from '@mui/icons-material/BugReportOutlined'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import ProjectCard from 'design-library/molecules/cards/project-card/project-card'
import ProjectListCompactPlaceholder from './project-list-compact.placeholder'

const projectBounties = (tasks: any[]) =>
  tasks.map((t) => (t.value ? t.value : 0)).reduce((a: number, b: number) => a + Number(b), 0)

const sortProjects = (data: any[]) =>
  data
    .filter((p) => p.Tasks.some((t: any) => t.status === 'open'))
    .sort((a, b) => projectBounties(b.Tasks) - projectBounties(a.Tasks))

export default function ProjectListCompact({
  projects
}: {
  projects: { data: any[]; completed?: boolean } | false
}) {
  if (!projects) return <ProjectListCompactPlaceholder />
  const { data, completed = true } = projects

  if (!completed) return <ProjectListCompactPlaceholder />

  const sorted = sortProjects(data)
  const totalOpen = data.reduce(
    (sum, p) => sum + p.Tasks.filter((t: any) => t.status === 'open').length,
    0
  )
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
          label={
            totalOpen > 0
              ? `${totalOpen} open issue${totalOpen !== 1 ? 's' : ''}`
              : 'no open issues'
          }
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
      <Grid container spacing={2}>
        {sorted.map((project) => (
          <Grid key={project.id} size={{ lg: 4, md: 6, xs: 12 }}>
            <ProjectCard project={project} completed={true} />
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}
