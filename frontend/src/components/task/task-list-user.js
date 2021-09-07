import React, { useState, useEffect } from 'react'
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
  SupervisedUserCircle as ContributionIcon,
} from '@material-ui/icons'
import ProfileHead from '../../containers/profile-head'

const styles = theme => ({
  rootTabs: {
    marginRight: theme.spacing(3),
    marginBottom: theme.spacing(3),
    backgroundColor: theme.palette.primary.light
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

  useEffect(() => {
    const userId = props.match.params.usernameId.split('-')[0]

    if (!isNaN(userId)) {
      props.listTasks({ userId: userId })
    }
    else {
      props.history.push('/')
    }
  }, [])

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
          <ProfileHead />
        </Container>
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
                      label={ props.intl.formatMessage(messages.issuesCreated) }
                      icon={ <RedeemIcon /> }
                    />
                    <Tab
                      value={ 1 }
                      label={ props.intl.formatMessage(messages.issuesSupported) }
                      icon={ <MoneyIcon /> }
                    />
                    <Tab
                      value={ 2 }
                      label={ props.intl.formatMessage(messages.issuesList) }
                      icon={ <ContributionIcon /> }
                    />
                  </Tabs>
                </AppBar>
                <TabContainer>
                  <CustomPaginationActionsTable tasks={ props.tasks } />
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
