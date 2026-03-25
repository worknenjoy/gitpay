import React from 'react'
import {
  Avatar,
  Box,
  Button,
  CardContent,
  Chip,
  Divider,
  Typography,
  Tooltip
} from '@mui/material'
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined'
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined'
import BugReportOutlinedIcon from '@mui/icons-material/BugReportOutlined'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import LinkIcon from '@mui/icons-material/Link'
import slugify from '@sindresorhus/slugify'
import { RootCard } from './organization-card.styles'
import { Link, useHistory } from 'react-router-dom'
import OrganizationCardPlaceholder from './organization-card.placeholder'

import logoGithub from 'images/github-logo.png'

const OrganizationCard = ({ organization, completed }) => {
  const history = useHistory()

  if (!completed) return <OrganizationCardPlaceholder />

  const projects = organization.Projects || []
  const projectCount = projects.length
  const openIssues = projects.reduce((sum, p) =>
    sum + (p.Tasks || []).filter((t) => t.status === 'open').length, 0)
  const bounties = projects.reduce((sum, p) =>
    sum + (p.Tasks || []).reduce((b, t) => b + (t.value ? parseInt(t.value) : 0), 0), 0)
  const hasTasks = projects.some((p) => p.Tasks)

  const githubUrl = organization.provider === 'bitbucket'
    ? `https://bitbucket.com/${organization.name}`
    : `https://github.com/${organization.name}`

  const organizationPath = `/organizations/${organization.id}/${slugify(organization.name)}`

  return (
    <RootCard>
      <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', pt: 4, pb: 2 }}>
        <Avatar
          aria-label={organization.name}
          sx={{ width: 80, height: 80, fontSize: 32, mb: 2, bgcolor: 'primary.main' }}
        >
          {organization.name[0]}
        </Avatar>

        <Typography align="center" variant="h6" fontWeight={600} gutterBottom>
          <Link
            to={organizationPath}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            {organization.name}
          </Link>
        </Typography>

        {organization.User && (
          <Typography align="center" variant="body2" color="text.secondary" gutterBottom>
            <AccountCircleOutlinedIcon sx={{ fontSize: 14, verticalAlign: 'middle', mr: 0.5 }} />
            <Link
              to={`/profile/users/${organization.User.id}`}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              {organization.User.name || organization.User.username}
            </Link>
          </Typography>
        )}

        {organization.description && (
          <Typography
            align="center"
            variant="body2"
            color="text.secondary"
            sx={{
              mt: 1,
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              lineHeight: 1.5
            }}
          >
            {organization.description}
          </Typography>
        )}

        <Box display="flex" alignItems="center" gap={1.5} mt={2}>
          {organization.name && (
            <Tooltip title="View on GitHub">
              <a href={githubUrl} target="_blank" rel="noreferrer">
                <img
                  width="22"
                  src={logoGithub}
                  style={{ borderRadius: '50%', padding: 2, backgroundColor: 'black', display: 'block' }}
                />
              </a>
            </Tooltip>
          )}
          {organization.websiteUrl && (
            <Tooltip title={organization.websiteUrl}>
              <a href={organization.websiteUrl} target="_blank" rel="noreferrer" style={{ color: 'inherit', display: 'flex', alignItems: 'center' }}>
                <LinkIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
              </a>
            </Tooltip>
          )}
        </Box>
      </CardContent>

      <Box flexGrow={1} />

      {projectCount > 0 && (
        <Box px={2} pb={2} display="flex" flexWrap="wrap" gap={0.75} justifyContent="center">
          <Chip
            icon={<FolderOutlinedIcon />}
            label={`${projectCount} project${projectCount !== 1 ? 's' : ''}`}
            size="small"
            variant="outlined"
          />
          {hasTasks && (
            <Chip
              icon={<BugReportOutlinedIcon />}
              label={openIssues > 0 ? `${openIssues} open issue${openIssues !== 1 ? 's' : ''}` : 'no open issues'}
              size="small"
              variant="outlined"
              color={openIssues > 0 ? 'warning' : 'default'}
            />
          )}
          {bounties > 0 && (
            <Chip
              icon={<AttachMoneyIcon />}
              label={`$${bounties} in bounties`}
              size="small"
              variant="outlined"
              color="success"
            />
          )}
        </Box>
      )}

      <Divider />

      <Box p={2}>
        <Button
          fullWidth
          variant="contained"
          disableElevation
          onClick={() => history.push(organizationPath)}
          sx={{
            borderRadius: 6,
            bgcolor: 'grey.800',
            color: 'white',
            textTransform: 'none',
            fontWeight: 600,
            '&:hover': { bgcolor: 'grey.900' }
          }}
        >
          View Organization
        </Button>
      </Box>
    </RootCard>
  )
}

export default OrganizationCard
