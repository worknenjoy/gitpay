import React, { Component } from 'react'

import {
  Avatar,
  Chip
} from '@material-ui/core'
import Folder from '@material-ui/icons/Folder'

import { withRouter } from 'react-router-dom'
import { injectIntl } from 'react-intl'
import PropTypes from 'prop-types'

class MySkill extends Component {
  render () {
    const { classes, title } = this.props

    return (
      <Chip
        avatar={
          <Avatar>
            <Folder />
          </Avatar>
        }
        label={ title }
        className={ classes.chipSkill }
        onDelete={ this.props.onDelete }
      />
    )
  }
}

MySkill.PropTypes = {
  classes: PropTypes.object.isRequired,
  preferences: PropTypes.string,
  language: PropTypes.string,
  title: PropTypes.string,
  onDelete: PropTypes.func.isRequired,
  isSelected: PropTypes.bool
}

export default injectIntl(withRouter(MySkill))
