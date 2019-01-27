import React, { Component } from 'react'
import PropTypes from 'prop-types'
<<<<<<< HEAD
=======
import { withStyles } from 'material-ui/styles'
>>>>>>> f67f46bfa942799c7ec509ca54ddba99b505000e
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

const styles = theme => ({
  selected: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText
  }
})

const statuses = ['open', 'in_progress', 'closed']

class TaskStatusFilter extends Component {
  constructor (props) {
    super(props)
    this.state = {
      selected: 'all'
    }
  }

  componentDidUpdate (prevProps) {
    if (this.props.loading !== prevProps.loading) {
      let pathName = this.props.history.location.pathname
      this.handleFromUrl(pathName)
    }
  }

  handleFromUrl = value => {
    switch (value) {
      case '/tasks/open':
        this.props.onFilter('status', 'open')
        this.setState({ selected: 'open' })
        break
      case '/tasks/progress':
        this.props.onFilter('status', 'in_progress')
        this.setState({ selected: 'in_progress' })
        break
      case '/tasks/finished':
        this.props.onFilter('status', 'closed')
        this.setState({ selected: 'closed' })
        break
      default:
        this.props.onFilter()
    }
  }

  handleListItemClick = value => {
    switch (value) {
      case 'open':
        this.props.history.push('/tasks/open')
        this.props.onFilter('status', value)
        break
      case 'in_progress':
        this.props.history.push('/tasks/progress')
        this.props.onFilter('status', value)
        break
      case 'closed':
        this.props.history.push('/tasks/finished')
        this.props.onFilter('status', value)
        break
      default:
        this.props.onFilter()
    }
    this.setState({ selected: value })
  }

  handleClickAll = () => {
    this.props.history.push('/tasks/all')
    this.props.onFilter()
    this.setState({ selected: 'all' })
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
    const { selected } = this.state
    const { classes } = this.props
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
              className={ selected === 'all' ? classes.selected : {} }
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
            className={ selected === status ? classes.selected : {} }
          />
        )) }
      </div>
    )
  }
}

TaskStatusFilter.propTypes = {
  classes: PropTypes.object.isRequired,
  onFilter: PropTypes.func
}

export default injectIntl(withRouter(withStyles(styles)(TaskStatusFilter)))
