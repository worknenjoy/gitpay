import React from 'react'
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
import ProjectCardPlaceholder from './project-card.placeholder'

const projectBounties = (data) => {
  return (
    data.length > 0 &&
    data
      .map((task) => (task.value ? task.value : 0))
      .reduce((prev, next) => parseInt(prev) + parseInt(next))
  )
}

const projectBountiesList = (data) => {
  const bounties = projectBounties(data)
  const hasBounties = bounties > 0
  return hasBounties ? `$${bounties} in bounties` : 'no bounties'
}

const ProjectCard = ({ project, completed }) => {
  const history = useHistory()
  const baseOrganizationPath = `/organizations/${project.Organization.id}/${slugify(project.Organization.name)}`
  const baseProjectPath = `${baseOrganizationPath}/projects/${project.id}/${slugify(project.name)}`
  const myIssuesProfilePath = `/profile`
  const exploreIssuesProfilePath = `/profile/explore`

  const [currentOrganizationPath, setCurrentOrganizationPath] = React.useState(baseOrganizationPath)
  const [currentProjectPath, setProjectCurrentPath] = React.useState(baseProjectPath)

  React.useEffect(() => {
    if (history.location.pathname.includes(myIssuesProfilePath)) {
      setCurrentOrganizationPath(`${myIssuesProfilePath}${baseOrganizationPath}`)
      setProjectCurrentPath(`${myIssuesProfilePath}${baseProjectPath}`)
    } else if (history.location.pathname.includes(exploreIssuesProfilePath)) {
      setCurrentOrganizationPath(`${exploreIssuesProfilePath}${baseOrganizationPath}`)
      setProjectCurrentPath(`${exploreIssuesProfilePath}${baseProjectPath}`)
    } else {
      setCurrentOrganizationPath(baseOrganizationPath)
      setProjectCurrentPath(baseProjectPath)
    }
  }, [])

  const goToProject = (e, project) => {
    e.preventDefault()
    history.push(currentProjectPath)
  }

  return completed ? (
    <RootCard>
      <CardContent style={{ position: 'relative' }}>
        <IconButton aria-label="provider" style={{ position: 'absolute', right: 10, top: 10 }}>
          <Tooltip
            id="tooltip-fab"
            title={
              project.Organization &&
              (project.Organization.provider ? project.Organization.provider : 'See on repository')
            }
            placement="right"
          >
            <a
              target="_blank"
              href={
                project.Organization &&
                (project.Organization.provider === 'bitbucket'
                  ? `https://bitbucket.com/${project.Organization.name}/${project.name}`
                  : `https://github.com/${project.Organization.name}/${project.name}`)
              }
              rel="noreferrer"
            >
              <img
                width="28"
                src={
                  project.Organization &&
                  (project.Organization.provider === 'bitbucket' ? logoBitbucket : logoGithub)
                }
                style={{ borderRadius: '50%', padding: 3, backgroundColor: 'black' }}
              />
            </a>
          </Tooltip>
        </IconButton>
        <Box display="flex" justifyContent="center" mb={3} mt={3}>
          <Avatar aria-label="recipe">{project.name[0]}</Avatar>
        </Box>
        <Typography align="center" color="textSecondary" variant="body2">
          <Link to={currentProjectPath}>{project.name}</Link>
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
          {project.Organization && (
            <Link color="textSecondary" to={currentOrganizationPath}>
              {project.Organization.name}
            </Link>
          )}
        </Typography>
        <Typography align="center" color="textPrimary" variant="body1">
          {project.description}
        </Typography>
      </CardContent>
      <Box flexGrow={1} />
      <Divider />
      <Box p={2}>
        <Grid container justifyContent="space-between" spacing={2}>
          <StatsItem>
            <Typography variant="subtitle1">{projectBountiesList(project.Tasks)}</Typography>
          </StatsItem>
          <StatsItem>
            <Chip
              style={{ marginLeft: 10 }}
              size="small"
              clickable
              onClick={(e) => goToProject(e, project)}
              avatar={<Avatar>{project.Tasks.filter((t) => t.status === 'open').length}</Avatar>}
              label={' open issue(s)'}
            />
          </StatsItem>
        </Grid>
      </Box>
    </RootCard>
  ) : (
    <ProjectCardPlaceholder />
  )
}

export default ProjectCard
