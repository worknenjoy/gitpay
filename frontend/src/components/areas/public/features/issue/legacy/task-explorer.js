import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { defineMessages, injectIntl } from 'react-intl'

import { Container, Typography, Tabs, Tab, Grid } from '@mui/material'

import TopBarContainer from '../../../../../../containers/topbar'
import Bottom from '../../../../../shared/bottom/bottom'

import { Page, PageContent } from 'app/styleguide/components/Page'

import TaskListContainer from '../../../../../../containers/task-list'
import ProjectListContainer from '../../../../../../containers/project-list'
import OrganizationListContainer from '../../../../../../containers/organization-list'
import TaskFiltersContainer from '../../../../../../containers/task-filter'

// removed withStyles usage; layout styled via sx

const messages = defineMessages({
  issuesTitle: {
    id: 'task.list.issue.title',
    defaultMessage: 'Explore issues, projects and organizations',
  },
  issuesLabel: {
    id: 'task.list.issue.label',
    defaultMessage: 'Issues',
  },
  projectsLabel: {
    id: 'task.list.issue.projects',
    defaultMessage: 'Projects',
  },
  organizationsLabel: {
    id: 'task.list.issue.organizations',
    defaultMessage: 'Organizations',
  },
})

const TaskExplorer = (props) => {
  const [state, setState] = useState({
    value: 0,
    showNavigation: false,
    isOrganizationPage: false,
    isProjectPage: false,
    currentPath: '',
  })

  useEffect(() => {
    function handlePathNameChange() {
      const pathname = props.history.location.pathname
      setState({ ...state, currentPath: pathname })
      if (pathname.includes('organizations') && parseInt(pathname.split('/')[2])) {
        setState({ ...state, isOrganizationPage: true })
      }
      if (pathname.includes('projects') && parseInt(pathname.split('/')[4])) {
        setState({ ...state, isProjectPage: true })
      }
      switch (pathname) {
        case '/tasks/open':
          props.listTasks('open')
          setState({ ...state, value: 0, showNavigation: true })
          break
        case '/tasks/withBounties':
          props.listTasks('withBounties')
          setState({ ...state, value: 0, showNavigation: true })
          break
        case '/tasks/contribution':
          props.listTasks('contribution')
          setState({ ...state, value: 0, showNavigation: true })
          break
        case '/projects':
          setState({ ...state, value: 1, showNavigation: true })
          break
        case '/organizations':
          setState({ ...state, value: 2, showNavigation: true })
          break
        default:
          //setState({ ...state, value: 0, showNavigation: false })
          break
      }
    }

    handlePathNameChange()
  }, [state.value, props.history.location.pathname])

  const handleSectionTab = ({ currentTarget }, value) => {
    setState({ ...state, value })
    switch (value) {
      case 0:
        props.history.push('/tasks/open')
        setState({ ...state, showNavigation: true })
        break
      case 1:
        props.history.push('/projects')
        setState({ ...state, showNavigation: true })
        break
      case 2:
        props.history.push('/organizations')
        setState({ ...state, showNavigation: true })
        break
      default:
        props.history.push('/tasks/open')
        setState({ ...state, showNavigation: true })
        break
    }
  }

  const { noTopBar, noBottomBar } = props

  return (
    <Page>
      {!noTopBar && <TopBarContainer />}
      <PageContent>
        {state.showNavigation && (
          <Container maxWidth="lg">
            <Typography variant="h5" gutterBottom style={{ marginTop: 40 }}>
              {props.intl.formatMessage(messages.issuesTitle)}
            </Typography>
            <Tabs
              variant="scrollable"
              value={state.value ? state.value : 0}
              onChange={handleSectionTab}
              style={{ marginTop: 20, marginBottom: 20 }}
              textColor="secondary"
              indicatorColor="secondary"
            >
              <Tab id="issues" value={0} label={props.intl.formatMessage(messages.issuesLabel)} />
              <Tab
                id="projects"
                value={1}
                label={props.intl.formatMessage(messages.projectsLabel)}
              />
              <Tab
                id="organizations"
                value={2}
                label={props.intl.formatMessage(messages.organizationsLabel)}
              />
            </Tabs>
          </Container>
        )}
        <Container fixed maxWidth="lg">
          <Grid container sx={{ flexGrow: 1 }}>
            <Grid size={{ xs: 12, md: 12 }}>
              {state.value === 0 && (
                <div>
                  <TaskFiltersContainer filterTasks={props.filterTasks} baseUrl="/tasks/" />
                  <TaskListContainer />
                </div>
              )}
              {state.value === 1 && <ProjectListContainer />}
              {state.value === 2 && <OrganizationListContainer />}
            </Grid>
          </Grid>
        </Container>
      </PageContent>
      {!noBottomBar && <Bottom />}
    </Page>
  )
}

TaskExplorer.propTypes = {
  classes: PropTypes.object,
}

export default injectIntl(TaskExplorer)
