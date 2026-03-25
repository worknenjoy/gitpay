import React from 'react'
import { Avatar, Chip, Tooltip } from '@mui/material'
import slugify from '@sindresorhus/slugify'
import { useHistory } from 'react-router-dom'

type CompactSize = 'small' | 'large'

const sizeStyles = {
  small: {},
  large: {
    height: 48,
    borderRadius: '24px',
    fontSize: 14,
    '& .MuiChip-avatar': { width: 36, height: 36, fontSize: 16 },
    '& .MuiChip-label': { px: 1.5 }
  }
}

const ProjectCardCompact = ({ project, size = 'small' }: { project: any; size?: CompactSize }) => {
  const history = useHistory()
  const orgPath = `/organizations/${project.Organization?.id}/${slugify(project.Organization?.name || '')}`
  const projectPath = `${orgPath}/projects/${project.id}/${slugify(project.name)}`
  const openIssues = project.Tasks?.filter((t) => t.status === 'open').length ?? 0

  const tooltip = [
    project.name,
    project.Organization?.name,
    openIssues > 0 ? `${openIssues} open` : null
  ]
    .filter(Boolean)
    .join(' · ')

  return (
    <Tooltip title={tooltip}>
      <Chip
        avatar={<Avatar>{project.name[0]}</Avatar>}
        label={project.name}
        onClick={() => history.push(projectPath)}
        variant="outlined"
        sx={{ cursor: 'pointer', ...sizeStyles[size] }}
      />
    </Tooltip>
  )
}

export default ProjectCardCompact
