import React, { useEffect, useState, useCallback } from 'react'
import { useHistory, useLocation, useParams } from 'react-router-dom'
import { defineMessages, FormattedMessage } from 'react-intl'

import { Tabs, Tab, Typography, Skeleton } from '@mui/material'
import {
  tableHeaderDefault,
  tableHeaderWithProject
} from '../../../../shared/table-metadata/task-header-metadata'
import ProjectListSimple from 'design-library/molecules/lists/project-list/project-list-compact/project-list-compact'
import { Breadcrumb } from 'design-library/molecules/breadcrumbs/breadcrumb/breadcrumb'
import { RootTabs } from './project-page.styles'

// styles moved to project-page.styles.ts

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
    defaultMessage: "I'm interested"
  }
})

import { useIntl } from 'react-intl'
import SectionTable from 'design-library/molecules/tables/section-table/section-table'
import IssueLinkField from 'design-library/molecules/tables/section-table/section-table-custom-fields/issue/issue-link-field/issue-link-field'
import IssueCreatedField from 'design-library/molecules/tables/section-table/section-table-custom-fields/issue/issue-created-field/issue-created-field'
import IssueLabelsField from 'design-library/molecules/tables/section-table/section-table-custom-fields/issue/issue-labels-field/issue-labels-field'
import IssueLanguageField from 'design-library/molecules/tables/section-table/section-table-custom-fields/issue/issue-language-field/issue-language-field'
import IssuePriceField from 'design-library/molecules/tables/section-table/section-table-custom-fields/issue/issue-price-field/issue-price-field'
import IssueProjectField from 'design-library/molecules/tables/section-table/section-table-custom-fields/issue/issue-project-field/issue-project-field'
import IssueStatusField from 'design-library/molecules/tables/section-table/section-table-custom-fields/issue/issue-status-field/issue-status-field'

interface TaskListProps {
  user: any
  tasks: any
  organization: any
  fetchOrganization: any
  listTasks: any
  listProjects: any
  project: any
  fetchProject: any
  filterTasks: any
  intl?: any
}

interface MatchParams {
  organization_id?: string
  project_id?: string
  filter?: string
}

const customColumnRenderer = {
  title: (item: any) => <IssueLinkField issue={item} />,
  status: (item: any) => <IssueStatusField issue={item} />,
  project: (item: any) => <IssueProjectField issue={item} />,
  value: (item: any) => <IssuePriceField issue={item} />,
  labels: (item: any) => <IssueLabelsField issue={item} />,
  languages: (item: any) => <IssueLanguageField issue={item} />,
  createdAt: (item: any) => <IssueCreatedField issue={item} />
}

const TaskList: React.FC<TaskListProps> = ({
  user,
  tasks,
  organization,
  fetchOrganization,
  listTasks,
  listProjects,
  project,
  fetchProject,
  filterTasks
}) => {
  const intl = useIntl()
  const history = useHistory()
  const location = useLocation()
  const params = useParams<MatchParams>()
  const isProfilePage = location.pathname.includes('/profile')
  const { organization_id, project_id } = params
  const profileUrl = isProfilePage ? '/profile' : ''
  const baseUrl =
    organization_id && project_id
      ? '/organizations/' + organization_id + '/projects/' + project_id + '/'
      : '/tasks/'
  const { data: organizationData } = organization

  const [currentTab, setCurrentTab] = useState('createdbyme')
  const [taskListState, setTaskListState] = useState({
    tab: 0,
    loading: true
  })
  const [isOrganizationPage, setIsOrganizationPage] = useState(false)
  const [isProjectPage, setIsProjectPage] = useState(false)
  const [organizationId, setOrganizationId] = useState(organization_id)
  const [projectId, setProjectId] = useState(project_id)

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
      await fetchProject(projectId, { status: 'open' })
    }

    if (!projectId && !organizationId) await listTasks({ status: 'open' })
    //if(projectId) await props.listProjects()

    handleRoutePath(params.filter)

    if (!projectId && !organizationId && location.pathname === '/tasks/open') {
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
        user.Types &&
          user.Types.map((t) => t.name).includes('contributor') &&
          handleSecTabChange({}, 'all')
        user.Types &&
          user.Types.map((t) => t.name).includes('maintainer') &&
          handleSecTabChange({}, 'createdbyme')
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
  }, [organization_id, project_id])

  useEffect(() => {
    filterTasksByState()
  }, [taskListState.tab, filterTasks])

  function filterTasksByState() {
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

  const handleTabChange = useCallback(
    async (event, value) => {
      const { organization_id, project_id } = params
      const baseUrl =
        profileUrl +
        (organization_id && project_id
          ? '/organizations/' + organization_id + '/projects/' + project_id + '/'
          : '/tasks/')
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
    },
    [taskListState, history, filterTasks, params, profileUrl]
  )

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

  const TabContainer = (props) => {
    return <div>{props.children}</div>
  }

  return (
    <React.Fragment>
      {(project?.data?.id || organizationData?.id) && (
        <div style={{ marginTop: 20 }}>
          <Breadcrumb project={project} organization={organizationData} />
        </div>
      )}
      {isOrganizationPage &&
        (!organization.completed ? (
          <div>
            <Skeleton variant="rectangular" height={100} animation="wave" />
            <Skeleton variant="text" animation="wave" />
          </div>
        ) : (
          <>
            <Typography variant="h5" component="h2" style={{ marginTop: 20 }}>
              <FormattedMessage id="task.list.org.headline" defaultMessage="Organization" />
            </Typography>
            <Typography variant="h3" component="h2">
              {organizationData.name}
            </Typography>
            <Typography variant="h5" component="h2" style={{ marginTop: 20 }}>
              <FormattedMessage id="task.list.org.projects.headline" defaultMessage="Projects" />
            </Typography>
            <ProjectListSimple
              projects={
                organizationData?.Projects?.length > 0 && { data: organizationData?.Projects }
              }
            />
          </>
        ))}
      {isProjectPage &&
        (!project.completed ? (
          <div>
            <Skeleton variant="text" animation="wave" />
            <Skeleton variant="text" animation="wave" />
          </div>
        ) : (
          <>
            <Typography variant="h5" component="h2" style={{ marginTop: 20 }}>
              <FormattedMessage id="task.list.headline" defaultMessage="Project" />
            </Typography>
            <Typography variant="h3" component="h2">
              {project.data.name}
            </Typography>
          </>
        ))}
      {isProfilePage && (
        <Tabs
          value={currentTab}
          onChange={handleSecTabChange}
          scrollButtons="auto"
          indicatorColor="secondary"
          textColor="secondary"
          style={{ marginTop: 20, marginBottom: 20 }}
        >
          {user.Types && user.Types.map((t) => t.name).includes('maintainer') && (
            <Tab value={'createdbyme'} label={intl.formatMessage(messages.createdByMeTasks)} />
          )}
          {user.Types && user.Types.map((t) => t.name).includes('contributor') && (
            <Tab value={'assigned'} label={intl.formatMessage(messages.assignedToMeTasks)} />
          )}
          {user.Types && user.Types.map((t) => t.name).includes('contributor') && (
            <Tab value={'interested'} label={intl.formatMessage(messages.interestedTasks)} />
          )}
        </Tabs>
      )}
      <RootTabs>
        <TabContainer>
          <SectionTable
            tableData={tasks}
            tableHeaderMetadata={isProjectPage ? tableHeaderWithProject : tableHeaderDefault}
            customColumnRenderer={customColumnRenderer}
          />
        </TabContainer>
      </RootTabs>
    </React.Fragment>
  )
}

export default TaskList
