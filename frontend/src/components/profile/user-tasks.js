import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { injectIntl, defineMessages, FormattedMessage } from 'react-intl'

import {
  Button,
  Paper,
  Typography,
  AppBar,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Tabs,
  Tab,
  withStyles
} from '@material-ui/core'
import {
  AccountCircle as CreatedByMeIcon,
  Assignment as AssignIcon,
  AssignmentInd as ActionIcon
} from '@material-ui/icons'

import CustomPaginationActionsTable from '../task/task-table'

import logoGithub from '../../images/github-logo.png'
import logoBitbucket from '../../images/bitbucket-logo.png'

import imageGettingStarted from '../../images/octodex.png'

import api from '../../consts'

const styles = theme => ({
  icon: {
    backgroundColor: 'black'
  },
  card: {},
  gutterLeft: {
    marginLeft: 10
  },
  media: {
    width: 600
  },
  rootTabs: {
    backgroundColor: theme.palette.primary.light
  }
})

const messages = defineMessages({
  allTasks: {
    id: 'task.list.lable.allTasks',
    defaultMessage: 'All tasks'
  },
  createdByMeTasks: {
    id: 'task.status.createdByMe',
    defaultMessage: 'Created by me'
  },
  interestedTasks: {
    id: 'tasks.status.interested',
    defaultMessage: 'I\'m interested'
  },
  assignedToMeTasks: {
    id: 'task.status.assigned',
    defaultMessage: 'Assigned to me'
  }
})

const UserTasks = ({ classes, intl, history, filterTasks, listTasks, tasks, user }) => {
  const [currentTab, setCurrentTab] = useState('')

  useEffect(() => {
    listTasks({}).then(() => {
      if (history.location.pathname === '/profile/tasks') {
        user.Types && user.Types.map(t => t.name).includes('contributor') && handleTabChange({}, 'interested')
        user.Types && user.Types.map(t => t.name).includes('maintainer') && handleTabChange({}, 'createdbyme')
      }
      if (history.location.pathname === '/profile/tasks/createdbyme') {
        handleTabChange({}, 'createdbyme')
      }
      if (history.location.pathname === '/profile/tasks/interested') {
        handleTabChange({}, 'interested')
      }
      if (history.location.pathname === '/profile/tasks/assigned') {
        handleTabChange({}, 'assigned')
      }
    })
  }, [])

  const handleTabChange = async (event, value) => {
    const baseUrl = '/profile/tasks/'
    setCurrentTab(value)
    history.push(baseUrl + value)
    switch (value) {
      case 'createdbyme':
        filterTasks('userId')
        break
      case 'interested':
        filterTasks('Assigns')
        break
      case 'assigned':
        filterTasks('assigned')
        break
      default:
    }
  }

  return (
    <Paper elevation={ 0 }>
      <div className={ classes.rootTabs } style={ { marginTop: 40 } }>
        <AppBar position='static' color='default'>
          <Tabs
            value={ currentTab }
            onChange={ handleTabChange }
            scrollable
            scrollButtons='on'
            indicatorColor='primary'
            textColor='primary'
          >
            { user.Types && user.Types.map(t => t.name).includes('maintainer') &&
            <Tab
              value={ 'createdbyme' }
              label={ intl.formatMessage(messages.createdByMeTasks) }
              icon={ <CreatedByMeIcon /> }
            />
            }
            { user.Types && user.Types.map(t => t.name).includes('contributor') &&

              <Tab
                value={ 'interested' }
                label={ intl.formatMessage(messages.interestedTasks) }
                icon={ <AssignIcon /> }
              />
            }
            { user.Types && user.Types.map(t => t.name).includes('contributor') &&
              <Tab
                value={ 'assigned' }
                label={ intl.formatMessage(
                  messages.assignedToMeTasks
                ) }
                icon={ <ActionIcon /> }
              />
            }
          </Tabs>
        </AppBar>
        <div style={ { padding: 8 * 3 } }>
          { !user.id ? (
            <Card className={ classes.card }>
              <CardMedia
                className={ classes.media }
                src={ imageGettingStarted }
              />
              <CardContent>
                <Typography gutterBottom variant='h5' component='h2'>
                  <FormattedMessage
                    id='task.user.account.create.headline'
                    defaultMessage='Login / signup to work in our tasks'
                  />
                </Typography>
                <Typography component='p'>
                  <FormattedMessage
                    id='task.user.account.create.description'
                    defaultMessage='Creating your account, you can be assigned to a task and receive bounties'
                  />
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  style={ { marginRight: 10 } }
                  href={ `${api.API_URL}/authorize/github` }
                  variant='contained'
                  size='small'
                  color='secondary'
                  className={ classes.logButtons }
                >
                  <img width='16' src={ logoGithub } />
                  <span className={ classes.gutterLeft }>Github</span>
                </Button>

                <Button
                  href={ `${api.API_URL}/authorize/bitbucket` }
                  variant='contained'
                  size='small'
                  color='secondary'
                  className={ classes.logButtons }
                >
                  <img width='16' src={ logoBitbucket } />
                  <span className={ classes.gutterLeft }>Bitbucket</span>
                </Button>
              </CardActions>
            </Card>
          ) : (
            <CustomPaginationActionsTable tasks={ tasks } />
          ) }
        </div>
      </div>
    </Paper>
  )
}

UserTasks.propTypes = {
  classes: PropTypes.object.isRequired,
  listTasks: PropTypes.func,
  filterTasks: PropTypes.func,
  tasks: PropTypes.object,
  user: PropTypes.object
}

export default injectIntl(withStyles(styles)(UserTasks))
