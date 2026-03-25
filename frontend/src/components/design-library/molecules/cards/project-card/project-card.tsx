import React from 'react'
import {
  Avatar,
  Box,
  Button,
  CardContent,
  Divider,
  Typography,
  Tooltip
} from '@mui/material'
import CorporateFareOutlinedIcon from '@mui/icons-material/CorporateFareOutlined'
import LinkIcon from '@mui/icons-material/Link'
import slugify from '@sindresorhus/slugify'
import { Link, useHistory } from 'react-router-dom'
import { RootCard } from './project-card.styles'

import logoGithub from 'images/github-logo.png'
import ProjectCardPlaceholder from './project-card.placeholder'

const ProjectCard = ({ project, completed }) => {
  const history = useHistory()
  const baseOrganizationPath = `/organizations/${project?.Organization?.id}/${slugify(project?.Organization?.name || '')}`
  const baseProjectPath = `${baseOrganizationPath}/projects/${project?.id}/${slugify(project?.name || '')}`
  const myIssuesProfilePath = `/profile`
  const exploreIssuesProfilePath = `/profile/explore`

  const [currentProjectPath, setProjectCurrentPath] = React.useState(baseProjectPath)

  React.useEffect(() => {
    if (history.location.pathname.includes(myIssuesProfilePath)) {
      setProjectCurrentPath(`${myIssuesProfilePath}${baseProjectPath}`)
    } else if (history.location.pathname.includes(exploreIssuesProfilePath)) {
      setProjectCurrentPath(`${exploreIssuesProfilePath}${baseProjectPath}`)
    } else {
      setProjectCurrentPath(baseProjectPath)
    }
  }, [])

  if (!completed) return <ProjectCardPlaceholder />

  const githubUrl = project.Organization &&
    (project.Organization.provider === 'bitbucket'
      ? `https://bitbucket.com/${project.Organization.name}/${project.name}`
      : `https://github.com/${project.Organization.name}/${project.name}`)

  return (
    <RootCard>
      <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', pt: 4, pb: 2 }}>
        <Avatar
          aria-label={project.name}
          sx={{ width: 80, height: 80, fontSize: 32, mb: 2, bgcolor: 'primary.main' }}
        >
          {project.name[0]}
        </Avatar>

        <Typography align="center" variant="h6" fontWeight={600} gutterBottom>
          <Link to={currentProjectPath} style={{ textDecoration: 'none', color: 'inherit' }}>
            {project.name}
          </Link>
        </Typography>

        {project.Organization && (
          <Typography align="center" variant="body2" color="text.secondary" gutterBottom>
            <CorporateFareOutlinedIcon sx={{ fontSize: 14, verticalAlign: 'middle', mr: 0.5 }} />
            <Link
              to={baseOrganizationPath}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              {project.Organization.name}
            </Link>
          </Typography>
        )}

        {project.description && (
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
            {project.description}
          </Typography>
        )}

        <Box display="flex" alignItems="center" gap={1.5} mt={2}>
          {githubUrl && (
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
          {project.websiteUrl && (
            <Tooltip title={project.websiteUrl}>
              <a href={project.websiteUrl} target="_blank" rel="noreferrer" style={{ color: 'inherit', display: 'flex', alignItems: 'center' }}>
                <LinkIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
              </a>
            </Tooltip>
          )}
        </Box>
      </CardContent>

      <Box flexGrow={1} />
      <Divider />

      <Box p={2}>
        <Button
          fullWidth
          variant="contained"
          disableElevation
          onClick={() => history.push(currentProjectPath)}
          sx={{
            borderRadius: 6,
            bgcolor: 'grey.800',
            color: 'white',
            textTransform: 'none',
            fontWeight: 600,
            '&:hover': { bgcolor: 'grey.900' }
          }}
        >
          View Project
        </Button>
      </Box>
    </RootCard>
  )
}

export default ProjectCard
