import React, { Component } from 'react'
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

class TaskExplorer extends Component {
  constructor (props) {
    super(props)

    this.state = {
      value: 0,
      showNavigation: false,
      isOrganizationPage: false,
      isProjectPage: false,
      currentPath: ''
    }

    this.handleSectionTab = this.handleSectionTab.bind(this)
  }

  async componentDidMount () {
    const pathname = this.props.history.location.pathname
    await this.setState({ currentPath: pathname })
    if (pathname.includes('organizations') && parseInt(pathname.split('/')[2])) await this.setState({ isOrganizationPage: true })
    if (pathname.includes('projects') && parseInt(pathname.split('/')[4])) await this.setState({ isProjectPage: true })
    switch (pathname) {
      case '/tasks/open':
        this.setState({ value: 0, showNavigation: true })
        break
      case '/projects':
        this.setState({ value: 1, showNavigation: true })
        break
      case '/organizations':
        this.setState({ value: 2, showNavigation: true })
        break
      default:
        this.setState({ value: 0, showNavigation: false })
        break
    }
  }

  componentWillReceiveProps (props) {
    switch (props.history.location.pathname) {
      case '/tasks/open':
        this.setState({ value: 0, showNavigation: true })
        break
      case '/projects':
        this.setState({ value: 1, showNavigation: true })
        break
      case '/organizations':
        this.setState({ value: 2, showNavigation: true })
        break
      default:
        break
    }
  }

  handleSectionTab = async ({ currentTarget }, value) => {
    await this.setState({ value })
    switch (value) {
      case 0:
        this.props.history.push('/tasks/open')
        this.setState({ showNavigation: true })
        break
      case 1:
        this.props.history.push('/projects')
        this.setState({ showNavigation: true })
        break
      case 2:
        this.props.history.push('/organizations')
        this.setState({ showNavigation: true })
        break
      default:
        this.props.history.push('/tasks/open')
        this.setState({ showNavigation: true })
        break
    }
  }

  render () {
    const { classes } = this.props

    return (
      <Page>
        <TopBarContainer />
        <PageContent>
          { this.state.showNavigation &&
            <AppBar position='sticky' color='default'>
              <Container maxWidth='lg'>
                <Tabs
                  variant='scrollable'
                  value={ this.state.value }
                  onChange={ this.handleSectionTab }
                >
                  <Tab
                    id='issues'
                    value={ 0 }
                    label={ this.props.intl.formatMessage(messages.issuesLabel) }
                  />
                  <Tab
                    id='projects'
                    value={ 1 }
                    label={ this.props.intl.formatMessage(messages.projectsLabel) }
                  />
                  <Tab
                    id='organizations'
                    value={ 2 }
                    label={ this.props.intl.formatMessage(messages.organizationsLabel) }
                  />
                </Tabs>
              </Container>
            </AppBar>
          }
          <Container fixed maxWidth='lg'>
            <Grid container className={ classes.root }>
              <Grid item xs={ 12 } md={ 12 }>
                { this.props.location.pathname.startsWith('/tasks/') &&
                  <TaskListContainer />
                }
                { this.props.location.pathname.startsWith('/projects') &&
                  <ProjectListContainer />
                }
                { this.props.location.pathname.startsWith('/organizations') &&
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
}

TaskExplorer.propTypes = {
  classes: PropTypes.object.isRequired
}

export default injectIntl(withStyles(styles)(TaskExplorer))
