import React from 'react'
import PropTypes from 'prop-types'
import Breadcrumbs from '@material-ui/core/Breadcrumbs'
import Link from '@material-ui/core/Link'
import NavigateNextIcon from '@material-ui/icons/NavigateNext'
import ReactPlaceholder from 'react-placeholder'
import { RectShape } from 'react-placeholder/lib/placeholders'
import TextEllipsis from 'text-ellipsis'
import {
  Avatar,
  Typography,
  Chip,
  Grid,
  withStyles
} from '@material-ui/core'

import { injectIntl, FormattedMessage } from 'react-intl'

import styled from 'styled-components'
import media from 'app/styleguide/media'

import Constants from '../../consts'
import TaskStatusIcons from './task-status-icons'
import TaskLabels from './task-labels'
import TaskStatusDropdown from './task-status-dropdown'

import logoGithub from '../../images/github-logo.png'
import logoBitbucket from '../../images/bitbucket-logo.png'

const TaskHeaderContainer = styled.div`
  box-sizing: border-box;
  position: relative;

  ${media.phone`
    margin: -1rem -1rem 1rem -1rem;
    padding: 1rem;

    & h1 {
      font-size: 1.75rem;
    }
  `}
`

const styles = theme => ({
  breadcrumbRoot: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2)
  },
  breadcrumbLink: {
    textDecoration: 'underline'
  },
  chipStatusSuccess: {
    marginBottom: theme.spacing(1),
    verticalAlign: 'middle',
    backgroundColor: 'transparent',
    color: theme.palette.primary.success
  },
  chipStatusClosed: {
    marginBottom: theme.spacing(1),
    verticalAlign: 'middle',
    backgroundColor: 'transparent',
    color: theme.palette.error.main
  },
  avatarStatusSuccess: {
    width: theme.spacing(0),
    height: theme.spacing(0),
    backgroundColor: theme.palette.primary.success,
  },
  avatarStatusClosed: {
    width: theme.spacing(0),
    height: theme.spacing(0),
    backgroundColor: theme.palette.error.main,
  },
  chipStatusPaid: {
    marginLeft: 0,
    verticalAlign: 'middle',
    backgroundColor: theme.palette.primary.light
  },
  button: {
    width: 100,
    font: 10
  },
  gutterRight: {
    marginRight: 10
  }
})

class TaskHeader extends React.Component {
  goToProjectRepo = (e, url) => {
    e.preventDefault()
    window.open(url, '_blank')
  }

  handleBackToTaskList = (e) => {
    e.preventDefault()
    window.location.assign('/#/tasks/explore')
  }

