import React from 'react'
import { Avatar, Box, Chip, CardContent, Divider, Grid, Typography } from '@mui/material'
import slugify from '@sindresorhus/slugify'
import { RootCard, StatsItem } from './organization-card.styles'
import { Link, useHistory } from 'react-router-dom'
import OrganizationCardPlaceholder from './organization-card.placeholder'

const OrganizationCard = ({ organization, completed }) => {
  const history = useHistory()

  return completed ? (
    <RootCard>
      <CardContent>
        <Box display="flex" justifyContent="center" mb={3}>
          <Avatar aria-label="recipe">{organization.name[0]}</Avatar>
        </Box>
        <Typography align="center" color="textPrimary" gutterBottom variant="h6">
          <Link
            color="textPrimary"
            to={`/organizations/${organization.id}/${slugify(organization.name)}`}
          >
            {organization.name}
          </Link>
        </Typography>
        <Typography
          align="center"
          color="textPrimary"
          gutterBottom
          variant="caption"
          style={{ display: 'inline-block', textAlign: 'center', width: '100%', marginTop: 0 }}
        >
          {' '}
          by{' '}
          {organization && (
            <Link color="textSecondary" to={`/profile/users/${organization.User.id}`}>
              {organization.User.name || organization.User.username}
            </Link>
          )}
        </Typography>
        <Typography align="center" color="textPrimary" variant="body1">
          {organization.description}
        </Typography>
      </CardContent>
      <Box flexGrow={1} />
      <Divider />
      <Box p={2}>
        <Grid container justifyContent="space-between" spacing={2}>
          <StatsItem>
            <Typography
              variant="body2"
              color="textSecondary"
              component="small"
              style={{ width: '100%', marginBottom: 10, marginLeft: 16 }}
            >
              Projects:
            </Typography>
          </StatsItem>
          <StatsItem style={{ flexWrap: 'wrap' }}>
            {organization.Projects &&
              organization.Projects.map((p) => (
                <Chip
                  key={p.id}
                  style={{ marginLeft: 10, marginBottom: 10 }}
                  size="medium"
                  clickable
                  onClick={() => {
                    history.push(
                      `/organizations/${organization.id}/${organization.name}/projects/${p.id}/${slugify(p.name)}`
                    )
                  }}
                  label={p.name}
                />
              ))}
          </StatsItem>
        </Grid>
      </Box>
    </RootCard>
  ) : (
    <OrganizationCardPlaceholder />
  )
}

export default OrganizationCard
