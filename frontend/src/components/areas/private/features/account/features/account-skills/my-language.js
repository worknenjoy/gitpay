import React, { Component } from 'react'

import { Avatar, Chip } from '@mui/material'
import Folder from '@mui/icons-material/Folder'

import { withRouter } from 'react-router-dom'
import { injectIntl } from 'react-intl'
import PropTypes from 'prop-types'

class MyLanguage extends Component {
  render() {
    const { classes, title } = this.props

    return (
      <Chip
        avatar={
          <Avatar>
            <Folder />
          </Avatar>
        }
        label={title}
        className={classes.chipLanguage}
        onDelete={this.props.onDelete}
      />
    )
  }
}

MyLanguage.propTypes = {
  classes: PropTypes.object.isRequired,
  preferences: PropTypes.string,
  language: PropTypes.string,
  title: PropTypes.string,
  onDelete: PropTypes.func.isRequired,
  isSelected: PropTypes.bool,
}

export default injectIntl(withRouter(MyLanguage))