  render () {
    const { classes, task, user, history, updateTask, taskOwner } = this.props

    const headerPlaceholder = (
      <div className='line-holder'>
        <RectShape
          color='white'
          style={ { marginLeft: 20, marginTop: 20, width: 300, height: 20 } }
        />
      </div>
    )

    return (
      <TaskHeaderContainer>
        <Grid item xs={ 12 } sm={ 12 } md={ 12 }>
          <ReactPlaceholder showLoadingAnimation type='text' rows={ 1 }
            ready={ task.completed }>
            <div className={ classes.breadcrumbRoot }>
              { task.data.Project ? (
                <Breadcrumbs aria-label='breadcrumb' separator={ ' / ' }>
                  { user && user.id ? (
                    <Link href='/' color='inherit' onClick={ (e) => {
                      e.preventDefault()
                      history.push('/profile/tasks')
                    } }>
                      <Typography variant='subtitle2' className={ classes.breadcrumbLink }>
                        <FormattedMessage id='task.title.navigation.user' defaultMessage='Your issues' />
                      </Typography>
                    </Link>
                  ) : (
                    <Link href='/' color='inherit' onClick={ this.handleBackToTaskList }>
                      <Typography variant='subtitle2' className={ classes.breadcrumbLink }>
                        <FormattedMessage id='task.title.navigation' defaultMessage='All issues' />
                      </Typography>
                    </Link>
                  ) }
                  <Link href='' color='inherit' onClick={ (e) => {
                    e.preventDefault()
                    window.location.href = '/#/organizations/' + task.data.Project.Organization.id
                  } }>
                    <Typography variant='subtitle2' className={ classes.breadcrumbLink }>
                      { task.data.Project.Organization.name }
                    </Typography>
                  </Link>
                  <Link href={ `/#/organizations/${task.data.Project.OrganizationId}/projects/${task.data.Project.id}` } className={ classes.breadcrumb } color='inherit'>
                    <Typography variant='subtitle2' className={ classes.breadcrumbLink }>
                      { task.data.Project.name }
                    </Typography>
                  </Link>
                  <Typography variant='subtitle2'>
                    ...
                  </Typography>
                </Breadcrumbs>
              ) : (
                <Breadcrumbs aria-label='breadcrumb' separator={ <NavigateNextIcon fontSize='small' /> }>
                  <Link href='/' color='inherit' onClick={ this.handleBackToTaskList }>
                    <Typography variant='subtitle2' className={ classes.breadcrumbLink }>
                      <FormattedMessage id='task.title.navigation' defaultMessage='All issues' />
                    </Typography>
                  </Link>
                  <Link href='/' color='inherit' onClick={ (e) => this.goToProjectRepo(e, task.data.metadata.ownerUrl) }>
                    <Typography variant='h4' className={ classes.breadcrumbLink }>
                      { task.data.metadata.company }
                    </Typography>
                  </Link>
                  <Link href='/' color='inherit' onClick={ (e) => this.goToProjectRepo(e, task.data.metadata.repoUrl) }>
                    <Typography variant='subtitle2' className={ classes.breadcrumbLink }>
                      { task.data.metadata.projectName }
                    </Typography>
                  </Link>
                  <Typography variant='subtitle2'>
                    ...
                  </Typography>
                </Breadcrumbs>
              ) }
            </div>
          </ReactPlaceholder>
          <ReactPlaceholder customPlaceholder={ headerPlaceholder } showLoadingAnimation
            ready={ task.completed }
          >
            <Typography variant='h5' gutterBottom title={task.data.title}>
              <strong>
                {task.data.title || 'no title'}
              </strong>
            </Typography>
          </ReactPlaceholder>
          <Typography variant='caption' style={ { display: 'inline-block', marginBottom: 20 } }>
            { task.data.provider &&
            <div>
              Created on <a
                href={ task.data.url }
                style={ { textDecoration: 'underline' } }
              >
                { task.data.provider } <img width='12' src={ task.data.provider === 'github' ? logoGithub : logoBitbucket } style={ { marginRight: 5, marginLeft: 5, borderRadius: '50%', padding: 3, backgroundColor: 'black', borderColor: 'black', borderWidth: 1, verticalAlign: 'bottom' } } />
              </a>
              by { ' ' }
              <a
                href={ task.data.metadata && task.data.provider === 'github' ? task.data.metadata.issue.user.html_url : '' }
              >
                { task.data.metadata && task.data.provider === 'github' ? task.data.metadata.issue.user.login : task.data.metadata && task.data.metadata.user }
                <img
                  style={ { marginRight: 5, marginLeft: 5, borderRadius: '50%', padding: 3, verticalAlign: 'bottom' } }
                  width='16'
                  src={ task.data.metadata && task.data.provider === 'github' ? task.data.metadata.issue.user.avatar_url : '' }
                />
              </a>
            </div> }
          </Typography>
          { task.data.metadata &&
          <ReactPlaceholder ready={ task.completed }>
            <TaskLabels labels={ task.data.metadata.labels } />
          </ReactPlaceholder>
          }
        </Grid>
      </TaskHeaderContainer>
    )
  }
}

TaskHeader.propTypes = {
  classes: PropTypes.object.isRequired,
  task: PropTypes.object
}

export default injectIntl(withStyles(styles)(TaskHeader))
