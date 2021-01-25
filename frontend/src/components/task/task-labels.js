import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { injectIntl, defineMessages } from 'react-intl'

import invert from 'invert-color'

import {
  withStyles,
  Chip
} from '@material-ui/core'

import {
  Label as LabelIcon,
  InfoRounded as InfoIcon
} from '@material-ui/icons'

import StatsCard from '../Cards/StatsCard'

const messages = defineMessages({
  labelStatus: {
    id: 'task.status.label.title',
    defaultMessage: 'Labels'
  },
  labelDesc: {
    id: 'task.status.label.desc',
    defaultMessage: 'Labels can help you understand more about the context of an issue'
  }
})

const styles = theme => ({
  selected: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText
  }
})

class TaskLabels extends Component {
  static propTypes = {
    labels: PropTypes.object
  }

  handleListItemClick = () => {

  }

  taskLabels = (labels) => {
    return (
      <React.Fragment>
        { labels.map((label, index) => (
          <Chip
            key={ index + 1 }
            label={ label.name }
            style={ { marginRight: 10, marginTop: 10, marginBottom: 10 } }
            variant='outlined'
          />
        )) }
      </React.Fragment>
    )
  }

  render () {
    const { labels } = this.props
    return (
      <div>
        { labels && this.taskLabels(labels) }
      </div>
    )
  }
}

export default injectIntl(withRouter(withStyles(styles)(TaskLabels)))
