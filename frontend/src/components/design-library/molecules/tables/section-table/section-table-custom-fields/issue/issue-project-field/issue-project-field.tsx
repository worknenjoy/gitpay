import React from 'react'
import { useHistory } from 'react-router-dom'
import { Typography, Chip, Link } from '@mui/material'

const IssueProjectField = ({ issue }) => {
  const history = useHistory()
  const { Project: project } = issue
  const isProfile = history.location.pathname.includes('/profile')
  const isExplore = history.location.pathname.includes('/profile/explore')
  const profile = isProfile ? '/profile' : ''
  const explore = isExplore ? '/explore' : ''

  if (!project?.id) return <Typography variant="caption">no project</Typography>

  const { id, name, OrganizationId } = project
  const url = `${profile}${explore}/organizations/${OrganizationId}/projects/${id}`

  return <Chip label={project ? name : 'no project'} component={Link} href={'/#' + url} clickable />
}

export default IssueProjectField
