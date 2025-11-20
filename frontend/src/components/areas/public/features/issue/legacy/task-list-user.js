import React, { useState, useEffect } from 'react'
import { Page } from 'app/styleguide/components/Page'
import TopBarContainer from '../../../../../../containers/topbar'
import Bottom from 'design-library/organisms/layouts/bottom-bar-layouts/bottom-bar-layout/bottom-bar-layout'
import { injectIntl, defineMessages } from 'react-intl'
import CustomPaginationActionsTable from './task-table'
import { tableHeaderDefault } from '../../../../../shared/table-metadata/task-header-metadata'

import { Container, Grid, Tab, Tabs } from '@mui/material'
import { styled } from '@mui/material/styles'
import ProfileHead from '../../../../../../containers/profile-head'

const Root = styled(Grid)(({ theme }) => ({
  marginRight: theme.spacing(3),
  marginBottom: theme.spacing(3)
}))

const messages = defineMessages({
  issuesCreated: {
    id: 'task.list.lable.issuesCreated',
    defaultMessage: 'All issues created'
  },
  issuesSupported: {
    id: 'task.list.lable.issuesSupported',
    defaultMessage: 'Issues supported'
  },
  issuesList: {
    id: 'task.list.lable.issuesList',
    defaultMessage: 'Issues list'
  }
})

const TaskListUser = (props) => {
  const {} = props

  const [taskListState, setTaskListState] = useState({
    tab: 0,
    loading: true
  })

  const verifyUserId = () => {
    const userId = props.match.params.usernameId.split('-')[0]

    if (isNaN(userId)) {
      props.history.push('/')

      // eslint-disable-next-line
      return
    }

    return userId
  }

  const listTasksByUserId = () => {
    const userId = verifyUserId()
    props.listTasks({ userId: userId })
    props.filterTasks('all')
  }

  const filterTasksWithOrders = () => {
    props.filterTasks('supported')
  }

  function filterTasksByState() {
    const currentTab = taskListState.tab

    switch (currentTab) {
      case 0:
        listTasksByUserId()
        break
      case 1:
        filterTasksWithOrders()
        break
      case 2:
        break
      default:
    }
  }

  useEffect(() => {
    filterTasksByState()
  }, [taskListState.tab])

  const handleTabChange = async (event, value) => {
    setTaskListState({ ...taskListState, tab: value })
  }

  const TabContainer = (props) => {
    return <div style={{ padding: '24px 0' }}>{props.children}</div>
  }

  return (
    <React.Fragment>
      <Page>
        <TopBarContainer />
        <Container fixed maxWidth="lg">
          <ProfileHead />
        </Container>
        <Container fixed maxWidth="lg">
          <Root container>
            <Grid size={{ xs: 12, md: 12 }}>
              <Tabs
                value={taskListState.tab}
                onChange={handleTabChange}
                indicatorColor="secondary"
                textColor="secondary"
                style={{ marginTop: 20, marginBottom: 20 }}
              >
                <Tab value={0} label={props.intl.formatMessage(messages.issuesCreated)} />
                <Tab value={1} label={props.intl.formatMessage(messages.issuesSupported)} />
              </Tabs>
              <TabContainer>
                <CustomPaginationActionsTable
                  tasks={props.tasks}
                  user={props.user}
                  tableHeaderMetadata={tableHeaderDefault}
                />
              </TabContainer>
            </Grid>
          </Root>
        </Container>
        <Bottom />
      </Page>
    </React.Fragment>
  )
}

TaskListUser.propTypes = {}

export default injectIntl(TaskListUser)
