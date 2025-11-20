import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { injectIntl } from 'react-intl'
import PropTypes from 'prop-types'
import MomentComponent from 'moment'
import TextEllipsis from 'text-ellipsis'
import {
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Avatar,
  ItemIcon,
  Chip,
  IconButton,
  Tooltip,
  Skeleton
} from '@mui/material'

import Constants from '../../../../../../consts'

import logoGithub from 'images/github-logo.png'
import logoBitbucket from 'images/bitbucket-logo.png'

class TaskItem extends Component {
  componentDidMount() {}

  handleClickListItem(id) {
    this.props.history.push('/task/' + id)
  }

  render() {
    const { item, key, ready, classes, intl } = this.props

    return !ready ? (
      <ListItem button key={key} style={{ marginBottom: 20 }}>
        <Skeleton variant="circular" width={40} height={40} style={{ marginRight: 10 }} />
        <ListItemText>
          <Skeleton variant="text" width="80%" />
          <Skeleton variant="text" width="40%" />
        </ListItemText>
        <ListItemSecondaryAction>
          <Skeleton variant="rectangular" width={80} height={32} />
        </ListItemSecondaryAction>
      </ListItem>
    ) : (
      <ListItem key={key} button onClick={() => this.handleClickListItem(item.id)}>
        <Avatar>
          <ItemIcon />
        </Avatar>
        <ListItemText
          id={item.id}
          primary={TextEllipsis(item.url, 50)}
          secondary={item.value ? `$ ${item.value}` : ' - '}
        />
        <Chip
          label={intl.formatMessage(Constants.STATUSES[item.status])}
          style={{
            marginRight: 10,
            backgroundColor: 'green',
            color: 'white'
          }}
        />
        <Chip
          label={item.deadline ? MomentComponent(item.deadline).fromNow() : ' - '}
          style={{
            marginRight: 20,
            backgroundColor: 'green',
            color: 'white'
          }}
        />
        <ListItemSecondaryAction>
          <IconButton aria-label="provider">
            <Tooltip id="tooltip-fab" title={`${item.provider}`} placement="right">
              <a target="_blank" href={item.url} rel="noreferrer">
                <img
                  width="24"
                  src={item.provider === 'github' ? logoGithub : logoBitbucket}
                  className={classes.icon}
                />
              </a>
            </Tooltip>
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
    )
  }
}

TaskItem.propTypes = {
  history: PropTypes.array,
  item: PropTypes.object,
  key: PropTypes.string,
  ready: PropTypes.func,
  classes: PropTypes.string
}

export default injectIntl(withRouter(TaskItem))
