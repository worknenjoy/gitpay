import React, { useState } from 'react'
import {
  NavigateNext as NavigateNextIcon,
  MoreVert as MoreIcon,
  Delete as DeleteIcon,
  BugReport as ReportIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon
} from '@material-ui/icons'
import ReactPlaceholder from 'react-placeholder'
import { RectShape } from 'react-placeholder/lib/placeholders'
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
} from '@material-ui/core'

import { FormattedMessage } from 'react-intl'

import styled from 'styled-components'
import media from '../../../../../styleguide/media'

import { Breadcrumb } from '../../../../design-library/molecules/breadcrumbs/breadcrumb/breadcrumb'

import { IssueLabelsList as TaskLabels } from './../../../molecules/lists/issue-labels-list/issue-labels-list'
import { IssueReportDialog as TaskReport } from '../../../molecules/dialogs/issue-reports-dialog/issue-reports-dialog'

import logoGithub from 'images/github-logo.png'
import logoBitbucket from 'images/bitbucket-logo.png'

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

const styles = theme => ({
  breadcrumbRoot: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2)
  },
  breadcrumbLink: {
    textDecoration: 'underline'
  },
  chipStatusPaid: {
    marginLeft: 0,
    verticalAlign: 'middle',
    backgroundColor: theme.palette.primary.light
  },
  button: {
    width: 100,
    font: 10
  },
  gutterRight: {
    marginRight: 10
  }
})

const IssueHeader = ({
  task,
  user,
  project,
  organization,
  handleDeleteTask,
  taskOwner,
  reportTask,
  updateTask
}) => {
  const [anchorEl, setAnchorEl] = useState(null)
  const [deleteDialog, setDeleteDialog] = useState(false)
  const [reportDialog, setReportDialog] = useState(false)

  const handleMoreButton = (e) => {
    e.preventDefault()
    setAnchorEl(e.currentTarget)
  }

  const handleCloseMoreButton = () => {
    setAnchorEl(null)
  }

  const handleDeleteDialogClose = () => {
    setDeleteDialog(false)
  }

  const handleReportDialogClose = () => {
    setReportDialog(false)
  }

  return (
    <TaskHeaderContainer>
      <Grid item xs={12} sm={12} md={12}>
        <Breadcrumb task={task} user={user} project={project} organization={organization} />
        <ReactPlaceholder type={'text'} rows={1} showLoadingAnimation
          ready={task.completed} style={{ marginTop: 32, marginBottom: 26, width: '80%' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant='h5' gutterBottom>
              <strong>
                {task.data.title}
              </strong>
            </Typography>
            <IconButton onClick={handleMoreButton}>
              <MoreIcon />
            </IconButton>
          </div>
        </ReactPlaceholder>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleCloseMoreButton}
        >
          {taskOwner &&
            <MenuItem onClick={async () => {
              await updateTask({ id: task.data.id, not_listed: !task.data.not_listed })
              handleCloseMoreButton()
            }}>
              <ListItemIcon>
                {task.data.not_listed ? <VisibilityIcon fontSize='small' /> : <VisibilityOffIcon fontSize='small' />}
              </ListItemIcon>
              <ListItemText primary={task.data.not_listed ? 'Change to public' : 'Change to not listed'} />
            </MenuItem>
          }
          <MenuItem onClick={() => {
            setAnchorEl(null)
            setReportDialog(true)
          }}>
            <ListItemIcon>
              <ReportIcon fontSize='small' />
            </ListItemIcon>
            <ListItemText primary='Report' />
          </MenuItem>
          {taskOwner &&
            <MenuItem onClick={() => {
              setAnchorEl(null)
              setDeleteDialog(true)
            }}>
              <ListItemIcon>
                <DeleteIcon fontSize='small' />
              </ListItemIcon>
              <ListItemText primary='Delete' />
            </MenuItem>
          }
        </Menu>
        <TaskReport
          taskData={task.data}
          reportTask={reportTask}
          user={user}
          visible={reportDialog}
          onClose={() => setReportDialog(false)}
        />
        <Dialog
          open={deleteDialog}
          onClose={handleDeleteDialogClose}
          aria-labelledby='form-dialog-title'
        >
          <div>
            <DialogTitle id='form-dialog-title'>
              <FormattedMessage id='task.bounties.delete.confirmation' defaultMessage='Are you sure you want to delete this issue?' />
            </DialogTitle>
            <DialogContent>
              <Typography variant='caption'>
                <FormattedMessage id='task.bounties.delete.caution' defaultMessage='If you delete this issue, all the records related about orders and payments will be lost' />
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDeleteDialogClose} color='primary'>
                <FormattedMessage id='task.actions.cancel' defaultMessage='Cancel' />
              </Button>
              <Button onClick={handleDeleteTask} variant='contained' color='secondary' >
                <FormattedMessage id='task.actions.delete' defaultMessage='Delete' />
              </Button>
            </DialogActions>
          </div>
        </Dialog>
        <ReactPlaceholder type={'text'} rows={1} showLoadingAnimation
          ready={task.completed} style={{ marginTop: 20, marginBottom: 20, width: '40%' }}
        >
          <Typography variant='caption' style={{ display: 'inline-block', marginBottom: 20, marginRight: 0 }}>
            {task.data.provider &&
              <div>
                Created on <a
                  href={task.data.url}
                  style={{ textDecoration: 'underline' }}
                >
                  {task.data.provider} <img width='12' src={task.data.provider === 'github' ? logoGithub : logoBitbucket} style={{ marginRight: 5, marginLeft: 5, borderRadius: '50%', padding: 3, backgroundColor: 'black', borderColor: 'black', borderWidth: 1, verticalAlign: 'bottom' }} />
                </a>
                by {' '}
                <a
                  href={task.data.metadata && task.data.provider === 'github' ? task.data.metadata.issue.user.html_url : ''}
                >
                  {task.data.metadata && task.data.provider === 'github' ? task.data.metadata.issue.user.login : task.data.metadata && task.data.metadata.user}
                  <img
                    style={{ marginRight: 5, marginLeft: 5, borderRadius: '50%', padding: 3, verticalAlign: 'bottom' }}
                    width='16'
                    src={task.data.metadata && task.data.provider === 'github' ? task.data.metadata.issue.user.avatar_url : ''}
                  />
                </a>
              </div>}
          </Typography>
        </ReactPlaceholder>
        <TaskLabels labels={task.data?.metadata?.labels} completed={task.completed} />
      </Grid>
    </TaskHeaderContainer>
  )
}

export default IssueHeader
