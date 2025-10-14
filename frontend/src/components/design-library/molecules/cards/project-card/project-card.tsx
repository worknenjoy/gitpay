import React from 'react'
import PropTypes from 'prop-types'
import {
  Avatar,
  Box,
  Chip,
  CardContent,
  Divider,
  Grid,
  Typography,
  IconButton,
  Tooltip
} from '@mui/material'
import slugify from '@sindresorhus/slugify'
import { Link, useHistory } from 'react-router-dom'
import { RootCard, StatsItem } from './project-card.styles'

import logoGithub from 'images/github-logo.png'
import logoBitbucket from 'images/bitbucket-logo.png'


const projectBounties = (data) => {
  return data.length > 0 && data.map(task => task.value ? task.value : 0).reduce((prev, next) => parseInt(prev) + parseInt(next))
}

const projectBountiesList = (data) => {
  const bounties = projectBounties(data)
  const hasBounties = bounties > 0
  return hasBounties ? `$${bounties} in bounties` : 'no bounties'
}

const ProjectCard = ({ project }) => {
  const history = useHistory()

  const goToProject = (e, project) => {
    e.preventDefault()
    history.push(`/organizations/${project.Organization.id}/${slugify(project.Organization.name)}/projects/${project.id}/${slugify(project.name)}`)
  }

  return (
    <RootCard>
      <CardContent style={{ position: 'relative' }}>
        <IconButton aria-label="provider" style={{ position: 'absolute', right: 10, top: 10 }}>
          <Tooltip id="tooltip-fab" title={project.Organization && (project.Organization.provider ? project.Organization.provider : 'See on repository')} placement="right">
            <a target="_blank" href={project.Organization && (project.Organization.provider === 'bitbucket' ? `https://bitbucket.com/${project.Organization.name}/${project.name}` : `https://github.com/${project.Organization.name}/${project.name}`)} rel="noreferrer">
              <img width="28" src={project.Organization && (project.Organization.provider === 'bitbucket' ? logoBitbucket : logoGithub)}
                style={{ borderRadius: '50%', padding: 3, backgroundColor: 'black' }}
              />
            </a>
          </Tooltip>
        </IconButton>
        <Box
          display="flex"
          justifyContent="center"
          mb={3}
          mt={3}
        >
          <Avatar aria-label="recipe">
            {project.name[0]}
          </Avatar>
        </Box>
        <Typography
          align="center"
          color="textSecondary"
          variant="body2"
        >
          <Link to={`/organizations/${project.Organization.id}/${slugify(project.Organization.name)}/projects/${project.id}/${slugify(project.name)}`}>
            {project.name}
          </Link>
        </Typography>
        <Typography
          align="center"
          color="textPrimary"
          gutterBottom
          variant="caption"
          style={{ display: 'inline-block', textAlign: 'center', width: '100%', marginTop: 0 }}
        > by {' '}
          {project.Organization && <Link color="textSecondary" to={`/organizations/${project.Organization.id}/${slugify(project.Organization.name)}`}>
            {project.Organization.name}
          </Link>}
        </Typography>
        <Typography
          align="center"
          color="textPrimary"
          variant="body1"
        >
          {project.description}
        </Typography>
      </CardContent>
      <Box flexGrow={1} />
      <Divider />
      <Box p={2}>
        <Grid
          container
          justifyContent="space-between"
          spacing={2}
        >
          <StatsItem>
            <Typography variant="subtitle1">
              {projectBountiesList(project.Tasks)}
            </Typography>
          </StatsItem>
          <StatsItem>
            <Chip style={{ marginLeft: 10 }} size="small" clickable onClick={(e) => goToProject(e, project)} avatar={<Avatar>{project.Tasks.filter(t => t.status === 'open').length}</Avatar>} label={' open issue(s)'}
            />
          </StatsItem>
        </Grid>
      </Box>
    </RootCard>
  )
}

ProjectCard.propTypes = {
  className: PropTypes.string,
  project: PropTypes.object.isRequired
}

export default ProjectCard
