import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { messages } from './messages/task-messages'
import { injectIntl, FormattedMessage } from 'react-intl'

import {
  withStyles,
  Chip
} from '@material-ui/core'

const styles = theme => ({
  selected: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText
  }
})

const statuses = ['open', 'in_progress', 'closed']
const additionalStatuses = ['issuesWithBounties', 'contribution']

class TaskStatusFilter extends Component {
  constructor (props) {
    super(props)
    this.state = {
      selected: 'all',
      additionalSelected: null
    }
  }

  static propTypes = {
    classes: PropTypes.object.isRequired,
    onFilter: PropTypes.func
  }

  componentDidMount () {
    let pathName = this.props.history.location.pathname
    this.handleFromUrl(pathName)
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
      case '/tasks/with-bounties':
        this.props.onFilter('status', 'issuesWithBounties')
        this.setState({ additionalSelected: 'issuesWithBounties' })
        break
      case '/tasks/contribution':
        this.props.onFilter('status', 'contribution')
        this.setState({ additionalSelected: 'contribution' })
        break
      default:
        this.props.onFilter()
    }
  }

  handleListItemClick = value => {
    switch (value) {
      case 'open':
        this.props.history.push('/tasks/open')
        this.props.onFilter('status', value, this.state.additionalSelected)
        break
      case 'in_progress':
        this.props.history.push('/tasks/progress')
        this.props.onFilter('status', value, this.state.additionalSelected)
        break
      case 'closed':
        this.props.history.push('/tasks/finished')
        this.props.onFilter('status', value, this.state.additionalSelected)
        break
      default:
        this.props.onFilter()
    }
    this.setState({ selected: value })
  }

  handleListAdditionalStatusesClick = value => {
    switch (value) {
      case 'issuesWithBounties':
        this.props.history.push('/tasks/with-bounties')
        this.props.onFilter('status', this.state.selected, value) // passing value as third parameter to consider as additional
        break
      case 'contribution':
        this.props.history.push('/tasks/contribution')
        this.props.onFilter('status', this.state.selected, value) // passing value as third parameter to consider as additional
        break
      default:
        this.props.onFilter()
    }
    this.setState({ additionalSelected: value })
  }

  handleClickAll = () => {
    this.props.history.push('/tasks/all')
    this.props.onFilter()
    this.setState({ selected: 'all', additionalSelected: null })
  }

  statusesDisplay = status => {
    const possibles = {
      open: this.props.intl.formatMessage(messages.openStatus),
      in_progress: this.props.intl.formatMessage(messages.inProgressStatus),
      closed: this.props.intl.formatMessage(messages.closed)
    }
    return possibles[status]
  }

  additionalStatusDisplay = status => {
    const additional = {
      issuesWithBounties: this.props.intl.formatMessage(messages.issuesWithBounties),
      contribution: this.props.intl.formatMessage(messages.contribution)
    }

    return additional[status]
  }

  render () {
    const { selected, additionalSelected } = this.state
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
        <span style={ {
          flexGrow: 1,
          flexBasis: 'auto',
          margin: '.25em 0',
          padding: '5px 0.3em',
          borderLeft: '1px solid #CCC',
          backgroundColor: '#FFF',
        } } />
        {
          additionalStatuses.map((status, index) => (
            <Chip
              style={ { marginRight: 10 } }
              onClick={ () => this.handleListAdditionalStatusesClick(status) }
              clickable
              key={ index + 1 }
              label={ this.additionalStatusDisplay(status) }
              className={ additionalSelected === status ? classes.selected : {} }
            />
          ))
        }
      </div>
    )
  }
}

export default injectIntl(withRouter(withStyles(styles)(TaskStatusFilter)))
