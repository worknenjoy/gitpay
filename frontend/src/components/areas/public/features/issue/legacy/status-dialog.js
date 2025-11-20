import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { injectIntl, defineMessages, FormattedMessage } from 'react-intl'

import {
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Dialog,
  DialogTitle
} from '@mui/material'
import { styled } from '@mui/material/styles'
import { FilterList as FilterListIcon, Done as DoneIcon } from '@mui/icons-material'
import { blue } from '@mui/material/colors'

import logoGithub from 'images/github-logo.png'
import logoBitbucket from 'images/bitbucket-logo.png'

const statuses = ['open', 'in_progress', 'closed']
const providerStatus = {
  github: {
    open: 'open',
    in_progress: 'in_progress',
    closed: 'closed'
  },
  bitbucket: {
    open: 'open',
    new: 'open',
    resolved: 'closed'
  }
}

const ColoredAvatar = styled(Avatar)(({ theme }) => ({
  backgroundColor: blue[100],
  color: blue[600]
}))

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
  handleListItemClick(status) {
    this.props.onSelect({ id: this.props.id, status: status })
    this.props.onClose()
  }

  render() {
    const { onClose, selectedValue, ...other } = this.props
    const statusesDisplay = {
      open: this.props.intl.formatMessage(messages.openStatus),
      new: this.props.intl.formatMessage(messages.openStatus),
      in_progress: this.props.intl.formatMessage(messages.inProgressStatus),
      closed: this.props.intl.formatMessage(messages.closed),
      resolved: this.props.intl.formatMessage(messages.closed)
    }

    return (
      <Dialog onClose={this.props.onClose} aria-labelledby="simple-dialog-title" {...other}>
        <DialogTitle id="simple-dialog-title">
          <FormattedMessage id="account.dialog.status" defaultMessage="Task status" />
        </DialogTitle>
        <div>
          <List>
            {statuses.map((status, index) => (
              <ListItem
                style={selectedValue === status ? { background: blue[200] } : {}}
                button
                onClick={() => this.handleListItemClick(status)}
                key={status}
              >
                <ListItemAvatar>
                  <ColoredAvatar>
                    {selectedValue === status ? <DoneIcon /> : <FilterListIcon />}
                  </ColoredAvatar>
                </ListItemAvatar>
                <ListItemText primary={statusesDisplay[status]} />
              </ListItem>
            ))}
            <Divider />
            <ListItem
              button
              onClick={() =>
                this.handleListItemClick(
                  providerStatus[this.props.provider][this.props.providerStatus]
                )
              }
            >
              <ListItemAvatar>
                <Avatar>
                  <img
                    width="24"
                    src={this.props.provider === 'github' ? logoGithub : logoBitbucket}
                  />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={`${this.props.provider}: ${statusesDisplay[this.props.providerStatus]}`}
              />
            </ListItem>
          </List>
        </div>
      </Dialog>
    )
  }
}

StatusDialog.propTypes = {
  provider: PropTypes.string,
  onClose: PropTypes.func,
  onSelect: PropTypes.func,
  selectedValue: PropTypes.string,
  providerStatus: PropTypes.string,
  id: PropTypes.number
}

export default injectIntl(StatusDialog)
