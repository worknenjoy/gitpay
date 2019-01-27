import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { injectIntl, defineMessages, FormattedMessage } from 'react-intl'
import Chip from 'material-ui/Chip'

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

const statuses = ['open', 'in_progress', 'closed']

class TaskStatusFilter extends Component {
  handleListItemClick = value => {
    this.props.onFilter('status', value)

    switch (value) {
      case 'open':
        this.props.history.push('/tasks/open')
        this.props.onFilter('status', value)
        break
      case 'in_progress':
        let data = this.props.onFilter().data
        if (data.status === 'in_progress') {
          Promise.all([this.props.onFilter('status', value)]).then(() => {
            this.props.onFilter('status', value)
          })
        }
        else {
          this.props.onFilter('status', value)
        }
        this.props.history.push('/tasks/progress')
        break
      case 'closed':
        this.props.history.push('/tasks/finished')
        this.props.onFilter('status', value)
        break
      default:
        this.props.onFilter()
    }
  }

  handleClickAll = () => {
    this.props.history.push('/tasks/all')
    this.props.onFilter()
  }

  statusesDisplay = status => {
    const possibles = {
      open: this.props.intl.formatMessage(messages.openStatus),
      in_progress: this.props.intl.formatMessage(messages.inProgressStatus),
      closed: this.props.intl.formatMessage(messages.closed)
    }
    return possibles[status]
  }

  render () {
    return (
      <div>
        <FormattedMessage id='task.status.filter.all' defaultMessage='All'>
          { msg => (
            <Chip
              style={ { marginRight: 10 } }
              onClick={ () => this.handleClickAll() }
              clickable
              key={ 0 }
              label={ msg }
            />
          ) }
        </FormattedMessage>
        { statuses.map((status, index) => (
          <Chip
            style={ { marginRight: 10 } }
            onClick={ () => this.handleListItemClick(status) }
            clickable
            key={ index + 1 }
            label={ this.statusesDisplay(status) }
          />
        )) }
      </div>
    )
  }
}

TaskStatusFilter.propTypes = {
  onFilter: PropTypes.func
}

export default injectIntl(withRouter(TaskStatusFilter))
