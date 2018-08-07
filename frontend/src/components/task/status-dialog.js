import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
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
    resolved: 'closed'
  }
}

const statusesDisplay = {
  open: 'Aberta',
  in_progress: 'Em desenvolvimento',
  closed: 'Finalizada',
  resolved: 'Finalizada'
}

const styles = {
  avatar: {
    backgroundColor: blue[100],
    color: blue[600]
  }
}

class StatusDialog extends Component {
  constructor (props) {
    super(props)
  }

  handleListItemClick (status) {
    this.props.onSelect({ id: this.props.id, status: status })
    this.props.onClose()
  }

  render () {
    const { classes, onClose, selectedValue, ...other } = this.props

    return (
      <Dialog
        onClose={ this.props.onClose }
        aria-labelledby='simple-dialog-title'
        { ...other }
      >
        <DialogTitle id='simple-dialog-title'>Status da tarefa</DialogTitle>
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
                primary={ `Do ${this.props.provider}: ${
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

export default withStyles(styles)(StatusDialog)
