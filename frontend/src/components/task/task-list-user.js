import React, { useLayoutEffect, useState } from 'react'
import { Page } from 'app/styleguide/components/Page'
import TopBarContainer from '../../containers/topbar'
import Bottom from '../bottom/bottom'
import PropTypes from 'prop-types'
import { injectIntl, defineMessages } from 'react-intl'
import CustomPaginationActionsTable from './task-table'

import {
  Container,
  Grid,
  withStyles,
  Typography,
  Tab,
  Tabs,
  AppBar,
} from '@material-ui/core'

import {
  Redeem as RedeemIcon,
  MonetizationOn as MoneyIcon,
  SupervisedUserCircle as ContributionIcon
} from '@material-ui/icons'

const styles = () => ({
  root: {
    flexGrow: 1
  },
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

const TaskListUser = (props) => {
  const { classes } = props

  const [taskListState, setTaskListState] = useState({
    tab: 0,
    loading: true
  })

  useLayoutEffect(() => {
    setTaskListState({ ...taskListState, loading: false })
  }, [props.match.params])

  // useEffect(() => {
  //   async function fetchData () {
  //     // const params = props.match.params
  //     // handleRoutePath(params.filter)

  //     if ((!projectId && !organizationId) && (props.history.location.pathname === '/tasks/open')) {
  //       setTaskListState({ ...taskListState, tab: 0 })
  //     }
  //   }

  //   fetchData()
  // }, [props.match.params])

  // useEffect(() => {
  //   filterTasksByState()
  // }, [taskListState.tab])

  // function filterTasksByState () {
  //   const currentTab = taskListState.tab

  //   switch (currentTab) {
  //     case 0:
  //       props.filterTasks('status', 'open')
  //       break
  //     case 1:
  //       props.filterTasks('issuesWithBounties')
  //       break
  //     case 2:
  //       props.filterTasks('contribution')
  //       break
  //     default:
  //   }
  // }

  const handleTabChange = async (event, value) => {
    setTaskListState({ ...taskListState, tab: value })
  }

  const TabContainer = props => {
    return (
      <Typography component='div' style={ { padding: 8 * 3 } }>
        { props.children }
      </Typography>
    )
  }

  return (
    <React.Fragment>
      <Page>
        <TopBarContainer />
        <Container fixed maxWidth='lg'>
          <Grid container className={ classes.root }>
            <Grid item xs={ 12 } md={ 12 }>
              <div className={ classes.rootTabs }>
                <AppBar position='static' color='default'>
                  <Tabs
                    value={ taskListState.tab }
                    onChange={ handleTabChange }
                    scrollable
                    scrollButtons='on'
                    indicatorColor='primary'
                    textColor='primary'
                  >
                    <Tab
                      value={ 0 }
                      label={ props.intl.formatMessage(messages.allTasks) }
                      icon={ <RedeemIcon /> }
                    />
                    <Tab
                      value={ 1 }
                      label={ props.intl.formatMessage(messages.allPublicTasksWithBounties) }
                      icon={ <MoneyIcon /> }
                    />
                    <Tab
                      value={ 2 }
                      label={ props.intl.formatMessage(messages.allPublicTasksNoBounties) }
                      icon={ <ContributionIcon /> }
                    />
                  </Tabs>
                </AppBar>
                <TabContainer>
                  <CustomPaginationActionsTable tasks={ { data: [{}] } } />
                  { /* <CustomPaginationActionsTable tasks={ props.tasks } /> */ }
                </TabContainer>
              </div>
            </Grid>
          </Grid>
        </Container>
        <Bottom classes={ classes } />
      </Page>
    </React.Fragment>
  )
}

TaskListUser.propTypes = {
  classes: PropTypes.object.isRequired
}

export default injectIntl(withStyles(styles)(TaskListUser))
