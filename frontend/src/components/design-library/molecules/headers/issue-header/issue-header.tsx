import React, { useState } from 'react'
import {
  MoreVert as MoreIcon,
  Delete as DeleteIcon,
  BugReport as ReportIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon
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
  ListItemText
} from '@mui/material'

import { FormattedMessage } from 'react-intl'

import { Breadcrumb } from '../../breadcrumbs/breadcrumb/breadcrumb'

import { IssueLabelsList as TaskLabels } from '../../lists/issue-labels-list/issue-labels-list'
import { IssueReportDialog as TaskReport } from '../../dialogs/issue-reports-dialog/issue-reports-dialog'

import logoGithub from 'images/github-logo.png'
import logoBitbucket from 'images/bitbucket-logo.png'
import useIssueAuthor from '../../../../../hooks/use-issue-author'
import { useHistory } from 'react-router-dom'
import IssueHeaderPlaceholder from './issue-header.placeholder'
import { TaskHeaderContainer } from './issue-header.styles'

const IssueHeader = ({ task, user, handleDeleteTask, reportTask, updateTask }) => {
  const { data, completed } = task || {}
  const history = useHistory()
  const issueAuthor = useIssueAuthor(task, user)
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

  const handleDeleteAndRedirect = async () => {
    const deleteAction = await handleDeleteTask(data)
    setDeleteDialog(false)
    if (deleteAction.error) return
    history.push('/profile/tasks')
  }

  const pathname = history.location.pathname

  const breadcrumbRoot = pathname.startsWith('/profile/explore')
    ? {
        label: <FormattedMessage id="explore.issues.breadcrumbs" defaultMessage="Explore Issues" />,
        link: '/profile/explore/tasks'
      }
    : pathname.startsWith('/profile')
      ? {
          label: <FormattedMessage id="user.profile.issues" defaultMessage="My Issues" />,
          link: '/profile/tasks'
        }
      : {
          label: (
            <FormattedMessage
              id="organization.issues.breadcrumbs"
              defaultMessage="Explore Issues"
            />
          ),
          link: '/explore/issues'
        }

  return (
    completed ?
    <TaskHeaderContainer>
      <Grid size={{ xs: 12, sm: 12, md: 12 }}>
        <div style={{ marginTop: 30, marginBottom: 20 }}>
          <Breadcrumb task={task} root={breadcrumbRoot} />
        </div>
        
        <div style={{ marginTop: 20, marginBottom: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h5" gutterBottom>
              <strong>{data.title}</strong>
            </Typography>
            <IconButton onClick={handleMoreButton}>
              <MoreIcon />
            </IconButton>
          </div>
        </div>
       
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMoreButton}>
          {issueAuthor && (
            <MenuItem
              onClick={async () => {
                await updateTask({ id: data.id, not_listed: !data.not_listed })
                handleCloseMoreButton()
              }}
            >
              <ListItemIcon>
                {data.not_listed ? (
                  <VisibilityIcon fontSize="small" />
                ) : (
                  <VisibilityOffIcon fontSize="small" />
                )}
              </ListItemIcon>
              <ListItemText
                primary={data.not_listed ? 'Change to public' : 'Change to not listed'}
              />
            </MenuItem>
          )}
          <MenuItem
            onClick={() => {
              setAnchorEl(null)
              setReportDialog(true)
            }}
          >
            <ListItemIcon>
              <ReportIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Report" />
          </MenuItem>
          {issueAuthor && (
            <MenuItem
              onClick={() => {
                setAnchorEl(null)
                setDeleteDialog(true)
              }}
            >
              <ListItemIcon>
                <DeleteIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Delete" />
            </MenuItem>
          )}
        </Menu>
        <TaskReport
          taskData={data}
          reportTask={reportTask}
          user={user}
          visible={reportDialog}
          onClose={() => setReportDialog(false)}
        />
        <Dialog
          open={deleteDialog}
          onClose={handleDeleteDialogClose}
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
              <Typography variant="caption">
                <FormattedMessage
                  id="task.bounties.delete.caution"
                  defaultMessage="If you delete this issue, all the records related about orders and payments will be lost"
                />
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDeleteDialogClose} color="primary">
                <FormattedMessage id="task.actions.cancel" defaultMessage="Cancel" />
              </Button>
              <Button onClick={handleDeleteAndRedirect} variant="contained" color="secondary">
                <FormattedMessage id="task.actions.delete" defaultMessage="Delete" />
              </Button>
            </DialogActions>
          </div>
        </Dialog>
        <Typography
          variant="caption"
          style={{ display: 'inline-block', marginBottom: 20, marginRight: 0 }}
        >
          {data.provider && (
            <div>
              Created on{' '}
              <a href={data.url} style={{ textDecoration: 'underline' }}>
                {data.provider}{' '}
                <img
                  width="18"
                  src={data.provider === 'github' ? logoGithub : logoBitbucket}
                  style={{
                    marginRight: 5,
                    marginLeft: 5,
                    borderRadius: '50%',
                    padding: 3,
                    backgroundColor: 'black',
                    borderColor: 'black',
                    borderWidth: 1,
                    verticalAlign: 'middle'
                  }}
                />
              </a>
              by{' '}
              <a
                href={
                  data.metadata && data.provider === 'github'
                    ? data.metadata.issue.user.html_url
                    : ''
                }
              >
                {data.metadata && data.provider === 'github'
                  ? data.metadata.issue.user.login
                  : data.metadata && data.metadata.user}
                <img
                  style={{
                    marginRight: 5,
                    marginLeft: 5,
                    borderRadius: '50%',
                    padding: 3,
                    verticalAlign: 'middle'
                  }}
                  width="18"
                  src={
                    data.metadata && data.provider === 'github'
                      ? data.metadata.issue.user.avatar_url
                      : ''
                  }
                />
              </a>
            </div>
          )}
        </Typography>
        <TaskLabels labels={data?.metadata?.labels} completed={task.completed} />
      </Grid>
    </TaskHeaderContainer> : <IssueHeaderPlaceholder />
  )
}

export default IssueHeader
