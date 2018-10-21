import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import { injectIntl, defineMessages, FormattedMessage } from 'react-intl'
import Avatar from 'material-ui/Avatar'
import List from 'material-ui/List'
import ListItem from 'material-ui/List/ListItem'
import ListItemAvatar from 'material-ui/List/ListItemAvatar'
import Divider from 'material-ui/Divider'
import ListItemText from 'material-ui/List/ListItemText'
import DialogTitle from 'material-ui/Dialog/DialogTitle'
import Dialog from 'material-ui/Dialog'
import FilterListIcon from 'material-ui-icons/FilterList'
import DoneIcon from 'material-ui-icons/Done'
import blue from 'material-ui/colors/blue'

const logoGithub = require('../../images/github-logo.png')
const logoBitbucket = require('../../images/bitbucket-logo.png')

const statuses = ['open', 'in_progress', 'closed']
const providerStatus = {
  'github': {
    open: 'open',
    in_progress: 'in_progress',
    closed: 'closed'
  },
  'bitbucket': {
    open: 'open',
    new: 'open',
    resolved: 'closed'
  }
}

const styles = {
  avatar: {
    backgroundColor: blue[100],
    color: blue[600]
  }
}

const messages = defineMessages({
  openStatus: {
    id: 'task.status.filter.open',
    defaultMessage: 'Open'
  },
  inProgressStatus: {
    id: 'task.status.filter.progress',
    defaultMessage: 'In progress'
  },
  closed: {
    id: 'task.status.filter.close',
    defaultMessage: 'Finished'
  }
})

class StatusDialog extends Component {
  handleListItemClick (status) {
    this.props.onSelect({ id: this.props.id, status: status })
    this.props.onClose()
  }

  render () {
    const { classes, onClose, selectedValue, ...other } = this.props
    const statusesDisplay = {
      open: this.props.intl.formatMessage(messages.openStatus),
      new: this.props.intl.formatMessage(messages.openStatus),
      in_progress: this.props.intl.formatMessage(messages.inProgressStatus),
      closed: this.props.intl.formatMessage(messages.closed),
      resolved: this.props.intl.formatMessage(messages.closed)
    }

    return (
      <Dialog
        onClose={ this.props.onClose }
        aria-labelledby='simple-dialog-title'
        { ...other }
      >
        <DialogTitle id='simple-dialog-title'>
          <FormattedMessage id='account.dialog.status' defaultMessage='Task status' />
        </DialogTitle>
        <div>
          <List>
            { statuses.map((status, index) => (
              <ListItem
                style={
                  selectedValue === status ? { background: blue[200] } : {}
                }
                button
                onClick={ () => this.handleListItemClick(status) }
                key={ status }
              >
                <ListItemAvatar>
                  <Avatar className={ classes.avatar }>
                    { selectedValue === status ? (
                      <DoneIcon />
                    ) : (
                      <FilterListIcon />
                    ) }
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={ statusesDisplay[status] } />
              </ListItem>
            )) }
            <Divider />
            <ListItem
              button
              onClick={ () =>
                this.handleListItemClick(providerStatus[this.props.provider][this.props.providerStatus])
              }
            >
              <ListItemAvatar>
                <Avatar>
                  <img width='24' src={ this.props.provider === 'github' ? logoGithub : logoBitbucket } />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={ `${this.props.provider}: ${
                  statusesDisplay[this.props.providerStatus]
                }` }
              />
            </ListItem>
          </List>
        </div>
      </Dialog>
    )
  }
}

StatusDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  provider: PropTypes.string,
  onClose: PropTypes.func,
  onSelect: PropTypes.func,
  selectedValue: PropTypes.string,
  providerStatus: PropTypes.string,
  id: PropTypes.number
}

export default injectIntl(withStyles(styles)(StatusDialog))
