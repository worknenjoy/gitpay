import React from 'react'
import { Avatar, Box, Chip, Typography } from '@mui/material'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import slugify from '@sindresorhus/slugify'
import { Link } from 'react-router-dom'
import OrganizationCardPlaceholder from './organization-card.placeholder'
import ResourceCard from '../resource-card'

const OrganizationCard = ({ organization, completed }) => {
  if (!completed) return <OrganizationCardPlaceholder />

  const projects = organization.Projects || []
  const projectCount = projects.length
  const openIssues = projects.reduce(
    (sum, p) => sum + (p.Tasks || []).filter((t) => t.status === 'open').length,
    0
  )
  const bounties = projects.reduce(
    (sum, p) => sum + (p.Tasks || []).reduce((b, t) => b + (t.value ? parseInt(t.value) : 0), 0),
    0
  )

  const organizationPath = `/organizations/${organization.id}/${slugify(organization.name)}`

  const header = (
    <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
      <Box
        display="flex"
        alignItems="center"
        gap={0.75}
        minWidth={0}
        overflow="hidden"
        flexShrink={1}
      >
        <Avatar
          sx={{ width: 20, height: 20, fontSize: 11, bgcolor: 'primary.main', flexShrink: 0 }}
        >
          {organization.name[0]}
        </Avatar>
        <Typography variant="subtitle2" fontWeight={700} noWrap>
          <Link to={organizationPath} style={{ textDecoration: 'none', color: 'inherit' }}>
            {organization.name}
          </Link>
        </Typography>
      </Box>

      {projectCount > 0 && (
        <Chip
          label={`${projectCount} project${projectCount !== 1 ? 's' : ''}`}
          size="small"
          variant="outlined"
          sx={{ ml: 1, flexShrink: 0, height: 22, fontSize: 11 }}
        />
      )}
    </Box>
  )

  const footer = (
    <>
      <Box display="flex" gap={2}>
        {bounties > 0 && (
          <Typography variant="caption" color="text.secondary">
            Bounties{' '}
            <Box component="span" fontWeight={700} color="text.primary">
              ${bounties.toLocaleString()}
            </Box>
          </Typography>
        )}
        {openIssues > 0 && (
          <Typography variant="caption" color="text.secondary">
            Open issues{' '}
            <Box component="span" fontWeight={700} color="text.primary">
              {openIssues}
            </Box>
          </Typography>
        )}
      </Box>

      <Link to={organizationPath} style={{ textDecoration: 'none' }}>
        <Box
          display="flex"
          alignItems="center"
          gap={0.5}
          sx={{
            color: 'warning.dark',
            '&:hover .org-card-arrow': { transform: 'translateX(4px)' }
          }}
        >
          <Typography variant="caption" fontWeight={600} color="inherit">
            View organization
          </Typography>
          <ArrowForwardIcon
            className="org-card-arrow"
            sx={{ fontSize: 14, transition: 'transform 0.2s ease', color: 'inherit' }}
          />
        </Box>
      </Link>
    </>
  )

  return (
    <ResourceCard header={header} footer={footer}>
      {organization.description && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            lineHeight: 1.5
          }}
        >
          {organization.description}
        </Typography>
      )}
    </ResourceCard>
  )
}

export default OrganizationCard
