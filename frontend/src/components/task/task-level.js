import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { injectIntl, defineMessages, FormattedMessage } from 'react-intl'

import {
  withStyles,
  Typography
} from '@material-ui/core'

import {
  BugReport,
  Code,
  Cloud
} from '@material-ui/icons'

import CustomTabs from '../styles/material-dashboard-react/components/CustomTabs/CustomTabs'

const messages = defineMessages({
  easyStatus: {
    id: 'task.level.easy',
    defaultMessage: 'Easy'
  },
  mediumStatus: {
    id: 'task.level.medium',
    defaultMessage: 'Medium'
  },
  hardStatus: {
    id: 'task.level.hard',
    defaultMessage: 'Hard'
  }
})

const styles = theme => ({
  selected: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText
  }
})

const levels = { 'easy': 0, 'medium': 1, 'hard': 2 }
const levelsArray = ['easy', 'medium', 'hard']

class TaskLevel extends Component {
  constructor (props) {
    super(props)
    this.state = {
      selected: null
    }
  }

  static propTypes = {
    id: PropTypes.number,
    onSelect: PropTypes.func,
    level: PropTypes.string
  }

  handleClick = (event, value) => {
    this.props.onSelect({
      id: this.props.id,
      level: levelsArray[value]
    })
  }

  render () {
    const { intl, level, readOnly } = this.props
    return (
      <div style={ { marginTop: 20, marginBottom: 20 } }>
        <CustomTabs
          value={ levels[level] }
          title='Level:'
          headerColor='info'
          onTab={ !readOnly ? this.handleClick : null }
          tabs={ [
            {
              tabName: intl.formatMessage(messages.easyStatus),
              tabIcon: BugReport,
              tabContent: (
                <Typography>
                  <FormattedMessage id='task.level.easy.description' defaultMessage='Easy issue to solve' />
                </Typography>
              )
            },
            {
              tabName: intl.formatMessage(messages.mediumStatus),
              tabIcon: Code,
              tabContent: (
                <Typography>
                  <FormattedMessage id='task.level.medium.description' defaultMessage='Medium issue to solve' />
                </Typography>
              )
            },
            {
              tabName: intl.formatMessage(messages.hardStatus),
              tabIcon: Cloud,
              tabContent: (
                <Typography>
                  <FormattedMessage id='task.level.hard.description' defaultMessage='Hard issue to solve' />
                </Typography>
              )
            }
          ] }
        />
      </div>
    )
  }
}

export default injectIntl(withRouter(withStyles(styles)(TaskLevel)))
