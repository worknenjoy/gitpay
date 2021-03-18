import React from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import {
  Avatar,
  Box,
  Chip,
  Card,
  CardContent,
  Divider,
  Grid,
  Typography,
  IconButton,
  Tooltip,
  makeStyles,
  Link
} from '@material-ui/core'

const logoGithub = require('../../images/github-logo.png')
const logoBitbucket = require('../../images/bitbucket-logo.png')

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column'
  },
  statsItem: {
    alignItems: 'center',
    display: 'flex'
  },
  statsIcon: {
    marginRight: theme.spacing(1)
  }
}))

const projectBounties = (data) => {
  return data.length > 0 && data.map(task => task.value ? task.value : 0).reduce((prev, next) => parseInt(prev) + parseInt(next))
}

const projectBountiesList = (data) => {
  const bounties = projectBounties(data)
  const hasBounties = bounties > 0
  return hasBounties ? `$${bounties} in open bounties` : 'no bounties'
}

const ProjectCard = ({ className, project, ...rest }) => {
  const classes = useStyles()

  return (
    <Card
      className={ clsx(classes.root, className) }
      { ...rest }
    >
      <CardContent style={ { position: 'relative' } }>
        <IconButton aria-label='provider' style={ { position: 'absolute', right: 10, top: 10 } }>
          <Tooltip id='tooltip-fab' title={ project.Organization && (project.Organization.provider ? project.Organization.provider : 'See on repository') } placement='right'>
            <a target='_blank' href={ project.Organization && (project.Organization.provider === 'bitbucket' ? `https://bitbucket.com/${project.Organization.name}/${project.name}` : `https://github.com/${project.Organization.name}/${project.name}`) }>
              <img width='28' src={ project.Organization && (project.Organization.provider === 'bitbucket' ? logoBitbucket : logoGithub) }
                style={ { borderRadius: '50%', padding: 3, backgroundColor: 'black' } }
              />
            </a>
          </Tooltip>
        </IconButton>
        <Box
          display='flex'
          justifyContent='center'
          mb={ 3 }
          mt={ 3 }
        >
          <Avatar aria-label='recipe' className={ classes.avatar }>
            { project.name[0] }
          </Avatar>
        </Box>
        <Typography
          align='center'
          color='textSecondary'
          
        >
          <Link href={''} onClick={(e) => {
            e.preventDefault()
            window.location.href = `/#/organizations/${project.Organization.id}/projects/${project.id}`
            window.location.reload()
          }}>
              { project.name }
          </Link>
        </Typography>
        <Typography
          align='center'
          color='textPrimary'
          gutterBottom
          variant='caption'
          style={ { display: 'inline-block', textAlign: 'center', width: '100%', marginTop: 0 } }
        > by {' '} 
          { project.Organization && <Link color="textSecondary" href={''} onClick={(e) => {
            e.preventDefault()
            window.location.href = `/#/organizations/${project.Organization.id}`
            window.location.reload()
          }}>{project.Organization.name}</Link> }
        </Typography>
        <Typography
          align='center'
          color='textPrimary'
          variant='body1'
        >
          { project.description }
        </Typography>
      </CardContent>
      <Box flexGrow={ 1 } />
      <Divider />
      <Box p={ 2 }>
        <Grid
          container
          justify='space-between'
          spacing={ 2 }
        >
          <Grid
            className={ classes.statsItem }
            item
          >
            <Chip size='small' label={ projectBountiesList(project.Tasks) } />
          </Grid>
          <Grid
            className={ classes.statsItem }
            item
          >
            <Chip style={ { marginLeft: 10 } } size='small' clickable onClick={ () => {
              window.location.href = '/#/organizations/' + project.OrganizationId + '/projects/' + project.id
              window.location.reload()
            } } avatar={ <Avatar>{ project.Tasks.filter(t => t.status === 'open').length }</Avatar> } label={ ' open issue(s)' }
            />
          </Grid>
        </Grid>
      </Box>
    </Card>
  )
}

ProjectCard.propTypes = {
  className: PropTypes.string,
  project: PropTypes.object.isRequired
}

export default ProjectCard
