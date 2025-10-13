import React, { useEffect } from 'react'
import { styled } from '@mui/material/styles'
import Card from '@mui/material/Card'
import Tooltip from '@mui/material/Tooltip'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import Chip from '@mui/material/Chip'
import Avatar from '@mui/material/Avatar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Link from '@mui/material/Link'

import logoGithub from 'images/github-logo.png'
import logoBitbucket from 'images/bitbucket-logo.png'

const Root = styled('div')(({ theme }) => ({
  marginTop: theme.spacing(0),
  marginBottom: theme.spacing(2),
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'flex-start'
}))

const RootCard = styled(Card)(({ theme }) => ({
  maxWidth: 345,
  marginRight: 20
}))

const Item = styled('div')(({ theme }) => ({
  marginTop: theme.spacing(3),
  marginBottom: theme.spacing(3)
}))

export default function ProjectListCompact ({ listProjects, projects }) {
  useEffect(() => {
    listProjects?.()
  }, [])

  const hasOpenIssues = (project) => {
    const hasOpenTasks = project.Tasks.filter(t => t.status === 'open')
    return hasOpenTasks.length > 0
  }

  const projectsSort = (data) => {
    const projectWithOpenIssues = data.filter(p => hasOpenIssues(p))
    return projectWithOpenIssues.sort((a, b) => parseInt(b.Tasks.length) - parseInt(a.Tasks.length))
  }

  const projectSortMoreBounties = (data) => {
    return data.sort((a, b) => projectBounties(b.Tasks) - projectBounties(a.Tasks))
  }

  const projectBounties = (data) => {
    return data.map(task => task.value ? task.value : 0).reduce((prev, next) => parseInt(prev) + parseInt(next))
  }

  const projectBountiesList = (data) => {
    const bounties = projectBounties(data)
    const hasBounties = bounties > 0
    return hasBounties ? `$${bounties} in bounties` : 'no bounties'
  }

  const getProjectLink = (p) => {
    const url = `/#/organizations/${p.OrganizationId}/projects/${p.id}`
    return (
      <Chip 
        style={ { marginLeft: 10 } }
        size="medium"
        clickable
        avatar={ <Avatar>{ p.Tasks.filter(t => t.status === 'open').length }</Avatar> }
        label={ ' open issue(s)' }
        component={Link}
        href={url}
      />
    )
  }
  return (
    <Root>
      { projects && projects.data && projectSortMoreBounties(projectsSort(projects.data)).map(p => {
        return (
          <Item key={p.id}>
            <RootCard>
              <CardHeader
                avatar={
                  <Avatar aria-label="recipe">
                    { p.name[0] }
                  </Avatar>
                }
                action={
                  <IconButton aria-label="provider">
                    <Tooltip id="tooltip-fab" title={ p.Organization && (p.Organization.provider ? p.Organization.provider : 'See on repository') } placement="right">
                      <a target="_blank" href={ p.Organization && (p.Organization.provider === 'bitbucket' ? `https://bitbucket.com/${p.Organization.name}/${p.name}` : `https://github.com/${p.Organization.name}/${p.name}`) } rel="noreferrer">
                        <img width="28" src={ p.Organization && (p.Organization.provider === 'bitbucket' ? logoBitbucket : logoGithub) }
                          style={ { borderRadius: '50%', padding: 3, backgroundColor: 'black' } }
                        />
                      </a>
                    </Tooltip>
                  </IconButton>
                }
                title={ p.name }
                subheader={ `by ${p.Organization && p.Organization.name}` }
              />
              { p.description &&
              <CardContent>
                <Typography variant="body2" color="textSecondary" component="p">
                  { p.description }
                </Typography>
              </CardContent>
              }
              <div>
                <CardActions disableSpacing style={ { alignItems: 'center' } }>
                  <Typography variant="subtitle1">
                    { projectBountiesList(p.Tasks) }
                  </Typography>
                  {getProjectLink(p)}
                </CardActions>
              </div>
            </RootCard>
          </Item>
        )
      }) }
    </Root>
  )
}
