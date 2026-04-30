import React from 'react'
import { Avatar, Box, Chip, Grid, Typography } from '@mui/material'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import ResourceCard from './resource-card'

import logoGithub from 'images/github-logo.png'

export default {
  title: 'Design Library/Molecules/Cards/ResourceCard',
  component: ResourceCard
}

// --- shared sample parts ---

const GitHubLogo = () => (
  <img
    width="16"
    height="16"
    src={logoGithub}
    style={{
      borderRadius: '50%',
      backgroundColor: 'black',
      padding: 2,
      display: 'block',
      flexShrink: 0
    }}
  />
)

const ViewLink = ({ label }: { label: string }) => (
  <Box
    display="flex"
    alignItems="center"
    gap={0.5}
    sx={{ color: 'warning.dark', cursor: 'pointer' }}
  >
    <Typography variant="caption" fontWeight={600} color="inherit">
      {label}
    </Typography>
    <ArrowForwardIcon sx={{ fontSize: 14, color: 'inherit' }} />
  </Box>
)

// --- Project-style card ---

const projectHeader = (
  <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
    <Box
      display="flex"
      alignItems="center"
      gap={0.75}
      minWidth={0}
      overflow="hidden"
      flexShrink={1}
    >
      <GitHubLogo />
      <Typography variant="body2" color="text.secondary" noWrap sx={{ flexShrink: 0 }}>
        worknenjoy
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ flexShrink: 0 }}>
        /
      </Typography>
      <Typography variant="subtitle2" fontWeight={700} noWrap>
        gitpay
      </Typography>
    </Box>
    <Chip
      label="8 open"
      size="small"
      color="warning"
      variant="outlined"
      sx={{ ml: 1, flexShrink: 0, height: 22, fontSize: 11 }}
    />
  </Box>
)

const projectFooter = (
  <>
    <Box display="flex" gap={2}>
      <Typography variant="caption" color="text.secondary">
        Paid out{' '}
        <Box component="span" fontWeight={700} color="text.primary">
          $2,500
        </Box>
      </Typography>
      <Typography variant="caption" color="text.secondary">
        Issues{' '}
        <Box component="span" fontWeight={700} color="text.primary">
          11
        </Box>
      </Typography>
    </Box>
    <ViewLink label="View project" />
  </>
)

export const ProjectStyle = () => (
  <Box maxWidth={380}>
    <ResourceCard header={projectHeader} footer={projectFooter}>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{
          mb: 1.5,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          lineHeight: 1.5
        }}
      >
        Payment platform for open-source work delivered. Bounties, payment requests, and more.
      </Typography>
      <Box display="flex" gap={0.75} flexWrap="wrap">
        {['TypeScript', 'React', 'Node'].map((lang) => (
          <Chip
            key={lang}
            label={lang}
            size="small"
            variant="outlined"
            sx={{ height: 22, fontSize: 11 }}
          />
        ))}
      </Box>
    </ResourceCard>
  </Box>
)
ProjectStyle.storyName = 'Project style'

// --- Organization-style card ---

const orgHeader = (
  <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
    <Box
      display="flex"
      alignItems="center"
      gap={0.75}
      minWidth={0}
      overflow="hidden"
      flexShrink={1}
    >
      <Avatar sx={{ width: 20, height: 20, fontSize: 11, bgcolor: 'primary.main', flexShrink: 0 }}>
        W
      </Avatar>
      <Typography variant="subtitle2" fontWeight={700} noWrap>
        worknenjoy
      </Typography>
    </Box>
    <Chip
      label="3 projects"
      size="small"
      variant="outlined"
      sx={{ ml: 1, flexShrink: 0, height: 22, fontSize: 11 }}
    />
  </Box>
)

const orgFooter = (
  <>
    <Box display="flex" gap={2}>
      <Typography variant="caption" color="text.secondary">
        Bounties{' '}
        <Box component="span" fontWeight={700} color="text.primary">
          $150
        </Box>
      </Typography>
      <Typography variant="caption" color="text.secondary">
        Open issues{' '}
        <Box component="span" fontWeight={700} color="text.primary">
          3
        </Box>
      </Typography>
    </Box>
    <ViewLink label="View organization" />
  </>
)

