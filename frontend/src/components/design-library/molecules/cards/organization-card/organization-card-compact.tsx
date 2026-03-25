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

const OrganizationCardCompact = ({ organization, size = 'small' }: { organization: any; size?: CompactSize }) => {
  const history = useHistory()
  const orgPath = `/organizations/${organization.id}/${slugify(organization.name)}`
  const projectCount = organization.Projects?.length ?? 0
  const creator = organization.User?.name || organization.User?.username

  const tooltip = [
    organization.name,
    creator,
    projectCount > 0 ? `${projectCount} project${projectCount !== 1 ? 's' : ''}` : null
  ].filter(Boolean).join(' · ')

  return (
    <Tooltip title={tooltip}>
      <Chip
        avatar={<Avatar>{organization.name[0]}</Avatar>}
        label={organization.name}
        onClick={() => history.push(orgPath)}
        variant="outlined"
        sx={{ cursor: 'pointer', ...sizeStyles[size] }}
      />
    </Tooltip>
  )
}

export default OrganizationCardCompact
