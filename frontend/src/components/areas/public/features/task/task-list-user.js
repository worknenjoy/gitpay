import React, { useState, useEffect } from 'react'
import { Page } from 'app/styleguide/components/Page'
import TopBarContainer from '../../../../../containers/topbar'
import Bottom from '../../../../design-library/organisms/bottom-bar/bottom'
import PropTypes from 'prop-types'
import { injectIntl, defineMessages } from 'react-intl'
import CustomPaginationActionsTable from './task-table'
import { tableHeaderDefault } from '../../../../shared/table-metadata/task-header-metadata'

import {
  Container,
  Grid,
  withStyles,
  Typography,
  Tab,
  Tabs,
  AppBar,
} from '@material-ui/core'
import ProfileHead from '../../../../../containers/profile-head'

const styles = theme => ({
  rootTabs: {
    marginRight: theme.spacing(3),
    marginBottom: theme.spacing(3)
  }
})

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
  },
})

const TaskListUser = (props) => {
  const { classes } = props

  const [taskListState, setTaskListState] = useState({
    tab: 0,
    loading: true,
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

  const TabContainer = props => {
    return (
      <div style={{ padding: '24px 0' }}>
        {props.children}
      </div>
    )
  }

  return (
    <React.Fragment>
      <Page>
        <TopBarContainer />
        <Container fixed maxWidth='lg'>
          <ProfileHead />
        </Container>
        <Container fixed maxWidth='lg'>
          <Grid container className={classes.root}>
            <Grid item xs={12} md={12}>
              <Tabs
                value={taskListState.tab}
                onChange={handleTabChange}
                indicatorColor='secondary'
                textColor='secondary'
                style={{ marginTop: 20, marginBottom: 20 }}
              >
                <Tab
                  value={0}
                  label={props.intl.formatMessage(messages.issuesCreated)}
                />
                <Tab
                  value={1}
                  label={props.intl.formatMessage(messages.issuesSupported)}
                />
              </Tabs>
              <TabContainer>
                <CustomPaginationActionsTable tasks={props.tasks} user={props.user} tableHeaderMetadata={tableHeaderDefault} />
              </TabContainer>
            </Grid>
          </Grid>
        </Container>
        <Bottom classes={classes} />
      </Page>
    </React.Fragment>
  )
}

TaskListUser.propTypes = {
  classes: PropTypes.object.isRequired
}

export default injectIntl(withStyles(styles)(TaskListUser))
