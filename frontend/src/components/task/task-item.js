import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import MomentComponent from 'moment'
import TextEllipsis from 'text-ellipsis'
import ReactPlaceholder from 'react-placeholder'
import {
  ListItem,
  ListItemText,
  ListItemSecondaryAction
} from 'material-ui/List'

import Constants from '../../consts'

const logoGithub = require('../../images/github-logo.png')

import Avatar from 'material-ui/Avatar'
import ItemIcon from 'material-ui-icons/AccountBox'
import Chip from 'material-ui/Chip'
import IconButton from 'material-ui/IconButton'
import Tooltip from 'material-ui/Tooltip'

class TaskItem extends Component {
  constructor (props) {
    super(props)
  }

  componentDidMount () {}

  handleClickListItem (id) {
    this.props.history.push('/task/' + id)
  }

  render () {
    const { item, key, ready, classes } = this.props

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
            secondary={ item.value ? `$ ${item.value}` : 'sem valor' }
          />
          <Chip
            label={ Constants.STATUSES[item.status] }
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
                : 'sem data definida'
            }
            style={ {
              marginRight: 20,
              backgroundColor: 'green',
              color: 'white'
            } }
          />
          <ListItemSecondaryAction>
            <IconButton aria-label='provider'>
              <Tooltip id='tooltip-fab' title='Ver no Github' placement='right'>
                <a target='_blank' href={ item.url }>
                  <img width='24' src={ logoGithub } className={ classes.icon } />
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

export default withRouter(TaskItem)
