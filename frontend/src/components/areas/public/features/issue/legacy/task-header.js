import React from 'react'
import PropTypes from 'prop-types'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import Link from '@mui/material/Link'
import {
  NavigateNext as NavigateNextIcon,
  MoreVert as MoreIcon,
  Delete as DeleteIcon,
  BugReport as ReportIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from '@mui/icons-material'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Skeleton,
} from '@mui/material'

import { injectIntl, FormattedMessage } from 'react-intl'

import styled from 'styled-components'
import media from '../../../../../../styleguide/media'

import { Breadcrumb } from 'design-library/molecules/breadcrumbs/breadcrumb/breadcrumb'

import TaskLabels from './task-labels'

import logoGithub from 'images/github-logo.png'
import logoBitbucket from 'images/bitbucket-logo.png'
import TaskReport from './task-report'

const TaskHeaderContainer = styled.div`
  box-sizing: border-box;
  position: relative;

  ${media.phone`
    margin: -1rem -1rem 1rem -1rem;
    padding: 1rem;

    & h1 {
      font-size: 1.75rem;
    }
  `}
`

// styles removed (migrated away from withStyles)

class TaskHeader extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      anchorEl: null,
      deleteDialog: false,
      reportDialog: false,
    }
  }

  handleMoreButton = (e) => {
    e.preventDefault()
    this.setState({ anchorEl: e.currentTarget })
  }

  handleCloseMoreButton = () => {
    this.setState({ anchorEl: null })
  }

  handleDeleteDialogClose = () => {
    this.setState({ deleteDialog: false })
  }

  handleReportDialogClose = () => {
    this.setState({ reportDialog: false })
  }

  render() {
    const { task, user, history, handleDeleteTask, taskOwner, reportTask, updateTask } = this.props

    const headerSkeleton = (
      <div style={{ marginTop: 8 }}>
        <Skeleton variant="text" width="60%" height={32} />
      </div>
    )

    return (
      <TaskHeaderContainer>
        <Grid size={{ xs: 12, sm: 12, md: 12 }}>
          <Breadcrumb task={task} user={user} />
          {!task.completed ? (
            headerSkeleton
          ) : (
            <>
              <div
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
                <Typography variant="h5" gutterBottom>
                  <strong>{task.data.title}</strong>
                </Typography>
                <IconButton onClick={this.handleMoreButton}>
                  <MoreIcon />
                </IconButton>
              </div>
              <Menu
                anchorEl={this.state.anchorEl}
                open={Boolean(this.state.anchorEl)}
                onClose={() => this.setState({ anchorEl: null })}
              >
                {taskOwner && (
                  <MenuItem
                    onClick={async () => {
                      await updateTask({ id: task.data.id, not_listed: !task.data.not_listed })
                      this.handleCloseMoreButton()
                    }}
                  >
                    <ListItemIcon>
                      {task.data.not_listed ? (
                        <VisibilityIcon size="small" />
                      ) : (
                        <VisibilityOffIcon size="small" />
                      )}
                    </ListItemIcon>
                    <ListItemText
                      primary={task.data.not_listed ? 'Change to public' : 'Change to not listed'}
                    />
                  </MenuItem>
                )}
                <MenuItem
                  onClick={() => {
                    this.setState({ anchorEl: null, reportDialog: true })
                  }}
                >
                  <ListItemIcon>
                    <ReportIcon size="small" />
                  </ListItemIcon>
                  <ListItemText primary="Report" />
                </MenuItem>
                {taskOwner && (
                  <MenuItem
                    onClick={() => {
                      this.setState({ anchorEl: null, deleteDialog: true })
                    }}
                  >
                    <ListItemIcon>
                      <DeleteIcon size="small" />
                    </ListItemIcon>
                    <ListItemText primary="Delete" />
                  </MenuItem>
                )}
              </Menu>
              <TaskReport
                taskData={task.data}
                reportTask={reportTask}
                user={user}
                visible={this.state.reportDialog}
                onClose={() => this.setState({ reportDialog: false })}
                onOpen={() => this.setState({ reportDialog: true })}
              />
              <Dialog
                open={this.state.deleteDialog}
                onClose={this.handleDeleteDialogClose}
                aria-labelledby="form-dialog-title"
              >
                <div>
                  <DialogTitle id="form-dialog-title">
                    <FormattedMessage
                      id="task.bounties.delete.confirmation"
                      defaultMessage="Are you sure you want to delete this issue?"
                    />
                  </DialogTitle>
                  <DialogContent>
                    <Typography type="caption">
                      <FormattedMessage
                        id="task.bounties.delete.caution"
                        defaultMessage="If you delete this issue, all the records related about orders and payments will be lost"
                      />
                    </Typography>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={this.handleDeleteDialogClose} color="primary">
                      <FormattedMessage id="task.actions.cancel" defaultMessage="Cancel" />
                    </Button>
                    <Button onClick={handleDeleteTask} variant="contained" color="secondary">
                      <FormattedMessage id="task.actions.delete" defaultMessage="Delete" />
                    </Button>
                  </DialogActions>
                </div>
              </Dialog>
            </>
          )}
          <Typography
            variant="caption"
            style={{ display: 'inline-block', marginBottom: 20, marginRight: 0 }}
          >
            {task.data.provider && (
              <div>
                Created on{' '}
                <a href={task.data.url} style={{ textDecoration: 'underline' }}>
                  {task.data.provider}{' '}
                  <img
                    width="12"
                    src={task.data.provider === 'github' ? logoGithub : logoBitbucket}
                    style={{
                      marginRight: 5,
                      marginLeft: 5,
                      borderRadius: '50%',
                      padding: 3,
                      backgroundColor: 'black',
                      borderColor: 'black',
                      borderWidth: 1,
                      verticalAlign: 'bottom',
                    }}
                  />
                </a>
                by{' '}
                <a
                  href={
                    task.data.metadata && task.data.provider === 'github'
                      ? task.data.metadata.issue.user.html_url
                      : ''
                  }
                >
                  {task.data.metadata && task.data.provider === 'github'
                    ? task.data.metadata.issue.user.login
                    : task.data.metadata && task.data.metadata.user}
                  <img
                    style={{
                      marginRight: 5,
                      marginLeft: 5,
                      borderRadius: '50%',
                      padding: 3,
                      verticalAlign: 'bottom',
                    }}
                    width="16"
                    src={
                      task.data.metadata && task.data.provider === 'github'
                        ? task.data.metadata.issue.user.avatar_url
                        : ''
                    }
                  />
                </a>
              </div>
            )}
          </Typography>
          {task.data.metadata &&
            (task.completed ? (
              <TaskLabels labels={task.data.metadata.labels} />
            ) : (
              <Skeleton variant="text" width={200} />
            ))}
        </Grid>
      </TaskHeaderContainer>
    )
  }
}

TaskHeader.propTypes = {
  task: PropTypes.object,
}

export default injectIntl(TaskHeader)
