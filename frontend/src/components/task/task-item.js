import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { injectIntl } from 'react-intl'
import PropTypes from 'prop-types'
import MomentComponent from 'moment'
import TextEllipsis from 'text-ellipsis'
import ReactPlaceholder from 'react-placeholder'

import {
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Avatar,
  ItemIcon,
  Chip,
  IconButton,
  Tooltip
} from '@material-ui/core'

import Constants from '../../consts'

const logoGithub = require('../../images/github-logo.png')
const logoBitbucket = require('../../images/bitbucket-logo.png')

class TaskItem extends Component {
  componentDidMount () { }

  handleClickListItem (id) {
    this.props.history.push('/task/' + id)
  }

  render () {
    const { item, key, ready, classes, intl } = this.props

    return (
      <ReactPlaceholder
        style={ { marginBottom: 20 } }
        showLoadingAnimation
        type='media'
        rows={ 2 }
        ready={ ready }
      >
        <ListItem
          key={ key }
          button
          onClick={ () => this.handleClickListItem(item.id) }
        >
          <Avatar>
            <ItemIcon />
          </Avatar>
          <ListItemText
            id={ item.id }
            primary={ TextEllipsis(item.url, 50) }
            secondary={ item.value ? `$ ${item.value}` : ' - ' }
          />
          <Chip
            label={ intl.formatMessage(Constants.STATUSES[item.status]) }
            style={ {
              marginRight: 10,
              backgroundColor: 'green',
              color: 'white'
            } }
          />
          <Chip
            label={
              item.deadline
                ? MomentComponent(item.deadline).fromNow()
                : ' - '
            }
            style={ {
              marginRight: 20,
              backgroundColor: 'green',
              color: 'white'
            } }
          />
          <ListItemSecondaryAction>
            <IconButton aria-label='provider'>
              <Tooltip id='tooltip-fab' title={ `${item.provider}` } placement='right'>
                <a target='_blank' href={ item.url }>
                  <img width='24' src={ item.provider === 'github' ? logoGithub : logoBitbucket } className={ classes.icon } />
                </a>
              </Tooltip>
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      </ReactPlaceholder>
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
