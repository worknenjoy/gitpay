import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
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
      loading: true
    }
  }

  componentDidMount () {
    this.props.listTasks().then(t => {
      let pathName = this.props.history.location.pathname
      this.handleRoutePath(pathName)
      this.setState({ loading: false })

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
    })
  }

  handleRoutePath = (path) => {
    switch (path) {
      case '/tasks/explore':
        this.handleTabChange(0, 0)
        break
      case '/tasks/createdbyme':
        this.handleTabChange(0, 1)
        break
      case '/tasks/interested':
        this.handleTabChange(0, 2)
        break
      case '/tasks/assignedtome':
        this.handleTabChange(0, 3)
        break
      default:
      // this.props.filterTasks()
    }
  }

  handleTabChange = (event, value) => {
    this.setState({ tab: value })
    switch (value) {
      case 0:
        this.props.history.push('/tasks/explore')
        this.props.filterTasks('open')
        break
      case 1:
        this.props.history.push('/tasks/createdbyme')
        this.props.filterTasks('userId')
        break
      case 2:
        this.props.history.push('/tasks/interested')
        this.props.filterTasks('Assigns')
        break
      case 3:
        this.props.history.push('/tasks/assignedtome')
        this.props.filterTasks('assigned')
        break
      default:
      // this.props.filterTasks()
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
        <Typography variant='h5' component='h2'>
          <FormattedMessage
            id='task.list.headline'
            defaultMessage='Task list'
          />
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
                  title='Teste'
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
  user: PropTypes.object
}

export default injectIntl(withRouter(withStyles(styles)(TaskList)))
