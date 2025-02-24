import React, { useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import Tooltip from '@material-ui/core/Tooltip'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import Chip from '@material-ui/core/Chip'
import Avatar from '@material-ui/core/Avatar'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import slugify from '@sindresorhus/slugify'
import Link from '@material-ui/core/Link'

import logoGithub from 'images/github-logo.png'
import logoBitbucket from 'images/bitbucket-logo.png'

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(0),
    marginBottom: theme.spacing(2),
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'flex-start'
  },
  rootCard: {
    maxWidth: 345,
    marginRight: 20
  },
  item: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3)
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  }
}))

export default function ProjectListSimple ({ listProjects, projects, user }) {
  const classes = useStyles()

  useEffect(() => {
    listProjects && listProjects()
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
    const url = user?.id ? `/#/profile/organizations/${p.OrganizationId}/projects/${p.id}` : `/#/organizations/${p.OrganizationId}/projects/${p.id}`
    return (
      <Chip 
        style={ { marginLeft: 10 } }
        size='medium'
        clickable
        avatar={ <Avatar>{ p.Tasks.filter(t => t.status === 'open').length }</Avatar> }
        label={ ' open issue(s)' }
        component={Link}
        href={url}
      />
    )
  }
  return (
    <div className={ classes.root }>
      { projects && projects.data && projectSortMoreBounties(projectsSort(projects.data)).map(p => {
        return (
          <div className={ classes.item }>
            <Card className={ classes.rootCard }>
              <CardHeader
                avatar={
                  <Avatar aria-label='recipe' className={ classes.avatar }>
                    { p.name[0] }
                  </Avatar>
                }
                action={
                  <IconButton aria-label='provider'>
                    <Tooltip id='tooltip-fab' title={ p.Organization && (p.Organization.provider ? p.Organization.provider : 'See on repository') } placement='right'>
                      <a target='_blank' href={ p.Organization && (p.Organization.provider === 'bitbucket' ? `https://bitbucket.com/${p.Organization.name}/${p.name}` : `https://github.com/${p.Organization.name}/${p.name}`) } rel="noreferrer">
                        <img width='28' src={ p.Organization && (p.Organization.provider === 'bitbucket' ? logoBitbucket : logoGithub) }
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
                <Typography variant='body2' color='textSecondary' component='p'>
                  { p.description }
                </Typography>
              </CardContent>
              }
              <div>
                <CardActions disableSpacing style={ { alignItems: 'center' } }>
                  <Typography variant='subtitle1'>
                    { projectBountiesList(p.Tasks) }
                  </Typography>
                  {getProjectLink(p)}
                </CardActions>
              </div>
            </Card>
          </div>
        )
      }) }
    </div>
  )
}
