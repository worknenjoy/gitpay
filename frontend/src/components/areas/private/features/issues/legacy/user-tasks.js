import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { injectIntl, defineMessages, FormattedMessage } from 'react-intl'
import { tableHeaderDefault } from '../../../../../shared/table-metadata/task-header-metadata'

import {
  Container,
  Button,
  Paper,
  Typography,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Tabs,
  Tab
} from '@mui/material'
import { styled } from '@mui/material/styles'

// import TaskFilter from '../task/task-filters'
import CustomPaginationActionsTable from '../../../../public/features/issue/legacy/task-table'

import logoGithub from 'images/github-logo.png'
import logoBitbucket from 'images/bitbucket-logo.png'

import imageGettingStarted from 'images/octodex.png'

import api from '../../../../../../consts'

const Media = styled(CardMedia)({ width: 600 })

const messages = defineMessages({
  allTasks: {
    id: 'task.list.lable.issues.all',
    defaultMessage: 'All issues'
  },
  createdByMeTasks: {
    id: 'task.status.myissues',
    defaultMessage: 'My issues'
  },
  interestedTasks: {
    id: 'tasks.status.interested',
    defaultMessage: "I'm interested"
  },
  assignedToMeTasks: {
    id: 'task.status.assigned',
    defaultMessage: 'Assigned to me'
  }
})

const UserTasks = ({ intl, history, filterTasks, listTasks, tasks, user }) => {
  const [currentTab, setCurrentTab] = useState('')

  const baseUrl = '/profile/tasks/'

  useEffect(() => {
    listTasks({}).then((t) => {
      if (history.location.pathname === '/profile/tasks/all') {
        handleTabChange({}, 'all')
      }
      if (history.location.pathname === '/profile/tasks') {
        user.Types &&
          user.Types.map((t) => t.name).includes('contributor') &&
          handleTabChange({}, 'assigned')
        user.Types &&
          user.Types.map((t) => t.name).includes('maintainer') &&
          handleTabChange({}, 'createdbyme')
      }
      if (history.location.pathname === '/profile/tasks/createdbyme') {
        handleTabChange({}, 'createdbyme')
      }
      if (history.location.pathname === '/profile/tasks/interested') {
        handleTabChange({}, 'interested')
      }
      if (history.location.pathname === '/profile/tasks/assigned') {
        handleTabChange({}, 'assigned')
      }
    })
  }, [])

  const handleTabChange = async (event, value) => {
    setCurrentTab(value)
    history.push(baseUrl + value)
    switch (value) {
      case 'all':
        filterTasks()
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

  return (
    <Paper elevation={0} style={{ backgroundColor: 'transparent' }}>
      <Container>
        <Typography variant="h5" gutterBottom style={{ marginTop: 40 }}>
          <FormattedMessage id="issues.user.title" defaultMessage="My issues" />
        </Typography>
        <Typography variant="caption" gutterBottom>
          <FormattedMessage
            id="issues.user.description"
            defaultMessage="Here you can see issues imported or that you're working on."
          />
        </Typography>
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          scrollable
          scrollButtons="on"
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
        <div style={{ marginBottom: 20 }}>
          {!user.id ? (
            <Card>
              <Media src={imageGettingStarted} />
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  <FormattedMessage
                    id="task.user.account.create.headline"
                    defaultMessage="Login / signup to work in our tasks"
                  />
                </Typography>
                <Typography component="p">
                  <FormattedMessage
                    id="task.user.account.create.description"
                    defaultMessage="Creating your account, you can be assigned to a task and receive bounties"
                  />
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  style={{ marginRight: 10 }}
                  href={`${api.API_URL}/authorize/github`}
                  variant="contained"
                  size="small"
                  color="secondary"
                  sx={{ ml: 1 }}
                >
                  <img width="16" src={logoGithub} />
                  <span style={{ marginLeft: 10 }}>Github</span>
                </Button>

                <Button
                  href={`${api.API_URL}/authorize/bitbucket`}
                  variant="contained"
                  size="small"
                  color="secondary"
                  sx={{ ml: 1 }}
                >
                  <img width="16" src={logoBitbucket} />
                  <span style={{ marginLeft: 10 }}>Bitbucket</span>
                </Button>
              </CardActions>
            </Card>
          ) : (
            <>
              <CustomPaginationActionsTable
                tasks={tasks}
                user={user}
                tableHeaderMetadata={tableHeaderDefault}
              />
            </>
          )}
        </div>
      </Container>
    </Paper>
  )
}

UserTasks.propTypes = {
  listTasks: PropTypes.func,
  filterTasks: PropTypes.func,
  tasks: PropTypes.object,
  user: PropTypes.object
}

export default injectIntl(UserTasks)
