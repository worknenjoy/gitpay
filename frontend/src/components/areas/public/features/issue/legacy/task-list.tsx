import React, { useEffect, useState, useCallback } from 'react'
import { defineMessages, FormattedMessage, useIntl } from 'react-intl'
import { Tabs, Tab, Typography, Skeleton } from '@mui/material'
import { styled } from '@mui/material/styles'
import {
  tableHeaderDefault,
  tableHeaderWithProject
} from '../../../../../shared/table-metadata/task-header-metadata'
import ProjectListSimple from 'design-library/molecules/lists/project-list/project-list-compact/project-list-compact'
import { Breadcrumb } from 'design-library/molecules/breadcrumbs/breadcrumb/breadcrumb'
import { useHistory, useLocation, useParams } from 'react-router-dom'
import SectionTable from 'design-library/molecules/tables/section-table/section-table'
import IssueLinkField from 'design-library/molecules/tables/section-table/section-table-custom-fields/issue/issue-link-field/issue-link-field'
import IssueCreatedField from 'design-library/molecules/tables/section-table/section-table-custom-fields/issue/issue-created-field/issue-created-field'
import IssueLabelsField from 'design-library/molecules/tables/section-table/section-table-custom-fields/issue/issue-labels-field/issue-labels-field'
import IssueLanguageField from 'design-library/molecules/tables/section-table/section-table-custom-fields/issue/issue-language-field/issue-language-field'
import IssuePriceField from 'design-library/molecules/tables/section-table/section-table-custom-fields/issue/issue-price-field/issue-price-field'
import IssueProjectField from 'design-library/molecules/tables/section-table/section-table-custom-fields/issue/issue-project-field/issue-project-field'
import IssueStatusField from 'design-library/molecules/tables/section-table/section-table-custom-fields/issue/issue-status-field/issue-status-field'

const RootTabs = styled('div')(({ theme }) => ({
  marginRight: theme.spacing(3),
  marginBottom: theme.spacing(3)
}))

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
  const { organization_id, project_id, filter } = useParams<MatchParams>()
  const isProfilePage = location.pathname.includes('/profile')
  const profileUrl = isProfilePage ? '/profile' : ''
  const { data: organizationData } = organization

  const basePath =
    organization_id && project_id
      ? `/organizations/${organization_id}/projects/${project_id}/`
      : '/tasks/'
  const baseUrl = `${profileUrl}${basePath}`

  const [currentTab, setCurrentTab] = useState('createdbyme')
  const [taskListState, setTaskListState] = useState({
    tab: 0,
    loading: true
  })

  const isOrganizationPage = !!organization_id && !project_id
  const isProjectPage = !!organization_id && !!project_id

  const fetchData = async () => {
    if (organization_id && !project_id) {
      await fetchOrganization(organization_id)
      await listTasks({ organizationId: organization_id })
    }

    if (organization_id && project_id) {
      await fetchProject(project_id, { status: 'open' })
    }

    if (!project_id && !organization_id) await listTasks({ status: 'open' })
    if (project_id) await listProjects()

    handleRoutePath(filter)

    if (!project_id && !organization_id && location.pathname === '/tasks/open') {
      setTaskListState((prev) => ({ ...prev, tab: 0 }))
    }
  }

  useEffect(() => {
    fetchData().then(() => {
      if (location.pathname === '/profile/organizations/2/projects/2') {
        user.Types &&
          user.Types.map((t) => t.name).includes('contributor') &&
          handleSecTabChange({}, 'all')
        user.Types &&
          user.Types.map((t) => t.name).includes('maintainer') &&
          handleSecTabChange({}, 'createdbyme')
      }
      if (location.pathname === '/profile/organizations/2/projects/2/createdbyme') {
        handleSecTabChange({}, 'createdbyme')
      }
      if (location.pathname === '/profile/organizations/2/projects/2/interested') {
        handleSecTabChange({}, 'interested')
      }
      if (location.pathname === '/profile/organizations/2/projects/2/assigned') {
        handleSecTabChange({}, 'assigned')
      }
    })

    return () => {
      // no-op cleanup
    }
  }, [organization_id, project_id]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    filterTasksByState()
  }, [taskListState.tab, filterTasks]) // eslint-disable-line react-hooks/exhaustive-deps

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

  const handleRoutePath = useCallback((value?: string) => {
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
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleTabChange = useCallback(
    async (event, value) => {
      setTaskListState((prev) => ({ ...prev, tab: value }))
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
    [baseUrl, history, filterTasks]
  )

  const handleSecTabChange = async (event: any, value: React.SetStateAction<string>) => {
    setCurrentTab(value)
    history.push(baseUrl + value)
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
      {(isOrganizationPage || isProjectPage) && (
        <div style={{ marginTop: 20 }}>
          <Breadcrumb project={project} organization={organizationData} />
        </div>
      )}
      {isOrganizationPage &&
        (!organization.completed ? (
          <>
            <Skeleton variant="text" animation="wave" width="60%" />
            <Skeleton variant="text" animation="wave" width="40%" />
          </>
        ) : (
          <Typography variant="h5" component="h2" style={{ marginTop: 20 }}>
            <FormattedMessage id="task.list.org.headline" defaultMessage="Organization" />
          </Typography>
        ))}
      {isOrganizationPage && organization.completed && (
        <>
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
      )}
      {isProjectPage &&
        (!project.completed ? (
          <>
            <Skeleton variant="text" animation="wave" width="60%" />
            <Skeleton variant="text" animation="wave" width="40%" />
          </>
        ) : (
          <Typography variant="h5" component="h2" style={{ marginTop: 20 }}>
            <FormattedMessage id="task.list.headline" defaultMessage="Project" />
          </Typography>
        ))}
      {isProjectPage && project.completed && (
        <Typography variant="h3" component="h2">
          {project.data.name}
        </Typography>
      )}
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
