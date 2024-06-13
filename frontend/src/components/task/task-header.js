import React from 'react'
import PropTypes from 'prop-types'
import {
  MoreVert as MoreIcon,
  Delete as DeleteIcon,
  BugReport as ReportIcon,
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
  withStyles,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core'

import { injectIntl, FormattedMessage } from 'react-intl'

import styled from 'styled-components'
import media from 'app/styleguide/media'

import { Breadcrumb } from '../../common/navigation/breadcrumb'

import TaskLabels from './task-labels'

import logoGithub from '../../images/github-logo.png'
import logoBitbucket from '../../images/bitbucket-logo.png'
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

class TaskHeader extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      anchorEl: null,
      deleteDialog: false,
      reportDialog: false
    }
  }

  handleMoreButton = (e) => {
    e.preventDefault()
    this.setState({ anchorEl: e.currentTarget })
  }

  handleDeleteDialogClose = () => {
    this.setState({ deleteDialog: false })
  }

  handleReportDialogClose = () => {
    this.setState({ reportDialog: false })
  }

  render () {
    const { classes, task, user, history, handleDeleteTask, taskOwner, reportTask } = this.props

    const headerPlaceholder = (
      <div className='line-holder'>
        <RectShape
          color='white'
          style={ { marginLeft: 20, marginTop: 20, width: 300, height: 20 } }
        />
      </div>
    )

    return (
      <TaskHeaderContainer>
        <Grid item xs={ 12 } sm={ 12 } md={ 12 }>
          <Breadcrumb task={ task } user={ user } history={ history } classes={ classes } />
          <ReactPlaceholder customPlaceholder={ headerPlaceholder } showLoadingAnimation
            ready={ task.completed }
          >
            <div style={ { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } }>
              <Typography variant='h5' gutterBottom title={ task.data.title }>
                <strong>
                  { task.data.title }
                </strong>
              </Typography>
              <IconButton onClick={ this.handleMoreButton }>
                <MoreIcon />
              </IconButton>
            </div>
            <Menu
              anchorEl={ this.state.anchorEl }
              open={ Boolean(this.state.anchorEl) }
              onClose={ () => this.setState({ anchorEl: null }) }
            >
              <MenuItem onClick={ () => {
                this.setState({ anchorEl: null, reportDialog: true })
              } }>
                <ListItemIcon>
                  <ReportIcon size='small' />
                </ListItemIcon>
                <ListItemText primary='Report' />
              </MenuItem>
              { taskOwner &&
                <MenuItem onClick={ () => {
                  this.setState({ anchorEl: null, deleteDialog: true })
                } }>
                  <ListItemIcon>
                    <DeleteIcon size='small' />
                  </ListItemIcon>
                  <ListItemText primary='Delete' />
                </MenuItem>
              }
            </Menu>
            <TaskReport
              taskData={ task.data }
              reportTask={ reportTask }
              user={ user }
              visible={ this.state.reportDialog }
              onClose={ () => this.setState({ reportDialog: false }) }
              onOpen={ () => this.setState({ reportDialog: true }) }
            />
            <Dialog
              open={ this.state.deleteDialog }
              onClose={ this.handleDeleteDialogClose }
              aria-labelledby='form-dialog-title'
            >

              <div>
                <DialogTitle id='form-dialog-title'>
                  <FormattedMessage id='task.bounties.delete.confirmation' defaultMessage='Are you sure you want to delete this issue?' />
                </DialogTitle>
                <DialogContent>
                  <Typography type='caption'>
                    <FormattedMessage id='task.bounties.delete.caution' defaultMessage='If you delete this issue, all the records related about orders and payments will be lost' />
                  </Typography>
                </DialogContent>
                <DialogActions>
                  <Button onClick={ this.handleDeleteDialogClose } color='primary'>
                    <FormattedMessage id='task.actions.cancel' defaultMessage='Cancel' />
                  </Button>
                  <Button onClick={ handleDeleteTask } variant='contained' color='secondary' >
                    <FormattedMessage id='task.actions.delete' defaultMessage='Delete' />
                  </Button>
                </DialogActions>
              </div>

            </Dialog>
          </ReactPlaceholder>
          <Typography variant='caption' style={ { display: 'inline-block', marginBottom: 20, marginRight: 0 } }>
            { task.data.provider &&
              <div>
                Created on <a
                  href={ task.data.url }
                  style={ { textDecoration: 'underline' } }
                >
                  { task.data.provider } <img width='12' src={ task.data.provider === 'github' ? logoGithub : logoBitbucket } style={ { marginRight: 5, marginLeft: 5, borderRadius: '50%', padding: 3, backgroundColor: 'black', borderColor: 'black', borderWidth: 1, verticalAlign: 'bottom' } } />
                </a>
                by { ' ' }
                <a
                  href={ task.data.metadata && task.data.provider === 'github' ? task.data.metadata.issue.user.html_url : '' }
                >
                  { task.data.metadata && task.data.provider === 'github' ? task.data.metadata.issue.user.login : task.data.metadata && task.data.metadata.user }
                  <img
                    style={ { marginRight: 5, marginLeft: 5, borderRadius: '50%', padding: 3, verticalAlign: 'bottom' } }
                    width='16'
                    src={ task.data.metadata && task.data.provider === 'github' ? task.data.metadata.issue.user.avatar_url : '' }
                  />
                </a>
              </div> }
          </Typography>
          { task.data.metadata &&
            <ReactPlaceholder ready={ task.completed }>
              <TaskLabels labels={ task.data.metadata.labels } />
            </ReactPlaceholder>
          }
        </Grid>
      </TaskHeaderContainer>
    )
  }
}

TaskHeader.propTypes = {
  classes: PropTypes.object.isRequired,
  task: PropTypes.object
}

export default injectIntl(withStyles(styles)(TaskHeader))
