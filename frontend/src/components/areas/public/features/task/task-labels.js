import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { injectIntl } from 'react-intl'

import {
  withStyles,
  Chip
} from '@mui/material'

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
