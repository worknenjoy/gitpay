import React, { useEffect, useState, useLayoutEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { injectIntl, defineMessages, FormattedMessage } from 'react-intl'

import {
  Typography,
  withStyles
} from '@material-ui/core'

import TaskFilter from './task-filters'

import CustomPaginationActionsTable from './task-table'
import { tableHeaderDefault, tableHeaderWithProject } from './task-header-metadata'
import ProjectListSimple from '../project/project-list-simple'
import { Breadcrumb } from '../../common/navigation/breadcrumb'
import ReactPlaceholder from 'react-placeholder'

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


const TaskList = ({ user, tasks, organization, match, fetchOrganization, listTasks, listProjects, project, fetchProject, history, filterTasks, classes }) => {
  const [taskListState, setTaskListState] = useState({
    tab: 0,
    loading: true
  })
  const [ isOrganizationPage, setIsOrganizationPage ] = useState(false)
  const [ isProjectPage, setIsProjectPage ] = useState(false)
  const [ organizationId, setOrganizationId ] = useState(match.params.organization_id)
  const [ projectId, setProjectId ] = useState(match.params.project_id)

  const fetchData = async () => {
    if (organizationId && !projectId) {
      setIsOrganizationPage(true)
      await fetchOrganization(organizationId)
      await listTasks({ organizationId: organizationId })
    }

    if (organizationId && projectId) {
      setIsProjectPage(true)
    }
    
    if (organizationId && projectId) {
      await fetchProject(
        projectId,
        { status: 'open' }
      )
    }
    
    if (!projectId && !organizationId) await listTasks({ status: 'open' })
    //if(projectId) await props.listProjects()

    const params = match.params
    handleRoutePath(params.filter)
    
    if ((!projectId && !organizationId) && (history.location.pathname === '/tasks/open')) {
      setTaskListState({ ...taskListState, tab: 0 })
    }
  }
  
  const clearProjectState = () => {
    setIsOrganizationPage(false)
    setIsProjectPage(false)
    setOrganizationId(null)
    setProjectId(null)
  }

  useEffect(() => {
    fetchData()

    return () => {
      clearProjectState()
    }
  }, [match.params.organization_id, match.params.project_id])
  
  useEffect(() => {
    filterTasksByState()
  }, [taskListState.tab, filterTasks])
  
  

  function filterTasksByState () {
    const currentTab = taskListState.tab

    switch (currentTab) {
      case 0:
        filterTasks('status', 'open')
        break
      case 1:
        filterTasks('issuesWithBounties')
        break
      case 2:
        filterTasks('contribution')
        break
      default:
    }
  }

  const handleRoutePath = useCallback((value) => {
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
  }, [])

  const handleTabChange = useCallback(async (event, value) => {
    const { organization_id, project_id } = match.params
    const baseUrl = organization_id && project_id ? '/organizations/' + organization_id + '/projects/' + project_id + '/' : '/tasks/'
    setTaskListState({ ...taskListState, tab: value })
    switch (value) {
      case 0:
        history.push(baseUrl + 'open')
        filterTasks('status', 'open')
        break
      case 1:
        history.push(baseUrl + 'withBounties')
        filterTasks('issuesWithBounties')
        break
      case 2:
        history.push(baseUrl + 'contribution')
        filterTasks('contribution')
        break
      default:
        filterTasks('all')
    }
  }, [taskListState, history, filterTasks])

  
  const TabContainer = props => {
    return (
      <div>
        { props.children }
      </div>
    )
  }
  const { organization_id, project_id } = match.params
  const profileUrl = user.id ? '/profile' : ''
  const baseUrl = organization_id && project_id ? '/organizations/' + organization_id + '/projects/' + project_id + '/' : '/tasks/'
  const { data: organizationData } = organization
  
  return (
    <React.Fragment>
        { (project?.data?.id || organizationData?.id) &&
          <div style={{marginTop: 20}}>
            <Breadcrumb classes={classes} history={history} project={project} organization={organizationData} user={user} task={{}}/>
          </div>
        }
        { isOrganizationPage &&
        <ReactPlaceholder ready={organization.completed} type='media' rows={2}>
          <Typography variant='h5' component='h2' style={ { marginTop: 20 } }>
            <FormattedMessage
              id='task.list.org.headline'
              defaultMessage='Organization'
            />
          </Typography>
          <Typography variant='h3' component='h2'>
            { organizationData.name }
          </Typography>
          <Typography variant='h5' component='h2' style={ { marginTop: 20 } }>
            <FormattedMessage
              id='task.list.org.projects.headline'
              defaultMessage='Projects'
            />
          </Typography>
          <ProjectListSimple 
            projects={organizationData?.Projects?.length > 0 && { data: organizationData?.Projects }}
            listProjects={listProjects}
            user={user}
          />
        </ReactPlaceholder>
        }
        { isProjectPage &&
          <ReactPlaceholder ready={project.completed} type='text' rows={2}>
            <Typography variant='h5' component='h2' style={ { marginTop: 20 } }>
              <FormattedMessage
                id='task.list.headline'
                defaultMessage='Project'
              />
            </Typography>
            <Typography variant='h3' component='h2'>
              { project.data.name }
            </Typography>
          </ReactPlaceholder>
        }
        <div className={ classes.rootTabs }>
          <TaskFilter
            filterTasks={ filterTasks }
            baseUrl={ profileUrl + baseUrl }
          />
          <TabContainer>
            <CustomPaginationActionsTable tasks={ tasks } user={ user } tableHeaderMetadata={isProjectPage ? tableHeaderWithProject : tableHeaderDefault} />
          </TabContainer>
        </div>
      
    </React.Fragment>
  )
}

TaskList.propTypes = {
  classes: PropTypes.object,
  filterTasks: PropTypes.func,
  tasks: PropTypes.object,
  project: PropTypes.object
}

export default injectIntl(withRouter(withStyles(styles)(TaskList)))
