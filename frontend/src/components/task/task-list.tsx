import React, { useEffect, useState, useLayoutEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { injectIntl, defineMessages, FormattedMessage } from 'react-intl'

import {
  Tabs,
  Tab,
  Typography,
  withStyles,
  Link
} from '@material-ui/core'

// import TaskFilter from './task-filters'
import TaskFilters from '../../containers/task-filter';

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
    id: 'task.list.lable.issues.all',
    defaultMessage: 'All issues'
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
  },
  createdByMeTasks: {
    id: 'task.status.myissues',
    defaultMessage: 'My issues'
  },
  interestedTasks: {
    id: 'tasks.status.interested',
    defaultMessage: 'I\'m interested'
  }
})


const TaskList = ({ user, tasks, organization, match, fetchOrganization, listTasks, listProjects, project, fetchProject, history, filterTasks, classes, intl }) => {
  const isProfilePage = history.location.pathname.includes('/profile')
  const { organization_id, project_id } = match.params
  const profileUrl = isProfilePage ? '/profile' : ''
  const baseUrl = organization_id && project_id ? '/organizations/' + organization_id + '/projects/' + project_id + '/' : '/tasks/'
  const { data: organizationData } = organization

  const [currentTab, setCurrentTab] = useState('createdbyme')
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
    fetchData().then(() => {
      if (history.location.pathname === '/profile/organizations/2/projects/2') {
        user.Types && user.Types.map(t => t.name).includes('contributor') && handleSecTabChange({}, 'all')
        user.Types && user.Types.map(t => t.name).includes('maintainer') && handleSecTabChange({}, 'createdbyme')
      }
      if (history.location.pathname === '/profile/organizations/2/projects/2/createdbyme') {
        handleSecTabChange({}, 'createdbyme')
      }
      if (history.location.pathname === '/profile/organizations/2/projects/2/interested') {
        handleSecTabChange({}, 'interested')
      }
      if (history.location.pathname === '/profile/organizations/2/projects/2/assigned') {
        handleSecTabChange({}, 'assigned')
      }
    })

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
    const  baseUrl = profileUrl + organization_id && project_id ? '/organizations/' + organization_id + '/projects/' + project_id + '/' : '/tasks/'
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

  const handleSecTabChange = async (event: any, value: React.SetStateAction<string>) => {
    setCurrentTab(value)
    history.push(profileUrl + baseUrl + value)
    switch (value) {
      case 'all':
        filterTasks('all')
        break
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

  
  const TabContainer = props => {
    return (
      <div>
        { props.children }
      </div>
    )
  }
  
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
        { isProfilePage &&
        <Tabs
          value={ currentTab }
          onChange={ handleSecTabChange }
          scrollButtons='on'
          indicatorColor='secondary'
          textColor='secondary'
          style={{marginTop: 20, marginBottom: 20}}
        >
          { user.Types && user.Types.map(t => t.name).includes('maintainer') &&
            <Tab
              value={ 'createdbyme' }
              label={ intl.formatMessage(messages.createdByMeTasks) }
            />
          }
           { user.Types && user.Types.map(t => t.name).includes('contributor') &&
            <Tab
              value={ 'all' }
              label={ intl.formatMessage(messages.allTasks) }
            />
          }
          { user.Types && user.Types.map(t => t.name).includes('contributor') &&
            <Tab
              value={ 'assigned' }
              label={ intl.formatMessage(
                messages.assignedToMeTasks
              ) }
            />
          }
          { user.Types && user.Types.map(t => t.name).includes('contributor') &&
            <Tab
              value={ 'interested' }
              label={ intl.formatMessage(messages.interestedTasks) }
            />
          }
        </Tabs>}
        <div className={ classes.rootTabs }>
        { currentTab === 'all' &&
          <TaskFilters
            filterTasks={ filterTasks }
            baseUrl={ profileUrl + baseUrl }
          />
          }
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
