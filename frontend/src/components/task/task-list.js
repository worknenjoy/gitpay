import React, { useEffect, useState, useLayoutEffect } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { injectIntl, defineMessages, FormattedMessage } from 'react-intl'

import {
  Paper,
  Typography,
  withStyles
} from '@material-ui/core'

import TaskFilter from './task-filters'

import CustomPaginationActionsTable from './task-table'
import ProjectListSimple from '../project/project-list-simple'

const styles = theme => ({
  card: {},
  gutterLeft: {
    marginLeft: 10
  },
  media: {
    width: 600
  },
  rootTabs: {
    marginRight: theme.spacing(3),
    marginBottom: theme.spacing(3),
  },
  button: {
    
  },
  buttonActive: {
    
  }
})

const messages = defineMessages({
  allTasks: {
    id: 'task.list.lable.allPublicTasks',
    defaultMessage: 'All public issues available'
  },
  allPublicTasksWithBounties: {
    id: 'task.list.lable.allPublicTasksWithBounties',
    defaultMessage: 'Issues with bounties'
  },
  allPublicTasksNoBounties: {
    id: 'task.list.lable.allPublicTasksNoBounties',
    defaultMessage: 'Issues for contribution'
  },
  assignedToMeTasks: {
    id: 'task.status.assigned',
    defaultMessage: 'Assigned to me'
  }
})

const TaskList = (props) => {
  const [taskListState, setTaskListState] = useState({
    tab: 0,
    loading: true
  })
  const [projectState, setProjectState] = useState({ projectId: undefined, organizationId: undefined })

  useLayoutEffect(() => {
    let projectStateChanged

    if (props.match.params.project_id && props.match.params.organization_id) projectStateChanged = { ...props.match.params }

    setProjectState({ ...projectStateChanged })
    setTaskListState({ ...taskListState, loading: false })
  }, [props.match.params])

  useEffect(() => {
    async function fetchData () {
      const projectId = props.match.params.project_id
      const organizationId = props.match.params.organization_id

      if (organizationId && !projectId) {
        await props.fetchOrganization(organizationId)
        await props.listTasks({ organizationId: organizationId })
      }
      if (organizationId && projectId) {
        await props.fetchProject(
          projectId,
          { status: 'open' }
        )
      }
      if (!projectId && !organizationId) await props.listTasks({ status: 'open' })
      await props.listProjects()

      const params = props.match.params
      handleRoutePath(params.filter)

      if ((!projectId && !organizationId) && (props.history.location.pathname === '/tasks/open')) {
        setTaskListState({ ...taskListState, tab: 0 })
      }
    }

    fetchData()
  }, [props.match.params])

  useEffect(() => {
    filterTasksByState()
  }, [taskListState.tab])

  function filterTasksByState () {
    const currentTab = taskListState.tab

    switch (currentTab) {
      case 0:
        props.filterTasks('status', 'open')
        break
      case 1:
        props.filterTasks('issuesWithBounties')
        break
      case 2:
        props.filterTasks('contribution')
        break
      default:
    }
  }

  const handleRoutePath = (value) => {
    switch (value) {
      case 'explore':
        handleTabChange(0, 0)
        break
      case 'createdbyme':
        handleTabChange(0, 1)
        break
      case 'interested':
        handleTabChange(0, 2)
        break
      case 'assignedtome':
        handleTabChange(0, 3)
        break
      default:
    }
  }

  const handleTabChange = async (event, value) => {
    const baseUrl = projectState && projectState.organization_id && projectState.project_id ? '/organizations/' + projectState.organization_id + '/projects/' + projectState.project_id + '/' : '/tasks/'
    await setTaskListState({ ...taskListState, tab: value })
    switch (value) {
      case 0:
        props.history.push(baseUrl + 'open')
        props.filterTasks('status', 'open')
        break
      case 1:
        props.history.push(baseUrl + 'withBounties')
        props.filterTasks('issuesWithBounties')
        break
      case 2:
        props.history.push(baseUrl + 'contribution')
        props.filterTasks('contribution')
        break
      default:
        props.filterTasks('all')
    }
  }

  const { classes } = props
  const TabContainer = props => {
    return (
      <div>
        { props.children }
      </div>
    )
  }

  const baseUrl = projectState && projectState.organization_id && projectState.project_id ? '/organizations/' + projectState.organization_id + '/projects/' + projectState.project_id + '/' : '/tasks/'

  return (
    <React.Fragment>
      <Paper elevation={ 0 }>
        { props.organization && props.organization.name && props.history.location.pathname.includes('organizations') &&
        <React.Fragment>
          <Typography variant='h5' component='h2' style={ { marginTop: 20 } }>
            <FormattedMessage
              id='task.list.org.headline'
              defaultMessage='Organization'
            />
          </Typography>
          <Typography variant='h3' component='h2'>
            { props.organization.name }
          </Typography>
          <Typography variant='h5' component='h2' style={ { marginTop: 20 } }>
            <FormattedMessage
              id='task.list.org.projects.headline'
              defaultMessage='Projects'
            />
          </Typography>
          <ProjectListSimple projects={ props.organization && props.organization.Projects.length > 0 && { data: props.organization.Projects } } />
        </React.Fragment>
        }
        { props.project.data.name && props.history.location.pathname.includes('projects') &&
          <React.Fragment>
            <Typography variant='h5' component='h2' style={ { marginTop: 20 } }>
              <FormattedMessage
                id='task.list.headline'
                defaultMessage='Project'
              />
            </Typography>
            <Typography variant='h3' component='h2'>
              { props.project.data.name }
            </Typography>
          </React.Fragment>
        }
        <div className={ classes.rootTabs }>
          <TaskFilter
            filterTasks={ props.filterTasks }
            baseUrl={ baseUrl }
          />
          <TabContainer>
            <CustomPaginationActionsTable tasks={ props.tasks } />
          </TabContainer>
        </div>
      </Paper>
    </React.Fragment>
  )
}

TaskList.propTypes = {
  classes: PropTypes.object.isRequired,
  filterTasks: PropTypes.func,
  tasks: PropTypes.object,
  project: PropTypes.object
}

export default injectIntl(withRouter(withStyles(styles)(TaskList)))
