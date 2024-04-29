import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { defineMessages, injectIntl } from 'react-intl'

import {
  Container,
  Typography,
  Tabs,
  Tab,
  Grid,
  withStyles,
} from '@material-ui/core'

import TopBarContainer from '../../containers/topbar'
import Bottom from '../bottom/bottom'

import { Page, PageContent } from 'app/styleguide/components/Page'

import TaskListContainer from '../../containers/task-list'

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  altButton: {
    marginRight: 10
  },
  bigRow: {
    marginTop: 40
  },
  row: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: 10
  },
  rowList: {
    marginTop: 10,
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column'
  },
  rowContent: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  infoItem: {
    width: '100%',
    textAlign: 'center'
  },
  menuContainer: {
    marginBottom: 40,
    marginRight: 20,
    marginLeft: 20,
    width: '100%'
  },
  menuItem: {
    '&:focus': {
      backgroundColor: theme.palette.primary.main,
      '& $primary, & $icon': {
        color: theme.palette.common.white
      }
    }
  },
  primary: {},
  icon: {
    marginRight: 5
  }
})

const messages = defineMessages({
  issuesTitle: {
    id: 'task.list.issue.title',
    defaultMessage: 'Explore issues, projects and organizations'
  },
  issuesLabel: {
    id: 'task.list.issue.label',
    defaultMessage: 'Issues'
  },
  projectsLabel: {
    id: 'task.list.issue.projects',
    defaultMessage: 'Projects'
  },
  organizationsLabel: {
    id: 'task.list.issue.organizations',
    defaultMessage: 'Organizations'
  }
})

const TaskListProfile = (props) => {
  const { classes, noTopBar, noBottomBar } = props

  return (
    <Page>
      { !noTopBar && <TopBarContainer /> }
      <PageContent>
        <Container fixed maxWidth='lg'>
          <Grid container className={ classes.root }>
            <Grid item xs={ 12 } md={ 12 }>
              <TaskListContainer />
            </Grid>
          </Grid>
        </Container>
      </PageContent>
      { !noBottomBar && <Bottom classes={ classes } /> }
    </Page>
  )
}

TaskListProfile.propTypes = {
  classes: PropTypes.object
}

export default injectIntl(withStyles(styles)(TaskListProfile))
