import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { defineMessages, injectIntl } from 'react-intl'

import {
  Container,
  AppBar,
  Tabs,
  Tab,
  Grid,
  withStyles,
} from '@material-ui/core'

import TopBarContainer from '../../containers/topbar'
import Bottom from '../bottom/bottom'

import { Page, PageContent } from 'app/styleguide/components/Page'

import TaskListContainer from '../../containers/task-list'
import ProjectListContainer from '../../containers/project-list'
import OrganizationListContainer from '../../containers/organization-list'

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

const TaskExplorer = (props) => {
  const [state, setState] = useState({
    value: 0,
    showNavigation: false,
    isOrganizationPage: false,
    isProjectPage: false,
    currentPath: ''
  })

  useEffect(() => {
    function handlePathNameChange () {
      const pathname = props.history.location.pathname
      setState({ ...state, currentPath: pathname })
      if (pathname.includes('organizations') && parseInt(pathname.split('/')[2])) setState({ ...state, isOrganizationPage: true })
      if (pathname.includes('projects') && parseInt(pathname.split('/')[4])) setState({ ...state, isProjectPage: true })
      switch (pathname) {
        case '/tasks/open':
          props.listTasks('open')
          setState({ ...state, value: 0, showNavigation: true })
          break
        case '/projects':
          setState({ ...state, value: 1, showNavigation: true })
          break
        case '/organizations':
          setState({ ...state, value: 2, showNavigation: true })
          break
        default:
          setState({ ...state, value: 0, showNavigation: false })
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

  const { classes } = props

  return (
    <Page>
      <TopBarContainer />
      <PageContent>
        { state.showNavigation &&
          <AppBar position='sticky' color='default'>
            <Container maxWidth='lg'>
              <Tabs
                variant='scrollable'
                value={ state.value ? state.value : 0 }
                onChange={ handleSectionTab }
              >
                <Tab
                  id='issues'
                  value={ 0 }
                  label={ props.intl.formatMessage(messages.issuesLabel) }
                />
                <Tab
                  id='projects'
                  value={ 1 }
                  label={ props.intl.formatMessage(messages.projectsLabel) }
                />
                <Tab
                  id='organizations'
                  value={ 2 }
                  label={ props.intl.formatMessage(messages.organizationsLabel) }
                />
              </Tabs>
            </Container>
          </AppBar>
        }
        <Container fixed maxWidth='lg'>
          <Grid container className={ classes.root }>
            <Grid item xs={ 12 } md={ 12 }>
              { state.value === 0 &&
                <TaskListContainer />
              }
              { state.value === 1 &&
                <ProjectListContainer />
              }
              { state.value === 2 &&
                <OrganizationListContainer />
              }
            </Grid>
          </Grid>
        </Container>
      </PageContent>
      <Bottom classes={ classes } />
    </Page>
  )
}

TaskExplorer.propTypes = {
  classes: PropTypes.object.isRequired
}

export default injectIntl(withStyles(styles)(TaskExplorer))
