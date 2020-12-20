import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {withRouter } from 'react-router-dom'
import { injectIntl, defineMessages, FormattedMessage } from 'react-intl'

import {
  Button,
  Link,
  Paper,
  Typography,
  AppBar,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Avatar,
  Chip,
  Tabs,
  Tab,
  withStyles
} from '@material-ui/core'
import {
  Redeem as RedeemIcon,
  ShoppingBasket,
  Assignment as AssignIcon,
  AssignmentInd as ActionIcon
} from '@material-ui/icons'

import CustomPaginationActionsTable from './task-table'
import TaskStatusFilter from './task-status-filter'

const logoGithub = require('../../images/github-logo.png')
const logoBitbucket = require('../../images/bitbucket-logo.png')

const imageGettingStarted = require('../../images/octodex.png')

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

class TaskList extends Component {
  constructor (props) {
    super(props)
    this.state = {
      tab: 0,
      loading: true,
      project: {}
    }
  }

  filterTasksByState () {
    const currentTab = this.state.tab

    switch (currentTab) {
      case 0:
        this.props.filterTasks('open')
        break
      case 1:
        this.props.filterTasks('userId')
        break
      case 2:
        this.props.filterTasks('Assigns')
        break
      case 3:
        this.props.filterTasks('assigned')
        break
      default:
    }
  }

  async componentDidMount () {
    const projectId = this.props.match.params.project_id
    if (projectId) {
      await this.props.fetchProject(projectId)
    }
    else {
      await this.props.listTasks()
    }
    const params = this.props.match.params
    this.handleRoutePath(params.filter)
    this.setState({ project: params })
    this.setState({ loading: false })

    this.filterTasksByState()
    await this.props.listProjects()
  }

  goToProject = (e, project) => {
    e.preventDefault()
    window.location.href = '/#/organizations/' + project.OrganizationId + '/projects/' + project.id
    window.location.reload()
  }

  handleRoutePath = (value) => {
    switch (value) {
      case 'explore':
        this.handleTabChange(0, 0)
        break
      case 'createdbyme':
        this.handleTabChange(0, 1)
        break
      case 'interested':
        this.handleTabChange(0, 2)
        break
      case 'assignedtome':
        this.handleTabChange(0, 3)
        break
      default:
    }
  }

  handleTabChange = (event, value) => {
    const baseUrl = this.state.project ? '/organizations/' + this.state.project.organization_id + '/projects/' + this.state.project.project_id + '/' : '/tasks/'
    this.setState({ tab: value })
    switch (value) {
      case 0:
        this.props.history.push(baseUrl + 'explore')
        this.props.filterTasks('open')
        break
      case 1:
        this.props.history.push(baseUrl + 'createdbyme')
        this.props.filterTasks('userId')
        break
      case 2:
        this.props.history.push(baseUrl + 'interested')
        this.props.filterTasks('Assigns')
        break
      case 3:
        this.props.history.push(baseUrl + 'assigned')
        this.props.filterTasks('assigned')
        break
      default:
        this.props.filterTasks('all')
    }
  }

  render () {
    const { classes, user } = this.props
    const TabContainer = props => {
      return (
        <Typography component='div' style={ { padding: 8 * 3 } }>
          { props.children }
        </Typography>
      )
    }

    return (
      <Paper elevation={ 0 }>
        { this.props.project.data.name && (
          <Link href='/' onClick={(e) => {
            e.preventDefault()
            window.location.href = '/#/tasks/all'
            window.location.reload()
          }}>
            <Typography component='p' style={ { marginBottom: 10 } }>
              <FormattedMessage
                  id='task.list.link.back'
                  defaultMessage='back to all issues'
                />
            </Typography>
          </Link>
        )}
        <Typography variant='h5' component='h2'>
          <FormattedMessage
            id='task.list.headline'
            defaultMessage='Projects'
          />
        </Typography>
        { this.props.projects && !this.props.project.data.name && (
          this.props.projects.data.map(p => {
            return (
              <Chip
                deleteIcon={ <Avatar>{p.Tasks.length}</Avatar> }
                onDelete={() => {}}
                label={ p.name }
                style={{marginRight: 10, marginTop: 20, marginBottom: 20}}
                size={'medium'}
                onClick={ (e) => this.goToProject(e, p)}
              />
            )
          })
        )}
        <Typography variant='h3' component='h2'>
          { this.props.project.data.name }
        </Typography>
        <Typography component='p' style={ { marginBottom: 20 } }>
          <FormattedMessage
            id='task.list.description'
            defaultMessage='Available tasks for development'
          />
        </Typography>
        <div style={ { marginTop: 20, marginBottom: 20 } }>
          <TaskStatusFilter onFilter={ this.props.filterTasks } loading={ this.state.loading } />
        </div>
        <div className={ classes.rootTabs }>
          <AppBar position='static' color='default'>
            <Tabs
              value={ this.state.tab }
              onChange={ this.handleTabChange }
              scrollable
              scrollButtons='on'
              indicatorColor='primary'
              textColor='primary'
            >
              <Tab
                value={ 0 }
                label={ this.props.intl.formatMessage(messages.allTasks) }
                icon={ <RedeemIcon /> }
              />
              <Tab
                value={ 1 }
                label={ this.props.intl.formatMessage(messages.createdByMeTasks) }
                icon={ <ShoppingBasket /> }
              />
              <Tab
                value={ 2 }
                label={ this.props.intl.formatMessage(messages.interestedTasks) }
                icon={ <AssignIcon /> }
              />
              <Tab
                value={ 3 }
                label={ this.props.intl.formatMessage(
                  messages.assignedToMeTasks
                ) }
                icon={ <ActionIcon /> }
              />
            </Tabs>
          </AppBar>
          <TabContainer>
            { !user.id && this.state.tab !== 0 ? (
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
              <CustomPaginationActionsTable tasks={ this.props.tasks } />
            ) }
          </TabContainer>
        </div>
      </Paper>
    )
  }
}

TaskList.propTypes = {
  classes: PropTypes.object.isRequired,
  listTasks: PropTypes.func,
  filterTasks: PropTypes.func,
  tasks: PropTypes.object,
  project: PropTypes.object,
  user: PropTypes.object
}

export default injectIntl(withRouter(withStyles(styles)(TaskList)))