export const OrganizationStyle = () => (
  <Box maxWidth={380}>
    <ResourceCard header={orgHeader} footer={orgFooter}>
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
        An open-source organization building tools for developers to manage bounties and get paid
        for their contributions.
      </Typography>
    </ResourceCard>
  </Box>
)
OrganizationStyle.storyName = 'Organization style'

// --- Minimal card (no body content) ---

const minimalHeader = (
  <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
    <Box
      display="flex"
      alignItems="center"
      gap={0.75}
      minWidth={0}
      overflow="hidden"
      flexShrink={1}
    >
      <GitHubLogo />
      <Typography variant="body2" color="text.secondary" noWrap sx={{ flexShrink: 0 }}>
        acme
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ flexShrink: 0 }}>
        /
      </Typography>
      <Typography variant="subtitle2" fontWeight={700} noWrap>
        minimal-project
      </Typography>
    </Box>
  </Box>
)

const minimalFooter = (
  <>
    <Typography variant="caption" color="text.secondary">
      Issues{' '}
      <Box component="span" fontWeight={700} color="text.primary">
        2
      </Box>
    </Typography>
    <ViewLink label="View project" />
  </>
)

export const Minimal = () => (
  <Box maxWidth={380}>
    <ResourceCard header={minimalHeader} footer={minimalFooter} />
  </Box>
)
Minimal.storyName = 'Minimal (no description)'

// --- Long name stress test ---

const longNameHeader = (
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
        sx={{ width: 20, height: 20, fontSize: 11, bgcolor: 'secondary.main', flexShrink: 0 }}
      >
        U
      </Avatar>
      <Typography variant="subtitle2" fontWeight={700} noWrap>
        this-organization-has-a-very-long-name-that-should-truncate
      </Typography>
    </Box>
    <Chip
      label="12 projects"
      size="small"
      variant="outlined"
      sx={{ ml: 1, flexShrink: 0, height: 22, fontSize: 11 }}
    />
  </Box>
)

export const LongName = () => (
  <Box maxWidth={380}>
    <ResourceCard header={longNameHeader} footer={orgFooter}>
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
        Testing that long organization and project names truncate cleanly without breaking the card
        layout.
      </Typography>
    </ResourceCard>
  </Box>
)
LongName.storyName = 'Long name (truncation)'

// --- Grid of mixed cards ---

export const GridOfCards = () => (
  <Grid container spacing={2}>
    <Grid size={{ lg: 4, md: 6, xs: 12 }}>
      <ResourceCard header={projectHeader} footer={projectFooter}>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 1.5,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            lineHeight: 1.5
          }}
        >
          Payment platform for open-source work delivered.
        </Typography>
        <Box display="flex" gap={0.75}>
          {['TypeScript', 'React'].map((l) => (
            <Chip
              key={l}
              label={l}
              size="small"
              variant="outlined"
              sx={{ height: 22, fontSize: 11 }}
            />
          ))}
        </Box>
      </ResourceCard>
    </Grid>
    <Grid size={{ lg: 4, md: 6, xs: 12 }}>
      <ResourceCard header={orgHeader} footer={orgFooter}>
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
          An open-source organization building tools for developers.
        </Typography>
      </ResourceCard>
    </Grid>
    <Grid size={{ lg: 4, md: 6, xs: 12 }}>
      <ResourceCard header={minimalHeader} footer={minimalFooter} />
    </Grid>
    <Grid size={{ lg: 4, md: 6, xs: 12 }}>
      <ResourceCard header={longNameHeader} footer={orgFooter}>
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
          Long name truncation test inside the grid layout.
        </Typography>
      </ResourceCard>
    </Grid>
  </Grid>
)
GridOfCards.storyName = 'Grid of cards'
