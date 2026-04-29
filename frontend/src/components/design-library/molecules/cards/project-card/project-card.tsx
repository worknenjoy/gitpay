import React from 'react'
import { Box, Card, CardContent, Chip, Divider, Typography } from '@mui/material'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { Link, useHistory } from 'react-router-dom'
import slugify from '@sindresorhus/slugify'
import ProjectCardPlaceholder from './project-card.placeholder'

import logoGithub from 'images/github-logo.png'
import logoBitbucket from 'images/bitbucket-logo.png'

const LANGUAGE_COLORS: Record<string, string> = {
  typescript: '#3178c6',
  javascript: '#f1e05a',
  react: '#61dafb',
  node: '#41b883',
  python: '#3572a5',
  ruby: '#701516',
  go: '#00add8',
  rust: '#dea584',
  java: '#b07219',
  css: '#563d7c',
  html: '#e34c26'
}

const projectBounties = (tasks: any[]) =>
  tasks.filter((t) => t.value && t.status !== 'open').reduce((sum, t) => sum + Number(t.value), 0)

const ProjectCard = ({ project, completed }: { project: any; completed: boolean }) => {
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

  const openIssues = project.Tasks?.filter((t: any) => t.status === 'open').length ?? 0
  const totalIssues = project.Tasks?.length ?? 0
  const paidOut = projectBounties(project.Tasks ?? [])

  const isGitHub = project.Organization?.provider?.toLowerCase() !== 'bitbucket'
  const providerLogo = isGitHub ? logoGithub : logoBitbucket
  const providerLogoStyle = isGitHub
    ? { borderRadius: '50%', backgroundColor: 'black', padding: 2 }
    : { borderRadius: '50%' }

  const languages: string[] = project.languages ?? []

  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: 2,
        display: 'flex',
        flexDirection: 'column',
        background: 'transparent',
        transition: 'box-shadow 0.2s',
        '&:hover': { boxShadow: 3 }
      }}
    >
      <CardContent sx={{ pb: 1.5 }}>
        {/* Header row */}
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
          <Box display="flex" alignItems="center" gap={0.75} minWidth={0} flexShrink={1}>
            <img
              width="16"
              height="16"
              src={providerLogo}
              style={{ ...providerLogoStyle, display: 'block', flexShrink: 0 }}
            />
            <Typography variant="body2" color="text.secondary" noWrap sx={{ flexShrink: 0 }}>
              {project.Organization?.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ flexShrink: 0 }}>
              /
            </Typography>
            <Typography variant="subtitle2" fontWeight={700} noWrap>
              <Link to={currentProjectPath} style={{ textDecoration: 'none', color: 'inherit' }}>
                {project.name}
              </Link>
            </Typography>
          </Box>

          {openIssues > 0 && (
            <Chip
              label={`${openIssues} open`}
              size="small"
              color="warning"
              variant="outlined"
              sx={{ ml: 1, flexShrink: 0, height: 22, fontSize: 11 }}
            />
          )}
        </Box>

        {/* Description */}
        {project.description && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: languages.length > 0 ? 1.5 : 0,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              lineHeight: 1.5
            }}
          >
            {project.description}
          </Typography>
        )}

        {/* Language chips */}
        {languages.length > 0 && (
          <Box display="flex" gap={0.75} flexWrap="wrap">
            {languages.map((lang) => {
              const color = LANGUAGE_COLORS[lang.toLowerCase()]
              return (
                <Chip
                  key={lang}
                  label={lang}
                  size="small"
                  variant="outlined"
                  sx={{
                    height: 22,
                    fontSize: 11,
                    borderColor: color ?? 'divider',
                    color: color ?? 'text.secondary'
                  }}
                />
              )
            })}
          </Box>
        )}
      </CardContent>

      <Box flexGrow={1} />
      <Divider />

      {/* Footer */}
      <Box px={2} py={1.25} display="flex" justifyContent="space-between" alignItems="center">
        <Box display="flex" gap={2}>
          {paidOut > 0 && (
            <Typography variant="caption" color="text.secondary">
              Paid out{' '}
              <Box component="span" fontWeight={700} color="text.primary">
                ${paidOut.toLocaleString()}
              </Box>
            </Typography>
          )}
          <Typography variant="caption" color="text.secondary">
            Issues{' '}
            <Box component="span" fontWeight={700} color="text.primary">
              {totalIssues}
            </Box>
          </Typography>
        </Box>

        <Link to={currentProjectPath} style={{ textDecoration: 'none' }}>
          <Box
            display="flex"
            alignItems="center"
            gap={0.5}
            sx={{
              color: 'warning.dark',
              '&:hover .project-card-arrow': { transform: 'translateX(4px)' }
            }}
          >
            <Typography variant="caption" fontWeight={600} color="inherit">
              View project
            </Typography>
            <ArrowForwardIcon
              className="project-card-arrow"
              sx={{ fontSize: 14, transition: 'transform 0.2s ease', color: 'inherit' }}
            />
          </Box>
        </Link>
      </Box>
    </Card>
  )
}

export default ProjectCard
